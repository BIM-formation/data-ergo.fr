import { BarChart3, CheckCircle2, Award, FileText, Settings, BookOpen, Home } from 'lucide-react';

interface MenuItem {
  id: string;
  icon: React.ReactNode;
  label: string;
  badge?: string;
}

interface SidebarProps {
  activeItem: string;
  onItemClick: (id: string) => void;
}

export default function Sidebar({ activeItem, onItemClick }: SidebarProps) {
  const menuItems: MenuItem[] = [
    {
      id: 'dashboard',
      icon: <Home className="w-5 h-5" />,
      label: 'Tableau de bord',
    },
    {
      id: 'qualiopi',
      icon: <CheckCircle2 className="w-5 h-5" />,
      label: 'Dossier Qualiopi',
      badge: '7 critères'
    },
    {
      id: 'bpf',
      icon: <FileText className="w-5 h-5" />,
      label: 'BPF',
    },
    {
      id: 'habilitations',
      icon: <Award className="w-5 h-5" />,
      label: 'Habilitations & Agréments',
    },
    {
      id: 'documents',
      icon: <FileText className="w-5 h-5" />,
      label: 'Gestion des Documents',
    },
    {
      id: 'abonnement',
      icon: <Settings className="w-5 h-5" />,
      label: 'Abonnement & JO',
    },
    {
      id: 'journal',
      icon: <BookOpen className="w-5 h-5" />,
      label: 'Récapitulatif Activités',
    },
  ];

  return (
    <aside className="w-64 bg-gradient-to-b from-[#0b3d91] to-[#0a2d6b] min-h-screen text-white shadow-lg fixed left-0 top-20">
      <nav className="p-4 space-y-2">
        {menuItems.map((item) => (
          <button
            key={item.id}
            onClick={() => onItemClick(item.id)}
            className={`w-full flex items-center justify-between px-4 py-3 rounded-lg transition-all ${
              activeItem === item.id
                ? 'bg-[#00a8a8] text-white shadow-lg'
                : 'text-white hover:bg-[#0b3d91] hover:bg-opacity-70'
            }`}
          >
            <div className="flex items-center space-x-3">
              {item.icon}
              <span className="font-medium">{item.label}</span>
            </div>
            {item.badge && (
              <span className="text-xs bg-white bg-opacity-20 px-2 py-1 rounded-full whitespace-nowrap">
                {item.badge}
              </span>
            )}
          </button>
        ))}
      </nav>

      <div className="absolute bottom-6 left-4 right-4 p-4 bg-white bg-opacity-10 rounded-lg border border-white border-opacity-20">
        <p className="text-xs text-white opacity-70">Version 1.0</p>
        <p className="text-xs text-[#00a8a8] font-semibold">DATA-ERGO.FR</p>
      </div>
    </aside>
  );
}
