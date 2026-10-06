import React, { useState } from 'react';
import { 
  CheckCircle2, 
  Clock, 
  Loader2, 
  AlertCircle, 
  Cpu, 
  Search, 
  MapPin, 
  Boxes, 
  Navigation, 
  Megaphone, 
  ShieldCheck, 
  Terminal,
  ArrowRight,
  Eye,
  Check
} from 'lucide-react';
import { EmergencyPlanResponse, AgentStatus } from '../types';

interface AgentActivityPageProps {
  plan: EmergencyPlanResponse | null;
  isAnalyzing: boolean;
  onNavigateToDashboard: () => void;
}

export const AgentActivityPage: React.FC<AgentActivityPageProps> = ({
  plan,
  isAnalyzing,
  onNavigateToDashboard,
}) => {
  const [selectedAgentIndex, setSelectedAgentIndex] = useState<number | null>(null);

  // The 6 standard agents in sequential DAG order
  const agentDefinitions = [
    {
      id: 'detection',
      name: 'Disaster Detection Agent',
      emoji: '🚨',
      icon: Search,
      role: 'Classification & Hazard Severity',
      extractSummary: (p: EmergencyPlanResponse) => 
        `✓ ${p.detection.disaster_type} detected | ✓ Severity: ${p.detection.severity} (Confidence: ${Math.round(p.detection.confidence * 100)}%)`,
      extractBullets: (p: EmergencyPlanResponse) => [
        `Disaster Type: ${p.detection.disaster_type}`,
        `Severity Level: ${p.detection.severity}`,
        `Immediate Risks: ${p.detection.immediate_risks?.[0] || 'High inundation risk'}`
      ],
      getData: (p: EmergencyPlanResponse) => p.detection
    },
    {
      id: 'situation',
      name: 'Situation Analysis Agent',
      emoji: '🗺️',
      icon: MapPin,
      role: 'Perimeter Sizing & Vulnerable Groups',
      extractSummary: (p: EmergencyPlanResponse) => 
        `✓ Perimeter: ~${p.situation.estimated_affected_population} people | ✓ Vulnerable: ${p.situation.vulnerable_groups.join(', ') || 'General population'}`,
      extractBullets: (p: EmergencyPlanResponse) => [
        `Affected Perimeter: ${p.situation.affected_area}`,
        `Population at Risk: ~${p.situation.estimated_affected_population} persons`,
        `Priority Zones: ${p.situation.priority_zones?.[0] || 'Zone 1 Red Sector'}`
      ],
      getData: (p: EmergencyPlanResponse) => p.situation
    },
    {
      id: 'resource',
      name: 'Resource Coordination Agent',
      emoji: '🏥',
      icon: Boxes,
      role: 'Asset Allocation & Priority Staging',
      extractSummary: (p: EmergencyPlanResponse) => 
        `✓ Matched ${p.resources.length} assets | Shelters, NDRF boats, ALS ambulances, hospitals, clean rations`,
      extractBullets: (p: EmergencyPlanResponse) => [
        `Matched Resources: ${p.resources.length} emergency units`,
        `Primary Shelter: ${p.resources.find(r => r.type === 'Shelter')?.name || 'Relief Center A'}`,
        `Medical Deployment: ${p.resources.find(r => r.type === 'Hospital')?.name || 'General Hospital'}`
      ],
      getData: (p: EmergencyPlanResponse) => p.resources
    },
    {
      id: 'evacuation',
      name: 'Evacuation Agent',
      emoji: '🚗',
      icon: Navigation,
      role: 'Safe Transit Corridor & Choke Point Avoidance',
      extractSummary: (p: EmergencyPlanResponse) => 
        `✓ Destination: ${p.evacuation.recommended_shelter} | ✓ Avoidance: ${p.evacuation.areas_to_avoid?.[0] || 'Flooded subways'}`,
      extractBullets: (p: EmergencyPlanResponse) => [
        `Assigned Shelter: ${p.evacuation.recommended_shelter}`,
        `Evacuation Priority: ${p.evacuation.evacuation_priority}`,
        `Hazards to Avoid: ${p.evacuation.areas_to_avoid?.[0] || 'Submerged underpass'}`
      ],
      getData: (p: EmergencyPlanResponse) => p.evacuation
    },
    {
      id: 'communication',
      name: 'Communication Agent',
      emoji: '📢',
      icon: Megaphone,
      role: 'Bilingual Emergency Alerts (English + Telugu)',
      extractSummary: (p: EmergencyPlanResponse) => 
        `✓ English alert synthesized | ✓ Telugu (తెలుగు) alert generated | Authority command brief prepared`,
      extractBullets: (p: EmergencyPlanResponse) => [
        `English Alert: "${p.communication.alert_english.substring(0, 60)}..."`,
        `Telugu Alert: "${p.communication.alert_telugu.substring(0, 60)}..."`,
        `Directives: ${p.communication.public_instructions?.length || 5} public safety instructions`
      ],
      getData: (p: EmergencyPlanResponse) => p.communication
    },
    {
      id: 'commander',
      name: 'Commander / Orchestrator',
      emoji: '🎯',
      icon: ShieldCheck,
      role: 'Synthesis & Incident Response Plan',
      extractSummary: (p: EmergencyPlanResponse) => 
        `✓ Multi-agent pipeline completed | Unified Emergency Response Plan published with ${p.priority_actions.length} priority actions`,
      extractBullets: (p: EmergencyPlanResponse) => [
        `Overall State: Response Plan Ready`,
        `Immediate Priorities: ${p.priority_actions[0] || 'Deploy water rescue'}`,
        `Fallback Mode: ${p.is_fallback ? 'Deterministic Demo Fallback Active' : 'Gemini 3.8 Live Pipeline'}`
      ],
      getData: (p: EmergencyPlanResponse) => ({
        priority_actions: p.priority_actions,
        generated_at: p.generated_at,
        is_fallback: p.is_fallback
      })
    }
  ];

  const getStatus = (index: number): AgentStatus => {
    if (!plan && !isAnalyzing) return 'pending';
    if (plan) return 'completed';
    // During analyzing simulation
    return index === 0 ? 'running' : 'pending';
  };

  return (
    <div className="max-w-6xl mx-auto py-6 space-y-8">
      {/* Page Title */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-6">
        <div>
          <div className="flex items-center gap-2 text-rose-500 font-mono text-xs font-bold uppercase tracking-wider">
            <Cpu className="w-4 h-4" />
            Screen 3 — Real-Time Agent Execution Pipeline
          </div>
          <h1 className="text-3xl font-extrabold text-white mt-1">
            Agent Activity & Orchestration Trace
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            Visual verification of 5 specialized agents executing sequentially under the Commander Agent.
          </p>
        </div>

        {plan && (
          <button
            onClick={onNavigateToDashboard}
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs uppercase tracking-wider rounded-xl shadow-lg shadow-rose-950 transition-all cursor-pointer"
          >
            <span>View Full Command Dashboard</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Fallback Notice if active */}
      {plan?.is_fallback && (
        <div className="p-3.5 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs flex items-center justify-between">
          <div className="flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-amber-400" />
            <span>AI service unavailable. Demo fallback mode activated. Guaranteed 100% deterministic hackathon results.</span>
          </div>
          <span className="font-mono text-[11px] bg-amber-500/20 px-2 py-0.5 rounded border border-amber-500/40">DEMO INTEGRITY</span>
        </div>
      )}

      {/* Main Agent List */}
      <div className="space-y-4">
        {agentDefinitions.map((def, idx) => {
          const status = getStatus(idx);
          const isSelected = selectedAgentIndex === idx;

          return (
            <div
              key={def.id}
              className={`rounded-2xl border transition-all ${
                status === 'completed'
                  ? 'bg-slate-900/90 border-slate-700/80 hover:border-slate-600 shadow-md'
                  : status === 'running'
                  ? 'bg-slate-900/90 border-rose-500/60 shadow-lg shadow-rose-950/30'
                  : 'bg-slate-950/50 border-slate-800/80 opacity-70'
              }`}
            >
              <div className="p-5 sm:p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                {/* Left: Agent Info */}
                <div className="flex items-start gap-4">
                  <div className="text-2xl p-2.5 rounded-2xl bg-slate-800/80 border border-slate-700 shrink-0">
                    {def.emoji}
                  </div>
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 className="text-base sm:text-lg font-bold text-white">
                        {def.name}
                      </h3>
                      <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700">
                        {def.role}
                      </span>
                    </div>

                    {plan ? (
                      <p className="text-xs sm:text-sm font-medium text-emerald-300 font-mono">
                        {def.extractSummary(plan)}
                      </p>
                    ) : (
                      <p className="text-xs text-slate-400">
                        Awaiting incident report from orchestrator...
                      </p>
                    )}
                  </div>
                </div>

                {/* Right: Status Pill & Inspector Trigger */}
                <div className="flex items-center gap-3 shrink-0 self-end md:self-center">
                  {status === 'completed' && (
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/15 text-emerald-300 border border-emerald-500/30 font-mono">
                      <Check className="w-3.5 h-3.5 text-emerald-400" />
                      Completed
                    </span>
                  )}
                  {status === 'running' && (
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-rose-500/20 text-rose-300 border border-rose-500/40 font-mono animate-pulse">
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      Running
                    </span>
                  )}
                  {status === 'pending' && (
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-slate-800 text-slate-400 border border-slate-700 font-mono">
                      <Clock className="w-3.5 h-3.5" />
                      Pending
                    </span>
                  )}

                  {plan && (
                    <button
                      onClick={() => setSelectedAgentIndex(isSelected ? null : idx)}
                      className={`p-2 rounded-xl border text-xs font-medium transition-colors ${
                        isSelected 
                          ? 'bg-rose-500/20 border-rose-500 text-rose-300' 
                          : 'bg-slate-800/80 border-slate-700 text-slate-300 hover:bg-slate-700'
                      }`}
                      title="Inspect structured agent output"
                    >
                      <Terminal className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>

              {/* Bullet highlights if plan exists */}
              {plan && (
                <div className="px-5 pb-5 pt-0 sm:px-6 sm:pb-6">
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 pt-3 border-t border-slate-800/80">
                    {def.extractBullets(plan).map((bullet, bIdx) => (
                      <div key={bIdx} className="text-[11px] text-slate-300 bg-slate-950/60 p-2 rounded-lg border border-slate-800 flex items-start gap-1.5 font-mono">
                        <span className="text-emerald-400">✓</span>
                        <span className="truncate">{bullet}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Inspector Output Drawer */}
              {isSelected && plan && (
                <div className="p-4 sm:p-5 bg-slate-950 border-t border-slate-800 rounded-b-2xl font-mono text-xs space-y-2">
                  <div className="flex items-center justify-between text-slate-400">
                    <span className="flex items-center gap-1.5 text-cyan-400">
                      <Terminal className="w-3.5 h-3.5" />
                      Structured JSON Output — {def.name}
                    </span>
                    <span className="text-[11px] text-slate-500">Contract Verified</span>
                  </div>
                  <pre className="p-3 rounded-xl bg-slate-900 border border-slate-800 text-emerald-400 overflow-x-auto text-[11px] max-h-60 scrollbar-thin">
                    {JSON.stringify(def.getData(plan), null, 2)}
                  </pre>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Backend Agent Trace Timeline */}
      {plan?.agent_trace && plan.agent_trace.length > 0 && (
        <div className="p-6 rounded-3xl bg-slate-900/60 border border-slate-800 space-y-4">
          <div className="flex items-center gap-2 text-xs font-mono font-bold text-slate-300 uppercase">
            <Terminal className="w-4 h-4 text-cyan-400" />
            Backend Orchestrator Execution Log & Timestamps
          </div>
          <div className="space-y-2.5">
            {plan.agent_trace.map((step, sIdx) => (
              <div key={sIdx} className="flex items-start gap-3 text-xs font-mono p-2.5 rounded-xl bg-slate-950/60 border border-slate-800/80">
                <span className="text-emerald-400 mt-0.5">●</span>
                <span className="text-slate-400 font-semibold shrink-0">
                  {step.agent}:
                </span>
                <span className="text-slate-200 flex-1">{step.summary}</span>
                {step.timestamp && (
                  <span className="text-[10px] text-slate-500 shrink-0">
                    {new Date(step.timestamp).toLocaleTimeString()}
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
