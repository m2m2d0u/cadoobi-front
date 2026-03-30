import React from 'react';
import {
  Plus,
  Filter,
  Download,
  Gift,
  CheckCircle2,
  Clock,
  Tag,
  ArrowRight
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { Button, PageHeader, SearchInput, StatsCard, StatusBadge } from '../components/ui';
import type { StatusType } from '../components/ui';

const giftCards = [
  { id: 'GC-8821', merchant: 'Auchan Senegal', type: 'Digital', value: 'XOF 50,000', status: 'Active', expiry: 'Dec 2026', code: '****-****-8821' },
  { id: 'GC-4410', merchant: 'Super U', type: 'Physical', value: 'XOF 25,000', status: 'Redeemed', expiry: 'Mar 2026', code: '****-****-4410' },
  { id: 'GC-9012', merchant: 'Baobab Pharmacy', type: 'Digital', value: 'XOF 10,000', status: 'Active', expiry: 'Jan 2027', code: '****-****-9012' },
  { id: 'GC-3321', merchant: 'Citydia', type: 'Digital', value: 'XOF 100,000', status: 'Expired', expiry: 'Feb 2026', code: '****-****-3321' },
];

export function GiftCards() {
  const { t } = useLanguage();

  return (
    <div className="max-w-7xl mx-auto">
      <PageHeader
        title={t('giftcards.title')}
        subtitle={t('giftcards.subtitle')}
        actions={
          <Button>
            <Plus className="w-4 h-4" />
            {t('giftcards.issue')}
          </Button>
        }
      />

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-10">
        <StatsCard
          label={t('giftcards.stats.totalIssued')}
          value="14,205"
          icon={Gift}
          iconColor="primary"
          desc={t('giftcards.stats.issuedDesc')}
          descColor="secondary"
        />
        <StatsCard
          label={t('giftcards.stats.redemptionRate')}
          value="68.4%"
          icon={CheckCircle2}
          iconColor="secondary"
          desc={t('giftcards.stats.redemptionDesc')}
          descColor="secondary"
        />
        <StatsCard
          label={t('giftcards.stats.pendingActivation')}
          value="412"
          icon={Clock}
          iconColor="amber"
          desc={t('giftcards.stats.pendingDesc')}
          descColor="muted"
        />
        <StatsCard
          label={t('giftcards.stats.expiredValue')}
          value="XOF 2.4M"
          icon={Tag}
          iconColor="error"
          desc={t('giftcards.stats.expiredDesc')}
          descColor="error"
        />
      </div>

      <div className="bg-surface-container-lowest rounded-2xl border border-outline-variant/10 overflow-hidden shadow-sm">
        <div className="p-4 border-b border-outline-variant/10 flex flex-wrap gap-4 items-center justify-between">
          <div className="flex gap-4 flex-grow max-w-2xl">
            <SearchInput
              value=""
              onChange={() => {}}
              placeholder={t('giftcards.search.placeholder')}
              className="flex-grow"
            />
            <button className="flex items-center gap-2 px-4 py-2 bg-surface-container-high rounded-lg text-sm font-bold text-primary">
              <Filter className="w-4 h-4" />
              {t('transactions.filter.title')}
            </button>
          </div>
          <button className="flex items-center gap-2 px-4 py-2 text-on-surface-variant hover:text-primary transition-colors text-sm font-bold">
            <Download className="w-4 h-4" />
            {t('transactions.export')}
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-surface-container-low border-b border-outline-variant/10">
                <th className="px-6 py-4 text-[10px] font-bold text-on-surface-variant uppercase tracking-widest">{t('giftcards.table.cardId')}</th>
                <th className="px-6 py-4 text-[10px] font-bold text-on-surface-variant uppercase tracking-widest">{t('giftcards.table.merchant')}</th>
                <th className="px-6 py-4 text-[10px] font-bold text-on-surface-variant uppercase tracking-widest">{t('giftcards.table.value')}</th>
                <th className="px-6 py-4 text-[10px] font-bold text-on-surface-variant uppercase tracking-widest">{t('giftcards.table.status')}</th>
                <th className="px-6 py-4 text-[10px] font-bold text-on-surface-variant uppercase tracking-widest">{t('giftcards.table.expiry')}</th>
                <th className="px-6 py-4 text-[10px] font-bold text-on-surface-variant uppercase tracking-widest">{t('giftcards.table.actions')}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-outline-variant/5">
              {giftCards.map((card) => (
                <tr key={card.id} className="hover:bg-surface-container-low/50 transition-colors group">
                  <td className="px-6 py-4">
                    <div className="flex flex-col">
                      <span className="font-bold text-primary text-sm">{card.id}</span>
                      <span className="text-[10px] font-mono text-on-surface-variant">{card.code}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded bg-primary/10 text-primary flex items-center justify-center text-[10px] font-bold">
                        {card.merchant.charAt(0)}
                      </div>
                      <span className="text-sm font-medium text-primary">{card.merchant}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 font-bold text-primary text-sm">{card.value}</td>
                  <td className="px-6 py-4">
                    <StatusBadge
                      status={card.status as StatusType}
                      label={card.status === 'Active' ? t('common.active') : card.status === 'Redeemed' ? t('common.redeemed') : t('common.expired')}
                      variant="badge"
                    />
                  </td>
                  <td className="px-6 py-4 text-sm text-on-surface-variant">{card.expiry}</td>
                  <td className="px-6 py-4">
                    <button className="p-2 hover:bg-surface-container-high rounded-full transition-colors opacity-0 group-hover:opacity-100">
                      <ArrowRight className="w-4 h-4 text-primary" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="p-4 border-t border-outline-variant/10 flex justify-center">
          <button className="text-xs font-bold text-primary hover:underline">{t('giftcards.history')}</button>
        </div>
      </div>
    </div>
  );
}
