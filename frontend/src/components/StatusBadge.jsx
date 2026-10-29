import React from 'react';
import { Sparkles, PhoneCall, CheckCircle2 } from 'lucide-react';

export const StatusBadge = ({ status }) => {
  const normalized = (status || 'NEW').toUpperCase();

  switch (normalized) {
    case 'NEW':
      return (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-blue-50 text-blue-700 border border-blue-200 shadow-sm">
          <Sparkles className="w-3 h-3 text-blue-500" />
          NEW
        </span>
      );
    case 'CONTACTED':
      return (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-50 text-amber-700 border border-amber-200 shadow-sm">
          <PhoneCall className="w-3 h-3 text-amber-500" />
          CONTACTED
        </span>
      );
    case 'CONVERTED':
      return (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200 shadow-sm">
          <CheckCircle2 className="w-3 h-3 text-emerald-500" />
          CONVERTED
        </span>
      );
    default:
      return (
        <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-slate-100 text-slate-700 border border-slate-200">
          {status}
        </span>
      );
  }
};
