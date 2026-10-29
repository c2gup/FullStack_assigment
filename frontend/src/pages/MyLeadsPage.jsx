import React, { useState, useEffect, useCallback } from 'react';
import { UserCheck, RefreshCw, Filter, Sparkles, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { leadsApi, getErrorMessage } from '../services/api';
import { SearchBar } from '../components/SearchBar';
import { Pagination } from '../components/Pagination';
import { LeadTable } from '../components/LeadTable';
import { LeadCard } from '../components/LeadCard';
import { LoadingSpinner } from '../components/LoadingSpinner';
import { ErrorMessage } from '../components/ErrorMessage';
import { EmptyState } from '../components/EmptyState';
import { LeadDetailsModal } from '../components/LeadDetailsModal';
import toast from 'react-hot-toast';

export const MyLeadsPage = () => {
  const [leads, setLeads] = useState([]);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 1,
  });
  const [search, setSearch] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [sortBy, setSortBy] = useState('createdAt');
  const [order, setOrder] = useState('desc');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedLead, setSelectedLead] = useState(null);

  // Debounce search input
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(search);
      setPagination((prev) => ({ ...prev, page: 1 }));
    }, 350);
    return () => clearTimeout(handler);
  }, [search]);

  const fetchMyLeads = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const res = await leadsApi.getMy({
        page: pagination.page,
        limit: pagination.limit,
        search: debouncedSearch,
        status: statusFilter,
        sortBy,
        order,
      });

      if (res.success) {
        setLeads(res.data);
        setPagination(res.pagination);
      }
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  }, [pagination.page, pagination.limit, debouncedSearch, statusFilter, sortBy, order]);

  useEffect(() => {
    fetchMyLeads();
  }, [fetchMyLeads]);

  const handlePageChange = (newPage) => {
    setPagination((prev) => ({ ...prev, page: newPage }));
  };

  const handleStatusChange = async (leadId, newStatus) => {
    try {
      const res = await leadsApi.updateStatus(leadId, newStatus);
      if (res.success) {
        toast.success(`Status updated to ${newStatus}`);
        // Optimistically or directly update local state
        setLeads((prev) =>
          prev.map((l) => (l._id === leadId ? { ...l, status: newStatus } : l))
        );
        if (selectedLead && selectedLead._id === leadId) {
          setSelectedLead((prev) => ({ ...prev, status: newStatus }));
        }
      }
    } catch (err) {
      toast.error(getErrorMessage(err));
      await fetchMyLeads();
    }
  };

  const statusTabs = [
    { label: 'All Statuses', value: '' },
    { label: 'NEW', value: 'NEW' },
    { label: 'CONTACTED', value: 'CONTACTED' },
    { label: 'CONVERTED', value: 'CONVERTED' },
  ];

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="p-1.5 rounded-lg bg-indigo-50 text-indigo-700">
              <UserCheck className="w-5 h-5" />
            </span>
            <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
              My Claimed Leads
            </h1>
          </div>
          <p className="text-xs sm:text-sm text-slate-500">
            Prospects assigned exclusively to your counseling portfolio. Update their status as you progress.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={fetchMyLeads}
            disabled={loading}
            className="inline-flex items-center gap-2 px-3.5 py-2 text-xs font-semibold text-slate-700 bg-white hover:bg-slate-50 border border-slate-300 rounded-xl transition-colors shadow-sm disabled:opacity-50"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
            <span>Refresh</span>
          </button>

          <Link
            to="/leads/public"
            className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold text-white bg-brand-600 hover:bg-brand-700 rounded-xl transition-colors shadow-sm"
          >
            <span>Claim More Leads</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>

      {/* Status Filter Tabs */}
      <div className="flex flex-wrap items-center gap-2 border-b border-slate-200 pb-3">
        {statusTabs.map((tab) => {
          const isActive = statusFilter === tab.value;
          return (
            <button
              key={tab.value}
              type="button"
              onClick={() => {
                setStatusFilter(tab.value);
                setPagination((prev) => ({ ...prev, page: 1 }));
              }}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
                isActive
                  ? 'bg-slate-900 text-white shadow-sm'
                  : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
              }`}
            >
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Filter and Search Bar */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-3 bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
        <div className="md:col-span-8">
          <SearchBar
            value={search}
            onChange={setSearch}
            onClear={() => setSearch('')}
            placeholder="Search your leads by name, email, course, city..."
          />
        </div>

        <div className="md:col-span-4 flex items-center gap-2">
          <label htmlFor="sort-by" className="text-xs font-semibold text-slate-500 whitespace-nowrap">
            Sort:
          </label>
          <select
            id="sort-by"
            value={`${sortBy}-${order}`}
            onChange={(e) => {
              const [sb, ord] = e.target.value.split('-');
              setSortBy(sb);
              setOrder(ord);
            }}
            className="w-full text-xs font-medium bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-800 focus:outline-none focus:ring-2 focus:ring-brand-500 transition-all cursor-pointer"
          >
            <option value="createdAt-desc">Newest First</option>
            <option value="createdAt-asc">Oldest First</option>
            <option value="name-asc">Student Name (A-Z)</option>
            <option value="name-desc">Student Name (Z-A)</option>
          </select>
        </div>
      </div>

      {/* Content Area */}
      {loading ? (
        <LoadingSpinner size="lg" text="Loading your private leads..." />
      ) : error ? (
        <ErrorMessage message={error} onRetry={fetchMyLeads} />
      ) : leads.length === 0 ? (
        <EmptyState
          title={search || statusFilter ? 'No Leads Match Filters' : 'Your Roster is Empty'}
          description={
            search || statusFilter
              ? 'No assigned leads matched your active search or status filter. Try clearing filters.'
              : 'You have not claimed any prospective students yet. Browse the Available Leads queue to start counseling.'
          }
          action={
            search || statusFilter ? (
              <button
                type="button"
                onClick={() => {
                  setSearch('');
                  setStatusFilter('');
                }}
                className="px-4 py-2 text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors"
              >
                Reset Filters
              </button>
            ) : (
              <Link
                to="/leads/public"
                className="inline-flex items-center gap-2 px-4 py-2.5 text-xs font-bold text-white bg-brand-600 hover:bg-brand-700 rounded-xl transition-colors shadow-sm"
              >
                <span>Browse Available Leads</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            )
          }
        />
      ) : (
        <div className="space-y-4">
          {/* Desktop Table View */}
          <div className="hidden md:block">
            <LeadTable
              leads={leads}
              isUnclaimed={false}
              onStatusChange={handleStatusChange}
              onViewDetails={(lead) => setSelectedLead(lead)}
            />
          </div>

          {/* Mobile Cards View */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:hidden">
            {leads.map((lead) => (
              <LeadCard
                key={lead._id}
                lead={lead}
                isUnclaimed={false}
                onStatusChange={handleStatusChange}
                onViewDetails={(lead) => setSelectedLead(lead)}
              />
            ))}
          </div>

          {/* Pagination Controls */}
          <Pagination
            page={pagination.page}
            totalPages={pagination.totalPages}
            total={pagination.total}
            limit={pagination.limit}
            onPageChange={handlePageChange}
          />
        </div>
      )}

      {/* Lead Details Modal */}
      <LeadDetailsModal
        isOpen={Boolean(selectedLead)}
        lead={selectedLead}
        onClose={() => setSelectedLead(null)}
      />
    </div>
  );
};
