import React from 'react';
import { ShieldCheck, CheckCircle, AlertCircle, ShieldAlert } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import { MerchantStatus } from '../../types/enums';

interface MerchantStatusActionsProps {
  currentStatus: MerchantStatus;
  onStatusChange: (status: MerchantStatus) => void;
  isLoading: boolean;
}

export function MerchantStatusActions({ currentStatus, onStatusChange, isLoading }: MerchantStatusActionsProps) {
  const { t } = useLanguage();

  return (
    <div className="bg-surface-container-lowest p-8 rounded-3xl border border-outline-variant/10 shadow-sm">
      <h4 className="text-lg font-bold text-primary mb-6 flex items-center gap-2">
        <ShieldCheck className="w-5 h-5 text-on-surface-variant" /> {t('merchantProfile.statusToggle.manageStatus')}
      </h4>

      <div className="flex flex-col gap-3">
        {currentStatus !== MerchantStatus.ACTIVE && (
          <StatusButton
            icon={CheckCircle}
            label={t('merchantProfile.statusToggle.activate')}
            onClick={() => onStatusChange(MerchantStatus.ACTIVE)}
            disabled={isLoading}
            variant="success"
          />
        )}

        {currentStatus !== MerchantStatus.SUSPENDED && (
          <StatusButton
            icon={AlertCircle}
            label={t('merchantProfile.statusToggle.suspend')}
            onClick={() => onStatusChange(MerchantStatus.SUSPENDED)}
            disabled={isLoading}
            variant="warning"
          />
        )}

        {currentStatus !== MerchantStatus.BLOCKED && (
          <StatusButton
            icon={ShieldAlert}
            label={t('merchantProfile.statusToggle.block')}
            onClick={() => onStatusChange(MerchantStatus.BLOCKED)}
            disabled={isLoading}
            variant="danger"
          />
        )}
      </div>
    </div>
  );
}

interface StatusButtonProps {
  icon: React.ElementType;
  label: string;
  onClick: () => void;
  disabled: boolean;
  variant: 'success' | 'warning' | 'danger';
}

function StatusButton({ icon: Icon, label, onClick, disabled, variant }: StatusButtonProps) {
  const variantClasses = {
    success: 'bg-emerald-50/50 hover:bg-emerald-50 border-emerald-200 text-emerald-700',
    warning: 'bg-orange-50/50 hover:bg-orange-50 border-orange-200 text-orange-700',
    danger: 'bg-rose-50/50 hover:bg-rose-50 border-rose-200 text-rose-700',
  };

  const iconColors = {
    success: 'text-emerald-500',
    warning: 'text-orange-500',
    danger: 'text-rose-500',
  };

  const dotColors = {
    success: 'bg-emerald-400',
    warning: 'bg-orange-400',
    danger: 'bg-rose-400',
  };

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`flex items-center justify-between p-4 border rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed group ${variantClasses[variant]}`}
    >
      <div className="flex items-center gap-3">
        <Icon className={`w-5 h-5 ${iconColors[variant]}`} />
        <span className="font-bold">{label}</span>
      </div>
      <div className={`w-2 h-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity ${dotColors[variant]}`}></div>
    </button>
  );
}
