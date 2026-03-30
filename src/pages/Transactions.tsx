import React, { useState, useMemo } from 'react';
import {
  Download,
  Plus,
  Filter,
  ChevronRight,
  ChevronLeft,
  Eye,
  Copy,
  ReceiptText,
  Store
} from 'lucide-react';
import { cn } from '@/src/lib/utils';
import { useLanguage } from '../context/LanguageContext';
import { Button, IconButton, PageHeader, SearchInput, StatusBadge } from '../components/ui';
import type { StatusType } from '../components/ui';

const initialTransactions = [
  { ref: '#TXN-8829104', merchant: 'Boulangerie Sunu', phone: '+221 77 402 11 92', amount: '25,500.00', operator: 'Orange Money', status: 'Success', time: 'Oct 24, 2023 • 14:32' },
  { ref: '#TXN-8829105', merchant: 'Supermarché Malik', phone: '+221 76 550 44 21', amount: '120,000.00', operator: 'Wave', status: 'Pending', time: 'Oct 24, 2023 • 14:15' },
  { ref: '#TXN-8829106', merchant: 'Pharmacie Thiaroye', phone: '+221 78 123 99 00', amount: '8,450.00', operator: 'Free Money', status: 'Failed', time: 'Oct 24, 2023 • 13:58' },
  { ref: '#TXN-8829107', merchant: 'Tigo Logistics', phone: '+221 70 888 22 11', amount: '45,000.00', operator: 'E-Money', status: 'Success', time: 'Oct 24, 2023 • 12:44' },
];

