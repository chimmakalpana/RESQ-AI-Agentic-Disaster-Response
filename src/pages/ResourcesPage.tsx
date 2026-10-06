import React, { useState } from 'react';
import { 
  Home, 
  Hospital, 
  Ambulance, 
  LifeBuoy, 
  UtensilsCrossed, 
  Droplets, 
  AlertTriangle, 
  Boxes, 
  Filter, 
  Phone,
  CheckCircle2
} from 'lucide-react';
import { ResourceItem } from '../types';

interface ResourcesPageProps {
  resources: ResourceItem[];
}

export const ResourcesPage: React.FC<ResourcesPageProps> = ({ resources }) => {
  const [filterType, setFilterType] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const typeIcons: Record<string, any> = {
    'Shelter': Home,
    'Hospital': Hospital,
    'Ambulance': Ambulance,
    'Rescue Team': LifeBuoy,
    'Food': UtensilsCrossed,
    'Water': Droplets,
  };

  const filterTabs = [
    { label: 'All', icon: Boxes },
    { label: 'Shelter', icon: Home },
    { label: 'Hospital', icon: Hospital },
    { label: 'Ambulance', icon: Ambulance },
    { label: 'Rescue Team', icon: LifeBuoy },
    { label: 'Food', icon: UtensilsCrossed },
    { label: 'Water', icon: Droplets },
  ];

  const filteredResources = resources.filter((item) => {
    const matchesType = filterType === 'All' || item.type.toLowerCase() === filterType.toLowerCase();
    const matchesSearch = 
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.purpose.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesType && matchesSearch;
  });

  return (
    <div className="max-w-7xl mx-auto py-6 space-y-6">
      {/* Header */}
      <div className="space-y-2">
        <div className="flex items-center gap-2 text-rose-500 font-mono text-xs font-bold uppercase tracking-wider">
          <Boxes className="w-4 h-4" />
          Screen 5 — Emergency Resource Allocation
        </div>
        <h1 className="text-3xl font-extrabold text-white">
          Coordinated Emergency Resources
        </h1>
        <p className="text-sm text-slate-400">
          Matched emergency staging assets allocated by the Resource Coordination Agent to address shelter, triage, water rescue, and rations.
        </p>
      </div>

      {/* Mandatory Demo Data Warning Banner */}
      <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/40 text-amber-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-md">
        <div className="flex items-center gap-3">
          <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0" />
          <p className="text-xs sm:text-sm font-semibold">
            ⚠️ Demo Data — Verify with official authorities before real-world use.
          </p>
        </div>
        <span className="text-[11px] font-mono px-2.5 py-1 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30 shrink-0">
          SIMULATED ASSETS ONLY
        </span>
      </div>

      {/* Filter Tabs & Search Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
        {/* Category Filter */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
          {filterTabs.map((tab) => {
            const Icon = tab.icon;
            const isSelected = filterType === tab.label;
            return (
              <button
                key={tab.label}
                onClick={() => setFilterType(tab.label)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-colors ${
                  isSelected
                    ? 'bg-rose-600 text-white shadow-sm'
                    : 'bg-slate-900 text-slate-400 hover:text-slate-200 hover:bg-slate-800 border border-slate-800'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Search */}
        <div className="relative">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search resources, sector, purpose..."
            className="w-full sm:w-64 pl-3.5 pr-4 py-2 bg-slate-900 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-rose-500"
          />
        </div>
      </div>

      {/* Resource Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredResources.map((item, idx) => {
          const Icon = typeIcons[item.type] || Boxes;
          const priorityColor = 
            item.priority === 'Critical' 
              ? 'bg-rose-500/20 text-rose-300 border-rose-500/40' 
              : item.priority === 'High' 
              ? 'bg-orange-500/20 text-orange-300 border-orange-500/40' 
              : 'bg-blue-500/20 text-blue-300 border-blue-500/40';

          return (
            <div
              key={item.id || idx}
              className="rounded-3xl bg-slate-900/80 border border-slate-800 p-6 flex flex-col justify-between space-y-4 hover:border-slate-700 transition-all shadow-md group"
            >
              {/* Card Header */}
              <div className="space-y-3">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="p-2.5 rounded-2xl bg-slate-800 border border-slate-700 text-rose-400 group-hover:scale-105 transition-transform">
                      <Icon className="w-5 h-5" />
                    </div>
                    <div>
                      <span className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-wider block">
                        {item.type}
                      </span>
                      <h3 className="text-base font-bold text-white leading-tight">
                        {item.name}
                      </h3>
                    </div>
                  </div>

                  <span className={`text-[10px] font-mono font-bold uppercase px-2 py-0.5 rounded-full border ${priorityColor} shrink-0`}>
                    {item.priority}
                  </span>
                </div>

                {/* Purpose */}
                <p className="text-xs text-slate-300 leading-relaxed bg-slate-950/60 p-3 rounded-xl border border-slate-800/80">
                  {item.purpose}
                </p>
              </div>

              {/* Card Details */}
              <div className="space-y-2 text-xs pt-2 border-t border-slate-800/80">
                <div className="flex items-center justify-between text-slate-400">
                  <span>Location:</span>
                  <span className="text-slate-200 font-medium text-right max-w-[60%] truncate" title={item.location}>
                    {item.location}
                  </span>
                </div>

                <div className="flex items-center justify-between text-slate-400">
                  <span>Capacity:</span>
                  <span className="text-cyan-400 font-mono font-semibold">
                    {item.capacity}
                  </span>
                </div>

                <div className="flex items-center justify-between text-slate-400">
                  <span>Availability:</span>
                  <span className="text-emerald-400 font-medium">
                    {item.availability}
                  </span>
                </div>

                {item.contact && (
                  <div className="flex items-center justify-between text-slate-400 pt-1">
                    <span className="flex items-center gap-1">
                      <Phone className="w-3 h-3 text-slate-500" />
                      Contact:
                    </span>
                    <span className="text-slate-300 font-mono text-[11px]">
                      {item.contact}
                    </span>
                  </div>
                )}

                {/* Mandatory is_demo flag */}
                <div className="pt-2 flex items-center justify-between text-[10px] font-mono text-slate-500">
                  <span className="flex items-center gap-1 text-amber-400/90">
                    <CheckCircle2 className="w-3 h-3 text-amber-400" />
                    is_demo: true
                  </span>
                  <span>SIMULATED ASSET</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
