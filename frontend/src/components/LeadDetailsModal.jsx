import React from 'react';
import { X, Mail, Phone, MapPin, BookOpen, Calendar, Clock, User, MessageSquare } from 'lucide-react';
import { StatusBadge } from './StatusBadge';

export const LeadDetailsModal = ({ isOpen, lead, onClose }) => {
  if (!isOpen || !lead) return null;

  const createdDate = new Date(lead.createdAt).toLocaleString('en-US', {
    dateStyle: 'medium',
    timeStyle: 'short',
  });
  const updatedDate = new Date(lead.updatedAt).toLocaleString('en-US', {
    dateStyle: 'medium',
    timeStyle: 'short',
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="w-full max-w-lg bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden">
        {/* Header */}
        <div className="px-6 py-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-brand-100 text-brand-700 flex items-center justify-center font-bold text-base">
              {lead.name.charAt(0).toUpperCase()}
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">{lead.name}</h3>
              <p className="text-xs text-slate-500">ID: {lead._id}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-200 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 space-y-5 max-h-[75vh] overflow-y-auto">
          {/* Status & Course Banner */}
          <div className="flex items-center justify-between p-3.5 rounded-xl bg-slate-50 border border-slate-200">
            <div>
              <span className="text-xs font-medium text-slate-500 uppercase tracking-wider block mb-1">
                Course Interest
              </span>
              <span className="text-sm font-semibold text-slate-800 flex items-center gap-1.5">
                <BookOpen className="w-4 h-4 text-brand-600" />
                {lead.courseInterest}
              </span>
            </div>
            <div className="text-right">
              <span className="text-xs font-medium text-slate-500 uppercase tracking-wider block mb-1">
                Current Status
              </span>
              <StatusBadge status={lead.status} />
            </div>
          </div>

          {/* Contact Details */}
          <div>
            <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
              Contact Information
            </h4>
            <div className="space-y-2.5 text-sm bg-white p-3.5 rounded-xl border border-slate-200">
              <div className="flex items-center gap-3 text-slate-700">
                <Mail className="w-4 h-4 text-slate-400" />
                <a href={`mailto:${lead.email}`} className="hover:text-brand-600 transition-colors">
                  {lead.email}
                </a>
              </div>
              <div className="flex items-center gap-3 text-slate-700">
                <Phone className="w-4 h-4 text-slate-400" />
                <a href={`tel:${lead.phone}`} className="hover:text-brand-600 transition-colors">
                  {lead.phone}
                </a>
              </div>
              {lead.city && (
                <div className="flex items-center gap-3 text-slate-700">
                  <MapPin className="w-4 h-4 text-slate-400" />
                  <span>{lead.city}</span>
                </div>
              )}
            </div>
          </div>

          {/* Student Message */}
          {lead.message && (
            <div>
              <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                <MessageSquare className="w-3.5 h-3.5" />
                Prospect's Note
              </h4>
              <div className="p-4 rounded-xl bg-amber-50/60 border border-amber-200/80 text-sm text-slate-700 leading-relaxed">
                "{lead.message}"
              </div>
            </div>
          )}

          {/* Assignment Information */}
          <div>
            <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
              Assignment & Timestamps
            </h4>
            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                <span className="text-slate-500 block mb-1">Counselor</span>
                <span className="font-semibold text-slate-800 flex items-center gap-1">
                  <User className="w-3.5 h-3.5 text-slate-400" />
                  {lead.assignedTo?.name || (lead.assignedTo ? 'Claimed' : 'Unclaimed')}
                </span>
              </div>
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                <span className="text-slate-500 block mb-1">Created At</span>
                <span className="font-medium text-slate-700 flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5 text-slate-400" />
                  {createdDate}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-3.5 bg-slate-50 border-t border-slate-200 flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-slate-700 bg-white border border-slate-300 hover:bg-slate-100 rounded-lg transition-colors shadow-sm"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
