import { TrendingUp, Clock, Users, FileCheck } from 'lucide-react';

export default function Dashboard() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-[#0b3d91] mb-6">Tableau de bord</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <div className="bg-white rounded-lg shadow-md p-6 border-t-4 border-[#0b3d91]">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Formations actives</p>
                <p className="text-3xl font-bold text-[#0b3d91] mt-2">3</p>
              </div>
              <FileCheck className="w-12 h-12 text-[#0b3d91] opacity-20" />
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6 border-t-4 border-[#00a8a8]">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Heures dispensées</p>
                <p className="text-3xl font-bold text-[#00a8a8] mt-2">357h</p>
              </div>
              <Clock className="w-12 h-12 text-[#00a8a8] opacity-20" />
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6 border-t-4 border-[#0b3d91]">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Stagiaires formés</p>
                <p className="text-3xl font-bold text-[#0b3d91] mt-2">54</p>
              </div>
              <Users className="w-12 h-12 text-[#0b3d91] opacity-20" />
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6 border-t-4 border-[#00a8a8]">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Qualiopi conformité</p>
                <p className="text-3xl font-bold text-[#00a8a8] mt-2">100%</p>
              </div>
              <TrendingUp className="w-12 h-12 text-[#00a8a8] opacity-20" />
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold text-[#0b3d91] mb-4">Sessions à venir</h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 bg-[#f7fbff] rounded-lg border-l-4 border-[#00a8a8]">
              <div>
                <p className="font-medium text-gray-900">SSIAP-1 - Session Janvier</p>
                <p className="text-sm text-gray-600">Groupe A - 12 stagiaires</p>
              </div>
              <span className="text-sm font-medium text-[#0b3d91]">En cours</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-white rounded-lg border-l-4 border-gray-300">
              <div>
                <p className="font-medium text-gray-900">SST - Recyclage</p>
                <p className="text-sm text-gray-600">Prévu 15 février - 8 stagiaires</p>
              </div>
              <span className="text-sm font-medium text-gray-600">Planifié</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-white rounded-lg border-l-4 border-gray-300">
              <div>
                <p className="font-medium text-gray-900">TFP-APS - Formation initiale</p>
                <p className="text-sm text-gray-600">Prévu 1er mars - 10 stagiaires</p>
              </div>
              <span className="text-sm font-medium text-gray-600">Planifié</span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold text-[#0b3d91] mb-4">À faire</h3>
          <div className="space-y-2">
            <div className="flex items-start space-x-3 p-2">
              <input type="checkbox" className="mt-1 w-4 h-4 text-[#00a8a8]" defaultChecked />
              <label className="text-sm text-gray-700">Audit Qualiopi Q1</label>
            </div>
            <div className="flex items-start space-x-3 p-2">
              <input type="checkbox" className="mt-1 w-4 h-4 text-[#00a8a8]" />
              <label className="text-sm text-gray-700">Mise à jour documents</label>
            </div>
            <div className="flex items-start space-x-3 p-2">
              <input type="checkbox" className="mt-1 w-4 h-4 text-[#00a8a8]" />
              <label className="text-sm text-gray-700">Vérifier certifications</label>
            </div>
            <div className="flex items-start space-x-3 p-2">
              <input type="checkbox" className="mt-1 w-4 h-4 text-[#00a8a8]" />
              <label className="text-sm text-gray-700">Renouvellement formations</label>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
