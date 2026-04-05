import React from 'react';
import { Filter, Store } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import { SearchInput } from '../ui';
import { PaymentStatus } from '../../types/enums';

interface TransactionFiltersProps {
  statusFilter: string;
  onStatusChange: (status: string) => void;
  operatorFilter: string;
  onOperatorChange: (operator: string) => void;
  merchantSearch: string;
  onMerchantSearchChange: (search: string) => void;
  dateFilter: string;
  onDateFilterChange: (date: string) => void;
  onReset: () => void;
}

export function TransactionFilters({
  statusFilter,
  onStatusChange,
  operatorFilter,
  onOperatorChange,
  merchantSearch,
  onMerchantSearchChange,
  dateFilter,
  onDateFilterChange,
  onReset
}: TransactionFiltersProps) {
  const { t } = useLanguage();

  return (
    <section className="bg-surface-container-low p-6 rounded-xl mb-8">
      <div className="grid grid-cols-1 md:grid-cols-4 lg:grid-cols-5 gap-6">
        {/* Status Filter */}
        <div className="space-y-2">
          <label className="text-xs font-bold text-on-surface-variant uppercase tracking-wider block">
            {t('transactions.filter.status')}
          </label>
          <select
            value={statusFilter}
            onChange={(e) => onStatusChange(e.target.value)}
            className="w-full bg-surface-container-lowest border-none rounded-lg text-sm py-2.5 focus:ring-2 focus:ring-secondary/20"
          >
            <option value="">{t('transactions.filter.allStatus')}</option>
            <option value={PaymentStatus.INITIATED}>{t('transactions.status.initiated')}</option>
            <option value={PaymentStatus.PENDING}>{t('transactions.status.pending')}</option>
            <option value={PaymentStatus.COMPLETED}>{t('transactions.status.completed')}</option>
            <option value={PaymentStatus.FAILED}>{t('transactions.status.failed')}</option>
            <option value={PaymentStatus.EXPIRED}>{t('transactions.status.expired')}</option>
            <option value={PaymentStatus.CANCELLED}>{t('transactions.status.cancelled')}</option>
          </select>
        </div>

        {/* Date Filter */}
        <div className="space-y-2">
          <label className="text-xs font-bold text-on-surface-variant uppercase tracking-wider block">
            {t('transactions.filter.dateRange')}
          </label>
          <div className="flex gap-2">
            <button
              onClick={() => onDateFilterChange('today')}
              className={`px-3 py-2 text-xs font-medium rounded-lg transition-colors ${
                dateFilter === 'today'
                  ? 'bg-primary text-white'
                  : 'bg-surface-container-highest text-primary hover:bg-surface-container-high'
              }`}
            >
              {t('transactions.filter.today')}
            </button>
            <button
              onClick={() => onDateFilterChange('yesterday')}
              className={`px-3 py-2 text-xs font-medium rounded-lg transition-colors ${
                dateFilter === 'yesterday'
                  ? 'bg-primary text-white'
                  : 'bg-surface-container-highest text-primary hover:bg-surface-container-high'
              }`}
            >
              {t('transactions.filter.yesterday')}
            </button>
            <button
              onClick={() => onDateFilterChange('custom')}
              className={`px-3 py-2 text-xs font-medium rounded-lg transition-colors ${
                dateFilter === 'custom'
                  ? 'bg-primary text-white'
                  : 'bg-surface-container-highest text-primary hover:bg-surface-container-high'
              }`}
            >
              {t('transactions.filter.custom')}
            </button>
          </div>
        </div>

        {/* Merchant Search */}
        <div className="space-y-2">
          <label className="text-xs font-bold text-on-surface-variant uppercase tracking-wider block">
            {t('transactions.filter.merchant')}
          </label>
          <SearchInput
            value={merchantSearch}
            onChange={onMerchantSearchChange}
            placeholder={t('transactions.filter.searchMerchant')}
            icon={Store}
          />
        </div>

        {/* Operator Filter */}
        <div className="space-y-2">
          <label className="text-xs font-bold text-on-surface-variant uppercase tracking-wider block">
            {t('transactions.filter.operator')}
          </label>
          <select
            value={operatorFilter}
            onChange={(e) => onOperatorChange(e.target.value)}
            className="w-full bg-surface-container-lowest border-none rounded-lg text-sm py-2.5 focus:ring-2 focus:ring-secondary/20"
          >
            <option value="">{t('transactions.filter.allOperators')}</option>
            {/* Options will be populated from operator list */}
          </select>
        </div>

        {/* Reset Button */}
        <div className="flex items-end pb-1">
          <button
            onClick={onReset}
            className="text-sm font-semibold text-secondary hover:underline flex items-center gap-1"
          >
            <Filter className="w-4 h-4" />
            {t('transactions.filter.reset')}
          </button>
        </div>
      </div>
    </section>
  );
}
