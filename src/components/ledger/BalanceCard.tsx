import React from 'react';
import { Wallet, Lock, TrendingUp } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import type { MerchantBalanceResponse } from '../../types/api';

interface BalanceCardProps {
  balance: MerchantBalanceResponse;
}

export function BalanceCard({ balance }: BalanceCardProps) {
  const { t } = useLanguage();

  const formatAmount = (amount: number) => {
    return new Intl.NumberFormat('fr-FR', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(amount);
  };

  return (
    <div className="bg-surface-container-lowest rounded-2xl border border-outline-variant/10 overflow-hidden shadow-sm">
      <div className="p-6 border-b border-outline-variant/10">
        <div className="flex items-center gap-3 mb-1">
          <Wallet className="w-6 h-6 text-primary" />
          <h3 className="text-xl font-bold text-primary">{t('ledger.balance.title')}</h3>
        </div>
        <p className="text-xs text-on-surface-variant ml-9">{balance.currency}</p>
      </div>

      <div className="p-6 space-y-6">
        {/* Total Balance */}
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-secondary" />
            <p className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest">
              {t('ledger.balance.total')}
            </p>
          </div>
          <p className="text-3xl font-bold text-primary">
            {formatAmount(balance.balance)} <span className="text-lg text-on-surface-variant">{balance.currency}</span>
          </p>
        </div>

        {/* Locked Balance */}
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <Lock className="w-4 h-4 text-error" />
            <p className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest">
              {t('ledger.balance.locked')}
            </p>
          </div>
          <p className="text-xl font-bold text-error">
            {formatAmount(balance.lockedBalance)} <span className="text-sm text-on-surface-variant">{balance.currency}</span>
          </p>
          <p className="text-xs text-on-surface-variant">
            {t('ledger.balance.lockedDesc')}
          </p>
        </div>

        {/* Available Balance */}
        <div className="pt-4 border-t border-outline-variant/10">
          <div className="space-y-2">
            <p className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest">
              {t('ledger.balance.available')}
            </p>
            <p className="text-2xl font-bold text-secondary">
              {formatAmount(balance.availableBalance)} <span className="text-base text-on-surface-variant">{balance.currency}</span>
            </p>
            <p className="text-xs text-on-surface-variant">
              {t('ledger.balance.availableDesc')}
            </p>
          </div>
        </div>

        {/* Last Updated */}
        <div className="pt-4 border-t border-outline-variant/10">
          <p className="text-[10px] text-on-surface-variant">
            {t('ledger.balance.lastUpdated')}: {new Date(balance.updatedAt).toLocaleString('fr-FR')}
          </p>
        </div>
      </div>
    </div>
  );
}
