import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { RefreshCw, ArrowLeft } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { Button, PageHeader, Pagination } from '../components/ui';
import { ledgerService, merchantsService } from '../services';
import type {
  MerchantBalanceResponse,
  LedgerEntryResponse,
  MerchantResponse
} from '../types/api';
import {
  BalanceCard,
  LedgerEntriesTable,
  LedgerStatsSection
} from '../components/ledger';

export function Ledger() {
  const { t } = useLanguage();
  const { merchantId } = useParams<{ merchantId: string }>();
  const navigate = useNavigate();

  const [merchant, setMerchant] = useState<MerchantResponse | null>(null);
  const [balance, setBalance] = useState<MerchantBalanceResponse | null>(null);
  const [entries, setEntries] = useState<LedgerEntryResponse[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Pagination state
  const [currentPage, setCurrentPage] = useState(0);
  const [pageSize, setPageSize] = useState(20);
  const [totalElements, setTotalElements] = useState(0);
  const [totalPages, setTotalPages] = useState(0);

  // Filter state
  const [currency, setCurrency] = useState('XOF');

  const fetchMerchant = async () => {
    if (!merchantId) return;
    try {
      const data = await merchantsService.getById(merchantId);
      setMerchant(data);
    } catch (err: any) {
      console.error(err);
      setError(err?.response?.data?.message || 'Failed to load merchant');
    }
  };

  const fetchBalance = async () => {
    if (!merchantId) return;
    try {
      const data = await ledgerService.getBalance(merchantId, currency);
      setBalance(data);
    } catch (err: any) {
      console.error(err);
      // If no account exists yet, don't show error
      if (err?.response?.status === 404) {
        setBalance(null);
      }
    }
  };

  const fetchEntries = async () => {
    if (!merchantId) return;
    try {
      setIsLoading(true);
      setError(null);
      const response = await ledgerService.getEntries(merchantId, {
        currency,
        page: currentPage,
        size: pageSize,
        sort: 'createdAt,desc'
      });

      console.log('Ledger API Response:', response);
      console.log('Response data type:', typeof response?.data);
      console.log('Is array?', Array.isArray(response?.data));

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
      console.error('Error fetching ledger entries:', err);
      // If 404, it means no ledger account exists yet
      if (err?.response?.status === 404) {
        setError(null);
      } else {
        setError(err?.response?.data?.message || 'Failed to load ledger entries');
      }
      setEntries([]);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchAllData = () => {
    fetchBalance();
    fetchEntries();
  };

  useEffect(() => {
    if (merchantId) {
      fetchMerchant();
      fetchAllData();
    }
  }, [merchantId, currentPage, pageSize, currency]);

  const handleBackToMerchant = () => {
    if (merchantId) {
      navigate(`/merchants/${merchantId}`);
    } else {
      navigate('/merchants');
    }
  };

  return (
    <div className="max-w-7xl mx-auto">
      <PageHeader
        title={t('ledger.title')}
        subtitle={merchant ? `${merchant.name} - ${merchant.symmetryMerchantId}` : t('ledger.subtitle')}
        actions={
          <>
            <Button variant="outline" size="sm" onClick={handleBackToMerchant}>
              <ArrowLeft className="w-4 h-4" />
              {t('common.back')}
            </Button>
            <Button variant="outline" size="sm" onClick={fetchAllData} disabled={isLoading}>
              <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
              {t('common.refresh')}
            </Button>
          </>
        }
      />

      {/* Currency Selector */}
      <div className="mb-6">
        <div className="flex items-center gap-4">
          <label className="text-sm font-bold text-primary">
            {t('ledger.filter.currency')}:
          </label>
          <select
            value={currency}
            onChange={(e) => {
              setCurrency(e.target.value);
              setCurrentPage(0);
            }}
            className="bg-surface-container-high border-none rounded-lg text-sm px-4 py-2 font-bold text-primary cursor-pointer"
          >
            <option value="XOF">XOF</option>
            <option value="USD">USD</option>
            <option value="EUR">EUR</option>
          </select>
        </div>
      </div>

      {/* Balance Card */}
      {balance && (
        <div className="mb-8">
          <BalanceCard balance={balance} />
        </div>
      )}

      {!balance && !isLoading && (
        <div className="mb-8 p-8 bg-surface-container-lowest border border-outline-variant/10 rounded-2xl text-center">
          <p className="text-on-surface-variant">
            {t('ledger.noAccount')} ({currency})
          </p>
        </div>
      )}

      {/* Stats Section */}
      {Array.isArray(entries) && entries.length > 0 && (
        <LedgerStatsSection entries={entries} currency={currency} />
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
