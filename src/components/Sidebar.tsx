import { BookOpen, FileText, Users, Video, TrendingUp, Calendar, MessageCircle, Headphones, FolderOpen, PenTool, } from 'lucide-react';

type NavItem = {
  icon: React.ReactNode;
  label: string;
  id: string;
};

type SidebarProps = {
  activeView: string;
  onNavigate: (view: string) => void;
  userType: string;
  lawFirmId?: string | null;
};

export default function Sidebar({ activeView, onNavigate, userType, lawFirmId }: SidebarProps) {
  const isClient = userType === 'client';
  const isLawFirmAdmin = userType === 'admin' && lawFirmId;

  const mainNav: NavItem[] = [
    ...(isClient ? [
      { icon: <FolderOpen size={20} />, label: 'Custom preparation', id: 'documents' },
      { icon: <PenTool size={20} />, label: 'Guided Case Writing', id: 'case-writing' },
      { icon: <BookOpen size={20} />, label: 'Course Catalog', id: 'catalog' },
      { icon: <Headphones size={20} />, label: 'Podcasts', id: 'podcasts' },
      { icon: <FileText size={20} />, label: 'Resources', id: 'resources' },
      { icon: <Users size={20} />, label: 'Community', id: 'community' },
      { icon: <Video size={20} />, label: 'Mock Hearings', id: 'hearings' },
    ] : isLawFirmAdmin ? [] : [
      { icon: <TrendingUp size={20} />, label: 'Operations', id: 'operations' },
    ]),
  ];

  const quickAccess: NavItem[] = isClient ? [
    { icon: <Calendar size={20} />, label: 'Progress Tracking', id: 'progress' },
    { icon: <MessageCircle size={20} />, label: 'Live Sessions', id: 'qna' },
  ] : [];

  return (
    <aside className="w-72 glass-panel border-r border-gray-200/50 h-screen flex flex-col shadow-xl">
      <div className="p-6 border-b border-gray-200/50">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-gray-900 to-gray-700 flex items-center justify-center text-white font-bold text-lg shadow-lg">
            C
          </div>
          <div className="text-2xl font-black tracking-tight bg-gradient-to-r from-gray-900 via-gray-700 to-gray-900 bg-clip-text text-transparent">
            Court99
          </div>
        </div>
      </div>

      <nav className="flex-1 overflow-y-auto py-6 px-4">
        <div className="space-y-2 mb-8">
          {mainNav.map((item) => (
            <button
              key={item.id}
              onClick={() => onNavigate(item.id)}
              className={`w-full flex items-center gap-4 px-4 py-3.5 rounded-xl text-sm font-semibold transition-all duration-200 group relative ${
                activeView === item.id
                  ? 'bg-gradient-to-r from-gray-900 to-gray-800 text-white shadow-lg shadow-gray-900/20 scale-105'
                  : 'text-gray-700 hover:bg-gray-100/80 hover:text-gray-900 hover:scale-105'
              }`}
            >
              <span className={`transition-transform duration-200 ${activeView === item.id ? 'scale-110' : 'group-hover:scale-110'}`}>
                {item.icon}
              </span>
              <span className="flex-1 text-left">{item.label}</span>
              {activeView === item.id && (
                <div className="absolute right-2 w-1.5 h-1.5 bg-white rounded-full animate-pulse"></div>
              )}
            </button>
          ))}
        </div>

        {quickAccess.length > 0 && (
          <div>
            <h3 className="px-4 text-xs font-bold text-gray-500 uppercase tracking-wider mb-3 flex items-center gap-2">
              <div className="h-px flex-1 bg-gradient-to-r from-transparent via-gray-300 to-transparent"></div>
              <span>Quick Access</span>
              <div className="h-px flex-1 bg-gradient-to-r from-transparent via-gray-300 to-transparent"></div>
            </h3>
            <div className="space-y-2">
              {quickAccess.map((item) => (
                <button
                  key={item.id}
                  onClick={() => onNavigate(item.id)}
                  className={`w-full flex items-center gap-4 px-4 py-3.5 rounded-xl text-sm font-semibold transition-all duration-200 group relative ${
                    activeView === item.id
                      ? 'bg-gradient-to-r from-gray-900 to-gray-800 text-white shadow-lg shadow-gray-900/20 scale-105'
                      : 'text-gray-700 hover:bg-gray-100/80 hover:text-gray-900 hover:scale-105'
                  }`}
                >
                  <span className={`transition-transform duration-200 ${activeView === item.id ? 'scale-110' : 'group-hover:scale-110'}`}>
                    {item.icon}
                  </span>
                  <span className="flex-1 text-left">{item.label}</span>
                  {activeView === item.id && (
                    <div className="absolute right-2 w-1.5 h-1.5 bg-white rounded-full animate-pulse"></div>
                  )}
                </button>
              ))}
            </div>
          </div>
        )}
      </nav>
    </aside>
  );
}