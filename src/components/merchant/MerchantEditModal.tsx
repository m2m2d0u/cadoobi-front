import React from 'react';
import { Building2, Smartphone, X } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import { Modal, Button } from '../ui';
import { CompensationAccountType } from '../../types/enums';
import type { UpdateMerchantRequest } from '../../types/api';

interface MerchantEditModalProps {
  isOpen: boolean;
  onClose: () => void;
  formData: UpdateMerchantRequest;
  setFormData: React.Dispatch<React.SetStateAction<UpdateMerchantRequest>>;
  onSubmit: (e: React.FormEvent) => void;
  onSettlementTypeChange: (type: CompensationAccountType) => void;
  isLoading: boolean;
}

export function MerchantEditModal({
  isOpen,
  onClose,
  formData,
  setFormData,
  onSubmit,
  onSettlementTypeChange,
  isLoading
}: MerchantEditModalProps) {
  const { t } = useLanguage();

  return (
    <Modal isOpen={isOpen} onClose={() => !isLoading && onClose()} size="xl">
      <form onSubmit={onSubmit} className="p-8">
        <div className="flex justify-between items-center mb-8 pb-6 border-b border-outline-variant/10">
          <h3 className="text-2xl font-bold text-primary">{t('merchantProfile.editModal.title')}</h3>
          <button
            type="button"
            onClick={() => !isLoading && onClose()}
            className="p-2 hover:bg-surface-container-high rounded-full transition-colors"
          >
            <X className="w-5 h-5 text-on-surface-variant" />
          </button>
        </div>

        <div className="space-y-8 max-h-[calc(100vh-300px)] overflow-y-auto pr-2">
          {/* Business Information */}
          <section>
            <h4 className="text-lg font-bold text-primary mb-4">{t('merchantProfile.editModal.businessInfo')}</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                label={t('merchantProfile.editModal.businessName')}
                value={formData.name || ''}
                onChange={(value) => setFormData({ ...formData, name: value })}
                required
              />
              <FormField
                label={t('merchantProfile.editModal.logoUrl')}
                value={formData.logoUrl || ''}
                onChange={(value) => setFormData({ ...formData, logoUrl: value })}
              />
              <FormField
                label={t('merchantProfile.editModal.phoneNumber')}
                value={formData.phone || ''}
                onChange={(value) => setFormData({ ...formData, phone: value })}
                required
              />
              <FormField
                label={t('merchantProfile.editModal.businessType')}
                value={formData.businessType || ''}
                onChange={(value) => setFormData({ ...formData, businessType: value })}
                required
              />
              <FormField
                label={t('merchantProfile.editModal.businessEmail')}
                type="email"
                value={formData.email || ''}
                onChange={(value) => setFormData({ ...formData, email: value })}
                required
              />
              <FormField
                label={t('merchantProfile.editModal.country')}
                value={formData.country || ''}
                onChange={(value) => setFormData({ ...formData, country: value })}
                required
              />
              <FormField
                label={t('merchantProfile.editModal.address')}
                value={formData.address || ''}
                onChange={(value) => setFormData({ ...formData, address: value })}
                required
                fullWidth
              />
            </div>
          </section>

          {/* Legal Information */}
          <section className="pt-6 border-t border-outline-variant/10">
            <h4 className="text-lg font-bold text-primary mb-4">{t('merchantProfile.editModal.legalInfo')}</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                label={t('merchantProfile.editModal.rccm')}
                value={formData.rccm || ''}
                onChange={(value) => setFormData({ ...formData, rccm: value })}
              />
              <FormField
                label={t('merchantProfile.editModal.ninea')}
                value={formData.ninea || ''}
                onChange={(value) => setFormData({ ...formData, ninea: value })}
              />
            </div>
          </section>

          {/* Owner Information */}
          <section className="pt-6 border-t border-outline-variant/10">
            <h4 className="text-lg font-bold text-primary mb-4">{t('merchantProfile.editModal.ownerInfo')}</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                label={t('merchantProfile.editModal.ownerFullName')}
                value={formData.ownerFullName || ''}
                onChange={(value) => setFormData({ ...formData, ownerFullName: value })}
                required
              />
              <FormField
                label={t('merchantProfile.editModal.ownerEmail')}
                type="email"
                value={formData.ownerEmail || ''}
                onChange={(value) => setFormData({ ...formData, ownerEmail: value })}
                required
              />
              <FormField
                label={t('merchantProfile.editModal.ownerPhone')}
                value={formData.ownerPhone || ''}
                onChange={(value) => setFormData({ ...formData, ownerPhone: value })}
                required
              />
              <FormField
                label={t('merchantProfile.editModal.ownerCni')}
                value={formData.ownerCni || ''}
                onChange={(value) => setFormData({ ...formData, ownerCni: value })}
              />
            </div>
          </section>

          {/* Settlement Endpoint */}
          <section className="pt-6 border-t border-outline-variant/10">
            <h4 className="text-lg font-bold text-primary mb-4">{t('merchantProfile.editModal.settlementEndpoint')}</h4>

            {/* Settlement Type Toggle */}
            <div className="mb-6">
              <label className="block text-sm font-bold text-on-surface-variant mb-3">
                {t('merchantProfile.editModal.settlementType')}
              </label>
              <div className="flex gap-4">
                <SettlementTypeButton
                  icon={Building2}
                  label={t('merchantProfile.editModal.bankAccount')}
                  isActive={formData.compensationAccount?.type === CompensationAccountType.BANK}
                  onClick={() => onSettlementTypeChange(CompensationAccountType.BANK)}
                />
                <SettlementTypeButton
                  icon={Smartphone}
                  label={t('merchantProfile.editModal.mobileWallet')}
                  isActive={formData.compensationAccount?.type === CompensationAccountType.OPERATOR}
                  onClick={() => onSettlementTypeChange(CompensationAccountType.OPERATOR)}
                />
              </div>
            </div>

            {/* Settlement Fields */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {formData.compensationAccount?.type === CompensationAccountType.BANK ? (
                <>
                  <FormField
                    label={t('merchantProfile.editModal.bankName')}
                    value={formData.compensationAccount?.bankName || ''}
                    onChange={(value) => setFormData({
                      ...formData,
                      compensationAccount: { ...formData.compensationAccount, bankName: value } as any
                    })}
                    required
                  />
                  <FormField
                    label={t('merchantProfile.editModal.accountNumber')}
                    value={formData.compensationAccount?.accountNumber || ''}
                    onChange={(value) => setFormData({
                      ...formData,
                      compensationAccount: { ...formData.compensationAccount, accountNumber: value } as any
                    })}
                    required
                  />
                </>
              ) : (
                <>
                  <FormField
                    label={t('merchantProfile.editModal.operatorCode')}
                    value={formData.compensationAccount?.operatorCode || ''}
                    onChange={(value) => setFormData({
                      ...formData,
                      compensationAccount: { ...formData.compensationAccount, operatorCode: value } as any
                    })}
                    required
                  />
                  <FormField
                    label={t('merchantProfile.editModal.operatorPhone')}
                    value={formData.compensationAccount?.operatorPhone || ''}
                    onChange={(value) => setFormData({
                      ...formData,
                      compensationAccount: { ...formData.compensationAccount, operatorPhone: value } as any
                    })}
                    required
                  />
                </>
              )}
            </div>
          </section>
        </div>

        {/* Actions */}
        <div className="flex gap-4 mt-8 pt-6 border-t border-outline-variant/10">
          <button
            type="button"
            onClick={onClose}
            disabled={isLoading}
            className="flex-1 px-6 py-4 rounded-xl text-on-surface-variant font-bold hover:bg-surface-container-high transition-colors disabled:opacity-50"
          >
            {t('common.cancel')}
          </button>
          <Button
            type="submit"
            disabled={isLoading}
            className="flex-1 py-4"
          >
            {isLoading ? (
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                <span>{t('common.saving')}</span>
              </div>
            ) : (
              t('common.saveChanges')
            )}
          </Button>
        </div>
      </form>
    </Modal>
  );
}

interface FormFieldProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  type?: 'text' | 'email';
  required?: boolean;
  fullWidth?: boolean;
}

function FormField({ label, value, onChange, type = 'text', required, fullWidth }: FormFieldProps) {
  return (
    <div className={fullWidth ? 'md:col-span-2' : ''}>
      <label className="block text-sm font-bold text-on-surface-variant mb-2">
        {label}
        {required && <span className="text-error ml-1">*</span>}
      </label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        required={required}
        className="w-full px-4 py-3 rounded-xl border border-outline-variant/20 bg-surface-container-low text-primary focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
      />
    </div>
  );
}

interface SettlementTypeButtonProps {
  icon: React.ElementType;
  label: string;
  isActive: boolean;
  onClick: () => void;
}

function SettlementTypeButton({ icon: Icon, label, isActive, onClick }: SettlementTypeButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex-1 flex items-center gap-3 p-4 rounded-xl border-2 transition-all ${
        isActive
          ? 'border-primary bg-primary/5 text-primary'
          : 'border-outline-variant/20 bg-surface-container-low text-on-surface-variant hover:border-outline-variant/40'
      }`}
    >
      <Icon className="w-5 h-5" />
      <span className="font-bold">{label}</span>
    </button>
  );
}