export function Transactions() {
  const { t } = useLanguage();
  const [statusFilter, setStatusFilter] = useState('All Statuses');
  const [operatorFilter, setOperatorFilter] = useState('All Operators');
  const [merchantSearch, setMerchantSearch] = useState('');

  const filteredTransactions = useMemo(() => {
    return initialTransactions.filter(tx => {
      const matchesStatus = statusFilter === 'All Statuses' || tx.status === statusFilter;
      const matchesOperator = operatorFilter === 'All Operators' || tx.operator === operatorFilter;
      const matchesMerchant = tx.merchant.toLowerCase().includes(merchantSearch.toLowerCase());
      return matchesStatus && matchesOperator && matchesMerchant;
    });
  }, [statusFilter, operatorFilter, merchantSearch]);

  const resetFilters = () => {
    setStatusFilter('All Statuses');
    setOperatorFilter('All Operators');
    setMerchantSearch('');
  };

  return (
    <div className="max-w-7xl mx-auto">
      <PageHeader
        title={t('transactions.title')}
        subtitle={t('transactions.subtitle')}
        breadcrumb={[{ label: t('nav.dashboard') }, { label: t('nav.transactions') }]}
        actions={
          <>
            <Button variant="secondary">
              <Download className="w-4 h-4" />
              {t('transactions.export')}
            </Button>
            <Button>
              <Plus className="w-4 h-4" />
              {t('transactions.initiate')}
            </Button>
          </>
        }
      />

      <section className="bg-surface-container-low p-6 rounded-xl mb-8">
        <div className="grid grid-cols-1 md:grid-cols-4 lg:grid-cols-5 gap-6">
          <div className="space-y-2">
            <label className="text-xs font-bold text-on-surface-variant uppercase tracking-wider block">{t('transactions.filter.status')}</label>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full bg-surface-container-lowest border-none rounded-lg text-sm py-2.5 focus:ring-2 focus:ring-secondary/20"
            >
              <option value="All Statuses">{t('transactions.filter.allStatus')}</option>
              <option value="Success">{t('common.success')}</option>
              <option value="Pending">{t('common.pending')}</option>
              <option value="Failed">{t('common.failed')}</option>
            </select>
          </div>
          <div className="space-y-2">
            <label className="text-xs font-bold text-on-surface-variant uppercase tracking-wider block">{t('transactions.filter.dateRange')}</label>
            <div className="flex gap-2">
              <button className="px-3 py-2 text-xs font-medium bg-primary text-white rounded-lg">{t('transactions.filter.today')}</button>
              <button className="px-3 py-2 text-xs font-medium bg-surface-container-highest text-primary rounded-lg hover:bg-surface-container-high transition-colors">{t('transactions.filter.yesterday')}</button>
              <button className="px-3 py-2 text-xs font-medium bg-surface-container-highest text-primary rounded-lg hover:bg-surface-container-high transition-colors">{t('transactions.filter.custom')}</button>
            </div>
          </div>
          <div className="space-y-2">
            <label className="text-xs font-bold text-on-surface-variant uppercase tracking-wider block">{t('transactions.filter.merchant')}</label>
            <SearchInput
              value={merchantSearch}
              onChange={setMerchantSearch}
              placeholder={t('transactions.filter.searchMerchant')}
              icon={Store}
            />
          </div>
          <div className="space-y-2">
            <label className="text-xs font-bold text-on-surface-variant uppercase tracking-wider block">{t('transactions.filter.operator')}</label>
            <select
              value={operatorFilter}
              onChange={(e) => setOperatorFilter(e.target.value)}
              className="w-full bg-surface-container-lowest border-none rounded-lg text-sm py-2.5 focus:ring-2 focus:ring-secondary/20"
            >
              <option value="All Operators">{t('transactions.filter.allOperators')}</option>
              <option value="Orange Money">{t('common.operator.orange')}</option>
              <option value="Free Money">{t('common.operator.free')}</option>
              <option value="Wave">{t('common.operator.wave')}</option>
              <option value="E-Money">{t('common.operator.emoney')}</option>
            </select>
          </div>
          <div className="flex items-end pb-1">
            <button
              onClick={resetFilters}
              className="text-sm font-semibold text-secondary hover:underline flex items-center gap-1"
            >
              <Filter className="w-4 h-4" />
              {t('transactions.filter.reset')}
            </button>
          </div>
        </div>
      </section>

      <div className="bg-surface-container-lowest rounded-xl shadow-sm overflow-hidden border border-outline-variant/10">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-surface-container-high/50 border-b border-outline-variant/10">
              <th className="px-6 py-4 text-[11px] font-bold text-on-surface-variant uppercase tracking-widest">{t('transactions.table.ref')}</th>
              <th className="px-6 py-4 text-[11px] font-bold text-on-surface-variant uppercase tracking-widest">{t('transactions.table.merchant')}</th>
              <th className="px-6 py-4 text-[11px] font-bold text-on-surface-variant uppercase tracking-widest">{t('transactions.table.phone')}</th>
              <th className="px-6 py-4 text-[11px] font-bold text-on-surface-variant uppercase tracking-widest text-right">{t('transactions.table.amount')}</th>
              <th className="px-6 py-4 text-[11px] font-bold text-on-surface-variant uppercase tracking-widest">{t('transactions.table.operator')}</th>
              <th className="px-6 py-4 text-[11px] font-bold text-on-surface-variant uppercase tracking-widest">{t('transactions.table.status')}</th>
              <th className="px-6 py-4 text-[11px] font-bold text-on-surface-variant uppercase tracking-widest">{t('transactions.table.date')}</th>
              <th className="px-6 py-4 text-[11px] font-bold text-on-surface-variant uppercase tracking-widest text-center">{t('transactions.table.actions')}</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-outline-variant/5">
            {filteredTransactions.map((tx) => (
              <tr key={tx.ref} className="hover:bg-surface-container-low transition-colors group">
                <td className="px-6 py-4">
                  <span className="text-sm font-semibold text-primary underline decoration-dotted underline-offset-4 cursor-pointer">{tx.ref}</span>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-primary-fixed-dim flex items-center justify-center text-primary text-xs font-bold">
                      {tx.merchant.substring(0, 2).toUpperCase()}
                    </div>
                    <span className="text-sm font-medium text-on-surface">{tx.merchant}</span>
                  </div>
                </td>
                <td className="px-6 py-4 text-sm tabular-nums text-on-surface-variant">{tx.phone}</td>
                <td className="px-6 py-4 text-right text-sm font-bold tabular-nums text-primary">{tx.amount}</td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-2">
                    <div className={cn(
                      'w-6 h-6 rounded-full flex items-center justify-center text-[10px] text-white font-bold',
                      tx.operator.includes('Orange') ? 'bg-orange-500' : tx.operator.includes('Wave') ? 'bg-blue-600' : 'bg-red-600'
                    )}>
                      {tx.operator.substring(0, 2).toUpperCase()}
                    </div>
                    <span className="text-xs font-medium text-on-surface-variant">{tx.operator}</span>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <StatusBadge
                    status={tx.status as StatusType}
                    label={t(`common.${tx.status.toLowerCase()}`)}
                    variant="dot"
                  />
                </td>
                <td className="px-6 py-4 text-xs text-on-surface-variant tabular-nums">{tx.time}</td>
                <td className="px-6 py-4">
                  <div className="flex items-center justify-center gap-3">
                    <IconButton icon={Eye} />
                    <IconButton icon={Copy} />
                    <IconButton icon={ReceiptText} hoverColor="secondary" />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="px-6 py-4 bg-surface-container-low flex justify-between items-center">
          <p className="text-xs text-on-surface-variant font-medium">
            {t('transactions.pagination.showing')} 1-{filteredTransactions.length} {t('transactions.pagination.of')} 1,284 {t('transactions.pagination.transactions')}
          </p>
          <div className="flex items-center gap-2">
            <button className="w-8 h-8 flex items-center justify-center rounded-lg bg-surface-container-highest text-on-surface-variant hover:text-primary transition-colors disabled:opacity-50" disabled>
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button className="w-8 h-8 flex items-center justify-center rounded-lg bg-primary text-white text-xs font-bold">1</button>
            <button className="w-8 h-8 flex items-center justify-center rounded-lg bg-surface-container-lowest text-on-surface hover:bg-surface-container-highest transition-all text-xs font-bold">2</button>
            <button className="w-8 h-8 flex items-center justify-center rounded-lg bg-surface-container-lowest text-on-surface hover:bg-surface-container-highest transition-all text-xs font-bold">3</button>
            <span className="text-on-surface-variant px-1">...</span>
            <button className="w-8 h-8 flex items-center justify-center rounded-lg bg-surface-container-lowest text-on-surface hover:bg-surface-container-highest transition-all text-xs font-bold">52</button>
            <button className="w-8 h-8 flex items-center justify-center rounded-lg bg-surface-container-highest text-on-surface hover:text-primary transition-colors">
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
