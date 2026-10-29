import React from 'react';
import { Mail, Phone, MapPin, BookOpen, Calendar, ArrowRight, UserCheck } from 'lucide-react';
import { StatusBadge } from './StatusBadge';

export const LeadCard = ({
  lead,
  isUnclaimed = false,
  onClaim = null,
  onStatusChange = null,
  onViewDetails = null,
  claiming = false,
}) => {
  const formattedDate = new Date(lead.createdAt).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });

  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-sm hover:shadow-md transition-all flex flex-col justify-between">
      <div>
        <div className="flex items-start justify-between gap-3 mb-3">
          <div>
            <h4 className="text-base font-bold text-slate-900 leading-snug">{lead.name}</h4>
            <div className="flex items-center gap-1.5 text-xs text-slate-500 mt-1">
              <Calendar className="w-3.5 h-3.5" />
              <span>{formattedDate}</span>
            </div>
          </div>
          <StatusBadge status={lead.status} />
        </div>

        <div className="space-y-2 py-3 border-y border-slate-100 text-xs text-slate-600">
          <div className="flex items-center gap-2">
            <BookOpen className="w-4 h-4 text-brand-600 flex-shrink-0" />
            <span className="font-semibold text-slate-800 truncate">{lead.courseInterest}</span>
          </div>

          <div className="flex items-center gap-2">
            <Mail className="w-4 h-4 text-slate-400 flex-shrink-0" />
            <a href={`mailto:${lead.email}`} className="truncate hover:text-brand-600 transition-colors">
              {lead.email}
            </a>
          </div>

          <div className="flex items-center gap-2">
            <Phone className="w-4 h-4 text-slate-400 flex-shrink-0" />
            <a href={`tel:${lead.phone}`} className="hover:text-brand-600 transition-colors">
              {lead.phone}
            </a>
          </div>

          {lead.city && (
            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4 text-slate-400 flex-shrink-0" />
              <span>{lead.city}</span>
            </div>
          )}
        </div>

        {lead.message && (
          <div className="mt-3 p-2.5 rounded-lg bg-slate-50 border border-slate-100 text-xs text-slate-600 line-clamp-2 italic">
            "{lead.message}"
          </div>
        )}
      </div>

      <div className="mt-4 pt-3 flex items-center justify-between gap-2">
        {onViewDetails && (
          <button
            type="button"
            onClick={() => onViewDetails(lead)}
            className="text-xs font-semibold text-slate-600 hover:text-brand-600 transition-colors"
          >
            View details
          </button>
        )}

        {isUnclaimed && onClaim && (
          <button
            type="button"
            disabled={claiming}
            onClick={() => onClaim(lead)}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-white bg-brand-600 hover:bg-brand-700 rounded-lg shadow-sm transition-colors ml-auto disabled:opacity-50"
          >
            <UserCheck className="w-3.5 h-3.5" />
            {claiming ? 'Claiming...' : 'Claim Lead'}
          </button>
        )}

        {!isUnclaimed && onStatusChange && (
          <div className="flex items-center gap-2 ml-auto">
            <label htmlFor={`status-${lead._id}`} className="text-xs font-medium text-slate-500">
              Status:
            </label>
            <select
              id={`status-${lead._id}`}
              value={lead.status}
              onChange={(e) => onStatusChange(lead._id, e.target.value)}
              className="text-xs font-medium bg-slate-50 border border-slate-200 rounded-lg px-2 py-1 text-slate-800 focus:outline-none focus:ring-2 focus:ring-brand-500"
            >
              <option value="NEW">NEW</option>
              <option value="CONTACTED">CONTACTED</option>
              <option value="CONVERTED">CONVERTED</option>
            </select>
          </div>
        )}
      </div>
    </div>
  );
};
