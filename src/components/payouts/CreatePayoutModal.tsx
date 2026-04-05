import React, { useState, useEffect } from 'react';
import { X, Send, ShieldAlert } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import { Modal } from '../ui';
import type { CreatePayoutRequest, OperatorResponse, MerchantResponse } from '../../types/api';
import { operatorsService, merchantsService } from '../../services';

interface CreatePayoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (request: CreatePayoutRequest) => Promise<void>;
  isLoading: boolean;
  error: string | null;
}

export function CreatePayoutModal({
  isOpen,
  onClose,
  onSubmit,
  isLoading,
  error
}: CreatePayoutModalProps) {
  const { t } = useLanguage();

  const [merchants, setMerchants] = useState<MerchantResponse[]>([]);
  const [operators, setOperators] = useState<OperatorResponse[]>([]);
  const [loadingData, setLoadingData] = useState(false);

  const initialFormState: CreatePayoutRequest = {
    merchantId: '',
    operatorCode: '',
    recipientNumber: '',
    amount: 0,
    currency: 'XOF',
    idempotencyKey: ''
  };

  const [formData, setFormData] = useState<CreatePayoutRequest>(initialFormState);

  useEffect(() => {
    if (isOpen) {
      loadData();
      // Generate idempotency key
      setFormData(prev => ({
        ...prev,
        idempotencyKey: `PAYOUT_${Date.now()}_${Math.random().toString(36).substring(7)}`
      }));
    }
  }, [isOpen]);

  const loadData = async () => {
    try {
      setLoadingData(true);
      const [merchantsData, operatorsData] = await Promise.all([
        merchantsService.list({ size: 500 }),
        operatorsService.listActive()
      ]);
      setMerchants(merchantsData?.data || []);
      // Filter operators that support payout
      setOperators((operatorsData || []).filter(op => op.supportsPayout));
    } catch (err) {
      console.error('Failed to load data:', err);
    } finally {
      setLoadingData(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSubmit(formData);
  };

  const handleClose = () => {
    if (!isLoading) {
      setFormData(initialFormState);
      onClose();
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={handleClose} size="lg">
      <div className="p-8">
        {/* Header */}
        <div className="flex justify-between items-start mb-8">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-primary flex items-center justify-center">
              <Send className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-primary mb-1">
                {t('payouts.create.title')}
              </h2>
              <p className="text-sm text-on-surface-variant">
                {t('payouts.create.subtitle')}
              </p>
            </div>
          </div>
          <button
            onClick={handleClose}
            className="p-2 hover:bg-surface-container-high rounded-full transition-colors"
            disabled={isLoading}
          >
            <X className="w-5 h-5 text-on-surface-variant" />
          </button>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-6 p-4 bg-error/10 border border-error/20 rounded-xl text-error text-sm flex items-start gap-3">
            <ShieldAlert className="w-5 h-5 shrink-0 mt-0.5" />
            <div>
              <p className="font-bold">{t('common.error')}</p>
              <p>{error}</p>
            </div>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Merchant Selection */}
          <div className="space-y-2">
            <label className="text-[10px] font-bold text-primary uppercase tracking-widest">
              {t('payouts.create.merchant')} *
            </label>
            <select
              required
              value={formData.merchantId}
              onChange={(e) => setFormData({ ...formData, merchantId: e.target.value })}
              disabled={loadingData || isLoading}
              className="w-full bg-surface-container-high border-none rounded-lg p-4 text-sm focus:ring-2 focus:ring-primary/20 transition-all"
            >
              <option value="">{t('payouts.create.selectMerchant')}</option>
              {merchants.map((merchant) => (
                <option key={merchant.id} value={merchant.id}>
                  {merchant.name} ({merchant.code})
                </option>
              ))}
            </select>
          </div>

          {/* Operator Selection */}
          <div className="space-y-2">
            <label className="text-[10px] font-bold text-primary uppercase tracking-widest">
              {t('payouts.create.operator')} *
            </label>
            <select
              required
              value={formData.operatorCode}
              onChange={(e) => setFormData({ ...formData, operatorCode: e.target.value })}
              disabled={loadingData || isLoading}
              className="w-full bg-surface-container-high border-none rounded-lg p-4 text-sm focus:ring-2 focus:ring-primary/20 transition-all"
            >
              <option value="">{t('payouts.create.selectOperator')}</option>
              {operators.map((operator) => (
                <option key={operator.id} value={operator.code}>
                  {operator.name} ({operator.code})
                </option>
              ))}
            </select>
          </div>

          {/* Recipient Number */}
          <div className="space-y-2">
            <label className="text-[10px] font-bold text-primary uppercase tracking-widest">
              {t('payouts.create.recipientNumber')} *
            </label>
            <input
              type="tel"
              required
              placeholder="+221 77 123 45 67"
              value={formData.recipientNumber}
              onChange={(e) => setFormData({ ...formData, recipientNumber: e.target.value })}
              disabled={isLoading}
              className="w-full bg-surface-container-high border-none rounded-lg p-4 text-sm focus:ring-2 focus:ring-primary/20 transition-all font-mono"
            />
          </div>

          {/* Amount and Currency */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-[10px] font-bold text-primary uppercase tracking-widest">
                {t('payouts.create.amount')} *
              </label>
              <input
                type="number"
                required
                min="0.01"
                step="0.01"
                placeholder="10000.00"
                value={formData.amount || ''}
                onChange={(e) => setFormData({ ...formData, amount: parseFloat(e.target.value) || 0 })}
                disabled={isLoading}
                className="w-full bg-surface-container-high border-none rounded-lg p-4 text-sm focus:ring-2 focus:ring-primary/20 transition-all tabular-nums"
              />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-bold text-primary uppercase tracking-widest">
                {t('payouts.create.currency')}
              </label>
              <select
                value={formData.currency}
                onChange={(e) => setFormData({ ...formData, currency: e.target.value })}
                disabled={isLoading}
                className="w-full bg-surface-container-high border-none rounded-lg p-4 text-sm focus:ring-2 focus:ring-primary/20 transition-all"
              >
                <option value="XOF">XOF (West African CFA franc)</option>
                <option value="USD">USD (US Dollar)</option>
                <option value="EUR">EUR (Euro)</option>
              </select>
            </div>
          </div>

          {/* Info Box */}
          <div className="p-4 bg-primary/5 border border-primary/20 rounded-xl text-sm">
            <p className="text-on-surface-variant">
              <span className="font-bold text-primary">{t('payouts.create.note')}:</span>{' '}
              {t('payouts.create.noteText')}
            </p>
          </div>

          {/* Actions */}
          <div className="flex gap-4 pt-6 border-t border-outline-variant/10">
            <button
              type="button"
              onClick={handleClose}
              disabled={isLoading}
              className="flex-1 py-4 rounded-xl font-bold text-on-surface-variant hover:bg-surface-container-high transition-all"
            >
              {t('common.cancel')}
            </button>
            <button
              type="submit"
              disabled={isLoading || loadingData}
              className={`flex-[2] text-white py-4 rounded-xl font-bold flex items-center justify-center gap-2 transition-all shadow-lg shadow-primary/20 ${
                isLoading || loadingData ? 'bg-primary/50 cursor-not-allowed' : 'bg-primary hover:opacity-90'
              }`}
            >
              {isLoading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  {t('common.saving')}
                </>
              ) : (
                <>
                  <Send className="w-4 h-4" />
                  {t('payouts.create.initiate')}
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </Modal>
  );
}
