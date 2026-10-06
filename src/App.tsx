import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { NavigationTabs } from './components/NavigationTabs';
import { Footer } from './components/Footer';

import { LandingPage } from './pages/LandingPage';
import { EmergencyReportPage } from './pages/EmergencyReportPage';
import { AgentActivityPage } from './pages/AgentActivityPage';
import { CommandDashboardPage } from './pages/CommandDashboardPage';
import { ResourcesPage } from './pages/ResourcesPage';
import { EvacuationPage } from './pages/EvacuationPage';
import { CommunicationPage } from './pages/CommunicationPage';

import { 
  EmergencyReportRequest, 
  EmergencyPlanResponse, 
  ResourceItem 
} from './types';
import { 
  analyzeEmergency, 
  fetchResources, 
  checkHealth, 
  DEMO_SCENARIO_GAJUWAKA 
} from './services/api';

export default function App() {
  const [currentTab, setCurrentTab] = useState<string>('landing');
  const [activePlan, setActivePlan] = useState<EmergencyPlanResponse | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState<boolean>(false);
  const [systemMode, setSystemMode] = useState<string>('Multi-Agent Online');
  const [catalogResources, setCatalogResources] = useState<ResourceItem[]>([]);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Initialize resources and backend health on mount
  useEffect(() => {
    async function init() {
      try {
        const [resList, health] = await Promise.all([
          fetchResources(),
          checkHealth(),
        ]);
        if (resList && resList.length > 0) {
          setCatalogResources(resList);
        }
        if (health && health.mode) {
          setSystemMode(health.mode);
        }
      } catch (err) {
        console.warn('Backend initialization warning:', err);
      }
    }
    init();
  }, []);

  const handleReportSubmit = async (report: EmergencyReportRequest) => {
    setErrorMessage(null);
    setIsAnalyzing(true);
    // Switch to agent activity screen so user visibly sees the agents executing
    setCurrentTab('agents');

    try {
      const plan = await analyzeEmergency(report);
      setActivePlan(plan);
      if (plan.resources && plan.resources.length > 0) {
        setCatalogResources(plan.resources);
      }
    } catch (err: any) {
      console.error('Emergency analysis error:', err);
      setErrorMessage('Could not connect to emergency orchestrator. Check network or server.');
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleTriggerDemo = () => {
    handleReportSubmit(DEMO_SCENARIO_GAJUWAKA);
  };

  const currentResources = (activePlan && activePlan.resources && activePlan.resources.length > 0)
    ? activePlan.resources
    : catalogResources;

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-rose-500 selection:text-white">
      {/* Top Header */}
      <Header
        currentTab={currentTab}
        setCurrentTab={setCurrentTab}
        activePlan={activePlan}
        onTriggerDemo={handleTriggerDemo}
        isAnalyzing={isAnalyzing}
        systemMode={systemMode}
      />

      {/* Navigation Bar for all 7 Screens */}
      <NavigationTabs
        currentTab={currentTab}
        setCurrentTab={setCurrentTab}
        hasActivePlan={!!activePlan}
      />

      {/* Main Screen Router */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-4">
        {errorMessage && (
          <div className="mb-6 p-4 rounded-xl bg-rose-500/20 border border-rose-500/40 text-rose-300 text-xs flex items-center justify-between">
            <span>{errorMessage}</span>
            <button
              onClick={() => setErrorMessage(null)}
              className="text-xs underline cursor-pointer"
            >
              Dismiss
            </button>
          </div>
        )}

        {/* Screen 1 — Landing Page */}
        {currentTab === 'landing' && (
          <LandingPage
            onStartReport={() => setCurrentTab('report')}
            onRunDemo={handleTriggerDemo}
            isAnalyzing={isAnalyzing}
            activePlan={activePlan}
            onViewDashboard={() => setCurrentTab('dashboard')}
          />
        )}

        {/* Screen 2 — Emergency Report Form */}
        {currentTab === 'report' && (
          <EmergencyReportPage
            onSubmit={handleReportSubmit}
            isAnalyzing={isAnalyzing}
          />
        )}

        {/* Screen 3 — Agent Activity */}
        {currentTab === 'agents' && (
          <AgentActivityPage
            plan={activePlan}
            isAnalyzing={isAnalyzing}
            onNavigateToDashboard={() => setCurrentTab('dashboard')}
          />
        )}

        {/* Screen 4 — Emergency Command Dashboard */}
        {currentTab === 'dashboard' && (
          <CommandDashboardPage
            plan={activePlan}
            onNavigateTab={setCurrentTab}
          />
        )}

        {/* Screen 5 — Resources */}
        {currentTab === 'resources' && (
          <ResourcesPage
            resources={currentResources}
          />
        )}

        {/* Screen 6 — Evacuation Route */}
        {currentTab === 'evacuation' && (
          activePlan ? (
            <EvacuationPage
              evacuation={activePlan.evacuation}
              situation={activePlan.situation}
            />
          ) : (
            <div className="py-20 text-center space-y-4">
              <h3 className="text-xl font-bold text-white">No Evacuation Route Computed</h3>
              <p className="text-sm text-slate-400">
                Please submit an emergency report or run the demo to calculate evacuation corridors.
              </p>
              <button
                onClick={() => setCurrentTab('report')}
                className="px-4 py-2 bg-rose-600 text-white rounded-xl text-xs font-semibold"
              >
                Go to Emergency Report
              </button>
            </div>
          )
        )}

        {/* Screen 7 — Emergency Communication */}
        {currentTab === 'communication' && (
          activePlan ? (
            <CommunicationPage
              communication={activePlan.communication}
              disasterType={activePlan.detection.disaster_type}
              location={activePlan.incident.location}
            />
          ) : (
            <div className="py-20 text-center space-y-4">
              <h3 className="text-xl font-bold text-white">No Emergency Alerts Generated</h3>
              <p className="text-sm text-slate-400">
                Submit an incident report to synthesize bilingual emergency broadcasts in English and Telugu.
              </p>
              <button
                onClick={() => setCurrentTab('report')}
                className="px-4 py-2 bg-rose-600 text-white rounded-xl text-xs font-semibold"
              >
                Go to Emergency Report
              </button>
            </div>
          )
        )}
      </main>

      {/* Global Footer */}
      <Footer />
    </div>
  );
}
