import React, { useState, useEffect } from 'react';
import { Plus, RefreshCw, Send, CheckCircle } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { Button, PageHeader, Pagination } from '../components/ui';
import { payoutService } from '../services';
import type { PayoutResponse, CreatePayoutRequest } from '../types/api';
import {
  CreatePayoutModal,
  PayoutDetailsModal,
  PayoutFilters,
  PayoutsTable
} from '../components/payouts';
import { PermissionGuard } from '../components/auth';
import { PAYOUT_CREATE, PAYOUT_READ } from '../lib/permissions';

export function Payouts() {
  const { t } = useLanguage();

  const [payouts, setPayouts] = useState<PayoutResponse[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  // Pagination state
  const [currentPage, setCurrentPage] = useState(0);
  const [pageSize, setPageSize] = useState(20);
  const [totalElements, setTotalElements] = useState(0);
  const [totalPages, setTotalPages] = useState(0);

  // Filter state
  const [statusFilter, setStatusFilter] = useState('');
  const [merchantSearch, setMerchantSearch] = useState('');

  // Modal state
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [selectedPayout, setSelectedPayout] = useState<PayoutResponse | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [createError, setCreateError] = useState<string | null>(null);

  const fetchPayouts = async () => {
    try {
      setIsLoading(true);
      setError(null);

      const response = await payoutService.list({
        page: currentPage,
        size: pageSize,
        sort: 'createdAt,desc'
      });

      const payoutsData = response?.data;
      if (Array.isArray(payoutsData)) {
        // Client-side filtering
        let filtered = payoutsData;

        if (statusFilter) {
          filtered = filtered.filter(p => p.status === statusFilter);
        }

        if (merchantSearch) {
          const query = merchantSearch.toLowerCase();
          filtered = filtered.filter(p =>
            p.merchantId.toLowerCase().includes(query) ||
            p.recipientNumber.includes(query)
          );
        }

        setPayouts(filtered);
      } else {
        console.warn('Payouts data is not an array:', payoutsData);
        setPayouts([]);
      }

      setTotalElements(response?.pagination?.totalElements || 0);
      setTotalPages(response?.pagination?.totalPages || 0);
    } catch (err: any) {
      console.error('Error fetching payouts:', err);
      setError(err?.response?.data?.message || 'Failed to load payouts');
      setPayouts([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchPayouts();
  }, [currentPage, pageSize]);

  const handleResetFilters = () => {
    setStatusFilter('');
    setMerchantSearch('');
    setCurrentPage(0);
  };

  const handleViewPayout = (payout: PayoutResponse) => {
    setSelectedPayout(payout);
  };

  const handleCreatePayout = async (request: CreatePayoutRequest) => {
    try {
      setIsCreating(true);
      setCreateError(null);
      await payoutService.create(request);
      setIsCreateModalOpen(false);
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
      fetchPayouts();
    } catch (err: any) {
      console.error('Error creating payout:', err);
      setCreateError(
        err?.response?.data?.message ||
        err?.message ||
        'Failed to create payout'
      );
    } finally {
      setIsCreating(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto">
      <PageHeader
        title={t('payouts.title')}
        subtitle={t('payouts.subtitle')}
        actions={
          <>
            <Button variant="outline" size="sm" onClick={fetchPayouts} disabled={isLoading}>
              <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
              {t('common.refresh')}
            </Button>
            <PermissionGuard permission={PAYOUT_CREATE}>
              <Button onClick={() => setIsCreateModalOpen(true)}>
                <Plus className="w-4 h-4" />
                {t('payouts.create.button')}
              </Button>
            </PermissionGuard>
          </>
        }
      />

      {/* Success Banner */}
      {success && (
        <div className="mb-6 p-4 bg-secondary/10 border border-secondary/20 rounded-xl text-secondary text-sm flex items-center gap-2">
          <CheckCircle className="w-5 h-5" />
          <span><strong>{t('common.success')}:</strong> {t('payouts.createSuccess')}</span>
        </div>
      )}

      {/* Error Banner */}
      {error && (
        <div className="mb-6 p-4 bg-error/10 border border-error/20 rounded-xl text-error text-sm">
          <strong>{t('common.error')}:</strong> {error}
        </div>
      )}

      {/* Create Payout Modal */}
      <CreatePayoutModal
        isOpen={isCreateModalOpen}
        onClose={() => {
          setIsCreateModalOpen(false);
          setCreateError(null);
        }}
        onSubmit={handleCreatePayout}
        isLoading={isCreating}
        error={createError}
      />

      {/* Payout Details Modal */}
      <PayoutDetailsModal
        isOpen={!!selectedPayout}
        onClose={() => setSelectedPayout(null)}
        payout={selectedPayout}
      />

      {/* Filters */}
      <PayoutFilters
        statusFilter={statusFilter}
        onStatusChange={setStatusFilter}
        merchantSearch={merchantSearch}
        onMerchantSearchChange={setMerchantSearch}
        onReset={handleResetFilters}
      />

      {/* Payouts Table */}
      <PayoutsTable
        payouts={payouts}
        isLoading={isLoading}
        onView={handleViewPayout}
      />

      {/* Pagination */}
      {Array.isArray(payouts) && payouts.length > 0 && (
        <div className="mt-6">
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            totalElements={totalElements}
            pageSize={pageSize}
            onPageChange={setCurrentPage}
            onPageSizeChange={(size) => {
              setPageSize(size);
              setCurrentPage(0);
            }}
          />
        </div>
      )}
    </div>
  );
}
