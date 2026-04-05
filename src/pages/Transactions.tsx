import React, { useState, useEffect } from 'react';
import { Download, Plus, RefreshCw, CheckCircle } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { Button, PageHeader, Pagination } from '../components/ui';
import { paymentsService } from '../services';
import type { PaymentResponse } from '../types/api';
import {
  TransactionFilters,
  TransactionsTable,
  TransactionDetailsModal
} from '../components/transactions';
import { PermissionGuard } from '../components/auth';
import { PAYMENT_CREATE, PAYMENT_READ } from '../lib/permissions';

export function Transactions() {
  const { t } = useLanguage();

  const [transactions, setTransactions] = useState<PaymentResponse[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Pagination state
  const [currentPage, setCurrentPage] = useState(0);
  const [pageSize, setPageSize] = useState(20);
  const [totalElements, setTotalElements] = useState(0);
  const [totalPages, setTotalPages] = useState(0);

  // Filter state
  const [statusFilter, setStatusFilter] = useState('');
  const [operatorFilter, setOperatorFilter] = useState('');
  const [merchantSearch, setMerchantSearch] = useState('');
  const [dateFilter, setDateFilter] = useState('today');

  // Modal state
  const [selectedTransaction, setSelectedTransaction] = useState<PaymentResponse | null>(null);
  const [copySuccess, setCopySuccess] = useState(false);

  const fetchTransactions = async () => {
    try {
      setIsLoading(true);
      setError(null);

      // NOTE: This endpoint needs to be implemented in the backend
      // For now, this will fail until GET /payments with pagination is added
      const response = await paymentsService.list({
        page: currentPage,
        size: pageSize,
        status: statusFilter || undefined,
        operatorCode: operatorFilter || undefined,
        search: merchantSearch || undefined,
        sort: 'createdAt,desc'
      });

      const transactionsData = response?.data;
      if (Array.isArray(transactionsData)) {
        setTransactions(transactionsData);
      } else {
        console.warn('Transactions data is not an array:', transactionsData);
        setTransactions([]);
      }

      setTotalElements(response?.pagination?.totalElements || 0);
      setTotalPages(response?.pagination?.totalPages || 0);
    } catch (err: any) {
      console.error('Error fetching transactions:', err);

      // If 404, it means endpoint doesn't exist yet
      if (err?.response?.status === 404 || err?.response?.status === 405) {
        setError('Transaction list endpoint not yet implemented in backend. Showing empty state.');
      } else {
        setError(err?.response?.data?.message || 'Failed to load transactions');
      }
      setTransactions([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchTransactions();
  }, [currentPage, pageSize, statusFilter, operatorFilter]);

  const handleResetFilters = () => {
    setStatusFilter('');
    setOperatorFilter('');
    setMerchantSearch('');
    setDateFilter('today');
    setCurrentPage(0);
  };

  const handleViewTransaction = (transaction: PaymentResponse) => {
    setSelectedTransaction(transaction);
  };

  const handleCopyReference = (reference: string) => {
    navigator.clipboard.writeText(reference);
    setCopySuccess(true);
    setTimeout(() => setCopySuccess(false), 2000);
  };

  const handleGenerateReceipt = (transaction: PaymentResponse) => {
    // Generate a simple text receipt
    const receipt = `
=================================
       TRANSACTION RECEIPT
=================================

Reference:    ${transaction.reference}
Status:       ${transaction.status}
Amount:       ${transaction.amount} ${transaction.currency}
Fee:          ${transaction.feeAmount} ${transaction.currency}
Merchant:     ${transaction.merchantCode}
Operator:     ${transaction.operatorCode}
Phone:        ${transaction.recipientPhone || transaction.payerPhone || '-'}
Date:         ${new Date(transaction.createdAt).toLocaleString('fr-FR')}

=================================
    `;

    // Create a blob and download
    const blob = new Blob([receipt], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `receipt_${transaction.reference}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleExport = () => {
    console.log('Export transactions');
    // TODO: Implement export functionality
  };

  const handleInitiatePayment = () => {
    console.log('Initiate new payment');
    // TODO: Open initiate payment modal
  };

  return (
    <div className="max-w-7xl mx-auto">
      <PageHeader
        title={t('transactions.title')}
        subtitle={t('transactions.subtitle')}
        actions={
          <>
            <Button variant="outline" size="sm" onClick={fetchTransactions} disabled={isLoading}>
              <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
              {t('common.refresh')}
            </Button>
            <PermissionGuard permission={PAYMENT_READ}>
              <Button variant="secondary" onClick={handleExport}>
                <Download className="w-4 h-4" />
                {t('transactions.export')}
              </Button>
            </PermissionGuard>
            <PermissionGuard permission={PAYMENT_CREATE}>
              <Button onClick={handleInitiatePayment}>
                <Plus className="w-4 h-4" />
                {t('transactions.initiate')}
              </Button>
            </PermissionGuard>
          </>
        }
      />

      {/* Success Banner */}
      {copySuccess && (
        <div className="mb-6 p-4 bg-secondary/10 border border-secondary/20 rounded-xl text-secondary text-sm flex items-center gap-2">
          <CheckCircle className="w-5 h-5" />
          <span><strong>{t('common.success')}:</strong> {t('transactions.copySuccess') || 'Reference copied to clipboard!'}</span>
        </div>
      )}

      {/* Error Banner */}
      {error && (
        <div className="mb-6 p-4 bg-error/10 border border-error/20 rounded-xl text-error text-sm">
          <strong>{t('common.error')}:</strong> {error}
        </div>
      )}

      {/* Transaction Details Modal */}
      <TransactionDetailsModal
        isOpen={!!selectedTransaction}
        onClose={() => setSelectedTransaction(null)}
        transaction={selectedTransaction}
      />

      {/* Filters */}
      <TransactionFilters
        statusFilter={statusFilter}
        onStatusChange={setStatusFilter}
        operatorFilter={operatorFilter}
        onOperatorChange={setOperatorFilter}
        merchantSearch={merchantSearch}
        onMerchantSearchChange={setMerchantSearch}
        dateFilter={dateFilter}
        onDateFilterChange={setDateFilter}
        onReset={handleResetFilters}
      />

      {/* Transactions Table */}
      <TransactionsTable
        transactions={transactions}
        isLoading={isLoading}
        onView={handleViewTransaction}
        onCopyReference={handleCopyReference}
        onGenerateReceipt={handleGenerateReceipt}
      />

      {/* Pagination */}
      {Array.isArray(transactions) && transactions.length > 0 && (
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
