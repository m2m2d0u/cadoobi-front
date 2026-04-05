import React from 'react';
import { Eye, Copy, ReceiptText } from 'lucide-react';
import { cn } from '@/src/lib/utils';
import { useLanguage } from '../../context/LanguageContext';
import { IconButton, StatusBadge } from '../ui';
import type { StatusType } from '../ui';
import type { PaymentResponse } from '../../types/api';
import { PaymentStatus } from '../../types/enums';
import { PermissionGuard } from '../auth';
import { PAYMENT_READ } from '../../lib/permissions';

interface TransactionRowProps {
  transaction: PaymentResponse;
  onView: (transaction: PaymentResponse) => void;
  onCopyReference: (reference: string) => void;
  onGenerateReceipt: (transaction: PaymentResponse) => void;
}

export function TransactionRow({ transaction, onView, onCopyReference, onGenerateReceipt }: TransactionRowProps) {
  const { t } = useLanguage();

  const formatAmount = (amount: number) => {
    return new Intl.NumberFormat('fr-FR', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(amount);
  };

  const getStatusType = (status: PaymentStatus): StatusType => {
    switch (status) {
      case PaymentStatus.COMPLETED:
        return 'Success';
      case PaymentStatus.PENDING:
      case PaymentStatus.INITIATED:
        return 'Pending';
      case PaymentStatus.FAILED:
      case PaymentStatus.EXPIRED:
      case PaymentStatus.CANCELLED:
        return 'Failed';
      default:
        return 'Pending';
    }
  };

  const getOperatorColor = (operatorCode: string) => {
    const code = operatorCode.toLowerCase();
    if (code.includes('orange')) return 'bg-orange-500';
    if (code.includes('wave')) return 'bg-blue-600';
    if (code.includes('free')) return 'bg-red-600';
    return 'bg-primary';
  };

  return (
    <tr className="hover:bg-surface-container-low transition-colors group">
      {/* Reference */}
      <td className="px-6 py-4">
        <span className="text-sm font-semibold text-primary underline decoration-dotted underline-offset-4 cursor-pointer">
          {transaction.reference}
        </span>
      </td>

      {/* Merchant */}
      <td className="px-6 py-4">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-primary-fixed-dim flex items-center justify-center text-primary text-xs font-bold">
            {transaction.merchantCode.substring(0, 2).toUpperCase()}
          </div>
          <span className="text-sm font-medium text-on-surface">{transaction.merchantCode}</span>
        </div>
      </td>

      {/* Phone */}
      <td className="px-6 py-4 text-sm tabular-nums text-on-surface-variant">
        {transaction.payerPhone || '-'}
      </td>

      {/* Amount */}
      <td className="px-6 py-4 text-right">
        <div className="space-y-1">
          <p className="text-sm font-bold tabular-nums text-primary">
            {formatAmount(transaction.amount)} <span className="text-xs text-on-surface-variant">{transaction.currency}</span>
          </p>
          {transaction.feeAmount > 0 && (
            <p className="text-[10px] text-on-surface-variant">
              {t('transactions.table.fee')}: {formatAmount(transaction.feeAmount)} {transaction.currency}
            </p>
          )}
        </div>
      </td>

      {/* Operator */}
      <td className="px-6 py-4">
        <div className="flex items-center gap-2">
          <div className={cn(
            'w-6 h-6 rounded-full flex items-center justify-center text-[10px] text-white font-bold',
            getOperatorColor(transaction.operatorCode)
          )}>
            {transaction.operatorCode.substring(0, 2).toUpperCase()}
          </div>
          <span className="text-xs font-medium text-on-surface-variant">{transaction.operatorCode}</span>
        </div>
      </td>

      {/* Status */}
      <td className="px-6 py-4">
        <StatusBadge
          status={getStatusType(transaction.status)}
          label={t(`transactions.status.${transaction.status.toLowerCase()}`)}
          variant="dot"
        />
      </td>

      {/* Date */}
      <td className="px-6 py-4">
        <div className="space-y-1">
          <p className="text-xs text-on-surface-variant tabular-nums">
            {new Date(transaction.createdAt).toLocaleDateString('fr-FR')}
          </p>
          <p className="text-[10px] text-on-surface-variant tabular-nums">
            {new Date(transaction.createdAt).toLocaleTimeString('fr-FR')}
          </p>
        </div>
      </td>

      {/* Actions */}
      <td className="px-6 py-4">
        <div className="flex items-center justify-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          <PermissionGuard permission={PAYMENT_READ}>
            <IconButton
              icon={Eye}
              onClick={() => onView(transaction)}
              title={t('transactions.actions.view') || 'View Details'}
              className="rounded-full hover:bg-primary/10 hover:text-primary"
            />
          </PermissionGuard>
          <PermissionGuard permission={PAYMENT_READ}>
            <IconButton
              icon={Copy}
              onClick={() => onCopyReference(transaction.reference)}
              title={t('transactions.actions.copy') || 'Copy Reference'}
              className="rounded-full hover:bg-secondary/10 hover:text-secondary"
            />
          </PermissionGuard>
          <PermissionGuard permission={PAYMENT_READ}>
            <IconButton
              icon={ReceiptText}
              onClick={() => onGenerateReceipt(transaction)}
              title={t('transactions.actions.receipt') || 'Generate Receipt'}
              className="rounded-full hover:bg-tertiary/10 hover:text-tertiary"
            />
          </PermissionGuard>
        </div>
      </td>
    </tr>
  );
}
