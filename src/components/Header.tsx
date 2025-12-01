import { LogIn, LogOut, UserPlus } from 'lucide-react';

interface HeaderProps {
  isAuthenticated: boolean;
  onLogin?: () => void;
  onSignup?: () => void;
  onLogout?: () => void;
  logoUrl?: string;
}

export default function Header({
  isAuthenticated,
  onLogin,
  onSignup,
  onLogout,
  logoUrl
}: HeaderProps) {
  return (
    <header className="bg-white border-b-2 border-[#0b3d91] shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          <div className="flex items-center space-x-3">
            {logoUrl && (
              <img
                src={logoUrl}
                alt="DATA-ERGO.FR"
                className="h-12 w-auto"
              />
            )}
            <div>
              <h1 className="text-2xl font-bold text-[#0b3d91]">DATA-ERGO</h1>
              <p className="text-xs text-[#00a8a8] font-medium">Formation Professionnelle</p>
            </div>
          </div>

          <nav className="flex items-center space-x-4">
            {isAuthenticated ? (
              <button
                onClick={onLogout}
                className="flex items-center space-x-2 px-4 py-2 bg-red-50 text-red-700 rounded-lg hover:bg-red-100 transition-colors"
              >
                <LogOut className="w-4 h-4" />
                <span className="hidden sm:inline">Déconnexion</span>
              </button>
            ) : (
              <>
                <button
                  onClick={onLogin}
                  className="flex items-center space-x-2 px-4 py-2 text-[#0b3d91] font-medium rounded-lg hover:bg-[#f7fbff] transition-colors"
                >
                  <LogIn className="w-4 h-4" />
                  <span className="hidden sm:inline">Connexion</span>
                </button>
                <button
                  onClick={onSignup}
                  className="flex items-center space-x-2 px-4 py-2 bg-[#00a8a8] text-white font-medium rounded-lg hover:bg-[#008888] transition-colors"
                >
                  <UserPlus className="w-4 h-4" />
                  <span className="hidden sm:inline">Inscription</span>
                </button>
              </>
            )}
          </nav>
        </div>
      </div>
    </header>
  );
}
