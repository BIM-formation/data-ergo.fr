import { BarChart3, TrendingUp } from 'lucide-react';

interface Activity {
  id: string;
  date: string;
  activityType: string;
  description: string;
  hours: number;
  stagiairesCount: number;
  formatorsCount: number;
}

interface QuarterlyStats {
  quarter: number;
  year: number;
  totalHours: number;
  totalStagiaires: number;
  totalFormateurs: number;
  activitiesCount: number;
}

export default function ActivityJournal() {
  const quarterlyStats: QuarterlyStats[] = [
    {
      quarter: 4,
      year: 2024,
      totalHours: 156,
      totalStagiaires: 24,
      totalFormateurs: 4,
      activitiesCount: 8
    },
    {
      quarter: 3,
      year: 2024,
      totalHours: 201,
      totalStagiaires: 30,
      totalFormateurs: 5,
      activitiesCount: 10
    }
  ];

  const recentActivities: Activity[] = [
    {
      id: '1',
      date: '2025-01-20',
      activityType: 'Formation SSIAP-1',
      description: 'Session initiale - Groupe A',
      hours: 67,
      stagiairesCount: 12,
      formatorsCount: 2
    },
    {
      id: '2',
      date: '2025-01-15',
      activityType: 'Formation SST',
      description: 'Recyclage sauveteur secouriste',
      hours: 14,
      stagiairesCount: 8,
      formatorsCount: 1
    },
    {
      id: '3',
      date: '2025-01-10',
      activityType: 'Audit Qualiopi',
      description: 'Vérification de conformité',
      hours: 4,
      stagiairesCount: 0,
      formatorsCount: 1
    }
  ];

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-2xl font-bold text-[#0b3d91] mb-6">Récapitulatif des Activités</h2>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-gradient-to-br from-[#0b3d91] to-[#0a2d6b] text-white p-4 rounded-lg">
            <p className="text-sm text-white opacity-80">Heures totales</p>
            <p className="text-3xl font-bold mt-2">357h</p>
          </div>
          <div className="bg-gradient-to-br from-[#00a8a8] to-[#008888] text-white p-4 rounded-lg">
            <p className="text-sm text-white opacity-80">Stagiaires formés</p>
            <p className="text-3xl font-bold mt-2">54</p>
          </div>
          <div className="bg-gradient-to-br from-[#0b3d91] to-[#0a2d6b] text-white p-4 rounded-lg">
            <p className="text-sm text-white opacity-80">Formateurs actifs</p>
            <p className="text-3xl font-bold mt-2">5</p>
          </div>
          <div className="bg-gradient-to-br from-[#00a8a8] to-[#008888] text-white p-4 rounded-lg">
            <p className="text-sm text-white opacity-80">Sessions</p>
            <p className="text-3xl font-bold mt-2">18</p>
          </div>
        </div>

        <div className="space-y-6">
          {quarterlyStats.map((quarter) => (
            <div key={`${quarter.year}-Q${quarter.quarter}`} className="border-l-4 border-[#00a8a8] pl-4">
              <h3 className="text-lg font-semibold text-[#0b3d91] mb-3">
                Q{quarter.quarter} {quarter.year}
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
                <div className="p-3 bg-blue-50 rounded-lg">
                  <p className="text-xs text-gray-600">Heures</p>
                  <p className="text-xl font-bold text-[#0b3d91]">{quarter.totalHours}h</p>
                </div>
                <div className="p-3 bg-cyan-50 rounded-lg">
                  <p className="text-xs text-gray-600">Stagiaires</p>
                  <p className="text-xl font-bold text-[#00a8a8]">{quarter.totalStagiaires}</p>
                </div>
                <div className="p-3 bg-blue-50 rounded-lg">
                  <p className="text-xs text-gray-600">Formateurs</p>
                  <p className="text-xl font-bold text-[#0b3d91]">{quarter.totalFormateurs}</p>
                </div>
                <div className="p-3 bg-cyan-50 rounded-lg">
                  <p className="text-xs text-gray-600">Activités</p>
                  <p className="text-xl font-bold text-[#00a8a8]">{quarter.activitiesCount}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-xl font-semibold text-[#0b3d91] mb-4">Activités récentes</h3>
        <div className="space-y-3">
          {recentActivities.map((activity) => (
            <div
              key={activity.id}
              className="p-4 border border-gray-200 rounded-lg hover:border-[#00a8a8] hover:bg-[#f7fbff] transition-all"
            >
              <div className="flex justify-between items-start mb-2">
                <div>
                  <h4 className="font-semibold text-gray-900">{activity.activityType}</h4>
                  <p className="text-sm text-gray-600">{activity.description}</p>
                </div>
                <span className="text-sm text-[#0b3d91] font-medium">
                  {new Date(activity.date).toLocaleDateString('fr-FR')}
                </span>
              </div>
              <div className="flex gap-4 text-sm text-gray-600">
                <span className="flex items-center">
                  <TrendingUp className="w-4 h-4 mr-1 text-[#00a8a8]" />
                  {activity.hours}h
                </span>
                <span>{activity.stagiairesCount} stagiaires</span>
                <span>{activity.formatorsCount} formateur(s)</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
