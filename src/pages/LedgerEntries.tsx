import React, { useState, useEffect } from 'react';
import { RefreshCw } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { Button, PageHeader, Pagination } from '../components/ui';
import { ledgerService } from '../services';
import type { LedgerEntryResponse } from '../types/api';
import {
  LedgerEntriesTable,
  LedgerStatsSection
} from '../components/ledger';

export function LedgerEntries() {
  const { t } = useLanguage();

  const [entries, setEntries] = useState<LedgerEntryResponse[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Pagination state
  const [currentPage, setCurrentPage] = useState(0);
  const [pageSize, setPageSize] = useState(20);
  const [totalElements, setTotalElements] = useState(0);
  const [totalPages, setTotalPages] = useState(0);

  const fetchEntries = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await ledgerService.getAllLedgerEntries({
        page: currentPage,
        size: pageSize,
        sort: 'createdAt,desc'
      });

      console.log('All Ledger Entries API Response:', response);

      // Ensure we have an array
      const entriesData = response?.data;
      if (Array.isArray(entriesData)) {
        setEntries(entriesData);
      } else {
        console.warn('Entries data is not an array:', entriesData);
        setEntries([]);
      }

      setTotalElements(response?.pagination?.totalElements || 0);
      setTotalPages(response?.pagination?.totalPages || 0);
    } catch (err: any) {
      console.error('Error fetching all ledger entries:', err);
      setError(err?.response?.data?.message || 'Failed to load ledger entries');
      setEntries([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchEntries();
  }, [currentPage, pageSize]);

  return (
    <div className="max-w-7xl mx-auto">
      <PageHeader
        title={t('ledgerEntries.title')}
        subtitle={t('ledgerEntries.subtitle')}
        actions={
          <Button variant="outline" size="sm" onClick={fetchEntries} disabled={isLoading}>
            <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
            {t('common.refresh')}
          </Button>
        }
      />

      {/* Info Banner */}
      <div className="mb-6 p-4 bg-primary/5 border border-primary/10 rounded-xl">
        <p className="text-sm text-primary">
          <strong>{t('ledgerEntries.info.title')}:</strong> {t('ledgerEntries.info.description')}
        </p>
      </div>

      {/* Stats Section */}
      {Array.isArray(entries) && entries.length > 0 && (
        <LedgerStatsSection entries={entries} currency="XOF" />
      )}

      {/* Entries Table */}
      <LedgerEntriesTable entries={entries} isLoading={isLoading} />

      {/* Pagination */}
      {Array.isArray(entries) && entries.length > 0 && (
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

      {/* Error Display */}
      {error && (
        <div className="mt-6 p-4 bg-error/10 border border-error/20 rounded-xl text-error text-sm">
          {error}
        </div>
      )}
    </div>
  );
}
