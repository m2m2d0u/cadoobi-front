import React from 'react';
import { 
  Ticket, 
  Plus, 
  Search, 
  Filter, 
  Download, 
  Gift, 
  History, 
  BarChart2,
  CheckCircle2,
  Clock,
  Tag,
  ArrowRight
} from 'lucide-react';
import { cn } from '@/src/lib/utils';
import { useLanguage } from '../context/LanguageContext';

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
      <div className="flex justify-between items-end mb-8">
        <div>
          <h2 className="text-3xl font-bold font-headline text-primary tracking-tight">{t('giftcards.title')}</h2>
          <p className="text-on-surface-variant text-sm mt-1">{t('giftcards.subtitle')}</p>
        </div>
        <button className="flex items-center gap-2 px-6 py-2.5 bg-primary text-white font-semibold text-sm rounded shadow-lg shadow-primary/10 hover:translate-y-[-1px] transition-all">
          <Plus className="w-4 h-4" />
          {t('giftcards.issue')}
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-10">
        <div className="bg-surface-container-low p-6 rounded-2xl border border-outline-variant/10">
          <div className="w-10 h-10 bg-primary/10 text-primary rounded-lg flex items-center justify-center mb-4">
            <Gift className="w-5 h-5" />
          </div>
          <p className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest mb-1">{t('giftcards.stats.totalIssued')}</p>
          <h3 className="text-2xl font-bold text-primary">14,205</h3>
          <p className="text-[10px] text-secondary font-bold mt-2">{t('giftcards.stats.issuedDesc')}</p>
        </div>
        <div className="bg-surface-container-low p-6 rounded-2xl border border-outline-variant/10">
          <div className="w-10 h-10 bg-secondary/10 text-secondary rounded-lg flex items-center justify-center mb-4">
            <CheckCircle2 className="w-5 h-5" />
          </div>
          <p className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest mb-1">{t('giftcards.stats.redemptionRate')}</p>
          <h3 className="text-2xl font-bold text-primary">68.4%</h3>
          <p className="text-[10px] text-secondary font-bold mt-2">{t('giftcards.stats.redemptionDesc')}</p>
        </div>
        <div className="bg-surface-container-low p-6 rounded-2xl border border-outline-variant/10">
          <div className="w-10 h-10 bg-amber-500/10 text-amber-600 rounded-lg flex items-center justify-center mb-4">
            <Clock className="w-5 h-5" />
          </div>
          <p className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest mb-1">{t('giftcards.stats.pendingActivation')}</p>
          <h3 className="text-2xl font-bold text-primary">412</h3>
          <p className="text-[10px] text-on-surface-variant font-bold mt-2">{t('giftcards.stats.pendingDesc')}</p>
        </div>
        <div className="bg-surface-container-low p-6 rounded-2xl border border-outline-variant/10">
          <div className="w-10 h-10 bg-error/10 text-error rounded-lg flex items-center justify-center mb-4">
            <Tag className="w-5 h-5" />
          </div>
          <p className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest mb-1">{t('giftcards.stats.expiredValue')}</p>
          <h3 className="text-2xl font-bold text-primary">XOF 2.4M</h3>
          <p className="text-[10px] text-error font-bold mt-2">{t('giftcards.stats.expiredDesc')}</p>
        </div>
      </div>

      <div className="bg-surface-container-lowest rounded-2xl border border-outline-variant/10 overflow-hidden shadow-sm">
        <div className="p-4 border-b border-outline-variant/10 flex flex-wrap gap-4 items-center justify-between">
          <div className="flex gap-4 flex-grow max-w-2xl">
            <div className="relative flex-grow">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant w-4 h-4" />
              <input className="w-full bg-surface-container-high border-none rounded-lg text-sm py-2 pl-10" placeholder={t('giftcards.search.placeholder')} type="text"/>
            </div>
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
                    <span className={cn(
                      "px-2 py-1 rounded text-[10px] font-bold uppercase tracking-wider",
                      card.status === 'Active' ? "bg-secondary/10 text-secondary" : 
                      card.status === 'Redeemed' ? "bg-primary/10 text-primary" : "bg-error/10 text-error"
                    )}>
                      {card.status === 'Active' ? t('common.active') : card.status === 'Redeemed' ? t('common.redeemed') : t('common.expired')}
                    </span>
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
