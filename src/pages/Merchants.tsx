import React, { useState, useMemo } from 'react';
import {
  Store,
  Plus,
  MoreVertical,
  MapPin,
  Phone,
  Calendar,
  TrendingUp,
  X,
  ChevronRight,
  ChevronLeft,
  Building2,
  CreditCard,
  Smartphone,
  Mail,
  User
} from 'lucide-react';
import { cn } from '@/src/lib/utils';
import { useLanguage } from '../context/LanguageContext';
import { motion } from 'motion/react';
import { Button, Modal, PageHeader, SearchInput, StatusBadge } from '../components/ui';
import type { StatusType } from '../components/ui';

const initialMerchants = [
  { id: 1, name: 'Auchan Senegal', category: 'Retail', location: 'Dakar, Plateau', status: 'Active', volume: 'XOF 12.5M', joined: 'Jan 2022' },
  { id: 2, name: 'Super U Market', category: 'Retail', location: 'Dakar, Almadies', status: 'Active', volume: 'XOF 8.2M', joined: 'Mar 2022' },
  { id: 3, name: 'Baobab Pharmacy', category: 'Healthcare', location: 'Thies', status: 'Pending', volume: 'XOF 0', joined: 'Oct 2023' },
  { id: 4, name: 'Tigo Logistics', category: 'Logistics', location: 'Saint-Louis', status: 'Blocked', volume: 'XOF 4.1M', joined: 'Jun 2021' },
];

