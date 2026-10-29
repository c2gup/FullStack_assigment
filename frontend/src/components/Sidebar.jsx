import React from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Users, UserCheck, Code2, Globe, X } from 'lucide-react';

export const Sidebar = ({ isOpen, onClose }) => {
  const navItems = [
    {
      to: '/dashboard',
      label: 'CRM Dashboard',
      icon: LayoutDashboard,
    },
    {
      to: '/leads/public',
      label: 'Available Leads',
      icon: Users,
    },
    {
      to: '/leads/my',
      label: 'My Claimed Leads',
      icon: UserCheck,
    },
    {
      to: '/external-api',
      label: 'Postman API Inspector',
      icon: Code2,
    },
  ];

  return (
    <>
      {/* Mobile backdrop */}
      {isOpen && (
        <div
          onClick={onClose}
          className="fixed inset-0 z-40 bg-slate-900/40 backdrop-blur-sm md:hidden"
        />
      )}

      {/* Sidebar container */}
      <aside
        className={`fixed md:sticky top-0 md:top-[61px] left-0 z-40 h-full md:h-[calc(100vh-61px)] w-64 bg-white border-r border-slate-200 transition-transform duration-200 ease-in-out flex flex-col justify-between ${
          isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
        }`}
      >
        <div className="p-4">
          <div className="flex items-center justify-between md:hidden pb-3 mb-3 border-b border-slate-100">
            <span className="font-bold text-slate-800 text-sm">Navigation</span>
            <button onClick={onClose} className="p-1 rounded-lg text-slate-400 hover:text-slate-700">
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400 px-3 mb-2">
            Main Menu
          </div>

          <nav className="space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <NavLink
                  key={item.to}
                  to={item.to}
                  onClick={() => onClose && onClose()}
                  className={({ isActive }) =>
                    `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold transition-all ${
                      isActive
                        ? 'bg-brand-50 text-brand-700 shadow-sm shadow-brand-500/10'
                        : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                    }`
                  }
                >
                  <Icon className="w-4 h-4 flex-shrink-0" />
                  <span>{item.label}</span>
                </NavLink>
              );
            })}
          </nav>

          <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400 px-3 mt-6 mb-2">
            Portals
          </div>

          <nav className="space-y-1">
            <NavLink
              to="/"
              target="_blank"
              className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold text-slate-600 hover:text-slate-900 hover:bg-slate-50 transition-all"
            >
              <Globe className="w-4 h-4 flex-shrink-0 text-slate-400" />
              <span>Student Enquiry Form</span>
            </NavLink>
          </nav>
        </div>

        {/* Footer info badge */}
        <div className="p-4 border-t border-slate-100">
          <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/80">
            <div className="flex items-center gap-2 mb-1">
              <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-xs font-bold text-slate-700">System Live</span>
            </div>
            <p className="text-[11px] text-slate-500 leading-snug">
              MongoDB atomic locking active for lead claims.
            </p>
          </div>
        </div>
      </aside>
    </>
  );
};
