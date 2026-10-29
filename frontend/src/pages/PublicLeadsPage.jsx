import React, { useState, useEffect, useCallback } from 'react';
import { Users, RefreshCw, Filter, Sparkles, PlusCircle } from 'lucide-react';
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
import { ConfirmationDialog } from '../components/ConfirmationDialog';
import toast from 'react-hot-toast';

export const PublicLeadsPage = () => {
  const [leads, setLeads] = useState([]);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 1,
  });
  const [search, setSearch] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [sortBy, setSortBy] = useState('createdAt');
  const [order, setOrder] = useState('desc');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Modals & Claim state
  const [selectedLead, setSelectedLead] = useState(null);
  const [leadToClaim, setLeadToClaim] = useState(null);
  const [claiming, setClaiming] = useState(false);

  // Debounce search input
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(search);
      setPagination((prev) => ({ ...prev, page: 1 }));
    }, 350);
    return () => clearTimeout(handler);
  }, [search]);

  const fetchPublicLeads = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const res = await leadsApi.getPublic({
        page: pagination.page,
        limit: pagination.limit,
        search: debouncedSearch,
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
  }, [pagination.page, pagination.limit, debouncedSearch, sortBy, order]);

  useEffect(() => {
    fetchPublicLeads();
  }, [fetchPublicLeads]);

  const handlePageChange = (newPage) => {
    setPagination((prev) => ({ ...prev, page: newPage }));
  };

  const handleConfirmClaim = async () => {
    if (!leadToClaim) return;
    setClaiming(true);
    try {
      await leadsApi.claim(leadToClaim._id);
      toast.success(`Claimed lead "${leadToClaim.name}"! It is now in your personal roster.`);
      setLeadToClaim(null);
      await fetchPublicLeads();
    } catch (err) {
      const msg = getErrorMessage(err);
      toast.error(msg);
      // If 409 Conflict, close dialog and refresh list so stale item disappears
      setLeadToClaim(null);
      await fetchPublicLeads();
    } finally {
      setClaiming(false);
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="p-1.5 rounded-lg bg-brand-50 text-brand-700">
              <Users className="w-5 h-5" />
            </span>
            <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
              Available Leads Pool
            </h1>
          </div>
          <p className="text-xs sm:text-sm text-slate-500">
            Unclaimed student enquiries. Click <span className="font-semibold text-slate-700">Claim</span> to assign a lead exclusively to your private roster.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={fetchPublicLeads}
            disabled={loading}
            className="inline-flex items-center gap-2 px-3.5 py-2 text-xs font-semibold text-slate-700 bg-white hover:bg-slate-50 border border-slate-300 rounded-xl transition-colors shadow-sm disabled:opacity-50"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
            <span>Refresh</span>
          </button>

          <Link
            to="/"
            target="_blank"
            className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold text-brand-700 bg-brand-50 hover:bg-brand-100 border border-brand-200 rounded-xl transition-colors shadow-sm"
          >
            <PlusCircle className="w-3.5 h-3.5" />
            <span>Submit New Enquiry</span>
          </Link>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-3 bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
        <div className="md:col-span-8">
          <SearchBar
            value={search}
            onChange={setSearch}
            onClear={() => setSearch('')}
            placeholder="Search unclaimed leads by name, email, course, city..."
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

      {/* Main Content Area */}
      {loading ? (
        <LoadingSpinner size="lg" text="Fetching unclaimed leads..." />
      ) : error ? (
        <ErrorMessage message={error} onRetry={fetchPublicLeads} />
      ) : leads.length === 0 ? (
        <EmptyState
          title={search ? 'No Matching Enquiries' : 'No Unclaimed Leads Available'}
          description={
            search
              ? `No unclaimed leads matched your search query "${search}". Try adjusting keywords.`
              : 'All prospective student enquiries are currently assigned to counselors.'
          }
          action={
            search ? (
              <button
                type="button"
                onClick={() => setSearch('')}
                className="px-4 py-2 text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors"
              >
                Clear Search
              </button>
            ) : (
              <Link
                to="/"
                target="_blank"
                className="inline-flex items-center gap-2 px-4 py-2 text-xs font-bold text-brand-700 bg-brand-50 hover:bg-brand-100 rounded-xl transition-colors border border-brand-200"
              >
                <PlusCircle className="w-4 h-4" />
                Submit Test Enquiry
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
              isUnclaimed={true}
              onClaim={(lead) => setLeadToClaim(lead)}
              onViewDetails={(lead) => setSelectedLead(lead)}
              claimingId={leadToClaim?._id}
            />
          </div>

          {/* Mobile Cards View */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:hidden">
            {leads.map((lead) => (
              <LeadCard
                key={lead._id}
                lead={lead}
                isUnclaimed={true}
                onClaim={(lead) => setLeadToClaim(lead)}
                onViewDetails={(lead) => setSelectedLead(lead)}
                claiming={claiming && leadToClaim?._id === lead._id}
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

      {/* Confirmation Dialog before Claiming */}
      <ConfirmationDialog
        isOpen={Boolean(leadToClaim)}
        title="Claim Prospective Student"
        message={`Assign "${leadToClaim?.name}" (${leadToClaim?.courseInterest}) exclusively to your roster? Other counselors will no longer be able to claim or view this lead.`}
        confirmText="Confirm & Claim"
        loading={claiming}
        onConfirm={handleConfirmClaim}
        onCancel={() => setLeadToClaim(null)}
      />
    </div>
  );
};