export function Merchants() {
  const { t } = useLanguage();
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All Categories');
  const [isRegisterModalOpen, setIsRegisterModalOpen] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);

  const filteredMerchants = useMemo(() => {
    return initialMerchants.filter(m => {
      const matchesSearch = m.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           m.location.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = categoryFilter === 'All Categories' || m.category === categoryFilter;
      return matchesSearch && matchesCategory;
    });
  }, [searchQuery, categoryFilter]);

  return (
    <div className="max-w-7xl mx-auto">
      <PageHeader
        title={t('merchants.title')}
        subtitle={t('merchants.subtitle')}
        actions={
          <Button
            onClick={() => { setIsRegisterModalOpen(true); setCurrentStep(1); }}
          >
            <Plus className="w-4 h-4" />
            {t('merchants.register')}
          </Button>
        }
      />

      <Modal isOpen={isRegisterModalOpen} onClose={() => setIsRegisterModalOpen(false)} size="lg">
        <div className="flex">
          {/* Sidebar Progress */}
          <div className="w-64 bg-surface-container-low p-8 border-r border-outline-variant/10">
            <div className="mb-10">
              <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center mb-4">
                <Store className="w-6 h-6 text-white" />
              </div>
              <h3 className="font-bold text-primary">{t('merchants.modal.registerTitle')}</h3>
            </div>

            <div className="space-y-6">
              {[1, 2].map((step) => (
                <div key={step} className="flex items-center gap-3">
                  <div className={cn(
                    'w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-colors',
                    currentStep === step ? 'bg-primary text-white' : 'bg-surface-container-highest text-on-surface-variant'
                  )}>{step}</div>
                  <span className={cn(
                    'text-sm font-bold transition-colors',
                    currentStep === step ? 'text-primary' : 'text-on-surface-variant'
                  )}>
                    {step === 1 ? t('merchants.modal.step1') : t('merchants.modal.step2')}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Content */}
          <div className="flex-grow p-8">
            <div className="flex justify-end mb-4">
              <button
                onClick={() => setIsRegisterModalOpen(false)}
                className="p-2 hover:bg-surface-container-high rounded-full transition-colors"
              >
                <X className="w-5 h-5 text-on-surface-variant" />
              </button>
            </div>

            {currentStep === 1 ? (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="space-y-6"
              >
                <div>
                  <h4 className="text-xl font-bold text-primary mb-1">{t('merchants.modal.step1')}</h4>
                  <p className="text-sm text-on-surface-variant">{t('merchants.modal.registerSubtitle')}</p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-primary uppercase tracking-widest">{t('merchants.modal.businessName')}</label>
                    <div className="relative">
                      <Building2 className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-on-surface-variant" />
                      <input type="text" placeholder={t('merchants.modal.businessNamePlaceholder')}
                        className="w-full bg-surface-container-high border-none rounded-lg p-4 pl-12 text-sm focus:ring-2 focus:ring-primary/20 transition-all" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-primary uppercase tracking-widest">{t('merchants.modal.merchantCode')}</label>
                    <input type="text" placeholder={t('merchants.modal.merchantCodePlaceholder')}
                      className="w-full bg-surface-container-high border-none rounded-lg p-4 text-sm focus:ring-2 focus:ring-primary/20 transition-all" />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-primary uppercase tracking-widest">{t('merchants.modal.contactPerson')}</label>
                  <div className="relative">
                    <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-on-surface-variant" />
                    <input type="text" placeholder={t('merchants.modal.contactPersonPlaceholder')}
                      className="w-full bg-surface-container-high border-none rounded-lg p-4 pl-12 text-sm focus:ring-2 focus:ring-primary/20 transition-all" />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-primary uppercase tracking-widest">{t('merchants.modal.phone')}</label>
                    <div className="relative">
                      <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-on-surface-variant" />
                      <input type="tel" placeholder="+221"
                        className="w-full bg-surface-container-high border-none rounded-lg p-4 pl-12 text-sm focus:ring-2 focus:ring-primary/20 transition-all" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-primary uppercase tracking-widest">{t('merchants.modal.email')}</label>
                    <div className="relative">
                      <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-on-surface-variant" />
                      <input type="email" placeholder="email@business.com"
                        className="w-full bg-surface-container-high border-none rounded-lg p-4 pl-12 text-sm focus:ring-2 focus:ring-primary/20 transition-all" />
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-primary uppercase tracking-widest">{t('merchants.modal.address')}</label>
                  <div className="relative">
                    <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-on-surface-variant" />
                    <input type="text" placeholder={t('merchants.modal.addressPlaceholder')}
                      className="w-full bg-surface-container-high border-none rounded-lg p-4 pl-12 text-sm focus:ring-2 focus:ring-primary/20 transition-all" />
                  </div>
                </div>

                <div className="pt-6">
                  <button
                    onClick={() => setCurrentStep(2)}
                    className="w-full bg-primary text-white py-4 rounded-xl font-bold flex items-center justify-center gap-2 hover:opacity-90 transition-all shadow-lg shadow-primary/20"
                  >
                    {t('common.next')}
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </motion.div>
            ) : (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="space-y-8"
              >
                <div>
                  <h4 className="text-xl font-bold text-primary mb-1">{t('merchants.modal.settlementDetails')}</h4>
                  <p className="text-sm text-on-surface-variant">Configure how this merchant will receive their funds.</p>
                </div>

                <div className="space-y-4">
                  <label className="text-[10px] font-bold text-primary uppercase tracking-widest">{t('merchants.modal.settlementType')}</label>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-6 bg-primary/5 border-2 border-primary rounded-2xl cursor-pointer">
                      <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                        <CreditCard className="w-6 h-6 text-primary" />
                      </div>
                      <p className="font-bold text-primary">{t('merchants.modal.bankAccount')}</p>
                      <p className="text-[10px] text-on-surface-variant mt-1">Direct bank transfer (T+1)</p>
                    </div>
                    <div className="p-6 bg-surface-container-high border-2 border-transparent rounded-2xl cursor-pointer hover:bg-surface-container-highest transition-colors">
                      <div className="w-10 h-10 bg-surface-container-lowest rounded-lg flex items-center justify-center mb-4">
                        <Smartphone className="w-6 h-6 text-on-surface-variant" />
                      </div>
                      <p className="font-bold text-on-surface-variant">{t('merchants.modal.mobileMoney')}</p>
                      <p className="text-[10px] text-on-surface-variant mt-1">Instant wallet settlement</p>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-primary uppercase tracking-widest">Bank Name</label>
                    <select className="w-full bg-surface-container-high border-none rounded-lg p-4 text-sm">
                      <option>Société Générale Sénégal</option>
                      <option>CBAO Attijariwafa Bank</option>
                      <option>Ecobank Senegal</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-primary uppercase tracking-widest">Account Number (IBAN)</label>
                    <input type="text" placeholder="SNXX XXXX XXXX XXXX XXXX XXXX XXX"
                      className="w-full bg-surface-container-high border-none rounded-lg p-4 text-sm font-mono" />
                  </div>
                </div>

                <div className="pt-6 flex gap-4">
                  <button
                    onClick={() => setCurrentStep(1)}
                    className="flex-grow py-4 rounded-xl font-bold text-on-surface-variant hover:bg-surface-container-high transition-all flex items-center justify-center gap-2"
                  >
                    <ChevronLeft className="w-4 h-4" />
                    {t('common.back')}
                  </button>
                  <button className="flex-[2] bg-primary text-white py-4 rounded-xl font-bold flex items-center justify-center gap-2 hover:opacity-90 transition-all shadow-lg shadow-primary/20">
                    {t('merchants.modal.register')}
                  </button>
                </div>
              </motion.div>
            )}
          </div>
        </div>
      </Modal>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-surface-container-low p-6 rounded-xl border border-outline-variant/10">
          <p className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest mb-1">{t('merchants.stats.active')}</p>
          <h3 className="text-3xl font-bold font-headline text-secondary">842</h3>
          <div className="mt-4 h-1 w-full bg-surface-container-highest rounded-full overflow-hidden">
            <div className="h-full bg-secondary w-[85%]" />
          </div>
        </div>
        <div className="bg-surface-container-low p-6 rounded-xl border border-outline-variant/10">
          <p className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest mb-1">{t('merchants.stats.pending')}</p>
          <h3 className="text-3xl font-bold font-headline text-amber-500">12</h3>
          <div className="mt-4 h-1 w-full bg-surface-container-highest rounded-full overflow-hidden">
            <div className="h-full bg-amber-500 w-[15%]" />
          </div>
        </div>
        <div className="bg-surface-container-low p-6 rounded-xl border border-outline-variant/10">
          <p className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest mb-1">{t('merchants.stats.blocked')}</p>
          <h3 className="text-3xl font-bold font-headline text-error">4</h3>
          <div className="mt-4 h-1 w-full bg-surface-container-highest rounded-full overflow-hidden">
            <div className="h-full bg-error w-[5%]" />
          </div>
        </div>
      </div>

      {/* Merchant list */}
      <div className="bg-surface-container-lowest rounded-xl border border-outline-variant/10 overflow-hidden">
        <div className="p-4 border-b border-outline-variant/10 flex gap-4">
          <SearchInput
            value={searchQuery}
            onChange={setSearchQuery}
            placeholder={t('merchants.filter.search')}
            className="flex-grow"
          />
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="bg-surface-container-high border-none rounded-lg text-sm px-4 py-2"
          >
            <option value="All Categories">{t('merchants.filter.allCategories')}</option>
            <option value="Retail">{t('merchants.filter.retail')}</option>
            <option value="Healthcare">{t('merchants.filter.healthcare')}</option>
            <option value="Logistics">{t('merchants.filter.logistics')}</option>
          </select>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 divide-x divide-y divide-outline-variant/10">
          {filteredMerchants.map((m) => (
            <div key={m.id} className="p-6 hover:bg-surface-container-low transition-colors group">
              <div className="flex justify-between items-start mb-6">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-primary text-white flex items-center justify-center font-bold text-xl">
                    {m.name.charAt(0)}
                  </div>
                  <div>
                    <h4 className="font-bold text-lg text-primary">{m.name}</h4>
                    <span className="text-xs font-medium text-on-surface-variant">
                      {t(`merchants.filter.${m.category.toLowerCase()}`)}
                    </span>
                  </div>
                </div>
                <button className="p-2 hover:bg-surface-container-high rounded-full transition-colors">
                  <MoreVertical className="w-5 h-5 text-on-surface-variant" />
                </button>
              </div>

              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="flex items-center gap-2 text-xs text-on-surface-variant">
                  <MapPin className="w-3.5 h-3.5" />{m.location}
                </div>
                <div className="flex items-center gap-2 text-xs text-on-surface-variant">
                  <Calendar className="w-3.5 h-3.5" />{t('merchants.card.joined')} {m.joined}
                </div>
                <div className="flex items-center gap-2 text-xs text-on-surface-variant">
                  <Phone className="w-3.5 h-3.5" />+221 77 000 00 00
                </div>
                <div className="flex items-center gap-2 text-xs font-bold text-primary">
                  <TrendingUp className="w-3.5 h-3.5 text-secondary" />{m.volume} {t('merchants.card.volume')}
                </div>
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-outline-variant/5">
                <StatusBadge
                  status={m.status as StatusType}
                  label={t(`common.${m.status.toLowerCase()}`)}
                  variant="icon"
                />
                <button className="text-xs font-bold text-primary hover:underline">{t('merchants.card.viewProfile')}</button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
