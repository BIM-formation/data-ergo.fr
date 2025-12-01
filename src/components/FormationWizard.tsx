import { useState } from 'react';
import { ChevronRight, Upload } from 'lucide-react';
import type { TimeSlot } from '../lib/supabase';

interface FormationWizardProps {
  onSubmit: (data: FormationWizardData) => void;
  isLoading?: boolean;
}

export interface FormationWizardData {
  nom_organisme: string;
  logo: File | null;
  telephone: string;
  email: string;
  adresse: string;
  nda: string;
  siret: string;
  code_ape: string;
  site_web: string;
  titre_formation: string;
  formation_type: string;
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

const FORMATION_TYPES = [
  { value: 'SSIAP-1', label: 'SSIAP-1 - Agent de Sécurité Incendie (67h, 10j)' },
  { value: 'SSIAP-2', label: 'SSIAP-2 - Chef d\'équipe (35h, 5j)' },
  { value: 'SSIAP-3', label: 'SSIAP-3 - Chef de Service (63h, 9j)' },
  { value: 'TFP-APS', label: 'TFP-APS - Agent de Prévention et Sécurité (70h, 10j)' },
  { value: 'SST', label: 'SST - Sauveteur Secouriste du Travail (14h, 2j)' },
  { value: 'H0-B0', label: 'H0-B0 - Habilitation Électrique (21h, 3j)' },
  { value: 'PRAP-IBC', label: 'PRAP-IBC - Prévention des Risques (21h, 3j)' },
  { value: 'HYGIENE-ALIMENTAIRE', label: 'Hygiène Alimentaire - HACCP (14h, 2j)' },
];

const getFormationConfig = (type: string) => {
  const configs: Record<string, { hours: number; days: number }> = {
    'SSIAP-1': { hours: 67, days: 10 },
    'SSIAP-2': { hours: 35, days: 5 },
    'SSIAP-3': { hours: 63, days: 9 },
    'TFP-APS': { hours: 70, days: 10 },
    'SST': { hours: 14, days: 2 },
    'H0-B0': { hours: 21, days: 3 },
    'PRAP-IBC': { hours: 21, days: 3 },
    'HYGIENE-ALIMENTAIRE': { hours: 14, days: 2 },
  };
  return configs[type] || { hours: 67, days: 10 };
};

export default function FormationWizard({ onSubmit, isLoading = false }: FormationWizardProps) {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState<FormationWizardData>({
    nom_organisme: '',
    logo: null,
    telephone: '',
    email: '',
    adresse: '',
    nda: '',
    siret: '',
    code_ape: '',
    site_web: '',
    titre_formation: '',
    formation_type: 'SSIAP-1',
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

  const handleFormationTypeChange = (type: string) => {
    const config = getFormationConfig(type);
    setFormData(prev => ({
      ...prev,
      formation_type: type,
      duree_totale: config.hours,
      nb_jours: config.days,
      titre_formation: FORMATION_TYPES.find(f => f.value === type)?.label || ''
    }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, field: 'logo' | 'document_c1i1') => {
    const file = e.target.files?.[0] || null;
    setFormData(prev => ({ ...prev, [field]: file }));
  };

  const handleNext = () => {
    if (step < 4) setStep(step + 1);
  };

  const handlePrev = () => {
    if (step > 1) setStep(step - 1);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-4xl mx-auto bg-white rounded-lg shadow-md p-8">
      <div className="mb-8">
        <div className="flex justify-between mb-4">
          {[1, 2, 3, 4].map(s => (
            <div key={s} className="flex-1">
              <div
                className={`h-2 rounded-full ${
                  s <= step ? 'bg-[#0b3d91]' : 'bg-gray-300'
                }`}
              ></div>
              <p className="text-xs text-center mt-2 text-gray-600">Étape {s}</p>
            </div>
          ))}
        </div>
      </div>

      {step === 1 && (
        <div className="space-y-6">
          <h2 className="text-2xl font-bold text-[#0b3d91]">1. Type de Formation</h2>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Sélectionnez la formation *
            </label>
            <select
              value={formData.formation_type}
              onChange={(e) => handleFormationTypeChange(e.target.value)}
              className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-[#0b3d91]"
            >
              {FORMATION_TYPES.map(type => (
                <option key={type.value} value={type.value}>
                  {type.label}
                </option>
              ))}
            </select>
          </div>

          <div className="bg-[#f7fbff] border border-[#00a8a8] rounded-lg p-4">
            <p className="text-sm text-gray-700">
              <strong>Configuration:</strong> {formData.duree_totale}h sur {formData.nb_jours} jours
            </p>
          </div>
        </div>
      )}

      {step === 2 && (
        <div className="space-y-6">
          <h2 className="text-2xl font-bold text-[#0b3d91]">2. Informations Organisme</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Nom *</label>
              <input
                type="text"
                required
                value={formData.nom_organisme}
                onChange={(e) => setFormData(prev => ({ ...prev, nom_organisme: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0b3d91]"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Logo</label>
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
                  className="flex items-center justify-center w-full px-3 py-2 border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50"
                >
                  <Upload className="w-4 h-4 mr-2" />
                  {formData.logo ? formData.logo.name : 'Choisir'}
                </label>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Téléphone *</label>
              <input
                type="tel"
                required
                value={formData.telephone}
                onChange={(e) => setFormData(prev => ({ ...prev, telephone: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0b3d91]"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email *</label>
              <input
                type="email"
                required
                value={formData.email}
                onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0b3d91]"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Adresse *</label>
              <input
                type="text"
                required
                value={formData.adresse}
                onChange={(e) => setFormData(prev => ({ ...prev, adresse: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0b3d91]"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">NDA/Numéro d'activité *</label>
              <input
                type="text"
                required
                value={formData.nda}
                onChange={(e) => setFormData(prev => ({ ...prev, nda: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0b3d91]"
                placeholder="Ex: 84630635263"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">SIRET *</label>
              <input
                type="text"
                required
                value={formData.siret}
                onChange={(e) => setFormData(prev => ({ ...prev, siret: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0b3d91]"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Code APE *</label>
              <input
                type="text"
                required
                value={formData.code_ape}
                onChange={(e) => setFormData(prev => ({ ...prev, code_ape: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0b3d91]"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Site web</label>
              <input
                type="text"
                value={formData.site_web}
                onChange={(e) => setFormData(prev => ({ ...prev, site_web: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0b3d91]"
              />
            </div>
          </div>
        </div>
      )}

      {step === 3 && (
        <div className="space-y-6">
          <h2 className="text-2xl font-bold text-[#0b3d91]">3. Documentation</h2>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Document C1-I1 (PDF) *</label>
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
                className="flex items-center justify-center w-full px-3 py-4 border-2 border-dashed border-[#00a8a8] rounded-lg cursor-pointer hover:bg-[#f7fbff]"
              >
                <Upload className="w-5 h-5 mr-2 text-[#00a8a8]" />
                <span className="text-[#0b3d91]">
                  {formData.document_c1i1 ? formData.document_c1i1.name : 'Cliquez pour charger'}
                </span>
              </label>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Références réglementaires</label>
            <textarea
              rows={4}
              value={formData.references_reglementaires}
              onChange={(e) => setFormData(prev => ({ ...prev, references_reglementaires: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0b3d91]"
            />
          </div>
        </div>
      )}

      {step === 4 && (
        <div className="space-y-6">
          <h2 className="text-2xl font-bold text-[#0b3d91]">4. Configuration QCM</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Nombre de questions *</label>
              <input
                type="number"
                required
                min="10"
                value={formData.qcm_n_questions}
                onChange={(e) => setFormData(prev => ({ ...prev, qcm_n_questions: parseInt(e.target.value) }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0b3d91]"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Seuil de réussite (0-1) *</label>
              <input
                type="number"
                required
                min="0"
                max="1"
                step="0.05"
                value={formData.qcm_seuil}
                onChange={(e) => setFormData(prev => ({ ...prev, qcm_seuil: parseFloat(e.target.value) }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0b3d91]"
              />
            </div>
          </div>

          <div className="flex items-center">
            <input
              type="checkbox"
              id="visites"
              checked={formData.integrer_visites}
              onChange={(e) => setFormData(prev => ({ ...prev, integrer_visites: e.target.checked }))}
              className="h-4 w-4 text-[#0b3d91]"
            />
            <label htmlFor="visites" className="ml-2 text-sm text-gray-700">
              Intégrer des visites applicatives
            </label>
          </div>

          <div className="bg-[#f7fbff] border border-[#00a8a8] rounded-lg p-4">
            <p className="text-sm font-medium text-[#0b3d91] mb-2">Résumé de votre configuration:</p>
            <ul className="text-sm text-gray-700 space-y-1">
              <li>Formation: {formData.titre_formation}</li>
              <li>Durée: {formData.duree_totale}h sur {formData.nb_jours} jours</li>
              <li>QCM: {formData.qcm_n_questions} questions, seuil {(formData.qcm_seuil * 100).toFixed(0)}%</li>
              <li>Visites: {formData.integrer_visites ? 'Oui' : 'Non'}</li>
            </ul>
          </div>
        </div>
      )}

      <div className="flex justify-between mt-8 pt-6 border-t">
        <button
          type="button"
          onClick={handlePrev}
          disabled={step === 1}
          className="px-6 py-2 text-[#0b3d91] font-medium rounded-lg hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          Précédent
        </button>

        {step < 4 ? (
          <button
            type="button"
            onClick={handleNext}
            className="flex items-center px-6 py-2 bg-[#0b3d91] text-white font-medium rounded-lg hover:bg-[#0a3275] transition-colors"
          >
            Suivant <ChevronRight className="w-4 h-4 ml-2" />
          </button>
        ) : (
          <button
            type="submit"
            disabled={isLoading}
            className="px-6 py-2 bg-[#00a8a8] text-white font-medium rounded-lg hover:bg-[#008888] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {isLoading ? 'Génération...' : 'Générer le Pack'}
          </button>
        )}
      </div>
    </form>
  );
}
