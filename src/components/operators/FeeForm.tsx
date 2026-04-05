import React from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { Button } from '../ui';
import { OperationType, FeeType } from '../../types/enums';
import type { CreateOperatorFeeRequest } from '../../types/api';

interface FeeFormProps {
  formData: CreateOperatorFeeRequest;
  setFormData: React.Dispatch<React.SetStateAction<CreateOperatorFeeRequest>>;
  onSubmit: (e: React.FormEvent) => void;
  onCancel: () => void;
  isLoading: boolean;
}

export function FeeForm({ formData, setFormData, onSubmit, onCancel, isLoading }: FeeFormProps) {
  const { t } = useLanguage();

  return (
    <form className="space-y-6" onSubmit={onSubmit}>
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <label className="text-[10px] font-bold text-primary uppercase tracking-widest">{t('operators.fees.form.operation')}</label>
          <select
            required
            value={formData.operationType}
            onChange={e => setFormData({...formData, operationType: e.target.value as OperationType})}
            className="w-full bg-surface-container-high border-none rounded-lg p-4 text-sm font-bold text-primary focus:ring-2 focus:ring-primary/20 transition-all cursor-pointer"
          >
            <option value={OperationType.PAYIN}>PAY-IN</option>
            <option value={OperationType.PAYOUT}>PAY-OUT</option>
          </select>
        </div>
        <div className="space-y-2">
          <label className="text-[10px] font-bold text-primary uppercase tracking-widest">{t('operators.fees.form.feeType')}</label>
          <select
            required
            value={formData.feeType}
            onChange={e => setFormData({...formData, feeType: e.target.value as FeeType})}
            className="w-full bg-surface-container-high border-none rounded-lg p-4 text-sm font-bold text-primary focus:ring-2 focus:ring-primary/20 transition-all cursor-pointer"
          >
            <option value={FeeType.PERCENTAGE}>PERCENTAGE</option>
            <option value={FeeType.FIXED}>FIXED</option>
            <option value={FeeType.MIXED}>MIXED</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        {(formData.feeType === FeeType.PERCENTAGE || formData.feeType === FeeType.MIXED) && (
          <div className="space-y-2">
            <label className="text-[10px] font-bold text-primary uppercase tracking-widest">{t('operators.fees.form.feePercentage')}</label>
            <input
              type="number"
              step="0.01"
              required
              value={formData.feePercentage || ''}
              onChange={e => setFormData({...formData, feePercentage: parseFloat(e.target.value)})}
              className="w-full bg-surface-container-high border-none rounded-lg p-4 text-sm focus:ring-2 focus:ring-primary/20 transition-all"
            />
          </div>
        )}
        {(formData.feeType === FeeType.FIXED || formData.feeType === FeeType.MIXED) && (
          <div className="space-y-2">
            <label className="text-[10px] font-bold text-primary uppercase tracking-widest">{t('operators.fees.form.feeFixed')}</label>
            <input
              type="number"
              required
              value={formData.feeFixed || ''}
              onChange={e => setFormData({...formData, feeFixed: parseFloat(e.target.value)})}
              className="w-full bg-surface-container-high border-none rounded-lg p-4 text-sm focus:ring-2 focus:ring-primary/20 transition-all"
            />
          </div>
        )}
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div className="space-y-2">
          <label className="text-[10px] font-bold text-primary uppercase tracking-widest">{t('operators.fees.form.minAmount')}</label>
          <input
            type="number"
            required
            value={formData.minAmount}
            onChange={e => setFormData({...formData, minAmount: parseFloat(e.target.value)})}
            className="w-full bg-surface-container-high border-none rounded-lg p-4 text-sm focus:ring-2 focus:ring-primary/20 transition-all"
          />
        </div>
        <div className="space-y-2">
          <label className="text-[10px] font-bold text-primary uppercase tracking-widest">{t('operators.fees.form.maxAmount')}</label>
          <input
            type="number"
            required
            value={formData.maxAmount}
            onChange={e => setFormData({...formData, maxAmount: parseFloat(e.target.value)})}
            className="w-full bg-surface-container-high border-none rounded-lg p-4 text-sm focus:ring-2 focus:ring-primary/20 transition-all"
          />
        </div>
        <div className="space-y-2">
          <label className="text-[10px] font-bold text-primary uppercase tracking-widest">{t('operators.fees.form.currency')}</label>
          <input
            type="text"
            required
            value={formData.currency}
            onChange={e => setFormData({...formData, currency: e.target.value.toUpperCase()})}
            className="w-full bg-surface-container-high border-none rounded-lg p-4 text-sm font-bold focus:ring-2 focus:ring-primary/20 transition-all"
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <label className="text-[10px] font-bold text-primary uppercase tracking-widest">{t('operators.fees.form.effectiveFrom')}</label>
          <input
            type="date"
            required
            value={formData.effectiveFrom}
            onChange={e => setFormData({...formData, effectiveFrom: e.target.value})}
            className="w-full bg-surface-container-high border-none rounded-lg p-4 text-sm focus:ring-2 focus:ring-primary/20 transition-all cursor-pointer"
          />
        </div>
        <div className="space-y-2">
          <label className="text-[10px] font-bold text-primary uppercase tracking-widest">{t('operators.fees.form.effectiveTo')}</label>
          <input
            type="date"
            value={formData.effectiveTo || ''}
            onChange={e => setFormData({...formData, effectiveTo: e.target.value || undefined})}
            className="w-full bg-surface-container-high border-none rounded-lg p-4 text-sm focus:ring-2 focus:ring-primary/20 transition-all cursor-pointer"
          />
        </div>
      </div>

      <div className="flex gap-4 pt-4 border-t border-outline-variant/10">
        <Button type="button" variant="outline" className="flex-1" onClick={onCancel}>
          {t('common.cancel')}
        </Button>
        <button
          type="submit"
          disabled={isLoading}
          className={`flex-1 text-white py-4 rounded-xl font-bold flex items-center justify-center gap-2 transition-all shadow-lg shadow-primary/20 ${isLoading ? 'bg-primary/50 cursor-not-allowed' : 'bg-primary hover:opacity-90'}`}
        >
          {isLoading ? t('common.saving') : t('operators.fees.form.save')}
        </button>
      </div>
    </form>
  );
}
