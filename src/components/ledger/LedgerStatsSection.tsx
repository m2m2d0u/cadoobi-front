import React from 'react';
import { TrendingUp, TrendingDown, Receipt } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import { StatsCard } from '../ui';
import { LedgerDirection } from '../../types/enums';
import type { LedgerEntryResponse } from '../../types/api';

interface LedgerStatsSectionProps {
  entries: LedgerEntryResponse[];
  currency: string;
}

export function LedgerStatsSection({ entries, currency }: LedgerStatsSectionProps) {
  const { t } = useLanguage();

  // Ensure entries is always an array
  const safeEntries = Array.isArray(entries) ? entries : [];

  const totalCredits = safeEntries
    .filter(e => e.direction === LedgerDirection.CREDIT)
    .reduce((sum, e) => sum + e.amount, 0);

  const totalDebits = safeEntries
    .filter(e => e.direction === LedgerDirection.DEBIT)
    .reduce((sum, e) => sum + e.amount, 0);

  const totalEntries = safeEntries.length;

  const formatAmount = (amount: number) => {
    return new Intl.NumberFormat('fr-FR', {
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
      <StatsCard
        icon={TrendingUp}
        iconColor="text-secondary"
        label={t('ledger.stats.totalCredits')}
        value={`${formatAmount(totalCredits)} ${currency}`}
        trend="+15.2%"
      />
      <StatsCard
        icon={TrendingDown}
        iconColor="text-error"
        label={t('ledger.stats.totalDebits')}
        value={`${formatAmount(totalDebits)} ${currency}`}
        trend="-8.1%"
      />
      <StatsCard
        icon={Receipt}
        iconColor="text-primary"
        label={t('ledger.stats.totalEntries')}
        value={totalEntries.toString()}
        sublabel={t('ledger.stats.currentPage')}
      />
    </div>
  );
}
