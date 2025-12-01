import { CheckCircle2, AlertCircle, Clock } from 'lucide-react';
import { useState } from 'react';

interface QualiopiCriterion {
  number: number;
  name: string;
  description: string;
  isCompliant: boolean;
  lastAudit?: string;
}

const QUALIOPI_CRITERIA: QualiopiCriterion[] = [
  {
    number: 1,
    name: 'Informations sur l\'offre',
    description: 'Informations accessibles, claires et actualisées sur l\'offre de formation',
    isCompliant: true,
    lastAudit: '2025-01-15'
  },
  {
    number: 2,
    name: 'Conditions d\'accès',
    description: 'Conditions d\'accès claires, délais et prérequis communiqués',
    isCompliant: true,
    lastAudit: '2025-01-15'
  },
  {
    number: 3,
    name: 'Moyens pédagogiques',
    description: 'Ressources pédagogiques adaptées et actualisées',
    isCompliant: false,
    lastAudit: '2024-12-20'
  },
  {
    number: 4,
    name: 'Compétences des formateurs',
    description: 'Formateurs compétents et formation continue garantie',
    isCompliant: true,
    lastAudit: '2025-01-10'
  },
  {
    number: 5,
    name: 'Suivi et résultats',
    description: 'Suivi continu des participants et mesure des résultats',
    isCompliant: true,
    lastAudit: '2025-01-15'
  },
  {
    number: 6,
    name: 'Investissement formation',
    description: 'Investissement dans la formation et amélioration continue',
    isCompliant: false,
    lastAudit: '2024-11-30'
  },
  {
    number: 7,
    name: 'Inclusion et accessibilité',
    description: 'Égalité des chances et adaptations pour personnes en situation de handicap',
    isCompliant: true,
    lastAudit: '2025-01-05'
  }
];

export default function Qualiopi() {
  const [criteria, setCriteria] = useState<QualiopiCriterion[]>(QUALIOPI_CRITERIA);
  const compliantCount = criteria.filter(c => c.isCompliant).length;

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold text-[#0b3d91]">Dossier Qualiopi</h2>
            <p className="text-gray-600 mt-1">Suivi de conformité aux 7 critères de qualité</p>
          </div>
          <div className="text-center">
            <div className="text-4xl font-bold text-[#00a8a8]">{compliantCount}/7</div>
            <p className="text-sm text-gray-600">Critères conformes</p>
          </div>
        </div>

        <div className="w-full bg-gray-200 rounded-full h-3 mb-6">
          <div
            className="bg-gradient-to-r from-[#0b3d91] to-[#00a8a8] h-3 rounded-full transition-all"
            style={{ width: `${(compliantCount / 7) * 100}%` }}
          ></div>
        </div>

        <div className="space-y-3">
          {criteria.map((criterion) => (
            <div
              key={criterion.number}
              className={`p-4 rounded-lg border-2 ${
                criterion.isCompliant
                  ? 'bg-green-50 border-green-200'
                  : 'bg-yellow-50 border-yellow-200'
              }`}
            >
              <div className="flex items-start justify-between">
                <div className="flex items-start space-x-3 flex-1">
                  {criterion.isCompliant ? (
                    <CheckCircle2 className="w-6 h-6 text-green-600 flex-shrink-0 mt-1" />
                  ) : (
                    <AlertCircle className="w-6 h-6 text-yellow-600 flex-shrink-0 mt-1" />
                  )}
                  <div>
                    <div className="flex items-center space-x-2">
                      <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-[#0b3d91] text-white text-sm font-bold">
                        {criterion.number}
                      </span>
                      <h3 className="font-semibold text-gray-900">{criterion.name}</h3>
                    </div>
                    <p className="text-sm text-gray-700 mt-1">{criterion.description}</p>
                  </div>
                </div>
                <div className="text-right text-xs text-gray-600 ml-4 flex-shrink-0">
                  {criterion.lastAudit && (
                    <>
                      <Clock className="w-4 h-4 inline mr-1" />
                      {new Date(criterion.lastAudit).toLocaleDateString('fr-FR')}
                    </>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-lg font-semibold text-[#0b3d91] mb-4">Plan d'action</h3>
        <div className="space-y-3">
          {criteria
            .filter(c => !c.isCompliant)
            .map((criterion) => (
              <div key={criterion.number} className="p-3 bg-yellow-50 rounded-lg border border-yellow-200">
                <p className="text-sm font-medium text-gray-900">
                  Critère {criterion.number}: {criterion.name}
                </p>
                <p className="text-sm text-gray-600 mt-1">
                  Action requise: Amélioration nécessaire avant le prochain audit
                </p>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
}
