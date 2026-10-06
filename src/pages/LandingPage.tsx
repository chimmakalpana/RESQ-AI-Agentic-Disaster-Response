import React from 'react';
import { 
  ShieldAlert, 
  ArrowRight, 
  Cpu, 
  Search, 
  MapPin, 
  Boxes, 
  Navigation, 
  Megaphone, 
  Play,
  CheckCircle2,
  FileCheck,
  Zap,
  Globe2
} from 'lucide-react';
import { EmergencyPlanResponse } from '../types';

interface LandingPageProps {
  onStartReport: () => void;
  onRunDemo: () => void;
  isAnalyzing: boolean;
  activePlan: EmergencyPlanResponse | null;
  onViewDashboard: () => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({
  onStartReport,
  onRunDemo,
  isAnalyzing,
  activePlan,
  onViewDashboard
}) => {
  const workflowSteps = [
    {
      step: '01',
      agent: 'Disaster Detection',
      icon: Search,
      desc: 'Classifies incident type, hazard vectors, and severity level (Low, Med, High, Critical).',
      color: 'from-amber-500/20 to-orange-500/10 border-amber-500/30 text-amber-400'
    },
    {
      step: '02',
      agent: 'Situation Analysis',
      icon: MapPin,
      desc: 'Determines affected perimeter, vulnerable demographics (elderly, children, injured), and priority zones.',
      color: 'from-blue-500/20 to-cyan-500/10 border-blue-500/30 text-blue-400'
    },
    {
      step: '03',
      agent: 'Resource Coordination',
      icon: Boxes,
      desc: 'Matches demo shelters, hospitals, NDRF rescue teams, ALS ambulances, food, and water tankers.',
      color: 'from-purple-500/20 to-indigo-500/10 border-purple-500/30 text-purple-400'
    },
    {
      step: '04',
      agent: 'Evacuation Agent',
      icon: Navigation,
      desc: 'Computes safe transit corridor to high-ground shelters, pinpointing submerged choke points to avoid.',
      color: 'from-emerald-500/20 to-teal-500/10 border-emerald-500/30 text-emerald-400'
    },
    {
      step: '05',
      agent: 'Emergency Communication',
      icon: Megaphone,
      desc: 'Synthesizes real-time bilingual broadcast alerts in English and Telugu (తెలుగు) with authority briefs.',
      color: 'from-rose-500/20 to-pink-500/10 border-rose-500/30 text-rose-400'
    }
  ];

  return (
    <div className="space-y-16 py-6 sm:py-10">
      {/* Hero Section */}
      <section className="relative overflow-hidden rounded-3xl border border-slate-800 bg-gradient-to-b from-slate-900/90 via-slate-950 to-slate-950 p-6 sm:p-12 lg:p-16 shadow-2xl">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(225,29,72,0.15),rgba(255,255,255,0))] pointer-events-none" />
        
        <div className="max-w-4xl mx-auto text-center space-y-6 relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs sm:text-sm font-medium">
            <Cpu className="w-4 h-4 text-rose-400" />
            <span>Autonomous Multi-Agent Emergency Coordination Pipeline</span>
          </div>

          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-white font-mono">
            RESQ<span className="text-rose-500">-AI</span>
          </h1>

          <p className="text-xl sm:text-2xl font-semibold text-slate-200">
            Agentic AI for Smarter Disaster Response
          </p>

          <p className="text-base sm:text-lg text-slate-400 max-w-2xl mx-auto leading-relaxed">
            “An AI-powered multi-agent emergency coordination system that transforms disaster reports into actionable response plans.”
          </p>

