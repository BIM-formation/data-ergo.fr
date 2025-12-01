import { useState } from 'react';
import { Upload } from 'lucide-react';
import type { TimeSlot } from '../lib/supabase';

interface FormationFormData {
  nom_organisme: string;
  logo: File | null;
  telephone: string;
  email: string;
  adresse: string;
  numero_declaration: string;
  siret: string;
  code_ape: string;
  site_web: string;
  titre_formation: string;
  version: string;
  duree_totale: number;
  nb_jours: number;
  plages_horaires: TimeSlot[];
  integrer_visites: boolean;
  references_reglementaires: string;
  document_c1i1: File | null;
  qcm_n_questions: number;
  qcm_seuil: number;
}

interface FormationFormProps {
  onSubmit: (data: FormationFormData) => void;
  isLoading?: boolean;
}

export default function FormationForm({ onSubmit, isLoading = false }: FormationFormProps) {
  const [formData, setFormData] = useState<FormationFormData>({
    nom_organisme: 'BIM-FCS',
    logo: null,
    telephone: '',
    email: '',
    adresse: '',
    numero_declaration: '84630635263',
    siret: '93976614300019',
    code_ape: '85.59B',
    site_web: 'www.bim-fcs.fr',
    titre_formation: 'SSIAP-1',
    version: 'V1-2026',
    duree_totale: 67,
    nb_jours: 10,
    plages_horaires: [
      { start: '09:00', end: '10:30', label: 'Créneau 1' },
      { start: '10:30', end: '12:00', label: 'Créneau 2' },
      { start: '13:00', end: '15:00', label: 'Créneau 3' },
      { start: '15:00', end: '17:00', label: 'Créneau 4' }
    ],
    integrer_visites: false,
    references_reglementaires: '',
    document_c1i1: null,
    qcm_n_questions: 30,
    qcm_seuil: 0.7
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, field: 'logo' | 'document_c1i1') => {
    const file = e.target.files?.[0] || null;
    setFormData(prev => ({ ...prev, [field]: file }));
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-4xl mx-auto bg-white rounded-lg shadow-md p-8 space-y-8">
      <div>
        <h2 className="text-2xl font-bold text-[#0b3d91] mb-6">Générateur SSIAP-1 - Configuration</h2>

        <div className="space-y-6">
          <section className="border-b pb-6">
            <h3 className="text-lg font-semibold text-[#00a8a8] mb-4">Informations Organisme</h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Nom de l'organisme *
                </label>
                <input
                  type="text"
                  required
                  value={formData.nom_organisme}
                  onChange={(e) => setFormData(prev => ({ ...prev, nom_organisme: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#0b3d91]"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Logo de l'organisme
                </label>
                <div className="relative">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleFileChange(e, 'logo')}
                    className="hidden"
                    id="logo-upload"
                  />
                  <label
                    htmlFor="logo-upload"
                    className="flex items-center justify-center w-full px-3 py-2 border border-gray-300 rounded-md cursor-pointer hover:bg-gray-50"
                  >
                    <Upload className="w-4 h-4 mr-2" />
                    {formData.logo ? formData.logo.name : 'Choisir un fichier'}
                  </label>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Téléphone *
                </label>
                <input
                  type="tel"
                  required
                  value={formData.telephone}
                  onChange={(e) => setFormData(prev => ({ ...prev, telephone: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#0b3d91]"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email *
                </label>
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#0b3d91]"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Adresse *
                </label>
                <input
                  type="text"
                  required
                  value={formData.adresse}
                  onChange={(e) => setFormData(prev => ({ ...prev, adresse: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#0b3d91]"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Numéro de déclaration *
                </label>
                <input
                  type="text"
                  required
                  value={formData.numero_declaration}
                  onChange={(e) => setFormData(prev => ({ ...prev, numero_declaration: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#0b3d91]"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  SIRET *
                </label>
                <input
                  type="text"
                  required
                  value={formData.siret}
                  onChange={(e) => setFormData(prev => ({ ...prev, siret: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#0b3d91]"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Code APE *
                </label>
                <input
                  type="text"
                  required
                  value={formData.code_ape}
                  onChange={(e) => setFormData(prev => ({ ...prev, code_ape: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#0b3d91]"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Site web
                </label>
                <input
                  type="text"
                  value={formData.site_web}
                  onChange={(e) => setFormData(prev => ({ ...prev, site_web: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#0b3d91]"
                />
              </div>
            </div>
          </section>

          <section className="border-b pb-6">
            <h3 className="text-lg font-semibold text-[#00a8a8] mb-4">Configuration Formation</h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Titre formation *
                </label>
                <input
                  type="text"
                  required
                  value={formData.titre_formation}
                  onChange={(e) => setFormData(prev => ({ ...prev, titre_formation: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#0b3d91]"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Version *
                </label>
                <input
                  type="text"
                  required
                  value={formData.version}
                  onChange={(e) => setFormData(prev => ({ ...prev, version: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#0b3d91]"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Durée totale (heures) *
                </label>
                <input
                  type="number"
                  required
                  min="66"
                  max="68"
                  step="0.5"
                  value={formData.duree_totale}
                  onChange={(e) => setFormData(prev => ({ ...prev, duree_totale: parseFloat(e.target.value) }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#0b3d91]"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Nombre de jours *
                </label>
                <input
                  type="number"
                  required
                  min="1"
                  value={formData.nb_jours}
                  onChange={(e) => setFormData(prev => ({ ...prev, nb_jours: parseInt(e.target.value) }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#0b3d91]"
                />
              </div>

              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="integrer_visites"
                  checked={formData.integrer_visites}
                  onChange={(e) => setFormData(prev => ({ ...prev, integrer_visites: e.target.checked }))}
                  className="h-4 w-4 text-[#0b3d91] focus:ring-[#0b3d91] border-gray-300 rounded"
                />
                <label htmlFor="integrer_visites" className="ml-2 block text-sm text-gray-700">
                  Intégrer des visites
                </label>
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Références réglementaires
                </label>
                <textarea
                  rows={3}
                  value={formData.references_reglementaires}
                  onChange={(e) => setFormData(prev => ({ ...prev, references_reglementaires: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#0b3d91]"
                />
              </div>
            </div>
          </section>

          <section className="border-b pb-6">
            <h3 className="text-lg font-semibold text-[#00a8a8] mb-4">Document Source</h3>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Document C1-I1 (PDF) *
              </label>
              <div className="relative">
                <input
                  type="file"
                  accept=".pdf"
                  required
                  onChange={(e) => handleFileChange(e, 'document_c1i1')}
                  className="hidden"
                  id="c1i1-upload"
                />
                <label
                  htmlFor="c1i1-upload"
                  className="flex items-center justify-center w-full px-3 py-2 border border-gray-300 rounded-md cursor-pointer hover:bg-gray-50"
                >
                  <Upload className="w-4 h-4 mr-2" />
                  {formData.document_c1i1 ? formData.document_c1i1.name : 'Choisir le document C1-I1'}
                </label>
              </div>
            </div>
          </section>

          <section>
            <h3 className="text-lg font-semibold text-[#00a8a8] mb-4">Configuration QCM</h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Nombre de questions *
                </label>
                <input
                  type="number"
                  required
                  min="10"
                  value={formData.qcm_n_questions}
                  onChange={(e) => setFormData(prev => ({ ...prev, qcm_n_questions: parseInt(e.target.value) }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#0b3d91]"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Seuil de réussite (0-1) *
                </label>
                <input
                  type="number"
                  required
                  min="0"
                  max="1"
                  step="0.05"
                  value={formData.qcm_seuil}
                  onChange={(e) => setFormData(prev => ({ ...prev, qcm_seuil: parseFloat(e.target.value) }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#0b3d91]"
                />
              </div>
            </div>
          </section>
        </div>
      </div>

      <div className="flex justify-end">
        <button
          type="submit"
          disabled={isLoading}
          className="px-6 py-3 bg-[#0b3d91] text-white font-medium rounded-md hover:bg-[#0a3275] focus:outline-none focus:ring-2 focus:ring-[#0b3d91] focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {isLoading ? 'Génération en cours...' : 'Générer le Pack SSIAP-1'}
        </button>
      </div>
    </form>
  );
}
