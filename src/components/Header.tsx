import React from 'react';
import { ShieldAlert, Activity, Radio, Cpu, RefreshCw } from 'lucide-react';
import { EmergencyPlanResponse } from '../types';

interface HeaderProps {
  currentTab: string;
  setCurrentTab: (tab: string) => void;
  activePlan: EmergencyPlanResponse | null;
  onTriggerDemo: () => void;
  isAnalyzing: boolean;
  systemMode?: string;
}

export const Header: React.FC<HeaderProps> = ({
  currentTab,
  setCurrentTab,
  activePlan,
  onTriggerDemo,
  isAnalyzing,
  systemMode
}) => {
  return (
    <header className="sticky top-0 z-50 border-b border-slate-800 bg-slate-950/90 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo & Branding */}
          <div 
            onClick={() => setCurrentTab('landing')}
            className="flex items-center gap-3 cursor-pointer group"
          >
            <div className="relative flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br from-rose-600 to-amber-600 shadow-md shadow-rose-950/50 group-hover:scale-105 transition-transform">
              <ShieldAlert className="w-5 h-5 text-white" />
              <span className="absolute -top-1 -right-1 flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-rose-500"></span>
              </span>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xl font-extrabold tracking-tight text-white font-mono">
                  RESQ<span className="text-rose-500">-AI</span>
                </span>
                <span className="px-1.5 py-0.5 text-[10px] font-semibold bg-rose-500/20 text-rose-300 border border-rose-500/30 rounded">
                  AGENTIC SYSTEM
                </span>
              </div>
              <p className="text-xs text-slate-400 hidden sm:block">
                Emergency Response & Disaster Coordination
              </p>
            </div>
          </div>

          {/* Center Info / Live Ticker */}
          <div className="hidden md:flex items-center gap-3 text-xs">
            <div className="flex items-center gap-1.5 px-3 py-1 bg-slate-900 border border-slate-800 rounded-full text-slate-300 font-mono">
              <Radio className="w-3.5 h-3.5 text-emerald-400 animate-pulse" />
              <span>Multi-Agent Mesh:</span>
              <span className="text-emerald-400 font-semibold">6 Agents Active</span>
            </div>
            {systemMode && (
              <div className="flex items-center gap-1 px-2.5 py-1 bg-slate-900/60 border border-slate-800/80 rounded-full text-[11px] text-slate-400">
                <Cpu className="w-3 h-3 text-cyan-400" />
                <span>{systemMode}</span>
              </div>
            )}
          </div>

          {/* Right Action Buttons */}
          <div className="flex items-center gap-2">
            <button
              onClick={onTriggerDemo}
              disabled={isAnalyzing}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-200 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-lg transition-colors disabled:opacity-50"
              title="Run standard hackathon demo scenario (Flood in Gajuwaka)"
            >
              <RefreshCw className={`w-3.5 h-3.5 text-amber-400 ${isAnalyzing ? 'animate-spin' : ''}`} />
              <span className="hidden sm:inline">Run Demo Scenario</span>
              <span className="sm:hidden">Demo</span>
            </button>

            <button
              onClick={() => setCurrentTab('report')}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold text-white bg-rose-600 hover:bg-rose-500 shadow-sm shadow-rose-900 rounded-lg transition-colors"
            >
              <Activity className="w-3.5 h-3.5" />
              <span>Report Emergency</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
