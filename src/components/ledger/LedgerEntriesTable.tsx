import React from 'react';
import { RefreshCw, Receipt } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import { LedgerEntryRow } from './LedgerEntryRow';
import type { LedgerEntryResponse } from '../../types/api';

interface LedgerEntriesTableProps {
  entries: LedgerEntryResponse[];
  isLoading: boolean;
}

export function LedgerEntriesTable({ entries, isLoading }: LedgerEntriesTableProps) {
  const { t } = useLanguage();

  // Ensure entries is always an array
  const safeEntries = Array.isArray(entries) ? entries : [];

  if (isLoading && safeEntries.length === 0) {
    return (
      <div className="h-64 flex items-center justify-center bg-surface-container-lowest border border-outline-variant/10 rounded-2xl">
        <div className="w-8 h-8 border-4 border-primary/20 border-t-primary rounded-full animate-spin"></div>
      </div>
    );
  }

  if (safeEntries.length === 0) {
    return (
      <div className="p-12 text-center text-on-surface-variant flex flex-col items-center justify-center bg-surface-container-lowest border border-outline-variant/10 rounded-2xl">
        <Receipt className="w-12 h-12 mb-4 opacity-20" />
        <p className="font-bold">{t('ledger.entries.empty')}</p>
        <p className="text-xs mt-1">{t('ledger.entries.emptyDesc')}</p>
      </div>
    );
  }

  return (
    <div className="bg-surface-container-lowest rounded-2xl border border-outline-variant/10 overflow-hidden shadow-sm">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-outline-variant/10 text-[10px] uppercase tracking-widest text-on-surface-variant bg-surface-container-low">
              <th className="p-4 font-bold">{t('ledger.table.date')}</th>
              <th className="p-4 font-bold">{t('ledger.table.direction')}</th>
              <th className="p-4 font-bold">{t('ledger.table.type')}</th>
              <th className="p-4 font-bold">{t('ledger.table.amount')}</th>
              <th className="p-4 font-bold">{t('ledger.table.description')}</th>
              <th className="p-4 font-bold">{t('ledger.table.reference')}</th>
            </tr>
          </thead>
          <tbody>
            {safeEntries.map((entry) => (
              <LedgerEntryRow key={entry.id} entry={entry} />
            ))}
          </tbody>
        </table>
      </div>

      {isLoading && safeEntries.length > 0 && (
        <div className="p-4 bg-surface-container-high border-t border-outline-variant/10 flex items-center justify-center gap-2">
          <RefreshCw className="w-4 h-4 text-primary animate-spin" />
          <span className="text-xs text-on-surface-variant font-bold">{t('common.loading')}</span>
        </div>
      )}
    </div>
  );
}
