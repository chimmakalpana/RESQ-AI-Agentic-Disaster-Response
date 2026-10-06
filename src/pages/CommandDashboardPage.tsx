import React, { useState } from 'react';
import { 
  ShieldAlert, 
  MapPin, 
  Users, 
  AlertTriangle, 
  CheckCircle, 
  Clock, 
  ListOrdered, 
  Download, 
  Printer, 
  Activity, 
  ChevronRight,
  Sparkles,
  Layers,
  HeartPulse
} from 'lucide-react';
import { EmergencyPlanResponse } from '../types';
import { SeverityBadge } from '../components/SeverityBadge';

interface CommandDashboardPageProps {
  plan: EmergencyPlanResponse | null;
  onNavigateTab: (tab: string) => void;
}

export const CommandDashboardPage: React.FC<CommandDashboardPageProps> = ({
  plan,
  onNavigateTab
}) => {
  const [copiedAction, setCopiedAction] = useState<string | null>(null);

  if (!plan) {
    return (
      <div className="max-w-4xl mx-auto py-16 text-center space-y-4">
        <div className="w-16 h-16 mx-auto rounded-3xl bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-500">
          <ShieldAlert className="w-8 h-8" />
        </div>
        <h2 className="text-xl font-bold text-white">No Active Response Plan</h2>
        <p className="text-sm text-slate-400 max-w-md mx-auto">
          Submit an incident on the Emergency Report page or trigger the demo scenario to generate the unified response plan.
        </p>
        <button
          onClick={() => onNavigateTab('report')}
          className="px-5 py-2.5 bg-rose-600 hover:bg-rose-500 text-white rounded-xl text-xs font-bold uppercase tracking-wider"
        >
          Submit Emergency Report
        </button>
      </div>
    );
  }

  const { incident, detection, situation, priority_actions, generated_at } = plan;

  const handleExportJSON = () => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(plan, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `RESQ-AI-PLAN-${incident.disaster_type}-${Date.now()}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="max-w-7xl mx-auto py-6 space-y-8">
      {/* Top Incident Status Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-6 rounded-3xl bg-slate-900/90 border border-slate-800 shadow-xl">
        <div className="space-y-2">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="font-mono text-xs font-bold text-slate-400 uppercase tracking-wider">
              INCIDENT COMMAND ID: #EVAC-{(incident.disaster_type || 'INC').substring(0, 3).toUpperCase()}-{new Date(generated_at).getMinutes()}{new Date(generated_at).getSeconds()}
            </span>
            <SeverityBadge severity={detection.severity} size="md" />
            <span className="px-2.5 py-0.5 rounded-full text-xs font-mono font-semibold bg-emerald-500/10 text-emerald-300 border border-emerald-500/30">
              STATUS: COORDINATION ACTIVE
            </span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-extrabold text-white">
            {detection.disaster_type} Incident Response Plan — {incident.location}
          </h1>

          <div className="flex items-center gap-4 text-xs text-slate-400 font-mono flex-wrap">
            <span className="flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-slate-400" />
              Generated: {new Date(generated_at).toLocaleTimeString()}
            </span>
            <span className="flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              Confidence: {Math.round(detection.confidence * 100)}%
            </span>
            <span className="flex items-center gap-1.5">
              <Activity className="w-3.5 h-3.5 text-cyan-400" />
              Mode: {plan.is_fallback ? 'Deterministic Fallback' : 'Gemini 3.8 Multi-Agent'}
            </span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2 self-start md:self-center">
          <button
            onClick={handleExportJSON}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-slate-200 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-xl transition-colors cursor-pointer"
            title="Download full JSON response plan"
          >
            <Download className="w-3.5 h-3.5 text-cyan-400" />
            <span>Export JSON</span>
          </button>
          <button
            onClick={handlePrint}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-slate-200 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-xl transition-colors cursor-pointer"
            title="Print or save as PDF"
          >
            <Printer className="w-3.5 h-3.5 text-emerald-400" />
            <span>Print Report</span>
          </button>
        </div>
      </div>

      {/* Grid of Key Incident Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Metric 1 */}
        <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-2">
          <div className="flex items-center justify-between text-slate-400 text-xs font-semibold">
            <span>Disaster Classification</span>
            <ShieldAlert className="w-4 h-4 text-rose-500" />
          </div>
          <div className="text-xl font-extrabold text-white">
            {detection.disaster_type}
          </div>
          <div className="text-xs text-slate-400 flex items-center justify-between">
            <span>Severity:</span>
            <SeverityBadge severity={detection.severity} size="sm" />
          </div>
        </div>

        {/* Metric 2 */}
        <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-2">
          <div className="flex items-center justify-between text-slate-400 text-xs font-semibold">
            <span>Location & Perimeter</span>
            <MapPin className="w-4 h-4 text-amber-500" />
          </div>
          <div className="text-xl font-extrabold text-white truncate" title={incident.location}>
            {incident.location}
          </div>
          <div className="text-xs text-slate-400 truncate">
            {situation.affected_area}
          </div>
        </div>

        {/* Metric 3 */}
        <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-2">
          <div className="flex items-center justify-between text-slate-400 text-xs font-semibold">
            <span>Estimated Population</span>
            <Users className="w-4 h-4 text-cyan-500" />
          </div>
          <div className="text-xl font-extrabold text-white">
            ~{situation.estimated_affected_population} Persons
          </div>
          <div className="text-xs text-slate-400">
            Within direct danger perimeter
          </div>
        </div>

        {/* Metric 4 */}
        <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-2">
          <div className="flex items-center justify-between text-slate-400 text-xs font-semibold">
            <span>Vulnerable Demographics</span>
            <HeartPulse className="w-4 h-4 text-rose-400" />
          </div>
          <div className="text-xl font-extrabold text-white">
            {situation.vulnerable_groups.length} Groups
          </div>
          <div className="text-xs text-rose-300 truncate">
            {situation.vulnerable_groups.join(', ') || 'None specified'}
          </div>
        </div>
      </div>

      {/* Main 2-Column Incident Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Immediate Risks & Tactical Priority Actions (2 cols wide) */}
        <div className="lg:col-span-2 space-y-6">
          {/* Priority Actions Card */}
          <div className="p-6 rounded-3xl bg-slate-900/80 border border-slate-800 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <ListOrdered className="w-5 h-5 text-rose-500" />
                <h2 className="text-lg font-bold text-white">
                  Immediate Priority Actions (Synthesized by Commander)
                </h2>
              </div>
              <span className="text-xs font-mono text-slate-400">
                {priority_actions.length} Directives
              </span>
            </div>

            <div className="space-y-2.5">
              {priority_actions.map((action, idx) => (
                <div
                  key={idx}
                  className="flex items-start gap-3 p-3.5 rounded-xl bg-slate-950/70 border border-slate-800/90 text-sm text-slate-200 hover:border-slate-700 transition-colors"
                >
                  <span className="flex items-center justify-center w-6 h-6 rounded-lg bg-rose-500/20 text-rose-400 font-mono font-bold text-xs shrink-0">
                    {idx + 1}
                  </span>
                  <p className="flex-1 leading-snug">{action}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Immediate Ground Risks */}
          <div className="p-6 rounded-3xl bg-slate-900/80 border border-slate-800 space-y-4">
            <div className="flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-amber-500" />
              <h2 className="text-lg font-bold text-white">
                Immediate Hazard Risks & Ground Vectors
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {detection.immediate_risks.map((risk, idx) => (
                <div
                  key={idx}
                  className="p-3.5 rounded-xl bg-amber-500/5 border border-amber-500/20 text-xs text-amber-200/90 space-y-1"
                >
                  <div className="flex items-center gap-1.5 font-bold text-amber-400">
                    <span>⚠</span>
                    <span>Risk Vector #{idx + 1}</span>
                  </div>
                  <p>{risk}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Priority Zones */}
          <div className="p-6 rounded-3xl bg-slate-900/80 border border-slate-800 space-y-4">
            <div className="flex items-center gap-2">
              <Layers className="w-5 h-5 text-cyan-400" />
              <h2 className="text-lg font-bold text-white">
                Sector Zonation & Ground Triage
              </h2>
            </div>

            <div className="space-y-2">
              {situation.priority_zones.map((zone, idx) => (
                <div
                  key={idx}
                  className="p-3 rounded-xl bg-slate-950/60 border border-slate-800 text-xs text-slate-300 font-mono flex items-center justify-between"
                >
                  <span>{zone}</span>
                  <span className="text-[10px] text-cyan-400 px-2 py-0.5 rounded bg-cyan-950/50 border border-cyan-800">
                    PRIORITY {idx + 1}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Coordination Shortcuts & Key Facts */}
        <div className="space-y-6">
          {/* Key Facts Summary */}
          <div className="p-6 rounded-3xl bg-slate-900/80 border border-slate-800 space-y-3">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider font-mono">
              Key Incident Facts
            </h3>
            <div className="space-y-2">
              {detection.key_facts.map((fact, idx) => (
                <div key={idx} className="flex items-start gap-2 text-xs text-slate-300">
                  <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <span>{fact}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Next Steps Quick Navigator */}
          <div className="p-6 rounded-3xl bg-gradient-to-b from-slate-900 to-slate-950 border border-slate-800 space-y-3">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider font-mono">
              Coordinated Operations
            </h3>

            <button
              onClick={() => onNavigateTab('resources')}
              className="w-full flex items-center justify-between p-3.5 rounded-xl bg-slate-950 hover:bg-slate-800 border border-slate-800 transition-colors text-left"
            >
              <div>
                <p className="text-xs font-bold text-white">Emergency Resources</p>
                <p className="text-[11px] text-slate-400">{plan.resources.length} units matched & staged</p>
              </div>
              <ChevronRight className="w-4 h-4 text-slate-400" />
            </button>

            <button
              onClick={() => onNavigateTab('evacuation')}
              className="w-full flex items-center justify-between p-3.5 rounded-xl bg-slate-950 hover:bg-slate-800 border border-slate-800 transition-colors text-left"
            >
              <div>
                <p className="text-xs font-bold text-white">Evacuation & Transit Map</p>
                <p className="text-[11px] text-slate-400">{plan.evacuation.recommended_shelter}</p>
              </div>
              <ChevronRight className="w-4 h-4 text-slate-400" />
            </button>

            <button
              onClick={() => onNavigateTab('communication')}
              className="w-full flex items-center justify-between p-3.5 rounded-xl bg-slate-950 hover:bg-slate-800 border border-slate-800 transition-colors text-left"
            >
              <div>
                <p className="text-xs font-bold text-white">Bilingual Public Alerts</p>
                <p className="text-[11px] text-slate-400">English & Telugu broadcasting</p>
              </div>
              <ChevronRight className="w-4 h-4 text-slate-400" />
            </button>

            <button
              onClick={() => onNavigateTab('agents')}
              className="w-full flex items-center justify-between p-3.5 rounded-xl bg-slate-950 hover:bg-slate-800 border border-slate-800 transition-colors text-left"
            >
              <div>
                <p className="text-xs font-bold text-white">Agent Execution Trace</p>
                <p className="text-[11px] text-slate-400">Inspect 6 multi-agent logs</p>
              </div>
              <ChevronRight className="w-4 h-4 text-slate-400" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
