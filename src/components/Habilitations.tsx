import { Plus, Calendar, CheckCircle, AlertCircle, Download } from 'lucide-react';

interface Habilitation {
  id: string;
  name: string;
  acronym: string;
  issuedBy: string;
  issuanceDate: string;
  expirationDate: string;
  status: 'active' | 'expiring_soon' | 'expired';
  certificateNumber: string;
}

export default function Habilitations() {
  const habilitations: Habilitation[] = [
    {
      id: '1',
      name: 'Agrément de formation SSIAP-1',
      acronym: 'AGRÉMENT-SSIAP1',
      issuedBy: 'Préfecture Auvergne-Rhône-Alpes',
      issuanceDate: '2023-06-15',
      expirationDate: '2026-06-15',
      status: 'active',
      certificateNumber: 'AGR-2023-00482'
    },
    {
      id: '2',
      name: 'Numéro de déclaration d\'activité de formation',
      acronym: 'NDA',
      issuedBy: 'Ministère du Travail',
      issuanceDate: '2022-01-10',
      expirationDate: '2027-01-10',
      status: 'active',
      certificateNumber: '84630635263'
    },
    {
      id: '3',
      name: 'Certification Qualiopi',
      acronym: 'QUALIOPI',
      issuedBy: 'COFRAC',
      issuanceDate: '2024-03-20',
      expirationDate: '2025-03-20',
      status: 'expiring_soon',
      certificateNumber: 'QUAL-2024-12345'
    },
    {
      id: '4',
      name: 'Agrément SST',
      acronym: 'AGR-SST',
      issuedBy: 'INRS',
      issuanceDate: '2023-09-01',
      expirationDate: '2025-09-01',
      status: 'expiring_soon',
      certificateNumber: 'SST-2023-00891'
    }
  ];

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return (
          <span className="flex items-center space-x-1 px-3 py-1 bg-green-100 text-green-800 rounded-full text-xs font-medium">
            <CheckCircle className="w-3 h-3" />
            <span>Actif</span>
          </span>
        );
      case 'expiring_soon':
        return (
          <span className="flex items-center space-x-1 px-3 py-1 bg-yellow-100 text-yellow-800 rounded-full text-xs font-medium">
            <AlertCircle className="w-3 h-3" />
            <span>Expire bientôt</span>
          </span>
        );
      case 'expired':
        return (
          <span className="flex items-center space-x-1 px-3 py-1 bg-red-100 text-red-800 rounded-full text-xs font-medium">
            <AlertCircle className="w-3 h-3" />
            <span>Expiré</span>
          </span>
        );
      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-[#0b3d91]">Habilitations & Agréments</h2>
          <p className="text-gray-600 mt-1">Gestion centralisée des certifications et agréments</p>
        </div>
        <button className="flex items-center space-x-2 px-4 py-2 bg-[#00a8a8] text-white rounded-lg hover:bg-[#008888] transition-colors">
          <Plus className="w-4 h-4" />
          <span>Ajouter</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {habilitations.map((hab) => (
          <div key={hab.id} className="bg-white rounded-lg shadow-md p-6 border-l-4 border-[#00a8a8]">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3 className="font-semibold text-gray-900 text-lg">{hab.name}</h3>
                <p className="text-sm text-gray-600 mt-1">{hab.acronym}</p>
              </div>
              {getStatusBadge(hab.status)}
            </div>

            <div className="space-y-2 mb-4 text-sm text-gray-700">
              <p><span className="font-medium">Autorité:</span> {hab.issuedBy}</p>
              <p><span className="font-medium">Numéro:</span> {hab.certificateNumber}</p>
              <div className="flex items-center space-x-4 pt-2 border-t">
                <div className="flex items-center space-x-1">
                  <Calendar className="w-4 h-4 text-gray-400" />
                  <span>
                    Délivré: {new Date(hab.issuanceDate).toLocaleDateString('fr-FR')}
                  </span>
                </div>
              </div>
              <div className="flex items-center space-x-1">
                <Calendar className="w-4 h-4 text-gray-400" />
                <span>
                  Expire: {new Date(hab.expirationDate).toLocaleDateString('fr-FR')}
                </span>
              </div>
            </div>

            <div className="flex space-x-2">
              <button className="flex-1 px-3 py-2 text-sm text-[#0b3d91] font-medium rounded-lg hover:bg-[#f7fbff] transition-colors border border-[#0b3d91]">
                Consulter
              </button>
              <button className="px-3 py-2 text-[#0b3d91] hover:bg-[#f7fbff] transition-colors rounded-lg">
                <Download className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
