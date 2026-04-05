import React from 'react';
import { X } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import { Modal } from '../ui';
import type { CreateOperatorRequest } from '../../types/api';

interface OperatorFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  formData: CreateOperatorRequest;
  setFormData: React.Dispatch<React.SetStateAction<CreateOperatorRequest>>;
  onSubmit: (e: React.FormEvent) => void;
  isLoading: boolean;
  error: string | null;
}

export function OperatorFormModal({
  isOpen,
  onClose,
  formData,
  setFormData,
  onSubmit,
  isLoading,
  error
}: OperatorFormModalProps) {
  const { t } = useLanguage();

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <div className="p-8">
        <div className="flex justify-between items-start mb-8">
          <div>
            <h3 className="text-2xl font-bold text-primary mb-1">{t('operators.create')}</h3>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-surface-container-high rounded-full transition-colors"
          >
            <X className="w-5 h-5 text-on-surface-variant" />
          </button>
        </div>

        <form className="space-y-6" onSubmit={onSubmit}>
          {error && <div className="p-3 bg-error/10 text-error text-sm font-bold rounded-lg">{error}</div>}

          <div className="space-y-2">
            <label className="text-[10px] font-bold text-primary uppercase tracking-widest">{t('operators.form.name')}</label>
            <input
              type="text"
              required
              value={formData.name}
              onChange={e => setFormData({ ...formData, name: e.target.value })}
              placeholder="e.g. Orange Money"
              className="w-full bg-surface-container-high border-none rounded-lg p-4 text-sm focus:ring-2 focus:ring-primary/20 transition-all"
            />
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-bold text-primary uppercase tracking-widest">{t('operators.form.code')}</label>
            <input
              type="text"
              required
              value={formData.code}
              onChange={e => setFormData({ ...formData, code: e.target.value.toUpperCase() })}
              placeholder="e.g. SN_OM"
              className="w-full bg-surface-container-high border-none rounded-lg p-4 text-sm focus:ring-2 focus:ring-primary/20 transition-all"
            />
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-bold text-primary uppercase tracking-widest">{t('operators.form.country')}</label>
            <input
              type="text"
              required
              value={formData.country}
              onChange={e => setFormData({ ...formData, country: e.target.value })}
              placeholder="e.g. Senegal"
              className="w-full bg-surface-container-high border-none rounded-lg p-4 text-sm focus:ring-2 focus:ring-primary/20 transition-all"
            />
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-bold text-primary uppercase tracking-widest">{t('operators.form.apiBaseUrl')}</label>
            <input
              type="url"
              required
              value={formData.apiBaseUrl}
              onChange={e => setFormData({ ...formData, apiBaseUrl: e.target.value })}
              placeholder="https://api.gateway.com/"
              className="w-full bg-surface-container-high border-none rounded-lg p-4 text-sm focus:ring-2 focus:ring-primary/20 transition-all"
            />
          </div>

          <div className="grid grid-cols-2 gap-4 pt-4 border-t border-outline-variant/10">
            <div className="space-y-2 flex items-center gap-3">
              <input
                type="checkbox"
                id="supportsPayin"
                checked={formData.supportsPayin}
                onChange={e => setFormData({ ...formData, supportsPayin: e.target.checked })}
                className="w-5 h-5 text-primary border-outline-variant rounded focus:ring-primary"
              />
              <label htmlFor="supportsPayin" className="text-sm font-bold text-on-surface-variant cursor-pointer">
                {t('operators.form.supportsPayin')}
              </label>
            </div>

            <div className="space-y-2 flex items-center gap-3">
              <input
                type="checkbox"
                id="supportsPayout"
                checked={formData.supportsPayout}
                onChange={e => setFormData({ ...formData, supportsPayout: e.target.checked })}
                className="w-5 h-5 text-primary border-outline-variant rounded focus:ring-primary"
              />
              <label htmlFor="supportsPayout" className="text-sm font-bold text-on-surface-variant cursor-pointer">
                {t('operators.form.supportsPayout')}
              </label>
            </div>
          </div>

          <div className="space-y-2 flex items-center gap-3 pt-2">
            <input
              type="checkbox"
              id="isActive"
              checked={formData.isActive}
              onChange={e => setFormData({ ...formData, isActive: e.target.checked })}
              className="w-5 h-5 text-primary border-outline-variant rounded focus:ring-primary"
            />
            <label htmlFor="isActive" className="text-sm font-bold text-on-surface-variant cursor-pointer">
              {t('operators.form.isActive')}
            </label>
          </div>

          <div className="mt-10 space-y-4">
            <button
              type="submit"
              disabled={isLoading}
              className={`w-full text-white py-4 rounded-xl font-bold flex items-center justify-center gap-2 transition-all shadow-lg shadow-primary/20 ${isLoading ? 'bg-primary/50 cursor-not-allowed' : 'bg-primary hover:opacity-90'}`}
            >
               {isLoading ? t('common.saving') : t('operators.form.save')}
            </button>
          </div>
        </form>
      </div>
    </Modal>
  );
}
