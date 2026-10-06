import React from 'react';
import { ShieldCheck, PhoneCall, AlertTriangle, GitFork } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="mt-16 border-t border-slate-800 bg-slate-950 py-10 text-xs text-slate-400">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        {/* Official Emergency Contact Notice */}
        <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/30 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-amber-200">
          <div className="flex items-center gap-2.5">
            <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0" />
            <p className="font-medium text-xs sm:text-sm">
              <strong className="text-amber-300">Hackathon Prototype Notice:</strong> RESQ-AI is a simulated disaster coordination prototype. For real-life life-threatening emergencies, immediately dial official authorities.
            </p>
          </div>
          <div className="flex items-center gap-2 font-mono text-xs font-bold shrink-0">
            <span className="px-2.5 py-1 bg-amber-500/20 rounded border border-amber-500/40">National: 112</span>
            <span className="px-2.5 py-1 bg-amber-500/20 rounded border border-amber-500/40">Medical: 108</span>
            <span className="px-2.5 py-1 bg-amber-500/20 rounded border border-amber-500/40">Fire: 101</span>
          </div>
        </div>

        <div className="flex flex-col md:flex-row items-center justify-between gap-4 pt-4 border-t border-slate-800/60">
          <div className="flex items-center gap-3">
            <div className="w-7 h-7 rounded-lg bg-rose-500/20 flex items-center justify-center text-rose-400 border border-rose-500/30 font-mono font-bold text-xs">
              R
            </div>
            <div>
              <p className="font-semibold text-slate-200">
                RESQ-AI — 24-Hour Disaster Management & Agentic AI
              </p>
              <p className="text-[11px] text-slate-400">
                Architecture: User → Frontend → Backend → Orchestrator → 5 Specialized Agents → Command Dashboard
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4 text-[11px] font-mono">
            <span className="inline-flex items-center gap-1 text-slate-300">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              Verified Demo Integrity
            </span>
            <span className="inline-flex items-center gap-1 text-slate-300">
              <GitFork className="w-3.5 h-3.5 text-cyan-400" />
              Sequential Multi-Agent DAG
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
};
