import React from 'react';
import { RefreshCw, Send } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import { PayoutRow } from './PayoutRow';
import type { PayoutResponse } from '../../types/api';
import type { PayoutStatus } from '../../types/enums';

interface PayoutsTableProps {
  payouts: PayoutResponse[];
  isLoading: boolean;
  onView: (payout: PayoutResponse) => void;
  onUpdateStatus?: (payout: PayoutResponse, status: PayoutStatus) => void;
}

export function PayoutsTable({
  payouts,
  isLoading,
  onView,
  onUpdateStatus
}: PayoutsTableProps) {
  const { t } = useLanguage();

  const safePayouts = Array.isArray(payouts) ? payouts : [];

  if (isLoading && safePayouts.length === 0) {
    return (
      <div className="h-64 flex items-center justify-center bg-surface-container-lowest border border-outline-variant/10 rounded-xl">
        <div className="w-8 h-8 border-4 border-primary/20 border-t-primary rounded-full animate-spin"></div>
      </div>
    );
  }

  if (safePayouts.length === 0) {
    return (
      <div className="p-12 text-center text-on-surface-variant flex flex-col items-center justify-center bg-surface-container-lowest border border-outline-variant/10 rounded-xl">
        <Send className="w-12 h-12 mb-4 opacity-20" />
        <p className="font-bold">{t('payouts.empty')}</p>
        <p className="text-xs mt-1">{t('payouts.emptyDesc')}</p>
      </div>
    );
  }

  return (
    <div className="bg-surface-container-lowest rounded-xl shadow-sm overflow-hidden border border-outline-variant/10">
      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="bg-surface-container-high/50 border-b border-outline-variant/10">
            <th className="px-6 py-4 text-[11px] font-bold text-on-surface-variant uppercase tracking-widest">
              {t('payouts.table.merchant')}
            </th>
            <th className="px-6 py-4 text-[11px] font-bold text-on-surface-variant uppercase tracking-widest">
              {t('payouts.table.recipient')}
            </th>
            <th className="px-6 py-4 text-[11px] font-bold text-on-surface-variant uppercase tracking-widest text-right">
              {t('payouts.table.amount')}
            </th>
            <th className="px-6 py-4 text-[11px] font-bold text-on-surface-variant uppercase tracking-widest">
              {t('payouts.table.operator')}
            </th>
            <th className="px-6 py-4 text-[11px] font-bold text-on-surface-variant uppercase tracking-widest">
              {t('payouts.table.status')}
            </th>
            <th className="px-6 py-4 text-[11px] font-bold text-on-surface-variant uppercase tracking-widest">
              {t('payouts.table.date')}
            </th>
            <th className="px-6 py-4 text-[11px] font-bold text-on-surface-variant uppercase tracking-widest text-center">
              {t('payouts.table.actions')}
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-outline-variant/5">
          {safePayouts.map((payout) => (
            <PayoutRow
              key={payout.id}
              payout={payout}
              onView={onView}
              onUpdateStatus={onUpdateStatus}
            />
          ))}
        </tbody>
      </table>

      {isLoading && safePayouts.length > 0 && (
        <div className="p-4 bg-surface-container-high border-t border-outline-variant/10 flex items-center justify-center gap-2">
          <RefreshCw className="w-4 h-4 text-primary animate-spin" />
          <span className="text-xs text-on-surface-variant font-bold">{t('common.loading')}</span>
        </div>
      )}
    </div>
  );
}
