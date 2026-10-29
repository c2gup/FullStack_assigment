import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import {
  Users,
  UserCheck,
  PhoneCall,
  CheckCircle2,
  ArrowRight,
  Sparkles,
  Clock,
  TrendingUp,
  RefreshCw,
  PlusCircle,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { leadsApi, getErrorMessage } from '../services/api';
import { LoadingSpinner } from '../components/LoadingSpinner';
import { ErrorMessage } from '../components/ErrorMessage';
import { EmptyState } from '../components/EmptyState';
import { StatusBadge } from '../components/StatusBadge';
import { LeadTable } from '../components/LeadTable';
import { LeadDetailsModal } from '../components/LeadDetailsModal';
import { ConfirmationDialog } from '../components/ConfirmationDialog';
import toast from 'react-hot-toast';

export const DashboardPage = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedLead, setSelectedLead] = useState(null);
  const [leadToClaim, setLeadToClaim] = useState(null);
  const [claiming, setClaiming] = useState(false);

  const fetchDashboardData = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const res = await leadsApi.getStats();
      if (res.success && res.data) {
        setStats(res.data);
      }
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchDashboardData();
  }, [fetchDashboardData]);

  const handleConfirmClaim = async () => {
    if (!leadToClaim) return;
    setClaiming(true);
    try {
      await leadsApi.claim(leadToClaim._id);
      toast.success(`Successfully claimed lead for ${leadToClaim.name}!`);
      setLeadToClaim(null);
      await fetchDashboardData();
    } catch (err) {
      const msg = getErrorMessage(err);
      toast.error(msg);
      // If 409 conflict, close dialog and refresh
      setLeadToClaim(null);
      await fetchDashboardData();
    } finally {
      setClaiming(false);
    }
  };

  if (loading) {
    return <LoadingSpinner size="lg" text="Loading CRM metrics and lead queue..." />;
  }

  if (error) {
    return <ErrorMessage message={error} onRetry={fetchDashboardData} />;
  }

  const statCards = [
    {
      title: 'Available Unclaimed Leads',
      value: stats?.availableLeads ?? 0,
      icon: Users,
      color: 'text-brand-600',
      bg: 'bg-brand-50 border-brand-200',
      description: 'Prospective students awaiting counselor contact',
      link: '/leads/public',
      linkText: 'Explore Available Queue',
    },
    {
      title: 'My Claimed Leads',
      value: stats?.myTotalLeads ?? 0,
      icon: UserCheck,
      color: 'text-indigo-600',
      bg: 'bg-indigo-50 border-indigo-200',
      description: 'Currently managed in your personal roster',
      link: '/leads/my',
      linkText: 'Manage My Roster',
    },
    {
      title: 'In Progress (Contacted)',
      value: stats?.myContactedLeads ?? 0,
      icon: PhoneCall,
      color: 'text-amber-600',
      bg: 'bg-amber-50 border-amber-200',
      description: 'Counseling conversations ongoing',
      link: '/leads/my',
      linkText: 'View Follow-ups',
    },
    {
      title: 'Converted Students',
      value: stats?.myConvertedLeads ?? 0,
      icon: CheckCircle2,
      color: 'text-emerald-600',
      bg: 'bg-emerald-50 border-emerald-200',
      description: 'Successfully enrolled prospects',
      link: '/leads/my',
      linkText: 'View Admissions',
    },
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-200">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-brand-900 via-brand-800 to-slate-900 rounded-3xl p-6 sm:p-8 text-white shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-brand-200 text-xs font-semibold mb-3 backdrop-blur-sm">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Counselor Workspace Active</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            Welcome back, {user?.name || 'Counselor'}!
          </h1>
          <p className="text-sm text-brand-100/90 mt-1.5 max-w-xl">
            You currently have <span className="font-bold text-white">{stats?.availableLeads ?? 0}</span> unassigned prospective students in the pool waiting for counseling.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <Link
            to="/leads/public"
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white text-brand-900 font-bold text-sm shadow-md hover:bg-brand-50 transition-all"
          >
            <span>Claim Available Leads</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
          <button
            onClick={fetchDashboardData}
            className="p-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-all backdrop-blur-sm"
            title="Refresh Data"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Summary KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {statCards.map((card) => {
          const Icon = card.icon;
          return (
            <div
              key={card.title}
              className={`rounded-2xl border p-5 shadow-sm flex flex-col justify-between bg-white hover:shadow-md transition-shadow`}
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                    {card.title}
                  </span>
                  <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${card.bg}`}>
                    <Icon className={`w-5 h-5 ${card.color}`} />
                  </div>
                </div>
                <div className="text-3xl font-extrabold text-slate-900 tracking-tight">
                  {card.value}
                </div>
                <p className="text-xs text-slate-500 mt-1">{card.description}</p>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-100">
                <Link
                  to={card.link}
                  className="inline-flex items-center gap-1.5 text-xs font-bold text-brand-600 hover:text-brand-700 transition-colors"
                >
                  <span>{card.linkText}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          );
        })}
      </div>

      {/* Recent Enquiries Queue */}
      <div className="bg-white rounded-3xl border border-slate-200/80 shadow-sm p-6 sm:p-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div>
            <h2 className="text-lg font-bold text-slate-900">Recent Unclaimed Enquiries</h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Fresh enquiries directly submitted from the public student portal
            </p>
          </div>

          <Link
            to="/leads/public"
            className="inline-flex items-center gap-1.5 text-xs font-bold text-brand-600 hover:text-brand-700 hover:underline"
          >
            <span>View All Available Leads ({stats?.availableLeads ?? 0})</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {stats?.recentPublicLeads && stats.recentPublicLeads.length > 0 ? (
          <LeadTable
            leads={stats.recentPublicLeads}
            isUnclaimed={true}
            onClaim={(lead) => setLeadToClaim(lead)}
            onViewDetails={(lead) => setSelectedLead(lead)}
          />
        ) : (
          <EmptyState
            title="No Unclaimed Enquiries"
            description="All prospective students have been assigned to counselors. Great job!"
            action={
              <Link
                to="/"
                target="_blank"
                className="inline-flex items-center gap-2 px-4 py-2 text-xs font-bold text-brand-700 bg-brand-50 hover:bg-brand-100 rounded-xl transition-colors border border-brand-200"
              >
                <PlusCircle className="w-4 h-4" />
                Submit Test Enquiry via Portal
              </Link>
            }
          />
        )}
      </div>

      {/* Lead Details Modal */}
      <LeadDetailsModal
        isOpen={Boolean(selectedLead)}
        lead={selectedLead}
        onClose={() => setSelectedLead(null)}
      />

      {/* Confirmation Dialog before Claiming */}
      <ConfirmationDialog
        isOpen={Boolean(leadToClaim)}
        title="Claim Prospective Student Lead"
        message={`Do you want to assign "${leadToClaim?.name}" (${leadToClaim?.courseInterest}) to your private counseling roster? Once claimed, other counselors cannot claim this lead.`}
        confirmText="Confirm & Claim"
        loading={claiming}
        onConfirm={handleConfirmClaim}
        onCancel={() => setLeadToClaim(null)}
      />
    </div>
  );
};
