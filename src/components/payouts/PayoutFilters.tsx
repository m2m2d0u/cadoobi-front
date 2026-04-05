import React from 'react';
import { Search, Filter } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import { SearchInput } from '../ui';
import { PayoutStatus } from '../../types/enums';

interface PayoutFiltersProps {
  statusFilter: string;
  onStatusChange: (status: string) => void;
  merchantSearch: string;
  onMerchantSearchChange: (search: string) => void;
  onReset: () => void;
}

export function PayoutFilters({
  statusFilter,
  onStatusChange,
  merchantSearch,
  onMerchantSearchChange,
  onReset
}: PayoutFiltersProps) {
  const { t } = useLanguage();

  return (
    <div className="bg-surface-container-lowest rounded-xl border border-outline-variant/10 p-6 mb-6">
      <div className="flex items-center gap-2 mb-4">
        <Filter className="w-5 h-5 text-primary" />
        <h3 className="font-bold text-primary">{t('payouts.filter.title')}</h3>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Status Filter */}
        <div className="space-y-2">
          <label className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest">
            {t('payouts.filter.status')}
          </label>
          <select
            value={statusFilter}
            onChange={(e) => onStatusChange(e.target.value)}
            className="w-full bg-surface-container-high text-primary font-bold border-none rounded-lg text-sm px-4 py-3 cursor-pointer focus:ring-2 focus:ring-primary/20"
          >
            <option value="">{t('payouts.filter.allStatus')}</option>
            <option value={PayoutStatus.PENDING}>{t('payouts.status.pending')}</option>
            <option value={PayoutStatus.COMPLETED}>{t('payouts.status.completed')}</option>
            <option value={PayoutStatus.FAILED}>{t('payouts.status.failed')}</option>
          </select>
        </div>

        {/* Merchant Search */}
        <div className="space-y-2 md:col-span-2">
          <label className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest">
            {t('payouts.filter.merchant')}
          </label>
          <SearchInput
            value={merchantSearch}
            onChange={onMerchantSearchChange}
            placeholder={t('payouts.filter.searchMerchant')}
          />
        </div>
      </div>

      {/* Reset Button */}
      {(statusFilter || merchantSearch) && (
        <div className="mt-4 pt-4 border-t border-outline-variant/10">
          <button
            onClick={onReset}
            className="text-sm font-bold text-primary hover:text-secondary transition-colors"
          >
            {t('payouts.filter.reset')}
          </button>
        </div>
      )}
    </div>
  );
}
