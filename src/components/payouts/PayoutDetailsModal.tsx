import React from 'react';
import { X, Copy, CheckCircle2, XCircle, Clock, Send } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import { Modal } from '../ui';
import type { PayoutResponse } from '../../types/api';
import { PayoutStatus } from '../../types/enums';

interface PayoutDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  payout: PayoutResponse | null;
}

export function PayoutDetailsModal({ isOpen, onClose, payout }: PayoutDetailsModalProps) {
  const { t } = useLanguage();

  if (!payout) return null;

  const formatAmount = (amount: number) => {
    return new Intl.NumberFormat('fr-FR', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(amount);
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  const getStatusIcon = (status: PayoutStatus) => {
    switch (status) {
      case PayoutStatus.COMPLETED:
        return <CheckCircle2 className="w-12 h-12 text-secondary" />;
      case PayoutStatus.FAILED:
        return <XCircle className="w-12 h-12 text-error" />;
      default:
        return <Clock className="w-12 h-12 text-amber-500" />;
    }
  };

  const getStatusColor = (status: PayoutStatus) => {
    switch (status) {
      case PayoutStatus.COMPLETED:
        return 'text-secondary bg-secondary/10';
      case PayoutStatus.FAILED:
        return 'text-error bg-error/10';
      default:
        return 'text-amber-500 bg-amber-500/10';
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="lg">
      <div className="p-8">
        {/* Header */}
        <div className="flex justify-between items-start mb-8">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
              <Send className="w-6 h-6 text-primary" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-primary mb-1">
                {t('payouts.details.title')}
              </h2>
              <p className="text-sm text-on-surface-variant">
                {t('payouts.details.subtitle')}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-surface-container-high rounded-full transition-colors"
          >
            <X className="w-5 h-5 text-on-surface-variant" />
          </button>
        </div>

        {/* Status Section */}
        <div className="mb-8 p-6 bg-surface-container-low rounded-xl border border-outline-variant/10 flex items-center gap-4">
          {getStatusIcon(payout.status)}
          <div className="flex-1">
            <p className="text-xs font-bold text-on-surface-variant uppercase tracking-widest mb-1">
              {t('payouts.table.status')}
            </p>
            <p className={`text-lg font-bold ${getStatusColor(payout.status)} inline-block px-3 py-1 rounded-lg`}>
              {t(`payouts.status.${payout.status.toLowerCase()}`)}
            </p>
          </div>
        </div>

        {/* Amount Section */}
        <div className="mb-8 p-6 bg-gradient-to-br from-primary/5 to-secondary/5 rounded-xl border border-outline-variant/10">
          <p className="text-xs font-bold text-on-surface-variant uppercase tracking-widest mb-2">
            {t('payouts.details.amountBreakdown')}
          </p>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-sm text-on-surface-variant">{t('payouts.details.declaredAmount')}:</span>
              <span className="text-2xl font-bold text-primary">
                {formatAmount(payout.amount)} <span className="text-sm text-on-surface-variant">{payout.currency}</span>
              </span>
            </div>
            {payout.merchantFeeAmount > 0 && (
              <div className="flex justify-between items-center">
                <span className="text-sm text-on-surface-variant">{t('payouts.details.merchantFee')}:</span>
                <span className="text-lg font-bold text-error">
                  - {formatAmount(payout.merchantFeeAmount)} {payout.currency}
                </span>
              </div>
            )}
            <div className="h-px bg-outline-variant/20"></div>
            <div className="flex justify-between items-center">
              <span className="text-sm font-bold text-secondary">{t('payouts.details.netAmount')}:</span>
              <span className="text-2xl font-bold text-secondary">
                {formatAmount(payout.amount - payout.merchantFeeAmount)} {payout.currency}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-on-surface-variant">{t('payouts.details.operatorFee')}:</span>
              <span className="text-lg font-bold text-yellow-400">
                {formatAmount(payout.feeAmount)} {payout.currency}
              </span>
            </div>
          </div>
        </div>

        {/* Details Grid */}
        <div className="grid grid-cols-2 gap-6 mb-8">
          {/* Payout ID */}
          <div className="space-y-2 col-span-2">
            <label className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest">
              {t('payouts.table.id')}
            </label>
            <div className="flex items-center gap-2">
              <p className="text-sm font-mono text-on-surface-variant bg-surface-container-high px-3 py-2 rounded-lg flex-1 break-all">
                {payout.id}
              </p>
              <button
                onClick={() => copyToClipboard(payout.id)}
                className="p-2 hover:bg-surface-container-high rounded-lg transition-colors"
                title={t('common.copy')}
              >
                <Copy className="w-4 h-4 text-on-surface-variant" />
              </button>
            </div>
          </div>

          {/* Merchant */}
          <div className="space-y-2">
            <label className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest">
              {t('payouts.table.merchant')}
            </label>
            <p className="text-sm font-bold text-primary bg-surface-container-high px-3 py-2 rounded-lg">
              {payout.merchantCode}
            </p>
          </div>

          {/* Operator */}
          <div className="space-y-2">
            <label className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest">
              {t('payouts.table.operator')}
            </label>
            <p className="text-sm font-bold text-primary bg-surface-container-high px-3 py-2 rounded-lg">
              {payout.operatorCode}
            </p>
          </div>

          {/* Recipient */}
          <div className="space-y-2">
            <label className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest">
              {t('payouts.table.recipient')}
            </label>
            <p className="text-sm font-mono font-bold text-primary bg-surface-container-high px-3 py-2 rounded-lg">
              {payout.recipientNumber}
            </p>
          </div>

          {/* Idempotency Key */}
          <div className="space-y-2">
            <label className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest">
              Idempotency Key
            </label>
            <p className="text-xs font-mono text-on-surface-variant bg-surface-container-high px-3 py-2 rounded-lg truncate">
              {payout.idempotencyKey}
            </p>
          </div>

          {/* Operator Transaction ID */}
          {payout.operatorTransactionId && (
            <div className="space-y-2 col-span-2">
              <label className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest">
                Operator Transaction ID
              </label>
              <p className="text-sm font-mono text-on-surface-variant bg-surface-container-high px-3 py-2 rounded-lg">
                {payout.operatorTransactionId}
              </p>
            </div>
          )}

          {/* Created Date */}
          <div className="space-y-2">
            <label className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest">
              {t('payouts.table.date')}
            </label>
            <div className="text-sm bg-surface-container-high px-3 py-2 rounded-lg">
              <p className="font-bold text-primary">
                {new Date(payout.createdAt).toLocaleDateString('fr-FR')}
              </p>
              <p className="text-xs text-on-surface-variant">
                {new Date(payout.createdAt).toLocaleTimeString('fr-FR')}
              </p>
            </div>
          </div>

          {/* Last Updated */}
          <div className="space-y-2">
            <label className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest">
              Last Updated
            </label>
            <p className="text-sm text-on-surface-variant bg-surface-container-high px-3 py-2 rounded-lg">
              {new Date(payout.updatedAt).toLocaleString('fr-FR')}
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-end gap-3 pt-6 border-t border-outline-variant/10">
          <button
            onClick={onClose}
            className="px-6 py-3 rounded-xl font-bold text-on-surface-variant hover:bg-surface-container-high transition-colors"
          >
            {t('common.close')}
          </button>
        </div>
      </div>
    </Modal>
  );
}
