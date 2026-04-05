import React from 'react';
import { RefreshCw, CreditCard } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import { TransactionRow } from './TransactionRow';
import type { PaymentResponse } from '../../types/api';

interface TransactionsTableProps {
  transactions: PaymentResponse[];
  isLoading: boolean;
  onView: (transaction: PaymentResponse) => void;
  onCopyReference: (reference: string) => void;
  onGenerateReceipt: (transaction: PaymentResponse) => void;
}

export function TransactionsTable({
  transactions,
  isLoading,
  onView,
  onCopyReference,
  onGenerateReceipt
}: TransactionsTableProps) {
  const { t } = useLanguage();

  const safeTransactions = Array.isArray(transactions) ? transactions : [];

  if (isLoading && safeTransactions.length === 0) {
    return (
      <div className="h-64 flex items-center justify-center bg-surface-container-lowest border border-outline-variant/10 rounded-xl">
        <div className="w-8 h-8 border-4 border-primary/20 border-t-primary rounded-full animate-spin"></div>
      </div>
    );
  }

  if (safeTransactions.length === 0) {
    return (
      <div className="p-12 text-center text-on-surface-variant flex flex-col items-center justify-center bg-surface-container-lowest border border-outline-variant/10 rounded-xl">
        <CreditCard className="w-12 h-12 mb-4 opacity-20" />
        <p className="font-bold">{t('transactions.empty')}</p>
        <p className="text-xs mt-1">{t('transactions.emptyDesc')}</p>
      </div>
    );
  }

  return (
    <div className="bg-surface-container-lowest rounded-xl shadow-sm overflow-hidden border border-outline-variant/10">
      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="bg-surface-container-high/50 border-b border-outline-variant/10">
            <th className="px-6 py-4 text-[11px] font-bold text-on-surface-variant uppercase tracking-widest">
              {t('transactions.table.ref')}
            </th>
            <th className="px-6 py-4 text-[11px] font-bold text-on-surface-variant uppercase tracking-widest">
              {t('transactions.table.merchant')}
            </th>
            <th className="px-6 py-4 text-[11px] font-bold text-on-surface-variant uppercase tracking-widest">
              {t('transactions.table.phone')}
            </th>
            <th className="px-6 py-4 text-[11px] font-bold text-on-surface-variant uppercase tracking-widest text-right">
              {t('transactions.table.amount')}
            </th>
            <th className="px-6 py-4 text-[11px] font-bold text-on-surface-variant uppercase tracking-widest">
              {t('transactions.table.operator')}
            </th>
            <th className="px-6 py-4 text-[11px] font-bold text-on-surface-variant uppercase tracking-widest">
              {t('transactions.table.status')}
            </th>
            <th className="px-6 py-4 text-[11px] font-bold text-on-surface-variant uppercase tracking-widest">
              {t('transactions.table.date')}
            </th>
            <th className="px-6 py-4 text-[11px] font-bold text-on-surface-variant uppercase tracking-widest text-center">
              {t('transactions.table.actions')}
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-outline-variant/5">
          {safeTransactions.map((transaction) => (
            <TransactionRow
              key={transaction.id}
              transaction={transaction}
              onView={onView}
              onCopyReference={onCopyReference}
              onGenerateReceipt={onGenerateReceipt}
            />
          ))}
        </tbody>
      </table>

      {isLoading && safeTransactions.length > 0 && (
        <div className="p-4 bg-surface-container-high border-t border-outline-variant/10 flex items-center justify-center gap-2">
          <RefreshCw className="w-4 h-4 text-primary animate-spin" />
          <span className="text-xs text-on-surface-variant font-bold">{t('common.loading')}</span>
        </div>
      )}
    </div>
  );
}
