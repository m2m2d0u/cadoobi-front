import React, { useState, useEffect } from 'react';
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
  User,
  RefreshCw,
  ShieldAlert
} from 'lucide-react';
import { cn } from '@/src/lib/utils';
import { useLanguage } from '../context/LanguageContext';
import { motion } from 'framer-motion';
import { Button, Modal, PageHeader, SearchInput, StatusBadge, Pagination } from '../components/ui';
import type { StatusType } from '../components/ui';
import { merchantsService } from '../services';
import type { MerchantResponse, CreateMerchantRequest, CompensationAccountDto } from '../types/api';
import { CompensationAccountType } from '../types/enums';
import { useNavigate } from 'react-router-dom';
import { PermissionGuard } from '../components/auth';
import { MERCHANT_CREATE, MERCHANT_READ, MERCHANT_UPDATE } from '../lib/permissions';

export function Merchants() {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All Categories');
  
  const [merchants, setMerchants] = useState<MerchantResponse[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Pagination State
  const [currentPage, setCurrentPage] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [totalElements, setTotalElements] = useState(0);
  const [totalPages, setTotalPages] = useState(0);

  const [isRegisterModalOpen, setIsRegisterModalOpen] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [isActionLoading, setIsActionLoading] = useState(false);

  const initialFormState: CreateMerchantRequest = {
    code: '',
    name: '',
    phone: '',
    businessType: 'Retail',
    email: '',
    address: '',
    country: 'Senegal',
    ownerFullName: '',
    ownerEmail: '',
    ownerPhone: '',
    compensationAccount: {
      type: CompensationAccountType.BANK,
      bankName: '',
      accountNumber: '',
      operatorCode: '',
      operatorPhone: ''
    }
  };
  const [formData, setFormData] = useState<CreateMerchantRequest>(initialFormState);

  const fetchMerchants = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const data = await merchantsService.list({ page: currentPage, size: pageSize });
      setMerchants(data?.data || []);
      setTotalElements(data?.pagination?.totalElements || 0);
      setTotalPages(data?.pagination?.totalPages || 0);
    } catch (err: any) {
      console.error(err);
      setError(err?.response?.data?.message || 'Failed to fetch merchants directory');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchMerchants();
  }, [currentPage, pageSize]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setIsActionLoading(true);
      setError(null);
      await merchantsService.create(formData);
      setIsRegisterModalOpen(false);
      setCurrentStep(1);
      setFormData(initialFormState);
      fetchMerchants();
    } catch (err: any) {
      console.error(err);
      setError(err?.response?.data?.message || 'Failed to register merchant');
    } finally {
      setIsActionLoading(false);
    }
  };

  const handleSettlementTypeChange = (type: CompensationAccountType) => {
    setFormData({
      ...formData,
      compensationAccount: {
        ...formData.compensationAccount,
        type,
        bankName: type === CompensationAccountType.BANK ? formData.compensationAccount.bankName : '',
        accountNumber: type === CompensationAccountType.BANK ? formData.compensationAccount.accountNumber : '',
        operatorCode: type === CompensationAccountType.OPERATOR ? formData.compensationAccount.operatorCode : '',
        operatorPhone: type === CompensationAccountType.OPERATOR ? formData.compensationAccount.operatorPhone : '',
      }
    });
  };

  const activeCount = merchants.filter(m => m.status === 'ACTIVE').length;
  const pendingCount = merchants.filter(m => m.status === 'PENDING').length;
  const blockedCount = merchants.filter(m => m.status === 'BLOCKED' || m.status === 'SUSPENDED').length;

  const filteredMerchants = merchants.filter(m => {
    const matchesSearch = m.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         m.address.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         m.code.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = categoryFilter === 'All Categories' || m.businessType === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="max-w-7xl mx-auto">
      <PageHeader
        title={t('merchants.title')}
        subtitle={t('merchants.subtitle')}
        actions={
          <div className="flex items-center gap-3">
            <Button variant="outline" onClick={fetchMerchants} disabled={isLoading}>
              <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
              {t('common.refresh')}
            </Button>
            <PermissionGuard permission={MERCHANT_CREATE}>
              <Button
                onClick={() => { setIsRegisterModalOpen(true); setCurrentStep(1); setError(null); }}
              >
                <Plus className="w-4 h-4" />
                {t('merchants.register')}
              </Button>
            </PermissionGuard>
          </div>
        }
      />

      <Modal isOpen={isRegisterModalOpen} onClose={() => !isActionLoading && setIsRegisterModalOpen(false)} size="lg">
        <div className="flex flex-col md:flex-row">
          {/* Sidebar Progress */}
          <div className="w-full md:w-64 bg-surface-container-low p-8 border-b md:border-b-0 md:border-r border-outline-variant/10">
            <div className="mb-10 hidden md:block">
              <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center mb-4">
                <Store className="w-6 h-6 text-white" />
              </div>
              <h3 className="font-bold text-primary">{t('merchants.modal.registerTitle')}</h3>
            </div>

            <div className="flex md:flex-col gap-6">
              {[1, 2].map((step) => (
                <div key={step} className="flex items-center gap-3">
                  <div className={cn(
                    'w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-colors shadow-sm',
                    currentStep === step ? 'bg-primary text-white shadow-primary/20' : 'bg-surface-container-highest text-on-surface-variant'
                  )}>{step}</div>
                  <span className={cn(
                    'text-sm font-bold transition-colors hidden md:block',
                    currentStep === step ? 'text-primary' : 'text-on-surface-variant'
                  )}>
                    {step === 1 ? t('merchants.modal.step1') : t('merchants.modal.step2')}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Content */}
          <div className="grow p-8">
            <div className="flex justify-between items-center mb-8 md:hidden">
               <h3 className="font-bold text-primary">{t('merchants.modal.registerTitle')}</h3>
               <button onClick={() => !isActionLoading && setIsRegisterModalOpen(false)} className="p-2 hover:bg-surface-container-high rounded-full transition-colors">
                 <X className="w-5 h-5 text-on-surface-variant" />
               </button>
            </div>
            <div className="hidden md:flex justify-end mb-4">
              <button
                onClick={() => !isActionLoading && setIsRegisterModalOpen(false)}
                className="p-2 hover:bg-surface-container-high rounded-full transition-colors"
                disabled={isActionLoading}
              >
                <X className="w-5 h-5 text-on-surface-variant" />
              </button>
            </div>

            <form onSubmit={handleSubmit}>
              {error && <div className="p-4 bg-error/10 text-error text-sm font-bold rounded-xl mb-6 flex items-start gap-3"><ShieldAlert className="w-5 h-5 shrink-0" />{error}</div>}

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
                        <input type="text" required placeholder={t('merchants.modal.businessNamePlaceholder')}
                          value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})}
                          className="w-full bg-surface-container-high border-none rounded-lg p-4 pl-12 text-sm focus:ring-2 focus:ring-primary/20 transition-all font-bold" />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-bold text-primary uppercase tracking-widest">{t('merchants.modal.merchantCode')}</label>
                      <input type="text" required placeholder={t('merchants.modal.merchantCodePlaceholder')}
                        value={formData.code} onChange={e => setFormData({...formData, code: e.target.value.toUpperCase()})}
                        className="w-full bg-surface-container-high border-none rounded-lg p-4 text-sm font-mono focus:ring-2 focus:ring-primary/20 transition-all" />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-primary uppercase tracking-widest">{t('merchants.modal.contactPerson')}</label>
                    <div className="relative">
                      <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-on-surface-variant" />
                      <input type="text" required placeholder={t('merchants.modal.contactPersonPlaceholder')}
                        value={formData.ownerFullName} onChange={e => setFormData({...formData, ownerFullName: e.target.value})}
                        className="w-full bg-surface-container-high border-none rounded-lg p-4 pl-12 text-sm focus:ring-2 focus:ring-primary/20 transition-all" />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-[10px] font-bold text-primary uppercase tracking-widest">{t('merchants.modal.phone')}</label>
                      <div className="relative">
                        <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-on-surface-variant" />
                        <input type="tel" required placeholder="+221"
                          value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value, ownerPhone: e.target.value})}
                          className="w-full bg-surface-container-high border-none rounded-lg p-4 pl-12 text-sm focus:ring-2 focus:ring-primary/20 transition-all" />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-bold text-primary uppercase tracking-widest">{t('merchants.modal.email')}</label>
                      <div className="relative">
                        <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-on-surface-variant" />
                        <input type="email" required placeholder="email@business.com"
                          value={formData.email} onChange={e => setFormData({...formData, email: e.target.value, ownerEmail: e.target.value})}
                          className="w-full bg-surface-container-high border-none rounded-lg p-4 pl-12 text-sm focus:ring-2 focus:ring-primary/20 transition-all" />
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-primary uppercase tracking-widest">{t('merchants.modal.address')}</label>
                    <div className="relative">
                      <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-on-surface-variant" />
                      <input type="text" required placeholder={t('merchants.modal.addressPlaceholder')}
                        value={formData.address} onChange={e => setFormData({...formData, address: e.target.value})}
                        className="w-full bg-surface-container-high border-none rounded-lg p-4 pl-12 text-sm focus:ring-2 focus:ring-primary/20 transition-all" />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-[10px] font-bold text-primary uppercase tracking-widest">Business Type</label>
                      <select 
                        required
                        value={formData.businessType} 
                        onChange={e => setFormData({...formData, businessType: e.target.value})}
                        className="w-full bg-surface-container-high border-none rounded-lg p-4 text-sm focus:ring-2 focus:ring-primary/20 transition-all"
                      >
                         <option value="Retail">{t('merchants.filter.retail')}</option>
                         <option value="Healthcare">{t('merchants.filter.healthcare')}</option>
                         <option value="Logistics">{t('merchants.filter.logistics')}</option>
                         <option value="Hospitality">Hospitality</option>
                         <option value="Other">Other</option>
                      </select>
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-bold text-primary uppercase tracking-widest">Country</label>
                      <input type="text" required placeholder="Country"
                        value={formData.country} onChange={e => setFormData({...formData, country: e.target.value})}
                        className="w-full bg-surface-container-high border-none rounded-lg p-4 text-sm focus:ring-2 focus:ring-primary/20 transition-all" />
                    </div>
                  </div>

                  <div className="pt-6">
                    <button
                      type="button"
                      onClick={() => {
                        if (formData.name && formData.code && formData.email) setCurrentStep(2);
                        else setError('Please fill out the required core fields (Name, Code, Email) before proceeding.');
                      }}
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
                      <div 
                        onClick={() => handleSettlementTypeChange(CompensationAccountType.BANK)}
                        className={`p-6 border-2 rounded-2xl cursor-pointer transition-colors ${formData.compensationAccount.type === CompensationAccountType.BANK ? 'bg-primary/5 border-primary' : 'bg-surface-container-high border-transparent hover:bg-surface-container-highest'}`}
                      >
                        <div className={`w-10 h-10 rounded-lg flex items-center justify-center mb-4 ${formData.compensationAccount.type === CompensationAccountType.BANK ? 'bg-primary/10 text-primary' : 'bg-surface-container-lowest text-on-surface-variant'}`}>
                          <CreditCard className="w-6 h-6" />
                        </div>
                        <p className={`font-bold ${formData.compensationAccount.type === CompensationAccountType.BANK ? 'text-primary' : 'text-on-surface-variant'}`}>{t('merchants.modal.bankAccount')}</p>
                        <p className="text-[10px] text-on-surface-variant mt-1">Direct bank transfer (T+1)</p>
                      </div>
                      <div 
                        onClick={() => handleSettlementTypeChange(CompensationAccountType.OPERATOR)}
                        className={`p-6 border-2 rounded-2xl cursor-pointer transition-colors ${formData.compensationAccount.type === CompensationAccountType.OPERATOR ? 'bg-primary/5 border-primary' : 'bg-surface-container-high border-transparent hover:bg-surface-container-highest'}`}
                      >
                        <div className={`w-10 h-10 rounded-lg flex items-center justify-center mb-4 ${formData.compensationAccount.type === CompensationAccountType.OPERATOR ? 'bg-primary/10 text-primary' : 'bg-surface-container-lowest text-on-surface-variant'}`}>
                          <Smartphone className="w-6 h-6" />
                        </div>
                        <p className={`font-bold ${formData.compensationAccount.type === CompensationAccountType.OPERATOR ? 'text-primary' : 'text-on-surface-variant'}`}>{t('merchants.modal.mobileMoney')}</p>
                        <p className="text-[10px] text-on-surface-variant mt-1">Instant wallet settlement</p>
                      </div>
                    </div>
                  </div>

                  {formData.compensationAccount.type === CompensationAccountType.BANK ? (
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <label className="text-[10px] font-bold text-primary uppercase tracking-widest">Bank Name</label>
                        <input type="text" required placeholder="e.g. Société Générale"
                          value={formData.compensationAccount.bankName || ''} onChange={e => setFormData({...formData, compensationAccount: {...formData.compensationAccount, bankName: e.target.value}})}
                          className="w-full bg-surface-container-high border-none rounded-lg p-4 text-sm" />
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] font-bold text-primary uppercase tracking-widest">Account Number (IBAN)</label>
                        <input type="text" required placeholder="SNXX XXXX XXXX XXXX XXXX XXXX XXX"
                          value={formData.compensationAccount.accountNumber || ''} onChange={e => setFormData({...formData, compensationAccount: {...formData.compensationAccount, accountNumber: e.target.value}})}
                          className="w-full bg-surface-container-high border-none rounded-lg p-4 text-sm font-mono" />
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <label className="text-[10px] font-bold text-primary uppercase tracking-widest">Operator Code</label>
                        <select 
                          required
                          value={formData.compensationAccount.operatorCode || ''} 
                          onChange={e => setFormData({...formData, compensationAccount: {...formData.compensationAccount, operatorCode: e.target.value}})}
                          className="w-full bg-surface-container-high border-none rounded-lg p-4 text-sm"
                        >
                          <option value="" disabled>Select Operator...</option>
                          <option value="WAVE">Wave</option>
                          <option value="OM">Orange Money</option>
                          <option value="FREE">Free Money</option>
                        </select>
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] font-bold text-primary uppercase tracking-widest">Wallet Phone Number</label>
                        <input type="tel" required placeholder="+221"
                          value={formData.compensationAccount.operatorPhone || ''} onChange={e => setFormData({...formData, compensationAccount: {...formData.compensationAccount, operatorPhone: e.target.value}})}
                          className="w-full bg-surface-container-high border-none rounded-lg p-4 text-sm font-mono" />
                      </div>
                    </div>
                  )}

                  <div className="pt-6 flex gap-4">
                    <button
                      type="button"
                      onClick={() => setCurrentStep(1)}
                      className="grow py-4 rounded-xl font-bold text-on-surface-variant hover:bg-surface-container-high transition-all flex items-center justify-center gap-2"
                      disabled={isActionLoading}
                    >
                      <ChevronLeft className="w-4 h-4" />
                      {t('common.back')}
                    </button>
                    <button 
                      type="submit"
                      disabled={isActionLoading}
                      className={`flex-[2] text-white py-4 rounded-xl font-bold flex items-center justify-center gap-2 transition-all shadow-lg shadow-primary/20 ${isActionLoading ? 'bg-primary/50 cursor-not-allowed' : 'bg-primary hover:opacity-90'}`}
                    >
                      {isActionLoading ? t('common.saving') : t('merchants.modal.register')}
                    </button>
                  </div>
                </motion.div>
              )}
            </form>
          </div>
        </div>
      </Modal>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-surface-container-low p-6 rounded-xl border border-outline-variant/10 relative overflow-hidden">
          <p className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest mb-1">{t('merchants.stats.active')}</p>
          <h3 className="text-3xl font-bold font-headline text-secondary">{activeCount}</h3>
          <div className="mt-4 h-1 w-full bg-surface-container-highest rounded-full overflow-hidden">
            <div className="h-full bg-secondary w-full opacity-50" />
          </div>
        </div>
        <div className="bg-surface-container-low p-6 rounded-xl border border-outline-variant/10 relative overflow-hidden">
          <p className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest mb-1">{t('merchants.stats.pending')}</p>
          <h3 className="text-3xl font-bold font-headline text-amber-500">{pendingCount}</h3>
          <div className="mt-4 h-1 w-full bg-surface-container-highest rounded-full overflow-hidden">
            <div className="h-full bg-amber-500 w-full opacity-50" />
          </div>
        </div>
        <div className="bg-surface-container-low p-6 rounded-xl border border-outline-variant/10 relative overflow-hidden">
          <p className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest mb-1">{t('merchants.stats.blocked')}</p>
          <h3 className="text-3xl font-bold font-headline text-error">{blockedCount}</h3>
          <div className="mt-4 h-1 w-full bg-surface-container-highest rounded-full overflow-hidden">
            <div className="h-full bg-error w-full opacity-50" />
          </div>
        </div>
      </div>

      {/* Merchant list */}
      <div className="bg-surface-container-lowest rounded-xl border border-outline-variant/10 overflow-hidden shadow-sm">
        <div className="p-4 border-b border-outline-variant/10 flex gap-4 items-center">
          <SearchInput
            value={searchQuery}
            onChange={setSearchQuery}
            placeholder={t('merchants.filter.search')}
            className="grow"
          />
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="bg-surface-container-high text-primary font-bold border-none rounded-lg text-sm px-4 py-2 cursor-pointer"
          >
            <option value="All Categories">{t('merchants.filter.allCategories')}</option>
            <option value="Retail">{t('merchants.filter.retail')}</option>
            <option value="Healthcare">{t('merchants.filter.healthcare')}</option>
            <option value="Logistics">{t('merchants.filter.logistics')}</option>
            <option value="Hospitality">Hospitality</option>
            <option value="Other">Other Category</option>
          </select>
        </div>

        <div className="relative min-h-[300px]">
          {isLoading && merchants.length === 0 ? (
            <div className="absolute inset-0 flex items-center justify-center bg-surface-container-lowest/50 backdrop-blur-sm z-10">
              <div className="w-10 h-10 border-4 border-primary/20 border-t-primary rounded-full animate-spin"></div>
            </div>
          ) : null}

          {error && merchants.length === 0 && (
             <div className="p-8 text-center bg-error/5 m-4 rounded-xl border border-error/20 text-error">
                <ShieldAlert className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <h3 className="font-bold mb-1">Error Loading Data</h3>
                <p className="text-sm opacity-80">{error}</p>
             </div>
          )}

          {!error && merchants.length === 0 && !isLoading ? (
             <div className="p-12 text-center text-on-surface-variant">
               <Store className="w-12 h-12 mx-auto mb-4 opacity-20" />
               <p className="font-bold">No merchants provisioned yet in the ecosystem.</p>
             </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 divide-x divide-y divide-outline-variant/10">
              {filteredMerchants.map((m) => (
                <div key={m.id} className="p-6 hover:bg-surface-container-low transition-colors group">
                  <div className="flex justify-between items-start mb-6">
                    <div className="flex items-center gap-4">
                      {m.logoUrl ? (
                        <div className="w-12 h-12 rounded-xl border border-outline-variant/10 overflow-hidden bg-white">
                          <img src={m.logoUrl} alt={m.name} className="w-full h-full object-cover" />
                        </div>
                      ) : (
                        <div className="w-12 h-12 rounded-xl bg-primary text-white flex items-center justify-center font-bold text-xl uppercase shadow-md shadow-primary/20">
                          {m.name.charAt(0)}
                        </div>
                      )}
                      <div>
                        <h4 className="font-bold text-lg text-primary leading-tight flex items-center gap-2">
                           {m.name}
                           {m.status === 'ACTIVE' && <div className="w-2 h-2 rounded-full bg-secondary" title="Active Platform Account" />}
                        </h4>
                        <span className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant mt-1.5 inline-block">
                          {t(`merchants.filter.${m.businessType.toLowerCase()}`) || m.businessType}
                        </span>
                      </div>
                    </div>
                    <PermissionGuard permission={MERCHANT_UPDATE}>
                      <button className="p-2 hover:bg-surface-container-high rounded-full transition-colors">
                        <MoreVertical className="w-5 h-5 text-on-surface-variant" />
                      </button>
                    </PermissionGuard>
                  </div>

                  <div className="grid grid-cols-2 gap-4 mb-6">
                    <div className="flex items-center gap-2 text-xs text-on-surface-variant">
                      <MapPin className="w-3.5 h-3.5 shrink-0" />
                      <span className="truncate" title={m.address}>{m.address}</span>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-on-surface-variant">
                      <Calendar className="w-3.5 h-3.5 shrink-0" />{t('merchants.card.joined')} {new Date(m.createdAt).toLocaleDateString()}
                    </div>
                    <div className="flex items-center gap-2 text-xs text-on-surface-variant">
                      <Phone className="w-3.5 h-3.5 shrink-0" />{m.phone}
                    </div>
                    <div className="flex items-center gap-2 text-xs font-bold text-primary">
                       <Store className="w-3.5 h-3.5 opacity-50 shrink-0" /> <span className="truncate">{m.code}</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-4 border-t border-outline-variant/5">
                    <StatusBadge
                      status={
                        m.status === 'ACTIVE' ? 'Active' :
                        m.status === 'PENDING' ? 'Pending' :
                        'Blocked'
                      }
                      label={t(`common.${m.status.toLowerCase()}`) || m.status}
                      variant="icon"
                    />
                    <PermissionGuard permission={MERCHANT_READ}>
                      <button onClick={() => navigate(`/merchants/${m.id}`)} className="text-xs font-bold text-primary hover:underline hover:text-secondary transition-colors">{t('merchants.card.viewProfile')}</button>
                    </PermissionGuard>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <Pagination 
          currentPage={currentPage}
          totalPages={totalPages}
          totalElements={totalElements}
          pageSize={pageSize}
          onPageChange={setCurrentPage}
          onPageSizeChange={(size) => {
             setPageSize(size);
             setCurrentPage(0);
          }}
        />

      </div>
    </div>
  );
}