          {/* Action CTAs */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <button
              onClick={onStartReport}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-3.5 text-base font-bold text-white bg-rose-600 hover:bg-rose-500 rounded-xl shadow-lg shadow-rose-950/60 transition-all hover:scale-[1.02] cursor-pointer"
            >
              <ShieldAlert className="w-5 h-5" />
              <span>Report Emergency</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              onClick={onRunDemo}
              disabled={isAnalyzing}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-3.5 text-base font-bold text-slate-200 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-xl transition-all hover:scale-[1.02] cursor-pointer disabled:opacity-50"
            >
              <Play className={`w-4 h-4 text-amber-400 fill-amber-400 ${isAnalyzing ? 'animate-spin' : ''}`} />
              <span>{isAnalyzing ? 'Activating Agents...' : 'View Demo'}</span>
            </button>
          </div>

          {activePlan && (
            <div className="pt-2">
              <button
                onClick={onViewDashboard}
                className="text-xs text-rose-400 hover:text-rose-300 inline-flex items-center gap-1.5 underline underline-offset-4"
              >
                <FileCheck className="w-4 h-4" />
                Active Plan Available ({activePlan.detection.disaster_type} in {activePlan.incident.location}) → View Dashboard
              </button>
            </div>
          )}

          {/* Small Disclaimer */}
          <p className="text-xs text-slate-500 pt-3">
            Prototype using simulated/demo emergency data. Not a replacement for official emergency services.
          </p>
        </div>
      </section>

      {/* Sequential Multi-Agent Workflow Section */}
      <section className="space-y-6">
        <div className="text-center space-y-2">
          <div className="inline-flex items-center gap-1.5 text-xs font-mono font-bold text-rose-400 uppercase tracking-widest">
            <Zap className="w-3.5 h-3.5" />
            Sequential Multi-Agent DAG
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold text-white">
            How The Orchestrator Coordinates 5 Specialized Agents
          </h2>
          <p className="text-sm text-slate-400 max-w-xl mx-auto">
            Unlike disjointed chatbots, RESQ-AI passes state downstream sequentially through strict schema contracts.
          </p>
        </div>

        {/* Workflow Pipeline Pills / Flowchart */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          {workflowSteps.map((item, idx) => {
            const Icon = item.icon;
            return (
              <div 
                key={item.step}
                className={`relative rounded-2xl border bg-gradient-to-b ${item.color} p-5 space-y-3 transition-all hover:border-slate-600 hover:-translate-y-1 shadow-md`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-mono text-xs font-bold px-2 py-0.5 rounded bg-slate-900/80 text-slate-300">
                    {item.step}
                  </span>
                  <div className="p-2 rounded-xl bg-slate-900/60 border border-slate-700/50">
                    <Icon className="w-5 h-5" />
                  </div>
                </div>

                <div>
                  <h3 className="font-bold text-white text-base">
                    {item.agent}
                  </h3>
                  <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                    {item.desc}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 flex items-center justify-between text-xs text-slate-300">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>Workflow pipeline: <strong>Detect → Analyze → Coordinate → Evacuate → Communicate</strong></span>
          </div>
          <div className="hidden md:flex items-center gap-2 font-mono text-[11px] text-slate-400">
            <Globe2 className="w-3.5 h-3.5 text-cyan-400" />
            <span>Autonomous English & Telugu Generation</span>
          </div>
        </div>
      </section>

      {/* Key Architectural Pillars */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="p-6 rounded-2xl bg-slate-900/50 border border-slate-800 space-y-2.5">
          <div className="w-9 h-9 rounded-xl bg-rose-500/20 text-rose-400 flex items-center justify-center font-bold">
            01
          </div>
          <h3 className="text-lg font-bold text-white">One Central Orchestrator</h3>
          <p className="text-xs text-slate-400 leading-relaxed">
            The Commander Agent manages token state, feeds detection outputs into situation analysis, allocates emergency resources, and aggregates the final unified plan.
          </p>
        </div>

        <div className="p-6 rounded-2xl bg-slate-900/50 border border-slate-800 space-y-2.5">
          <div className="w-9 h-9 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center font-bold">
            02
          </div>
          <h3 className="text-lg font-bold text-white">Full Trace & Observability</h3>
          <p className="text-xs text-slate-400 leading-relaxed">
            View live status changes (Pending, Running, Completed) across every agent in the pipeline with exact timestamps, parameters, and structured outputs.
          </p>
        </div>

        <div className="p-6 rounded-2xl bg-slate-900/50 border border-slate-800 space-y-2.5">
          <div className="w-9 h-9 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold">
            03
          </div>
          <h3 className="text-lg font-bold text-white">Guaranteed Demo Integrity</h3>
          <p className="text-xs text-slate-400 leading-relaxed">
            Integrated with Gemini 3.8 and bolstered by a rock-solid deterministic fallback. If an API key is missing or quota is exhausted, the demo never fails.
          </p>
        </div>
      </section>
    </div>
  );
};
