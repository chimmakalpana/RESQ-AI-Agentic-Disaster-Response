import React from 'react';
import { 
  Home, 
  AlertCircle, 
  Cpu, 
  LayoutDashboard, 
  Boxes, 
  Navigation, 
  Megaphone 
} from 'lucide-react';

interface NavigationTabsProps {
  currentTab: string;
  setCurrentTab: (tab: string) => void;
  hasActivePlan: boolean;
}

export const NavigationTabs: React.FC<NavigationTabsProps> = ({
  currentTab,
  setCurrentTab,
  hasActivePlan
}) => {
  const tabs = [
    { id: 'landing', label: 'Overview', icon: Home },
    { id: 'report', label: 'Report Emergency', icon: AlertCircle, highlight: true },
    { id: 'agents', label: 'Agent Activity', icon: Cpu, badge: 'Multi-Agent' },
    { id: 'dashboard', label: 'Command Dashboard', icon: LayoutDashboard },
    { id: 'resources', label: 'Resources', icon: Boxes },
    { id: 'evacuation', label: 'Evacuation Route', icon: Navigation },
    { id: 'communication', label: 'Bilingual Alert', icon: Megaphone, badge: 'EN / TE' },
  ];

  return (
    <div className="border-b border-slate-800 bg-slate-900/60 sticky top-16 z-40 backdrop-blur-sm overflow-x-auto scrollbar-none">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <nav className="flex space-x-1 sm:space-x-2 py-2" aria-label="Tabs">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = currentTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setCurrentTab(tab.id)}
                className={`flex items-center gap-2 px-3 py-2 text-xs sm:text-sm font-medium rounded-lg whitespace-nowrap transition-all ${
                  isActive
                    ? 'bg-rose-600/20 text-rose-300 border border-rose-500/40 shadow-sm'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60 border border-transparent'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-rose-400' : 'text-slate-400'}`} />
                <span>{tab.label}</span>
                {tab.badge && (
                  <span className={`text-[10px] px-1.5 py-0.2 rounded font-mono ${
                    isActive ? 'bg-rose-500/30 text-rose-200' : 'bg-slate-800 text-slate-400'
                  }`}>
                    {tab.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>
      </div>
    </div>
  );
};
