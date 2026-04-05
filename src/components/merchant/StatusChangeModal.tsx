import React from 'react';
import { CheckCircle, AlertCircle, ShieldAlert, X } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import { Modal, Button } from '../ui';
import { MerchantStatus } from '../../types/enums';
import type { MerchantResponse } from '../../types/api';

interface StatusChangeModalProps {
  isOpen: boolean;
  onClose: () => void;
  merchant: MerchantResponse;
  pendingStatus: MerchantStatus | null;
  onConfirm: () => void;
  isLoading: boolean;
}

export function StatusChangeModal({
  isOpen,
  onClose,
  merchant,
  pendingStatus,
  onConfirm,
  isLoading
}: StatusChangeModalProps) {
  const { t } = useLanguage();

  if (!pendingStatus) return null;

  const getStatusIcon = () => {
    switch (pendingStatus) {
      case MerchantStatus.ACTIVE:
        return <CheckCircle className="w-6 h-6 text-emerald-500" />;
      case MerchantStatus.SUSPENDED:
        return <AlertCircle className="w-6 h-6 text-orange-500" />;
      case MerchantStatus.BLOCKED:
        return <ShieldAlert className="w-6 h-6 text-rose-500" />;
      default:
        return null;
    }
  };

  const getStatusTitle = () => {
    switch (pendingStatus) {
      case MerchantStatus.ACTIVE:
        return t('merchantProfile.statusToggle.activate');
      case MerchantStatus.SUSPENDED:
        return t('merchantProfile.statusToggle.suspend');
      case MerchantStatus.BLOCKED:
        return t('merchantProfile.statusToggle.block');
      default:
        return '';
    }
  };

  const getConfirmMessage = () => {
    switch (pendingStatus) {
      case MerchantStatus.ACTIVE:
        return t('merchantProfile.statusToggle.confirmActivate');
      case MerchantStatus.SUSPENDED:
        return t('merchantProfile.statusToggle.confirmSuspend');
      case MerchantStatus.BLOCKED:
        return t('merchantProfile.statusToggle.confirmBlock');
      default:
        return '';
    }
  };

  const getButtonColor = () => {
    switch (pendingStatus) {
      case MerchantStatus.ACTIVE:
        return 'bg-emerald-500 hover:bg-emerald-600 shadow-emerald-500/20';
      case MerchantStatus.SUSPENDED:
        return 'bg-orange-500 hover:bg-orange-600 shadow-orange-500/20';
      case MerchantStatus.BLOCKED:
        return 'bg-rose-500 hover:bg-rose-600 shadow-rose-500/20';
      default:
        return '';
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={() => !isLoading && onClose()} size="md">
      <div className="p-8">
        <div className="flex justify-between items-center mb-6 pb-4 border-b border-outline-variant/10">
          <div className="flex items-center gap-3">
            {getStatusIcon()}
            <h3 className="text-xl font-bold text-primary">{getStatusTitle()}</h3>
          </div>
          <button
            onClick={() => !isLoading && onClose()}
            className="p-2 hover:bg-surface-container-high rounded-full transition-colors"
          >
            <X className="w-5 h-5 text-on-surface-variant" />
          </button>
        </div>

        <div className="mb-8">
          <p className="text-on-surface-variant text-sm leading-relaxed">{getConfirmMessage()}</p>

          <div className="mt-6 p-4 bg-surface-container-low rounded-xl border border-outline-variant/10">
            <div className="flex items-center gap-3 mb-2">
              {merchant.logoUrl ? (
                <img src={merchant.logoUrl} alt={merchant.name} className="w-10 h-10 rounded-lg object-cover" />
              ) : (
                <div className="w-10 h-10 rounded-lg bg-primary/10 text-primary flex items-center justify-center font-bold">
                  {merchant.name.charAt(0)}
                </div>
              )}
              <div>
                <p className="font-bold text-primary">{merchant.name}</p>
                <p className="text-xs text-on-surface-variant">{merchant.code}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="flex gap-4">
          <button
            type="button"
            onClick={onClose}
            disabled={isLoading}
            className="flex-1 px-6 py-4 rounded-xl text-on-surface-variant font-bold hover:bg-surface-container-high transition-colors disabled:opacity-50"
          >
            {t('merchantProfile.statusToggle.cancel')}
          </button>
          <Button
            onClick={onConfirm}
            disabled={isLoading}
            className={`flex-1 py-4 shadow-lg ${getButtonColor()}`}
          >
            {isLoading ? (
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                <span>Processing...</span>
              </div>
            ) : (
              t('merchantProfile.statusToggle.confirm')
            )}
          </Button>
        </div>
      </div>
    </Modal>
  );
}
