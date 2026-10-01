import React from 'react';

export default function StatusBadge({ status }) {
  const getStyle = () => {
    switch (status) {
      case 'In Transit':
      case 'IN_TRANSIT':
        return 'bg-emerald-950/70 text-emerald-400 border-emerald-500/30';
      case 'In Workshop':
      case 'IN_WORKSHOP':
        return 'bg-amber-950/70 text-amber-400 border-amber-500/30';
      default:
        return 'bg-slate-800/80 text-slate-300 border-slate-700';
    }
  };

  return (
    <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${getStyle()}`}>
      {status}
    </span>
  );
}