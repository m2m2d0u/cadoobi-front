import React, { useState, useEffect } from 'react';
import { RefreshCw, TrendingUp, Wallet, DollarSign } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { Button, PageHeader, Pagination } from '../components/ui';
import { systemAccountService } from '../services';
import type { SystemAccountBalanceResponse, SystemAccountEntryResponse } from '../types/api';
import { SystemEntryType } from '../types/enums';

export function SystemAccount() {
  const { t } = useLanguage();

  const [balances, setBalances] = useState<SystemAccountBalanceResponse[]>([]);
  const [entries, setEntries] = useState<SystemAccountEntryResponse[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Pagination state
  const [currentPage, setCurrentPage] = useState(0);
  const [pageSize, setPageSize] = useState(20);
  const [totalElements, setTotalElements] = useState(0);
  const [totalPages, setTotalPages] = useState(0);

  // Currency filter
  const [selectedCurrency, setSelectedCurrency] = useState('XOF');

  const fetchData = async () => {
    try {
      setIsLoading(true);
      setError(null);

      const [balancesData, entriesData] = await Promise.all([
        systemAccountService.getAllBalances(),
        systemAccountService.getEntries({
          currency: selectedCurrency,
          page: currentPage,
          size: pageSize,
          sort: 'createdAt,desc'
        })
      ]);

      console.log('System Account Entries API Response:', entriesData);

      // Handle balances
      const balancesArray = balancesData?.data;
      if (Array.isArray(balancesArray)) {
        setBalances(balancesArray);
      } else {
        console.warn('Balances data is not an array:', balancesArray);
        setBalances([]);
      }

      // Handle entries (could be array or Page object with content)
      const entriesArray = entriesData?.data;
      if (Array.isArray(entriesArray)) {
        setEntries(entriesArray);
      } else if (entriesArray && typeof entriesArray === 'object' && 'content' in entriesArray) {
        // Handle Spring Page object
        setEntries(Array.isArray(entriesArray.content) ? entriesArray.content : []);
      } else {
        console.warn('Entries data is not an array or Page object:', entriesArray);
        setEntries([]);
      }

      setTotalElements(entriesData?.pagination?.totalElements || 0);
      setTotalPages(entriesData?.pagination?.totalPages || 0);
    } catch (err: any) {
      console.error('Error fetching system account data:', err);
      setError(err?.response?.data?.message || 'Failed to load system account data');
      setBalances([]);
      setEntries([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [currentPage, pageSize, selectedCurrency]);

  const formatAmount = (amount: number) => {
    return new Intl.NumberFormat('fr-FR', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(amount);
  };

  const getEntryTypeLabel = (type: SystemEntryType) => {
    return t(`systemAccount.entryType.${type}`) || type;
  };

  const getEntryTypeColor = (type: SystemEntryType) => {
    switch (type) {
      case SystemEntryType.MERCHANT_FEE_EARNED:
        return 'text-secondary bg-secondary/10';
      case SystemEntryType.WITHDRAWAL:
        return 'text-error bg-error/10';
      case SystemEntryType.MANUAL_ADJUSTMENT:
        return 'text-amber-500 bg-amber-500/10';
      default:
        return 'text-on-surface-variant bg-surface-container-high';
    }
  };

  // Calculate total earnings
  const totalEarnings = balances.reduce((sum, b) => sum + b.balance, 0);

  return (
    <div className="max-w-7xl mx-auto">
      <PageHeader
        title={t('systemAccount.title')}
        subtitle={t('systemAccount.subtitle')}
        actions={
          <Button variant="outline" size="sm" onClick={fetchData} disabled={isLoading}>
            <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
            {t('common.refresh')}
          </Button>
        }
      />

      {/* Error Banner */}
      {error && (
        <div className="mb-6 p-4 bg-error/10 border border-error/20 rounded-xl text-error text-sm">
          <strong>{t('common.error')}:</strong> {error}
        </div>
      )}

      {/* Balance Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {/* Total Earnings Card */}
        <div className="bg-gradient-to-br from-secondary/20 to-primary/20 p-6 rounded-xl border border-outline-variant/10 col-span-1 md:col-span-3 lg:col-span-1">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 rounded-xl bg-secondary/20 flex items-center justify-center">
              <TrendingUp className="w-6 h-6 text-secondary" />
            </div>
            <div>
              <p className="text-xs font-bold text-on-surface-variant uppercase tracking-widest">
                {t('systemAccount.totalEarnings')}
              </p>
              <p className="text-3xl font-bold text-secondary">
                {formatAmount(totalEarnings)}
              </p>
            </div>
          </div>
        </div>

        {/* Individual Currency Balances */}
        {balances.map((balance) => (
          <div
            key={balance.accountId}
            className="bg-surface-container-low p-6 rounded-xl border border-outline-variant/10"
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                <Wallet className="w-5 h-5 text-primary" />
              </div>
              <div>
                <p className="text-xs font-bold text-on-surface-variant uppercase tracking-widest">
                  {balance.currency}
                </p>
                <p className="text-2xl font-bold text-primary">
                  {formatAmount(balance.balance)}
                </p>
              </div>
            </div>
            <p className="text-[10px] text-on-surface-variant">
              {t('systemAccount.balance.updated')}: {new Date(balance.updatedAt).toLocaleString('fr-FR')}
            </p>
          </div>
        ))}
      </div>

      {/* Entry History */}
      <div className="bg-surface-container-lowest rounded-2xl border border-outline-variant/10 overflow-hidden shadow-sm">
        {/* Header */}
        <div className="p-4 border-b border-outline-variant/10 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <DollarSign className="w-5 h-5 text-primary" />
            <h3 className="font-bold text-primary">{t('systemAccount.entries.title')}</h3>
          </div>
          {balances.length > 0 && (
            <select
              value={selectedCurrency}
              onChange={(e) => {
                setSelectedCurrency(e.target.value);
                setCurrentPage(0);
              }}
              className="bg-surface-container-high text-primary font-bold border-none rounded-lg text-sm px-4 py-2 cursor-pointer"
            >
              {balances.map((balance) => (
                <option key={balance.currency} value={balance.currency}>
                  {balance.currency}
                </option>
              ))}
            </select>
          )}
        </div>

        {/* Loading State */}
        {isLoading && entries.length === 0 ? (
          <div className="p-12 text-center">
            <div className="w-10 h-10 border-4 border-primary/20 border-t-primary rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-on-surface-variant">{t('systemAccount.entries.loading')}</p>
          </div>
        ) : entries.length === 0 ? (
          <div className="p-12 text-center text-on-surface-variant">
            <DollarSign className="w-12 h-12 mx-auto mb-4 opacity-20" />
            <p className="font-bold">{t('systemAccount.entries.empty')}</p>
            <p className="text-sm mt-2">{t('systemAccount.entries.emptyDesc')}</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-surface-container-high/50">
                <tr className="border-b border-outline-variant/10">
                  <th className="px-6 py-4 text-left text-xs font-bold text-on-surface-variant uppercase tracking-wider">
                    {t('systemAccount.table.date')}
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-on-surface-variant uppercase tracking-wider">
                    {t('systemAccount.table.type')}
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-on-surface-variant uppercase tracking-wider">
                    {t('systemAccount.table.description')}
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-on-surface-variant uppercase tracking-wider">
                    {t('systemAccount.table.direction')}
                  </th>
                  <th className="px-6 py-4 text-right text-xs font-bold text-on-surface-variant uppercase tracking-wider">
                    {t('systemAccount.table.amount')}
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-outline-variant/10">
                {entries.map((entry) => (
                  <tr key={entry.id} className="hover:bg-surface-container-low/50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="space-y-1">
                        <p className="text-sm text-on-surface">
                          {new Date(entry.createdAt).toLocaleDateString('fr-FR')}
                        </p>
                        <p className="text-xs text-on-surface-variant">
                          {new Date(entry.createdAt).toLocaleTimeString('fr-FR')}
                        </p>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-block px-3 py-1 rounded-lg text-xs font-bold ${getEntryTypeColor(entry.entryType)}`}>
                        {getEntryTypeLabel(entry.entryType)}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-sm text-on-surface-variant max-w-md truncate">
                        {entry.description}
                      </p>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-block px-2 py-1 rounded text-xs font-bold ${
                        entry.direction === 'CREDIT'
                          ? 'text-secondary bg-secondary/10'
                          : 'text-error bg-error/10'
                      }`}>
                        {t(`systemAccount.direction.${entry.direction}`)}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <p className={`text-sm font-bold ${
                        entry.direction === 'CREDIT' ? 'text-secondary' : 'text-error'
                      }`}>
                        {entry.direction === 'CREDIT' ? '+' : '-'}
                        {formatAmount(entry.amount)} {entry.currency}
                      </p>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination */}
        {entries.length > 0 && (
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
        )}
      </div>
    </div>
  );
}
