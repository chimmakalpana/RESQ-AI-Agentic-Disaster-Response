import React from 'react';
import { SeverityLevel } from '../types';

interface SeverityBadgeProps {
  severity: SeverityLevel | string;
  size?: 'sm' | 'md' | 'lg';
}

export const SeverityBadge: React.FC<SeverityBadgeProps> = ({ severity, size = 'md' }) => {
  const norm = (severity || 'Medium').toUpperCase();

  let colorClasses = 'bg-amber-500/20 text-amber-300 border-amber-500/40';
  let dotColor = 'bg-amber-400';

  if (norm === 'CRITICAL') {
    colorClasses = 'bg-rose-500/20 text-rose-300 border-rose-500/50 shadow-sm shadow-rose-950';
    dotColor = 'bg-rose-500 animate-ping';
  } else if (norm === 'HIGH') {
    colorClasses = 'bg-orange-500/20 text-orange-300 border-orange-500/40';
    dotColor = 'bg-orange-400';
  } else if (norm === 'LOW') {
    colorClasses = 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40';
    dotColor = 'bg-emerald-400';
  }

  const sizeClasses = size === 'sm' 
    ? 'text-xs px-2 py-0.5' 
    : size === 'lg' 
    ? 'text-sm font-bold px-3.5 py-1.5' 
    : 'text-xs font-semibold px-2.5 py-1';

  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full border uppercase tracking-wider font-mono ${colorClasses} ${sizeClasses}`}>
      <span className="relative flex h-2 w-2">
        {norm === 'CRITICAL' && (
          <span className={`absolute inline-flex h-full w-full rounded-full opacity-75 ${dotColor}`} />
        )}
        <span className={`relative inline-flex rounded-full h-2 w-2 ${norm === 'CRITICAL' ? 'bg-rose-500' : dotColor}`} />
      </span>
      {severity}
    </span>
  );
};
