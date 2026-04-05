import React from 'react';
import { Eye, CheckCircle, XCircle, Clock } from 'lucide-react';
import { cn } from '@/src/lib/utils';
import { useLanguage } from '../../context/LanguageContext';
import { IconButton, StatusBadge } from '../ui';
import type { StatusType } from '../ui';
import type { PayoutResponse } from '../../types/api';
import { PayoutStatus } from '../../types/enums';
import { PermissionGuard } from '../auth';
import { PAYOUT_READ } from '../../lib/permissions';

interface PayoutRowProps {
  payout: PayoutResponse;
  onView: (payout: PayoutResponse) => void;
  onUpdateStatus?: (payout: PayoutResponse, status: PayoutStatus) => void;
}

export function PayoutRow({ payout, onView, onUpdateStatus }: PayoutRowProps) {
  const { t } = useLanguage();

  const formatAmount = (amount: number) => {
    return new Intl.NumberFormat('fr-FR', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(amount);
  };

  const getStatusType = (status: PayoutStatus): StatusType => {
    switch (status) {
      case PayoutStatus.COMPLETED:
        return 'Success';
      case PayoutStatus.PROCESSING:
        return 'Processing';
      case PayoutStatus.PENDING:
        return 'Pending';
      case PayoutStatus.FAILED:
        return 'Failed';
      default:
        return 'Pending';
    }
  };

  const getStatusIcon = (status: PayoutStatus) => {
    switch (status) {
      case PayoutStatus.COMPLETED:
        return <CheckCircle className="w-4 h-4 text-secondary" />;
      case PayoutStatus.FAILED:
        return <XCircle className="w-4 h-4 text-error" />;
      default:
        return <Clock className="w-4 h-4 text-amber-500" />;
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
      {/* Merchant */}
      <td className="px-6 py-4">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-primary-fixed-dim flex items-center justify-center text-primary text-xs font-bold">
            {payout.merchantCode.substring(0, 2).toUpperCase()}
          </div>
          <span className="text-sm font-medium text-on-surface">{payout.merchantCode}</span>
        </div>
      </td>

      {/* Recipient */}
      <td className="px-6 py-4 text-sm tabular-nums text-on-surface-variant">
        {payout.recipientNumber}
      </td>

      {/* Amount */}
      <td className="px-6 py-4 text-right">
        <div className="space-y-0.5">
          <p className="text-sm font-bold tabular-nums text-primary">
            {formatAmount(payout.amount)} <span className="text-xs text-on-surface-variant">{payout.currency}</span>
          </p>
          {(payout.feeAmount > 0 || payout.merchantFeeAmount > 0) && (
            <div className="text-[10px] text-on-surface-variant space-y-0.5">
              {payout.merchantFeeAmount > 0 && (
                <p>Platform Fee: -{formatAmount(payout.merchantFeeAmount)}</p>
              )}
            </div>
          )}
          <p className="text-[10px] font-bold text-secondary pt-0.5">
            Net: {formatAmount(payout.amount - payout.merchantFeeAmount)} {payout.currency}
          </p>
          <div className="text-[10px] text-on-surface-variant space-y-0.5">
              {payout.feeAmount > 0 && (
                  <p>Operator Fee: {formatAmount(payout.feeAmount)}</p>
              )}
          </div>
        </div>
      </td>

      {/* Operator */}
      <td className="px-6 py-4">
        <div className="flex items-center gap-2">
          <div className={cn(
            'w-6 h-6 rounded-full flex items-center justify-center text-[10px] text-white font-bold',
            getOperatorColor(payout.operatorCode)
          )}>
            {payout.operatorCode.substring(0, 2).toUpperCase()}
          </div>
          <span className="text-xs font-medium text-on-surface-variant">{payout.operatorCode}</span>
        </div>
      </td>

      {/* Status */}
      <td className="px-6 py-4">
        <div className="flex items-center gap-2">
          {getStatusIcon(payout.status)}
          <StatusBadge
            status={getStatusType(payout.status)}
            label={t(`payouts.status.${payout.status.toLowerCase()}`)}
            variant="dot"
          />
        </div>
      </td>

      {/* Date */}
      <td className="px-6 py-4">
        <div className="space-y-1">
          <p className="text-xs text-on-surface-variant tabular-nums">
            {new Date(payout.createdAt).toLocaleDateString('fr-FR')}
          </p>
          <p className="text-[10px] text-on-surface-variant tabular-nums">
            {new Date(payout.createdAt).toLocaleTimeString('fr-FR')}
          </p>
        </div>
      </td>

      {/* Actions */}
      <td className="px-6 py-4">
        <div className="flex items-center justify-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          <PermissionGuard permission={PAYOUT_READ}>
            <IconButton
              icon={Eye}
              onClick={() => onView(payout)}
              title={t('payouts.actions.view') || 'View Details'}
              className="rounded-full hover:bg-primary/10 hover:text-primary"
            />
          </PermissionGuard>
        </div>
      </td>
    </tr>
  );
}
