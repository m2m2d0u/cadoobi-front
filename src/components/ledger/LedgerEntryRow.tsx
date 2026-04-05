import React from 'react';
import { ArrowDownCircle, ArrowUpCircle, ExternalLink } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import { LedgerDirection, LedgerEntryType } from '../../types/enums';
import type { LedgerEntryResponse } from '../../types/api';

interface LedgerEntryRowProps {
  entry: LedgerEntryResponse;
}

export function LedgerEntryRow({ entry }: LedgerEntryRowProps) {
  const { t } = useLanguage();

  const formatAmount = (amount: number) => {
    return new Intl.NumberFormat('fr-FR', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(amount);
  };

  const getEntryTypeColor = (type: LedgerEntryType) => {
    switch (type) {
      case LedgerEntryType.PAYIN_SETTLEMENT:
        return 'bg-secondary/10 text-secondary';
      case LedgerEntryType.PAYOUT_LOCK:
        return 'bg-primary/10 text-primary';
      case LedgerEntryType.PAYOUT_RELEASE:
        return 'bg-secondary/10 text-secondary';
      case LedgerEntryType.PAYOUT_SETTLEMENT:
        return 'bg-error/10 text-error';
      case LedgerEntryType.PAYOUT_FEE:
        return 'bg-error/10 text-error';
      case LedgerEntryType.MANUAL_ADJUSTMENT:
        return 'bg-on-surface-variant/10 text-on-surface-variant';
      default:
        return 'bg-on-surface-variant/10 text-on-surface-variant';
    }
  };

  const getEntryTypeLabel = (type: LedgerEntryType) => {
    return t(`ledger.entryType.${type}`) || type;
  };

  return (
    <tr className="border-b border-outline-variant/5 text-sm hover:bg-surface-container-lowest transition-colors">
      {/* Date & Time */}
      <td className="p-4">
        <div className="space-y-1">
          <p className="font-bold text-primary text-xs">
            {new Date(entry.createdAt).toLocaleDateString('fr-FR')}
          </p>
          <p className="text-[10px] text-on-surface-variant">
            {new Date(entry.createdAt).toLocaleTimeString('fr-FR')}
          </p>
        </div>
      </td>

      {/* Direction */}
      <td className="p-4">
        <div className="flex items-center gap-2">
          {entry.direction === LedgerDirection.CREDIT ? (
            <>
              <ArrowDownCircle className="w-5 h-5 text-secondary" />
              <span className="text-xs font-bold text-secondary uppercase">{t('ledger.direction.credit')}</span>
            </>
          ) : (
            <>
              <ArrowUpCircle className="w-5 h-5 text-error" />
              <span className="text-xs font-bold text-error uppercase">{t('ledger.direction.debit')}</span>
            </>
          )}
        </div>
      </td>

      {/* Entry Type */}
      <td className="p-4">
        <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase ${getEntryTypeColor(entry.entryType)}`}>
          {getEntryTypeLabel(entry.entryType)}
        </span>
      </td>

      {/* Amount */}
      <td className="p-4">
        <p className={`text-base font-bold ${entry.direction === LedgerDirection.CREDIT ? 'text-secondary' : 'text-error'}`}>
          {entry.direction === LedgerDirection.CREDIT ? '+' : '-'}{formatAmount(entry.amount)} <span className="text-xs text-on-surface-variant">{entry.currency}</span>
        </p>
      </td>

      {/* Description */}
      <td className="p-4 max-w-xs">
        <p className="text-xs text-on-surface-variant truncate" title={entry.description}>
          {entry.description}
        </p>
      </td>

      {/* Reference */}
      <td className="p-4">
        {entry.paymentTransactionId && (
          <div className="flex items-center gap-1">
            <ExternalLink className="w-3 h-3 text-primary" />
            <span className="text-[10px] font-mono text-primary">
              {entry.paymentTransactionId.substring(0, 8)}...
            </span>
          </div>
        )}
        {entry.payoutTransactionId && (
          <div className="flex items-center gap-1">
            <ExternalLink className="w-3 h-3 text-primary" />
            <span className="text-[10px] font-mono text-primary">
              {entry.payoutTransactionId.substring(0, 8)}...
            </span>
          </div>
        )}
        {!entry.paymentTransactionId && !entry.payoutTransactionId && (
          <span className="text-[10px] text-on-surface-variant">-</span>
        )}
      </td>
    </tr>
  );
}
