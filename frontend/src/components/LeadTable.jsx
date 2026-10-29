import React from 'react';
import { Mail, Phone, MapPin, BookOpen, Calendar, UserCheck, Eye, Loader2 } from 'lucide-react';
import { StatusBadge } from './StatusBadge';

export const LeadTable = ({
  leads = [],
  isUnclaimed = false,
  onClaim = null,
  onStatusChange = null,
  onViewDetails = null,
  claimingId = null,
}) => {
  return (
    <div className="overflow-x-auto bg-white rounded-2xl border border-slate-200/80 shadow-sm">
      <table className="min-w-full divide-y divide-slate-200">
        <thead className="bg-slate-50/75 text-xs font-semibold uppercase tracking-wider text-slate-500">
          <tr>
            <th scope="col" className="px-6 py-3.5 text-left">
              Prospective Student
            </th>
            <th scope="col" className="px-6 py-3.5 text-left">
              Contact Details
            </th>
            <th scope="col" className="px-6 py-3.5 text-left">
              Course & City
            </th>
            <th scope="col" className="px-6 py-3.5 text-left">
              Status
            </th>
            <th scope="col" className="px-6 py-3.5 text-left">
              Enquiry Date
            </th>
            <th scope="col" className="px-6 py-3.5 text-right">
              Actions
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100 text-sm">
          {leads.map((lead) => {
            const dateStr = new Date(lead.createdAt).toLocaleDateString('en-US', {
              month: 'short',
              day: 'numeric',
              year: 'numeric',
            });
            const isCurrentlyClaiming = claimingId === lead._id;

            return (
              <tr key={lead._id} className="hover:bg-slate-50/70 transition-colors">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="font-semibold text-slate-900">{lead.name}</div>
                  {lead.message && (
                    <div className="text-xs text-slate-400 truncate max-w-xs" title={lead.message}>
                      "{lead.message}"
                    </div>
                  )}
                </td>

                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center gap-1.5 text-slate-600 text-xs">
                    <Mail className="w-3.5 h-3.5 text-slate-400" />
                    <a href={`mailto:${lead.email}`} className="hover:text-brand-600 transition-colors">
                      {lead.email}
                    </a>
                  </div>
                  <div className="flex items-center gap-1.5 text-slate-600 text-xs mt-1">
                    <Phone className="w-3.5 h-3.5 text-slate-400" />
                    <a href={`tel:${lead.phone}`} className="hover:text-brand-600 transition-colors">
                      {lead.phone}
                    </a>
                  </div>
                </td>

                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center gap-1.5 font-medium text-slate-800 text-xs">
                    <BookOpen className="w-3.5 h-3.5 text-brand-600 flex-shrink-0" />
                    <span className="truncate max-w-[200px]" title={lead.courseInterest}>
                      {lead.courseInterest}
                    </span>
                  </div>
                  {lead.city && (
                    <div className="flex items-center gap-1.5 text-slate-500 text-xs mt-1">
                      <MapPin className="w-3.5 h-3.5 text-slate-400" />
                      <span>{lead.city}</span>
                    </div>
                  )}
                </td>

                <td className="px-6 py-4 whitespace-nowrap">
                  <StatusBadge status={lead.status} />
                </td>

                <td className="px-6 py-4 whitespace-nowrap text-xs text-slate-500">
                  <div className="flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5 text-slate-400" />
                    <span>{dateStr}</span>
                  </div>
                </td>

                <td className="px-6 py-4 whitespace-nowrap text-right text-xs">
                  <div className="flex items-center justify-end gap-2">
                    {onViewDetails && (
                      <button
                        type="button"
                        onClick={() => onViewDetails(lead)}
                        className="p-1.5 text-slate-500 hover:text-brand-600 hover:bg-brand-50 rounded-lg transition-colors"
                        title="View Full Lead Details"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                    )}

                    {isUnclaimed && onClaim && (
                      <button
                        type="button"
                        disabled={isCurrentlyClaiming}
                        onClick={() => onClaim(lead)}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-white bg-brand-600 hover:bg-brand-700 rounded-lg shadow-sm transition-colors disabled:opacity-50"
                      >
                        {isCurrentlyClaiming ? (
                          <>
                            <Loader2 className="w-3.5 h-3.5 animate-spin" />
                            Claiming...
                          </>
                        ) : (
                          <>
                            <UserCheck className="w-3.5 h-3.5" />
                            Claim
                          </>
                        )}
                      </button>
                    )}

                    {!isUnclaimed && onStatusChange && (
                      <select
                        aria-label="Update lead status"
                        value={lead.status}
                        onChange={(e) => onStatusChange(lead._id, e.target.value)}
                        className="text-xs font-medium bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 text-slate-800 focus:outline-none focus:ring-2 focus:ring-brand-500 transition-all cursor-pointer"
                      >
                        <option value="NEW">Status: NEW</option>
                        <option value="CONTACTED">Status: CONTACTED</option>
                        <option value="CONVERTED">Status: CONVERTED</option>
                      </select>
                    )}
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};
