import React from 'react';
import { X, Copy, CheckCircle2, XCircle, Clock } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import { Modal } from '../ui';
import type { PaymentResponse } from '../../types/api';
import { PaymentStatus } from '../../types/enums';

interface TransactionDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  transaction: PaymentResponse | null;
}

export function TransactionDetailsModal({ isOpen, onClose, transaction }: TransactionDetailsModalProps) {
  const { t } = useLanguage();

  if (!transaction) return null;

  const formatAmount = (amount: number) => {
    return new Intl.NumberFormat('fr-FR', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(amount);
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    // TODO: Show toast notification
  };

  const getStatusIcon = (status: PaymentStatus) => {
    switch (status) {
      case PaymentStatus.COMPLETED:
        return <CheckCircle2 className="w-12 h-12 text-secondary" />;
      case PaymentStatus.FAILED:
      case PaymentStatus.EXPIRED:
      case PaymentStatus.CANCELLED:
        return <XCircle className="w-12 h-12 text-error" />;
      default:
        return <Clock className="w-12 h-12 text-amber-500" />;
    }
  };

  const getStatusColor = (status: PaymentStatus) => {
    switch (status) {
      case PaymentStatus.COMPLETED:
        return 'text-secondary bg-secondary/10';
      case PaymentStatus.FAILED:
      case PaymentStatus.EXPIRED:
      case PaymentStatus.CANCELLED:
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
          <div>
            <h2 className="text-2xl font-bold text-primary mb-1">
              {t('transactions.details.title')}
            </h2>
            <p className="text-sm text-on-surface-variant">
              {t('transactions.details.subtitle')}
            </p>
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
          {getStatusIcon(transaction.status)}
          <div className="flex-1">
            <p className="text-xs font-bold text-on-surface-variant uppercase tracking-widest mb-1">
              {t('transactions.table.status')}
            </p>
            <p className={`text-lg font-bold ${getStatusColor(transaction.status)} inline-block px-3 py-1 rounded-lg`}>
              {t(`transactions.status.${transaction.status.toLowerCase()}`)}
            </p>
          </div>
        </div>

        {/* Amount Section */}
        <div className="mb-8 p-6 bg-gradient-to-br from-primary/5 to-secondary/5 rounded-xl border border-outline-variant/10">
          <p className="text-xs font-bold text-on-surface-variant uppercase tracking-widest mb-2">
            {t('transactions.table.amount')}
          </p>
          <p className="text-4xl font-bold text-primary mb-2">
            {formatAmount(transaction.amount)} <span className="text-lg text-on-surface-variant">{transaction.currency}</span>
          </p>
          {transaction.feeAmount > 0 && (
            <p className="text-sm text-on-surface-variant">
              {t('transactions.table.fee')}: <span className="font-bold">{formatAmount(transaction.feeAmount)} {transaction.currency}</span>
            </p>
          )}
        </div>

        {/* Details Grid */}
        <div className="grid grid-cols-2 gap-6 mb-8">
          {/* Reference */}
          <div className="space-y-2">
            <label className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest">
              {t('transactions.table.ref')}
            </label>
            <div className="flex items-center gap-2">
              <p className="text-sm font-mono font-bold text-primary bg-surface-container-high px-3 py-2 rounded-lg flex-1">
                {transaction.reference}
              </p>
              <button
                onClick={() => copyToClipboard(transaction.reference)}
                className="p-2 hover:bg-surface-container-high rounded-lg transition-colors"
                title={t('common.copy')}
              >
                <Copy className="w-4 h-4 text-on-surface-variant" />
              </button>
            </div>
          </div>

          {/* Transaction ID */}
          <div className="space-y-2">
            <label className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest">
              Transaction ID
            </label>
            <div className="flex items-center gap-2">
              <p className="text-sm font-mono text-on-surface-variant bg-surface-container-high px-3 py-2 rounded-lg flex-1 truncate">
                {transaction.id}
              </p>
              <button
                onClick={() => copyToClipboard(transaction.id)}
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
              {t('transactions.table.merchant')}
            </label>
            <p className="text-sm font-bold text-primary bg-surface-container-high px-3 py-2 rounded-lg">
              {transaction.merchantCode}
            </p>
          </div>

          {/* Operator */}
          <div className="space-y-2">
            <label className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest">
              {t('transactions.table.operator')}
            </label>
            <p className="text-sm font-bold text-primary bg-surface-container-high px-3 py-2 rounded-lg">
              {transaction.operatorCode}
            </p>
          </div>

          {/* Phone */}
          {(transaction.recipientPhone || transaction.payerPhone) && (
            <div className="space-y-2">
              <label className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest">
                {t('transactions.table.phone')}
              </label>
              <p className="text-sm font-mono font-bold text-primary bg-surface-container-high px-3 py-2 rounded-lg">
                {transaction.recipientPhone || transaction.payerPhone}
              </p>
            </div>
          )}

          {/* Date */}
          <div className="space-y-2">
            <label className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest">
              {t('transactions.table.date')}
            </label>
            <div className="text-sm bg-surface-container-high px-3 py-2 rounded-lg">
              <p className="font-bold text-primary">
                {new Date(transaction.createdAt).toLocaleDateString('fr-FR')}
              </p>
              <p className="text-xs text-on-surface-variant">
                {new Date(transaction.createdAt).toLocaleTimeString('fr-FR')}
              </p>
            </div>
          </div>

          {/* Last Updated */}
          {transaction.updatedAt && (
            <div className="space-y-2 col-span-2">
              <label className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest">
                Last Updated
              </label>
              <p className="text-sm text-on-surface-variant bg-surface-container-high px-3 py-2 rounded-lg">
                {new Date(transaction.updatedAt).toLocaleString('fr-FR')}
              </p>
            </div>
          )}

          {/* Description */}
          {transaction.description && (
            <div className="space-y-2 col-span-2">
              <label className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest">
                Description
              </label>
              <p className="text-sm text-on-surface bg-surface-container-high px-3 py-2 rounded-lg">
                {transaction.description}
              </p>
            </div>
          )}

          {/* Idempotency Key */}
          {transaction.idempotencyKey && (
            <div className="space-y-2 col-span-2">
              <label className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest">
                Idempotency Key
              </label>
              <p className="text-xs font-mono text-on-surface-variant bg-surface-container-high px-3 py-2 rounded-lg break-all">
                {transaction.idempotencyKey}
              </p>
            </div>
          )}
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
