import { useState, useEffect, useRef } from 'react';
import { Search, LogOut } from 'lucide-react';
import Notifications from './Notifications';

type HeaderProps = {
  userName: string;
  userAvatar?: string;
  userType?: string;
  lawFirmName?: string;
  onLogout?: () => void;
};

export default function Header({ userName, userAvatar, userType, lawFirmName, onLogout }: HeaderProps) {
  const [showUserMenu, setShowUserMenu] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  const getUserTypeLabel = () => {
    if (userType === 'admin' && !lawFirmName) {
      return 'Court99 Admin';
    } else if (userType === 'admin' && lawFirmName) {
      return lawFirmName;
    } else if (userType === 'client' && lawFirmName) {
      return `${lawFirmName} Client`;
    }
    return 'Client';
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setShowUserMenu(false);
      }
    };

    if (showUserMenu) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showUserMenu]);

  return (
    <header className="glass-panel sticky top-0 z-40 border-b border-gray-200/50 px-6 py-4 backdrop-blur-xl">
      <div className="flex items-center justify-between">
        <div className="flex-1 max-w-2xl">
          <div className="relative group">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 group-focus-within:text-gray-900 transition-colors" size={20} />
            <input
              type="text"
              placeholder="Search courses, resources..."
              className="w-full pl-12 pr-4 py-3 bg-white/70 border-2 border-gray-200/80 rounded-2xl focus:outline-none focus:ring-4 focus:ring-gray-900/10 focus:border-gray-900 transition-all duration-200 placeholder:text-gray-400"
            />
          </div>
        </div>

        <div className="flex items-center gap-3 ml-6">
          <Notifications />

          <div className="relative" ref={menuRef}>
            <button
              onClick={() => setShowUserMenu(!showUserMenu)}
              className="flex items-center gap-3 hover:bg-gray-100/80 rounded-xl p-2 pr-3 transition-all duration-200 hover:scale-105 group"
            >
              <div className="text-right">
                <div className="text-sm font-bold text-gray-900 group-hover:text-gray-700 transition-colors">{userName}</div>
                <div className="text-xs text-gray-500 font-medium">{getUserTypeLabel()}</div>
              </div>
              <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-gray-900 to-gray-700 flex items-center justify-center text-white font-bold text-base shadow-lg shadow-gray-900/20 ring-2 ring-white">
                {userAvatar ? (
                  <img src={userAvatar} alt={userName} className="w-full h-full rounded-xl object-cover" />
                ) : (
                  userName.charAt(0).toUpperCase()
                )}
              </div>
            </button>

            {showUserMenu && (
              <div className="absolute right-0 mt-2 w-52 bg-white/95 backdrop-blur-xl rounded-2xl shadow-2xl border border-gray-200/50 py-2 z-50 animate-scale-in">
                {onLogout && (
                  <button
                    onClick={() => {
                      setShowUserMenu(false);
                      onLogout();
                    }}
                    className="w-full px-4 py-3 text-left text-sm font-semibold text-gray-900 hover:bg-gray-100/80 flex items-center gap-3 transition-all duration-200 mx-2 rounded-xl"
                  >
                    <LogOut size={18} />
                    Sign Out
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}