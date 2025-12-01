import { useState } from 'react';
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import Dashboard from './components/Dashboard';
import Qualiopi from './components/Qualiopi';
import ActivityJournal from './components/ActivityJournal';
import DocumentManager from './components/DocumentManager';
import Habilitations from './components/Habilitations';
import FormationWizard from './components/FormationWizard';
import GeneratedDocuments from './components/GeneratedDocuments';
import { supabase } from './lib/supabase';
import { extractTextFromPDF, parseC1I1Content, mapSectionsToDays } from './services/pdfParser';
import { generatePlanningHTML, generateSessionsJSON, generateQCM, generateAttestationHTML } from './services/documentGenerator';
import type { Organization, Formation, Planning } from './lib/supabase';
import type { FormationWizardData } from './components/FormationWizard';
import { Loader2 } from 'lucide-react';

interface DocumentLink {
  type: string;
  format: string;
  url: string;
  label: string;
}

interface GenerationResult {
  documents: DocumentLink[];
  metadata: {
    generated_at: string;
    version: string;
    organisme: string;
  };
}

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [activeSection, setActiveSection] = useState('dashboard');
  const [isGenerating, setIsGenerating] = useState(false);
  const [result, setResult] = useState<GenerationResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (formData: FormationWizardData) => {
    setIsGenerating(true);
    setError(null);
    setResult(null);

    try {
      let logoUrl = null;
      if (formData.logo) {
        const logoExt = formData.logo.name.split('.').pop();
        const logoPath = `logos/${Date.now()}.${logoExt}`;
        const { error: uploadError } = await supabase.storage
          .from('documents')
          .upload(logoPath, formData.logo);

        if (!uploadError) {
          const { data: urlData } = supabase.storage
            .from('documents')
            .getPublicUrl(logoPath);
          logoUrl = urlData.publicUrl;
        }
      }

      const { data: org, error: orgError } = await supabase
        .from('organizations')
        .insert({
          name: formData.nom_organisme,
          logo_url: logoUrl,
          phone: formData.telephone,
          email: formData.email,
          address: formData.adresse,
          nda: formData.nda,
          siret: formData.siret,
          code_ape: formData.code_ape,
          website: formData.site_web
        })
        .select()
        .single();

      if (orgError) throw orgError;

      const { data: formation, error: formError } = await supabase
        .from('formations')
        .insert({
          organization_id: org.id,
          formation_type: formData.formation_type,
          title: formData.titre_formation,
          version: formData.version,
          total_duration_hours: formData.duree_totale,
          number_of_days: formData.nb_jours,
          time_slots: formData.plages_horaires,
          include_visits: formData.integrer_visites,
          regulatory_references: formData.references_reglementaires
        })
        .select()
        .single();

      if (formError) throw formError;

      let extractedText = '';
      if (formData.document_c1i1) {
        extractedText = await extractTextFromPDF(formData.document_c1i1);
      }

      const sections = extractedText
        ? parseC1I1Content(extractedText)
        : [];

      const mappedSections = mapSectionsToDays(
        sections,
        formData.nb_jours,
        formData.plages_horaires.length,
        formData.duree_totale
      );

      const planningInserts = mappedSections.map((section, index) => {
        const slotIndex = (section.slot - 1) % formData.plages_horaires.length;
        const slot = formData.plages_horaires[slotIndex];

        return {
          formation_id: formation.id,
          day_number: section.day,
          slot_number: section.slot,
          slot_time: `${slot.start} - ${slot.end}`,
          duration_hours: section.duration,
          title: section.title,
          content: section.content,
          application: section.application
        };
      });

      const { data: planningItems, error: planError } = await supabase
        .from('planning')
        .insert(planningInserts)
        .select();

      if (planError) throw planError;

      const planningHTML = await generatePlanningHTML(
        org as Organization,
        formation as Formation,
        planningItems as Planning[]
      );

      const sessionsJSON = await generateSessionsJSON(
        formation as Formation,
        planningItems as Planning[]
      );

      const qcmData = await generateQCM(
        formation.id,
        formData.qcm_n_questions,
        formData.qcm_seuil,
        planningItems as Planning[]
      );

      const attestationHTML = await generateAttestationHTML(
        org as Organization,
        formation as Formation,
        {
          first_name: 'Prénom',
          last_name: 'NOM',
          exam_date: new Date().toISOString(),
          score: 0.85
        }
      );

      const htmlBlob = new Blob([planningHTML], { type: 'text/html' });
      const htmlUrl = URL.createObjectURL(htmlBlob);

      const sessionsBlob = new Blob([JSON.stringify(sessionsJSON, null, 2)], { type: 'application/json' });
      const sessionsUrl = URL.createObjectURL(sessionsBlob);

      const sessionsCsvContent = convertToCSV(sessionsJSON);
      const csvBlob = new Blob([sessionsCsvContent], { type: 'text/csv' });
      const csvUrl = URL.createObjectURL(csvBlob);

      const qcmBlob = new Blob([JSON.stringify(qcmData, null, 2)], { type: 'application/json' });
      const qcmUrl = URL.createObjectURL(qcmBlob);

      const attestationBlob = new Blob([attestationHTML], { type: 'text/html' });
      const attestationUrl = URL.createObjectURL(attestationBlob);

      const documents: DocumentLink[] = [
        {
          type: 'planning',
          format: 'html',
          url: htmlUrl,
          label: 'Planning complet (HTML)'
        },
        {
          type: 'planning',
          format: 'pdf',
          url: htmlUrl,
          label: 'Planning complet (PDF)'
        },
        {
          type: 'sessions',
          format: 'json',
          url: sessionsUrl,
          label: 'Sessions détaillées (JSON)'
        },
        {
          type: 'sessions',
          format: 'csv',
          url: csvUrl,
          label: 'Sessions détaillées (CSV)'
        },
        {
          type: 'qcm',
          format: 'json',
          url: qcmUrl,
          label: 'QCM automatique'
        },
        {
          type: 'attestation',
          format: 'html',
          url: attestationUrl,
          label: 'Modèle Attestation'
        }
      ];

      setResult({
        documents,
        metadata: {
          generated_at: new Date().toISOString(),
          version: formData.version,
          organisme: formData.nom_organisme
        }
      });

    } catch (err) {
      console.error('Erreur de génération:', err);
      setError(err instanceof Error ? err.message : 'Erreur inconnue');
    } finally {
      setIsGenerating(false);
    }
  };

  const convertToCSV = (data: Record<string, unknown>[]): string => {
    if (data.length === 0) return '';

    const headers = Object.keys(data[0]);
    const rows = data.map(row =>
      headers.map(header => {
        const value = row[header];
        const stringValue = typeof value === 'object' ? JSON.stringify(value) : String(value);
        return `"${stringValue.replace(/"/g, '""')}"`;
      }).join(',')
    );

    return [headers.join(','), ...rows].join('\n');
  };

  const renderContent = () => {
    if (activeSection === 'generator') {
      return (
        <div className="space-y-6">
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <p className="text-red-800 font-medium">Erreur:</p>
              <p className="text-red-700">{error}</p>
            </div>
          )}

          {isGenerating && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 flex items-center justify-center space-x-3">
              <Loader2 className="w-6 h-6 text-[#0b3d91] animate-spin" />
              <p className="text-[#0b3d91] font-medium">Génération en cours...</p>
            </div>
          )}

          {!result && !isGenerating && (
            <FormationWizard onSubmit={handleSubmit} isLoading={isGenerating} />
          )}

          {result && !isGenerating && (
            <>
              <GeneratedDocuments
                documents={result.documents}
                metadata={result.metadata}
              />
              <div className="text-center">
                <button
                  onClick={() => {
                    setResult(null);
                    setError(null);
                    setActiveSection('dashboard');
                  }}
                  className="px-6 py-3 bg-[#00a8a8] text-white font-medium rounded-md hover:bg-[#008888] transition-colors"
                >
                  Retour au tableau de bord
                </button>
              </div>
            </>
          )}
        </div>
      );
    }

    switch (activeSection) {
      case 'dashboard':
        return <Dashboard />;
      case 'qualiopi':
        return <Qualiopi />;
      case 'bpf':
        return <div className="text-center py-12"><p className="text-gray-500">Section BPF en développement</p></div>;
      case 'habilitations':
        return <Habilitations />;
      case 'documents':
        return <DocumentManager />;
      case 'abonnement':
        return <div className="text-center py-12"><p className="text-gray-500">Section Abonnement & JO en développement</p></div>;
      case 'journal':
        return <ActivityJournal />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <div className="min-h-screen bg-[#f7fbff]">
      <Header
        isAuthenticated={isAuthenticated}
        onLogin={() => setIsAuthenticated(true)}
        onSignup={() => setIsAuthenticated(true)}
        onLogout={() => setIsAuthenticated(false)}
      />

      {isAuthenticated ? (
        <div className="flex">
          <Sidebar
            activeItem={activeSection}
            onItemClick={(id) => {
              if (id === 'generator') {
                setActiveSection('generator');
              } else {
                setActiveSection(id);
              }
            }}
          />

          <main className="flex-1 ml-64 p-8">
            <div className="max-w-7xl">
              {renderContent()}
            </div>
          </main>
        </div>
      ) : (
        <div className="pt-12 px-4">
          <div className="max-w-4xl mx-auto">
            <FormationWizard onSubmit={handleSubmit} isLoading={isGenerating} />
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
