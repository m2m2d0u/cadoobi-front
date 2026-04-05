import React from 'react';
import { User, Mail, Phone, ShieldCheck } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import type { MerchantResponse } from '../../types/api';

interface MerchantOwnerInfoProps {
  merchant: MerchantResponse;
}

export function MerchantOwnerInfo({ merchant }: MerchantOwnerInfoProps) {
  const { t } = useLanguage();

  return (
    <div className="bg-surface-container-lowest rounded-3xl border border-outline-variant/10 p-8 shadow-sm">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-secondary/10 rounded-xl flex items-center justify-center">
            <User className="w-5 h-5 text-secondary" />
          </div>
          <h4 className="text-lg font-bold text-primary">{t('merchantProfile.ownerDetails')}</h4>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6 bg-surface-container-low rounded-2xl border border-outline-variant/5">
        <OwnerField
          icon={User}
          label={t('merchantProfile.fullName')}
          value={merchant.ownerFullName}
        />
        <OwnerField
          icon={Mail}
          label={t('merchantProfile.email')}
          value={merchant.ownerEmail}
        />
        <OwnerField
          icon={Phone}
          label={t('merchantProfile.phoneNumber')}
          value={merchant.ownerPhone}
        />
        <OwnerField
          icon={ShieldCheck}
          label={t('merchantProfile.ownerCni')}
          value={merchant.ownerCni || '—'}
        />
      </div>
    </div>
  );
}

interface OwnerFieldProps {
  icon: React.ElementType;
  label: string;
  value: string;
}

function OwnerField({ icon: Icon, label, value }: OwnerFieldProps) {
  return (
    <div>
      <p className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest mb-1.5 flex items-center gap-1.5">
        <Icon className="w-3 h-3" /> {label}
      </p>
      <p className="text-sm font-bold text-primary">{value}</p>
    </div>
  );
}
