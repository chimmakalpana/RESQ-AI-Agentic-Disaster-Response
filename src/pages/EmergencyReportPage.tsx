import React, { useState } from 'react';
import { 
  AlertTriangle, 
  Send, 
  UploadCloud, 
  X, 
  Sparkles, 
  Users, 
  MapPin, 
  Flame, 
  Waves, 
  Wind, 
  ActivitySquare, 
  Mountain,
  HelpCircle,
  FileText
} from 'lucide-react';
import { EmergencyReportRequest } from '../types';
import { 
  DEMO_SCENARIO_GAJUWAKA, 
  DEMO_SCENARIO_CYCLONE, 
  DEMO_SCENARIO_FIRE 
} from '../services/api';

interface EmergencyReportPageProps {
  onSubmit: (report: EmergencyReportRequest) => void;
  isAnalyzing: boolean;
}

export const EmergencyReportPage: React.FC<EmergencyReportPageProps> = ({
  onSubmit,
  isAnalyzing
}) => {
  const [disasterType, setDisasterType] = useState<string>('Flood');
  const [location, setLocation] = useState<string>('Gajuwaka, Visakhapatnam');
  const [description, setDescription] = useState<string>(
    'Heavy flooding has affected a residential area. Several people are stranded and elderly people and children may need immediate assistance.'
  );
  const [affectedPeople, setAffectedPeople] = useState<number>(200);
  const [vulnerableGroups, setVulnerableGroups] = useState<string[]>([
    'Children',
    'Elderly',
    'Injured'
  ]);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [imageError, setImageError] = useState<string | null>(null);

  const disasterOptions = [
    { type: 'Flood', icon: Waves, color: 'text-blue-400 border-blue-500/40 bg-blue-500/10' },
    { type: 'Cyclone', icon: Wind, color: 'text-cyan-400 border-cyan-500/40 bg-cyan-500/10' },
    { type: 'Fire', icon: Flame, color: 'text-orange-400 border-orange-500/40 bg-orange-500/10' },
    { type: 'Earthquake', icon: ActivitySquare, color: 'text-amber-400 border-amber-500/40 bg-amber-500/10' },
    { type: 'Landslide', icon: Mountain, color: 'text-emerald-400 border-emerald-500/40 bg-emerald-500/10' },
    { type: 'Other', icon: HelpCircle, color: 'text-purple-400 border-purple-500/40 bg-purple-500/10' },
  ];

  const vulnerableOptions = [
    'Children',
    'Elderly',
    'Injured',
    'Persons with disabilities'
  ];

  const handleCheckboxToggle = (group: string) => {
    setVulnerableGroups((prev) => 
      prev.includes(group) ? prev.filter((g) => g !== group) : [...prev, group]
    );
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setImageError(null);
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      setImageError('Image file must be under 5 MB');
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      setImagePreview(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleRemoveImage = () => {
    setImagePreview(null);
    setImageError(null);
  };

  const loadPreset = (preset: EmergencyReportRequest) => {
    setDisasterType(preset.disaster_type);
    setLocation(preset.location);
    setDescription(preset.description);
    setAffectedPeople(preset.affected_people);
    setVulnerableGroups(preset.vulnerable_groups);
    setImagePreview(null);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!location.trim() || !description.trim()) {
      return;
    }

    onSubmit({
      disaster_type: disasterType,
      location: location.trim(),
      description: description.trim(),
      affected_people: Number(affectedPeople) || 1,
      vulnerable_groups: vulnerableGroups,
      image_data: imagePreview || undefined,
    });
  };

  return (
    <div className="max-w-4xl mx-auto py-6 space-y-8">
      {/* Header */}
      <div className="space-y-2">
        <div className="flex items-center gap-2 text-rose-500 font-mono text-xs font-bold uppercase tracking-wider">
          <AlertTriangle className="w-4 h-4" />
          Screen 2 — Official Emergency Intake
        </div>
        <h1 className="text-3xl font-extrabold text-white">
          Report Emergency Incident
        </h1>
        <p className="text-sm text-slate-400">
          Provide critical ground details. The multi-agent orchestrator will trigger detection, situation sizing, resource matching, evacuation corridors, and bilingual alert generation.
        </p>
      </div>

      {/* Quick Fill Scenarios */}
      <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-3">
        <div className="flex items-center gap-2 text-xs font-semibold text-slate-300">
          <Sparkles className="w-3.5 h-3.5 text-amber-400" />
          <span>Quick Hackathon Demo Scenarios:</span>
        </div>
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => loadPreset(DEMO_SCENARIO_GAJUWAKA)}
            className="px-3 py-1.5 text-xs font-medium rounded-lg bg-blue-500/10 text-blue-300 border border-blue-500/30 hover:bg-blue-500/20 transition-colors"
          >
            🌊 Flood in Gajuwaka (Official 200 Affected Demo)
          </button>
          <button
            type="button"
            onClick={() => loadPreset(DEMO_SCENARIO_CYCLONE)}
            className="px-3 py-1.5 text-xs font-medium rounded-lg bg-cyan-500/10 text-cyan-300 border border-cyan-500/30 hover:bg-cyan-500/20 transition-colors"
          >
            🌀 Cyclone Coastal Surge
          </button>
          <button
            type="button"
            onClick={() => loadPreset(DEMO_SCENARIO_FIRE)}
            className="px-3 py-1.5 text-xs font-medium rounded-lg bg-orange-500/10 text-orange-300 border border-orange-500/30 hover:bg-orange-500/20 transition-colors"
          >
            🔥 Market District Fire
          </button>
        </div>
      </div>

      {/* Main Form */}
      <form onSubmit={handleSubmit} className="p-6 sm:p-8 rounded-3xl bg-slate-900/80 border border-slate-800 space-y-6 shadow-xl">
        {/* Disaster Type */}
        <div className="space-y-3">
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-300">
            Disaster Type <span className="text-rose-500">*</span>
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-2.5">
            {disasterOptions.map((opt) => {
              const Icon = opt.icon;
              const isSelected = disasterType === opt.type;
              return (
                <button
                  key={opt.type}
                  type="button"
                  onClick={() => setDisasterType(opt.type)}
                  className={`flex flex-col items-center justify-center p-3 rounded-xl border text-xs font-semibold transition-all ${
                    isSelected
                      ? `${opt.color} ring-2 ring-rose-500 font-bold scale-[1.02]`
                      : 'border-slate-800 bg-slate-950/60 text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
                  }`}
                >
                  <Icon className="w-5 h-5 mb-1.5" />
                  <span>{opt.type}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Location */}
        <div className="space-y-2">
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-300">
            Location <span className="text-rose-500">*</span>
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
              <MapPin className="w-4 h-4 text-rose-500" />
            </div>
            <input
              type="text"
              required
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="e.g. Gajuwaka, Visakhapatnam or Sector 4 Colony"
              className="w-full pl-10 pr-4 py-3 bg-slate-950 border border-slate-800 rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-rose-500 focus:border-rose-500"
            />
          </div>
        </div>

        {/* Description */}
        <div className="space-y-2">
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-300">
            Emergency Description <span className="text-rose-500">*</span>
          </label>
          <div className="relative">
            <textarea
              required
              rows={4}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe what is happening on the ground, water levels, structural stability, urgent threats, stranded locations..."
              className="w-full p-4 bg-slate-950 border border-slate-800 rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-rose-500 focus:border-rose-500"
            />
          </div>
        </div>

        {/* Number of Affected People */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-300">
              Estimated People Affected <span className="text-rose-500">*</span>
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                <Users className="w-4 h-4 text-cyan-400" />
              </div>
              <input
                type="number"
                min={1}
                max={500000}
                required
                value={affectedPeople}
                onChange={(e) => setAffectedPeople(Math.max(1, parseInt(e.target.value) || 1))}
                className="w-full pl-10 pr-4 py-3 bg-slate-950 border border-slate-800 rounded-xl text-sm text-white focus:outline-none focus:ring-2 focus:ring-rose-500 focus:border-rose-500"
              />
            </div>
          </div>

          {/* Optional Image Upload */}
          <div className="space-y-2">
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-300">
              Optional Image Upload (Max 5MB)
            </label>
            {!imagePreview ? (
              <label className="flex items-center justify-center gap-2 p-3 border border-dashed border-slate-700 hover:border-slate-500 rounded-xl bg-slate-950/60 cursor-pointer text-xs text-slate-400 hover:text-slate-200 transition-colors">
                <UploadCloud className="w-4 h-4 text-rose-400" />
                <span>Upload site photo or ground imagery</span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="hidden"
                />
              </label>
            ) : (
              <div className="relative inline-block border border-slate-700 rounded-xl overflow-hidden bg-slate-950 p-1">
                <img
                  src={imagePreview}
                  alt="Upload Preview"
                  className="h-20 w-36 object-cover rounded-lg"
                />
                <button
                  type="button"
                  onClick={handleRemoveImage}
                  className="absolute top-2 right-2 p-1 bg-slate-900/80 rounded-full text-slate-300 hover:text-white"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            )}
            {imageError && (
              <p className="text-xs text-rose-400">{imageError}</p>
            )}
          </div>
        </div>

        {/* Vulnerable Groups */}
        <div className="space-y-3">
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-300">
            Vulnerable Demographics Present
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {vulnerableOptions.map((item) => {
              const isChecked = vulnerableGroups.includes(item);
              return (
                <label
                  key={item}
                  className={`flex items-center gap-2.5 p-3 rounded-xl border cursor-pointer select-none text-xs font-medium transition-colors ${
                    isChecked
                      ? 'bg-rose-500/15 border-rose-500/50 text-rose-200 font-semibold'
                      : 'bg-slate-950/70 border-slate-800 text-slate-400 hover:bg-slate-800/40'
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={isChecked}
                    onChange={() => handleCheckboxToggle(item)}
                    className="w-4 h-4 rounded text-rose-600 focus:ring-rose-500 border-slate-700 bg-slate-900"
                  />
                  <span>{item}</span>
                </label>
              );
            })}
          </div>
        </div>

        {/* Submit Button */}
        <div className="pt-4 border-t border-slate-800">
          <button
            type="submit"
            disabled={isAnalyzing}
            className="w-full flex items-center justify-center gap-2.5 py-4 px-6 bg-gradient-to-r from-rose-600 to-red-600 hover:from-rose-500 hover:to-red-500 text-white font-extrabold text-base tracking-wide rounded-xl shadow-lg shadow-rose-950 cursor-pointer disabled:opacity-50 transition-all hover:scale-[1.01]"
          >
            {isAnalyzing ? (
              <div className="flex items-center gap-2">
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                <span>Activating ResQ-AI agents…</span>
              </div>
            ) : (
              <>
                <Send className="w-5 h-5" />
                <span>ANALYZE EMERGENCY</span>
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};
