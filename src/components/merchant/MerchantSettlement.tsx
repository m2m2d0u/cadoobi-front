import React from 'react';
import { CreditCard, Building2, Smartphone, Calendar } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import type { MerchantResponse } from '../../types/api';

interface MerchantSettlementProps {
  merchant: MerchantResponse;
}

export function MerchantSettlement({ merchant }: MerchantSettlementProps) {
  const { t } = useLanguage();
  const isBankAccount = merchant.compensationAccount.type === 'BANK';

  return (
    <div className="bg-surface-container-lowest p-8 rounded-3xl border border-outline-variant/10 shadow-sm">
      <h4 className="text-lg font-bold text-primary mb-6 flex items-center gap-2">
        <CreditCard className="w-5 h-5 text-on-surface-variant" /> {t('merchantProfile.settlementRouting')}
      </h4>

      <div className={`p-6 rounded-2xl mb-6 shadow-sm border ${
        isBankAccount ? 'bg-primary/5 border-primary/20' : 'bg-secondary/5 border-secondary/20'
      }`}>
        <div className="flex items-center gap-3 mb-6">
          <div className={`w-12 h-12 rounded-xl flex items-center justify-center shadow-sm ${
            isBankAccount ? 'bg-white text-primary' : 'bg-white text-secondary'
          }`}>
            {isBankAccount ? <Building2 className="w-6 h-6" /> : <Smartphone className="w-6 h-6" />}
          </div>
          <div>
            <h5 className={`font-bold ${isBankAccount ? 'text-primary' : 'text-secondary'}`}>
              {isBankAccount ? t('merchantProfile.bankWireTransfer') : t('merchantProfile.mobileMoney')}
            </h5>
            <p className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest mt-0.5">
              {t('merchantProfile.activePayoutEndpoint')}
            </p>
          </div>
        </div>

        {isBankAccount ? (
          <div className="space-y-4 pt-4 border-t border-outline-variant/10">
            <SettlementField
              label={t('merchantProfile.bankName')}
              value={merchant.compensationAccount.bankName || ''}
            />
            <SettlementField
              label={t('merchantProfile.accountNumber')}
              value={merchant.compensationAccount.accountNumber || ''}
              mono
            />
          </div>
        ) : (
          <div className="space-y-4 pt-4 border-t border-outline-variant/10">
            <SettlementField
              label={t('merchantProfile.telecomOperator')}
              value={merchant.compensationAccount.operatorCode || ''}
              uppercase
            />
            <SettlementField
              label={t('merchantProfile.walletEndpoint')}
              value={merchant.compensationAccount.operatorPhone || ''}
              mono
            />
          </div>
        )}
      </div>

      <div className="flex flex-col gap-3">
        <MetaField
          icon={Calendar}
          label={t('merchantProfile.joinedDate')}
          value={new Date(merchant.createdAt).toLocaleDateString()}
        />
        <MetaField
          icon={Calendar}
          label={t('merchantProfile.lastUpdated')}
          value={new Date(merchant.updatedAt).toLocaleDateString()}
        />
      </div>
    </div>
  );
}

interface SettlementFieldProps {
  label: string;
  value: string;
  mono?: boolean;
  uppercase?: boolean;
}

function SettlementField({ label, value, mono, uppercase }: SettlementFieldProps) {
  return (
    <div>
      <p className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest mb-1">{label}</p>
      <p className={`text-sm font-bold text-primary bg-white/50 px-3 py-2 rounded-lg ${
        mono ? 'font-mono' : ''
      } ${uppercase ? 'uppercase' : ''}`}>
        {value}
      </p>
    </div>
  );
}

interface MetaFieldProps {
  icon: React.ElementType;
  label: string;
  value: string;
}

function MetaField({ icon: Icon, label, value }: MetaFieldProps) {
  return (
    <div className="flex justify-between items-center p-4 bg-surface-container-low rounded-xl border border-outline-variant/5">
      <div className="flex items-center gap-2">
        <Icon className="w-4 h-4 text-on-surface-variant" />
        <span className="text-sm text-on-surface-variant font-bold">{label}</span>
      </div>
      <span className="text-sm font-bold text-primary">{value}</span>
    </div>
  );
}
