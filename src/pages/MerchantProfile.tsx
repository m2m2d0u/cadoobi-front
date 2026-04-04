import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Store, Mail, Phone, MapPin, Calendar, ShieldCheck,
  Building2, CreditCard, Smartphone, User, ChevronLeft,
  Briefcase, Globe, Edit2, ShieldAlert, X, CheckCircle, AlertCircle
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { PageHeader, StatusBadge, Modal, Button } from '../components/ui';
import { merchantsService } from '../services';
import type { MerchantResponse, UpdateMerchantRequest } from '../types/api';
import { CompensationAccountType, MerchantStatus } from '../types/enums';

export function MerchantProfile() {
  const { t } = useLanguage();
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [merchant, setMerchant] = useState<MerchantResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Edit State
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isActionLoading, setIsActionLoading] = useState(false);
  const [formData, setFormData] = useState<UpdateMerchantRequest>({});

  // Notification State
  const [notification, setNotification] = useState<{ type: 'success' | 'error', message: string } | null>(null);

  // Status Toggle State
  const [isStatusModalOpen, setIsStatusModalOpen] = useState(false);
  const [pendingStatus, setPendingStatus] = useState<MerchantStatus | null>(null);

  const fetchMerchant = async () => {
    if (!id) return;
    try {
      setIsLoading(true);
      setError(null);
      const data = await merchantsService.getById(id);
      setMerchant(data);
      if (data) {
         setFormData({
           name: data.name,
           logoUrl: data.logoUrl || '',
           phone: data.phone,
           businessType: data.businessType,
           email: data.email,
           address: data.address,
           country: data.country,
           rccm: data.rccm || '',
           ninea: data.ninea || '',
           ownerFullName: data.ownerFullName,
           ownerEmail: data.ownerEmail,
           ownerPhone: data.ownerPhone,
           ownerCni: data.ownerCni || '',
           status: data.status,
           // compensation account
           compensationAccount: data.compensationAccount
         });
      }
    } catch (err: any) {
      console.error(err);
      setError(err?.response?.data?.message || 'Failed to fetch merchant details');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchMerchant();
  }, [id]);

  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!id) return;
    try {
      setIsActionLoading(true);
      setError(null);
      await merchantsService.update(id, formData);
      setNotification({ type: 'success', message: t('merchantProfile.editModal.successMessage') });
      setIsEditModalOpen(false);
      fetchMerchant();
      // Auto hide notification after 5 seconds
      setTimeout(() => setNotification(null), 5000);
    } catch (err: any) {
      console.error(err);
      const errorMessage = err?.response?.data?.message || t('merchantProfile.editModal.errorMessage');
      setNotification({ type: 'error', message: errorMessage });
      // Auto hide notification after 5 seconds
      setTimeout(() => setNotification(null), 5000);
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
        bankName: type === CompensationAccountType.BANK ? formData.compensationAccount?.bankName : '',
        accountNumber: type === CompensationAccountType.BANK ? formData.compensationAccount?.accountNumber : '',
        operatorCode: type === CompensationAccountType.OPERATOR ? formData.compensationAccount?.operatorCode : '',
        operatorPhone: type === CompensationAccountType.OPERATOR ? formData.compensationAccount?.operatorPhone : '',
      } as any
    });
  };

  const handleStatusChange = (newStatus: MerchantStatus) => {
    setPendingStatus(newStatus);
    setIsStatusModalOpen(true);
  };

  const confirmStatusChange = async () => {
    if (!id || !pendingStatus) return;
    try {
      setIsActionLoading(true);
      setError(null);
      await merchantsService.updateStatus(id, { status: pendingStatus });

      const successMessage =
        pendingStatus === MerchantStatus.ACTIVE ? t('merchantProfile.statusToggle.successActivated') :
        pendingStatus === MerchantStatus.SUSPENDED ? t('merchantProfile.statusToggle.successSuspended') :
        t('merchantProfile.statusToggle.successBlocked');

      setNotification({ type: 'success', message: successMessage });
      setIsStatusModalOpen(false);
      setPendingStatus(null);
      fetchMerchant();
      // Auto hide notification after 5 seconds
      setTimeout(() => setNotification(null), 5000);
    } catch (err: any) {
      console.error(err);
      setNotification({ type: 'error', message: t('merchantProfile.statusToggle.error') });
      setTimeout(() => setNotification(null), 5000);
    } finally {
      setIsActionLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <div className="w-10 h-10 border-4 border-primary/20 border-t-primary rounded-full animate-spin"></div>
      </div>
    );
  }

  if (error || !merchant) {
    return (
      <div className="p-8 text-center bg-error/5 m-4 rounded-xl border border-error/20 text-error">
        <ShieldAlert className="w-12 h-12 mx-auto mb-4 opacity-50" />
        <h3 className="font-bold mb-1">{t('merchantProfile.error.title')}</h3>
        <p className="text-sm opacity-80">{error || t('merchantProfile.error.notFound')}</p>
        <button onClick={() => navigate('/merchants')} className="mt-4 text-sm font-bold underline hover:opacity-80 transition-opacity">{t('merchantProfile.error.goBack')}</button>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto">
      {/* Notification Toast */}
      {notification && (
        <div className={`fixed top-4 right-4 z-50 flex items-center gap-3 px-6 py-4 rounded-xl shadow-lg border transition-all animate-in slide-in-from-top-5 ${
          notification.type === 'success'
            ? 'bg-emerald-50 border-emerald-200 text-emerald-700'
            : 'bg-rose-50 border-rose-200 text-rose-700'
        }`}>
          {notification.type === 'success' ? (
            <CheckCircle className="w-5 h-5 shrink-0 text-emerald-500" />
          ) : (
            <AlertCircle className="w-5 h-5 shrink-0 text-rose-500" />
          )}
          <span className="font-bold text-sm">{notification.message}</span>
          <button onClick={() => setNotification(null)} className="ml-2 hover:opacity-70 transition-opacity">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      <div className="mb-8 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button onClick={() => navigate('/merchants')} className="p-2 bg-surface-container-high rounded-full hover:bg-surface-container-highest transition-colors">
            <ChevronLeft className="w-5 h-5 text-on-surface-variant" />
          </button>
          <PageHeader title={merchant.name} subtitle={`${t('merchantProfile.dashboard')} / ${merchant.code}`} customMargin="mb-0" />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Business & Owner Details */}
        <div className="lg:col-span-2 space-y-8">
          
          <div className="bg-surface-container-lowest rounded-3xl border border-outline-variant/10 overflow-hidden shadow-sm">
            <div className="h-32 bg-primary/5 relative">
              <div className="absolute top-4 right-4">
                 <StatusBadge
                   status={
                     merchant.status === 'ACTIVE' ? 'Active' :
                     merchant.status === 'PENDING' ? 'Pending' :
                     'Blocked'
                   }
                   label={t(`common.${merchant.status.toLowerCase()}`) || merchant.status}
                   className="shadow-sm shadow-black/10"
                   variant="badge"
                 />
              </div>
              <div className="absolute -bottom-12 left-8">
                {merchant.logoUrl ? (
                  <div className="w-24 h-24 rounded-2xl border-4 border-surface-container-lowest shadow-xl bg-white overflow-hidden">
                    <img src={merchant.logoUrl} alt={merchant.name} className="w-full h-full object-cover" />
                  </div>
                ) : (
                  <div className="w-24 h-24 rounded-2xl bg-primary text-white flex items-center justify-center text-3xl font-bold border-4 border-surface-container-lowest shadow-xl uppercase">
                    {merchant.name.charAt(0)}
                  </div>
                )}
              </div>
            </div>
            
            <div className="pt-16 p-8">
              <div className="flex justify-between items-start mb-8">
                <div>
                  <h3 className="text-2xl font-bold text-primary mb-1">{merchant.name}</h3>
                  <div className="flex items-center gap-3 text-sm font-medium text-on-surface-variant">
                    <span className="flex items-center gap-1.5"><Store className="w-4 h-4" /> {merchant.code}</span>
                    <span>•</span>
                    <span className="flex items-center gap-1.5"><Briefcase className="w-4 h-4" /> {merchant.businessType}</span>
                  </div>
                </div>
                <Button onClick={() => setIsEditModalOpen(true)}>
                  <Edit2 className="w-4 h-4" /> {t('merchantProfile.editProfile')}
                </Button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="flex items-center gap-4 p-4 bg-surface-container-low rounded-2xl border border-outline-variant/10 hover:border-outline-variant/30 transition-colors">
                  <div className="w-10 h-10 bg-surface-container-high rounded-xl flex items-center justify-center shrink-0">
                    <Mail className="w-5 h-5 text-on-surface-variant" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest">{t('merchantProfile.businessEmail')}</p>
                    <p className="text-sm font-medium text-primary truncate">{merchant.email}</p>
                  </div>
                </div>
                <div className="flex items-center gap-4 p-4 bg-surface-container-low rounded-2xl border border-outline-variant/10 hover:border-outline-variant/30 transition-colors">
                  <div className="w-10 h-10 bg-surface-container-high rounded-xl flex items-center justify-center shrink-0">
                    <Phone className="w-5 h-5 text-on-surface-variant" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest">{t('merchantProfile.businessPhone')}</p>
                    <p className="text-sm font-medium text-primary truncate">{merchant.phone}</p>
                  </div>
                </div>
                <div className="flex items-center gap-4 p-4 bg-surface-container-low rounded-2xl border border-outline-variant/10 hover:border-outline-variant/30 transition-colors">
                  <div className="w-10 h-10 bg-surface-container-high rounded-xl flex items-center justify-center shrink-0">
                    <MapPin className="w-5 h-5 text-on-surface-variant" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest">{t('merchantProfile.address')}</p>
                    <p className="text-sm font-medium text-primary truncate" title={merchant.address}>{merchant.address}</p>
                  </div>
                </div>
                <div className="flex items-center gap-4 p-4 bg-surface-container-low rounded-2xl border border-outline-variant/10 hover:border-outline-variant/30 transition-colors">
                  <div className="w-10 h-10 bg-surface-container-high rounded-xl flex items-center justify-center shrink-0">
                    <Globe className="w-5 h-5 text-on-surface-variant" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest">{t('merchantProfile.country')}</p>
                    <p className="text-sm font-medium text-primary truncate">{merchant.country}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

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
                <div>
                   <p className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest mb-1.5 flex items-center gap-1.5"><User className="w-3 h-3" /> {t('merchantProfile.fullName')}</p>
                   <p className="text-sm font-bold text-primary">{merchant.ownerFullName}</p>
                </div>
                <div>
                   <p className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest mb-1.5 flex items-center gap-1.5"><Mail className="w-3 h-3" /> {t('merchantProfile.email')}</p>
                   <p className="text-sm font-bold text-primary">{merchant.ownerEmail}</p>
                </div>
                <div>
                   <p className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest mb-1.5 flex items-center gap-1.5"><Phone className="w-3 h-3" /> {t('merchantProfile.phoneNumber')}</p>
                   <p className="text-sm font-bold text-primary">{merchant.ownerPhone}</p>
                </div>
                <div>
                   <p className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest mb-1.5 flex items-center gap-1.5"><ShieldCheck className="w-3 h-3" /> {t('merchantProfile.ownerCni')}</p>
                   <p className="text-sm font-bold text-primary">{merchant.ownerCni || '—'}</p>
                </div>
             </div>
          </div>
        </div>

        {/* Right Column: Settlement & Meta */}
        <div className="space-y-8">

          {/* Quick Actions - Status Management */}
          <div className="bg-surface-container-lowest p-8 rounded-3xl border border-outline-variant/10 shadow-sm">
            <h4 className="text-lg font-bold text-primary mb-6 flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-on-surface-variant" /> {t('merchantProfile.statusToggle.manageStatus')}
            </h4>

            <div className="flex flex-col gap-3">
              {merchant.status !== MerchantStatus.ACTIVE && (
                <button
                  onClick={() => handleStatusChange(MerchantStatus.ACTIVE)}
                  disabled={isActionLoading}
                  className="flex items-center justify-between p-4 bg-emerald-50/50 hover:bg-emerald-50 border border-emerald-200 rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed group"
                >
                  <div className="flex items-center gap-3">
                    <CheckCircle className="w-5 h-5 text-emerald-500" />
                    <span className="font-bold text-emerald-700">{t('merchantProfile.statusToggle.activate')}</span>
                  </div>
                  <div className="w-2 h-2 rounded-full bg-emerald-400 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                </button>
              )}

              {merchant.status !== MerchantStatus.SUSPENDED && (
                <button
                  onClick={() => handleStatusChange(MerchantStatus.SUSPENDED)}
                  disabled={isActionLoading}
                  className="flex items-center justify-between p-4 bg-orange-50/50 hover:bg-orange-50 border border-orange-200 rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed group"
                >
                  <div className="flex items-center gap-3">
                    <AlertCircle className="w-5 h-5 text-orange-500" />
                    <span className="font-bold text-orange-700">{t('merchantProfile.statusToggle.suspend')}</span>
                  </div>
                  <div className="w-2 h-2 rounded-full bg-orange-400 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                </button>
              )}

              {merchant.status !== MerchantStatus.BLOCKED && (
                <button
                  onClick={() => handleStatusChange(MerchantStatus.BLOCKED)}
                  disabled={isActionLoading}
                  className="flex items-center justify-between p-4 bg-rose-50/50 hover:bg-rose-50 border border-rose-200 rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed group"
                >
                  <div className="flex items-center gap-3">
                    <ShieldAlert className="w-5 h-5 text-rose-500" />
                    <span className="font-bold text-rose-700">{t('merchantProfile.statusToggle.block')}</span>
                  </div>
                  <div className="w-2 h-2 rounded-full bg-rose-400 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                </button>
              )}
            </div>
          </div>

          <div className="bg-surface-container-lowest p-8 rounded-3xl border border-outline-variant/10 shadow-sm">
            <h4 className="text-lg font-bold text-primary mb-6 flex items-center gap-2">
              <CreditCard className="w-5 h-5 text-on-surface-variant" /> {t('merchantProfile.settlementRouting')}
            </h4>
            
            <div className={`p-6 rounded-2xl mb-6 shadow-sm border ${merchant.compensationAccount.type === 'BANK' ? 'bg-primary/5 border-primary/20' : 'bg-secondary/5 border-secondary/20'}`}>
               <div className="flex items-center gap-3 mb-6">
                 <div className={`w-12 h-12 rounded-xl flex items-center justify-center shadow-sm ${merchant.compensationAccount.type === 'BANK' ? 'bg-white text-primary' : 'bg-white text-secondary'}`}>
                   {merchant.compensationAccount.type === 'BANK' ? <Building2 className="w-6 h-6" /> : <Smartphone className="w-6 h-6" />}
                 </div>
                 <div>
                   <h5 className={`font-bold ${merchant.compensationAccount.type === 'BANK' ? 'text-primary' : 'text-secondary'}`}>
                     {merchant.compensationAccount.type === 'BANK' ? t('merchantProfile.bankWireTransfer') : t('merchantProfile.mobileMoney')}
                   </h5>
                   <p className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest mt-0.5">{t('merchantProfile.activePayoutEndpoint')}</p>
                 </div>
               </div>
               
               {merchant.compensationAccount.type === 'BANK' && (
                 <div className="space-y-4 pt-4 border-t border-outline-variant/10">
                   <div>
                     <p className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest mb-1">{t('merchantProfile.bankName')}</p>
                     <p className="text-sm font-bold text-primary bg-white/50 px-3 py-2 rounded-lg">{merchant.compensationAccount.bankName}</p>
                   </div>
                   <div>
                     <p className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest mb-1">{t('merchantProfile.accountNumber')}</p>
                     <p className="text-sm font-mono font-bold text-primary bg-white/50 px-3 py-2 rounded-lg">{merchant.compensationAccount.accountNumber}</p>
                   </div>
                 </div>
               )}

               {merchant.compensationAccount.type === 'OPERATOR' && (
                 <div className="space-y-4 pt-4 border-t border-outline-variant/10">
                   <div>
                     <p className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest mb-1">{t('merchantProfile.telecomOperator')}</p>
                     <p className="text-sm font-bold text-primary bg-white/50 px-3 py-2 rounded-lg uppercase">{merchant.compensationAccount.operatorCode}</p>
                   </div>
                   <div>
                     <p className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest mb-1">{t('merchantProfile.walletEndpoint')}</p>
                     <p className="text-sm font-mono font-bold text-primary bg-white/50 px-3 py-2 rounded-lg">{merchant.compensationAccount.operatorPhone}</p>
                   </div>
                 </div>
               )}
            </div>
            
            <div className="flex flex-col gap-3">
              <div className="flex justify-between items-center p-4 bg-surface-container-low rounded-xl border border-outline-variant/5">
                <div className="flex items-center gap-2">
                   <Calendar className="w-4 h-4 text-on-surface-variant" />
                   <span className="text-sm text-on-surface-variant font-bold">{t('merchantProfile.joinedDate')}</span>
                </div>
                <span className="text-sm font-bold text-primary">{new Date(merchant.createdAt).toLocaleDateString()}</span>
              </div>
              <div className="flex justify-between items-center p-4 bg-surface-container-low rounded-xl border border-outline-variant/5">
                <div className="flex items-center gap-2">
                   <Calendar className="w-4 h-4 text-on-surface-variant" />
                   <span className="text-sm text-on-surface-variant font-bold">{t('merchantProfile.lastUpdated')}</span>
                </div>
                <span className="text-sm font-bold text-primary">{new Date(merchant.updatedAt).toLocaleDateString()}</span>
              </div>
            </div>
          </div>
          
        </div>
      </div>

      {/* Edit Modal */}
      <Modal isOpen={isEditModalOpen} onClose={() => !isActionLoading && setIsEditModalOpen(false)} size="xl">
        <div className="p-8 max-h-[90vh] overflow-y-auto">
           <div className="flex justify-between items-center mb-8 pb-4 border-b border-outline-variant/10">
             <h3 className="text-xl font-bold text-primary flex items-center gap-3"><Edit2 className="w-6 h-6" /> {t('merchantProfile.editModal.title')}</h3>
             <button onClick={() => !isActionLoading && setIsEditModalOpen(false)} className="p-2 hover:bg-surface-container-high rounded-full transition-colors">
               <X className="w-5 h-5 text-on-surface-variant" />
             </button>
           </div>
           
           <form onSubmit={handleEditSubmit} className="space-y-8">
              {/* Basic Fields */}
              <div>
                <h4 className="text-sm font-bold text-primary mb-4 uppercase tracking-widest">{t('merchantProfile.editModal.businessInfo')}</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6 bg-surface-container-lowest rounded-2xl border border-outline-variant/10">
                   <div className="space-y-2">
                     <label className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest">{t('merchantProfile.editModal.businessName')}</label>
                     <input type="text" required value={formData.name || ''} onChange={e => setFormData({...formData, name: e.target.value})}
                       className="w-full bg-surface-container-high border-none rounded-lg p-3 text-sm font-bold focus:ring-2 focus:ring-primary/20" />
                   </div>
                   <div className="space-y-2">
                     <label className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest">{t('merchantProfile.editModal.businessEmail')}</label>
                     <input type="email" required value={formData.email || ''} onChange={e => setFormData({...formData, email: e.target.value})}
                       className="w-full bg-surface-container-high border-none rounded-lg p-3 text-sm font-bold focus:ring-2 focus:ring-primary/20" />
                   </div>
                   <div className="space-y-2">
                     <label className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest">{t('merchantProfile.editModal.phoneNumber')}</label>
                     <input type="tel" required value={formData.phone || ''} onChange={e => setFormData({...formData, phone: e.target.value})}
                       className="w-full bg-surface-container-high border-none rounded-lg p-3 text-sm font-bold focus:ring-2 focus:ring-primary/20" />
                   </div>
                   <div className="space-y-2">
                     <label className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest">{t('merchantProfile.editModal.address')}</label>
                     <input type="text" required value={formData.address || ''} onChange={e => setFormData({...formData, address: e.target.value})}
                       className="w-full bg-surface-container-high border-none rounded-lg p-3 text-sm font-bold focus:ring-2 focus:ring-primary/20" />
                   </div>
                   <div className="space-y-2">
                     <label className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest">{t('merchantProfile.editModal.country')}</label>
                     <input type="text" required value={formData.country || ''} onChange={e => setFormData({...formData, country: e.target.value})}
                       className="w-full bg-surface-container-high border-none rounded-lg p-3 text-sm font-bold focus:ring-2 focus:ring-primary/20" />
                   </div>
                   <div className="space-y-2">
                     <label className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest">{t('merchantProfile.editModal.businessType')}</label>
                     <input type="text" required value={formData.businessType || ''} onChange={e => setFormData({...formData, businessType: e.target.value})}
                       className="w-full bg-surface-container-high border-none rounded-lg p-3 text-sm font-bold focus:ring-2 focus:ring-primary/20" />
                   </div>
                   <div className="space-y-2">
                      <label className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest">{t('merchantProfile.editModal.accountStatus')}</label>
                      <select required value={formData.status || ''} onChange={e => setFormData({...formData, status: e.target.value as MerchantStatus})}
                        className="w-full bg-surface-container-high border-none rounded-lg p-3 text-sm font-bold focus:ring-2 focus:ring-primary/20">
                         <option value={MerchantStatus.ACTIVE}>{t('merchantProfile.status.active')}</option>
                         <option value={MerchantStatus.PENDING}>{t('merchantProfile.status.pending')}</option>
                         <option value={MerchantStatus.SUSPENDED}>{t('merchantProfile.status.suspended')}</option>
                         <option value={MerchantStatus.BLOCKED}>{t('merchantProfile.status.blocked')}</option>
                      </select>
                   </div>
                   <div className="space-y-2">
                     <label className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest">{t('merchantProfile.editModal.logoUrl')}</label>
                     <input type="url" value={formData.logoUrl || ''} onChange={e => setFormData({...formData, logoUrl: e.target.value})}
                       className="w-full bg-surface-container-high border-none rounded-lg p-3 text-sm font-bold focus:ring-2 focus:ring-primary/20"
                       placeholder="https://example.com/logo.png" />
                   </div>
                </div>
              </div>

              {/* Legal Information */}
              <div>
                <h4 className="text-sm font-bold text-primary mb-4 uppercase tracking-widest">{t('merchantProfile.editModal.legalInfo')}</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6 bg-surface-container-lowest rounded-2xl border border-outline-variant/10">
                   <div className="space-y-2">
                     <label className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest">{t('merchantProfile.editModal.rccm')}</label>
                     <input type="text" value={formData.rccm || ''} onChange={e => setFormData({...formData, rccm: e.target.value})}
                       className="w-full bg-surface-container-high border-none rounded-lg p-3 text-sm font-bold focus:ring-2 focus:ring-primary/20" />
                   </div>
                   <div className="space-y-2">
                     <label className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest">{t('merchantProfile.editModal.ninea')}</label>
                     <input type="text" value={formData.ninea || ''} onChange={e => setFormData({...formData, ninea: e.target.value})}
                       className="w-full bg-surface-container-high border-none rounded-lg p-3 text-sm font-bold focus:ring-2 focus:ring-primary/20" />
                   </div>
                </div>
              </div>

              {/* Owner Information */}
              <div>
                <h4 className="text-sm font-bold text-primary mb-4 uppercase tracking-widest">{t('merchantProfile.editModal.ownerInfo')}</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6 bg-surface-container-lowest rounded-2xl border border-outline-variant/10">
                   <div className="space-y-2">
                     <label className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest">{t('merchantProfile.editModal.ownerFullName')}</label>
                     <input type="text" required value={formData.ownerFullName || ''} onChange={e => setFormData({...formData, ownerFullName: e.target.value})}
                       className="w-full bg-surface-container-high border-none rounded-lg p-3 text-sm font-bold focus:ring-2 focus:ring-primary/20" />
                   </div>
                   <div className="space-y-2">
                     <label className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest">{t('merchantProfile.editModal.ownerEmail')}</label>
                     <input type="email" required value={formData.ownerEmail || ''} onChange={e => setFormData({...formData, ownerEmail: e.target.value})}
                       className="w-full bg-surface-container-high border-none rounded-lg p-3 text-sm font-bold focus:ring-2 focus:ring-primary/20" />
                   </div>
                   <div className="space-y-2">
                     <label className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest">{t('merchantProfile.editModal.ownerPhone')}</label>
                     <input type="tel" required value={formData.ownerPhone || ''} onChange={e => setFormData({...formData, ownerPhone: e.target.value})}
                       className="w-full bg-surface-container-high border-none rounded-lg p-3 text-sm font-bold focus:ring-2 focus:ring-primary/20" />
                   </div>
                   <div className="space-y-2">
                     <label className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest">{t('merchantProfile.editModal.ownerCni')}</label>
                     <input type="text" value={formData.ownerCni || ''} onChange={e => setFormData({...formData, ownerCni: e.target.value})}
                       className="w-full bg-surface-container-high border-none rounded-lg p-3 text-sm font-bold focus:ring-2 focus:ring-primary/20" />
                   </div>
                </div>
              </div>

              {/* Settlement Edit snippet */}
              <div>
                <h4 className="text-sm font-bold text-primary mb-4 uppercase tracking-widest">{t('merchantProfile.editModal.settlementEndpoint')}</h4>
                <div className="p-6 bg-surface-container-lowest rounded-2xl border border-outline-variant/10">
                   <div className="grid grid-cols-2 gap-4 mb-6">
                      <button type="button" onClick={() => handleSettlementTypeChange(CompensationAccountType.BANK)}
                        className={`py-3 px-4 rounded-xl text-sm font-bold flex items-center justify-center gap-2 border-2 transition-all ${formData.compensationAccount?.type === 'BANK' ? 'border-primary bg-primary/10 text-primary' : 'border-transparent bg-surface-container-high text-on-surface-variant hover:bg-surface-container-highest'}`}>
                        <Building2 className="w-4 h-4" /> {t('merchantProfile.editModal.bankAccount')}
                      </button>
                      <button type="button" onClick={() => handleSettlementTypeChange(CompensationAccountType.OPERATOR)}
                        className={`py-3 px-4 rounded-xl text-sm font-bold flex items-center justify-center gap-2 border-2 transition-all ${formData.compensationAccount?.type === 'OPERATOR' ? 'border-primary bg-primary/10 text-primary' : 'border-transparent bg-surface-container-high text-on-surface-variant hover:bg-surface-container-highest'}`}>
                        <Smartphone className="w-4 h-4" /> {t('merchantProfile.editModal.mobileWallet')}
                      </button>
                   </div>

                   {formData.compensationAccount?.type === 'BANK' ? (
                     <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-surface-container-low p-4 rounded-xl">
                       <div className="space-y-2">
                          <label className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest">{t('merchantProfile.bankName')}</label>
                          <input type="text" required value={formData.compensationAccount.bankName || ''} onChange={e => setFormData({...formData, compensationAccount: {...formData.compensationAccount, bankName: e.target.value}} as any)}
                            className="w-full bg-surface-container-high border-none rounded-lg p-3 text-sm font-bold focus:ring-2 focus:ring-primary/20" />
                       </div>
                       <div className="space-y-2">
                          <label className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest">{t('merchantProfile.editModal.accountDetails')}</label>
                          <input type="text" required value={formData.compensationAccount.accountNumber || ''} onChange={e => setFormData({...formData, compensationAccount: {...formData.compensationAccount, accountNumber: e.target.value}} as any)}
                            className="w-full bg-surface-container-high border-none rounded-lg p-3 text-sm font-mono font-bold focus:ring-2 focus:ring-primary/20" />
                       </div>
                     </div>
                   ) : (
                     <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-surface-container-low p-4 rounded-xl">
                       <div className="space-y-2">
                          <label className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest">{t('merchantProfile.editModal.operatorCode')}</label>
                          <select required value={formData.compensationAccount?.operatorCode || ''} onChange={e => setFormData({...formData, compensationAccount: {...formData.compensationAccount, operatorCode: e.target.value}} as any)}
                            className="w-full bg-surface-container-high border-none rounded-lg p-3 text-sm font-bold focus:ring-2 focus:ring-primary/20">
                            <option value="" disabled>{t('merchantProfile.editModal.selectOperator')}</option>
                            <option value="WAVE">{t('merchantProfile.operator.wave')}</option>
                            <option value="OM">{t('merchantProfile.operator.orangeMoney')}</option>
                            <option value="FREE">{t('merchantProfile.operator.freeMoney')}</option>
                          </select>
                       </div>
                       <div className="space-y-2">
                          <label className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest">{t('merchantProfile.editModal.walletNumber')}</label>
                          <input type="text" required value={formData.compensationAccount?.operatorPhone || ''} onChange={e => setFormData({...formData, compensationAccount: {...formData.compensationAccount, operatorPhone: e.target.value}} as any)}
                            className="w-full bg-surface-container-high border-none rounded-lg p-3 text-sm font-mono font-bold focus:ring-2 focus:ring-primary/20" />
                       </div>
                     </div>
                   )}
                </div>
              </div>

              <div className="flex gap-4 pt-6 border-t border-outline-variant/10">
                 <button type="button" onClick={() => setIsEditModalOpen(false)} className="px-6 py-4 rounded-xl text-on-surface-variant font-bold hover:bg-surface-container-high transition-colors">
                   {t('merchantProfile.editModal.cancelEdit')}
                 </button>
                 <Button type="submit" className="grow py-4 shadow-lg shadow-primary/20" disabled={isActionLoading}>
                    {isActionLoading ? t('merchantProfile.editModal.savingProfile') : t('merchantProfile.editModal.saveConfiguration')}
                 </Button>
              </div>
           </form>
        </div>
      </Modal>

      {/* Status Change Confirmation Modal */}
      <Modal isOpen={isStatusModalOpen} onClose={() => !isActionLoading && setIsStatusModalOpen(false)} size="md">
        <div className="p-8">
          <div className="flex justify-between items-center mb-6 pb-4 border-b border-outline-variant/10">
            <div className="flex items-center gap-3">
              {pendingStatus === MerchantStatus.ACTIVE && <CheckCircle className="w-6 h-6 text-emerald-500" />}
              {pendingStatus === MerchantStatus.SUSPENDED && <AlertCircle className="w-6 h-6 text-orange-500" />}
              {pendingStatus === MerchantStatus.BLOCKED && <ShieldAlert className="w-6 h-6 text-rose-500" />}
              <h3 className="text-xl font-bold text-primary">
                {pendingStatus === MerchantStatus.ACTIVE && t('merchantProfile.statusToggle.activate')}
                {pendingStatus === MerchantStatus.SUSPENDED && t('merchantProfile.statusToggle.suspend')}
                {pendingStatus === MerchantStatus.BLOCKED && t('merchantProfile.statusToggle.block')}
              </h3>
            </div>
            <button onClick={() => !isActionLoading && setIsStatusModalOpen(false)} className="p-2 hover:bg-surface-container-high rounded-full transition-colors">
              <X className="w-5 h-5 text-on-surface-variant" />
            </button>
          </div>

          <div className="mb-8">
            <p className="text-on-surface-variant text-sm leading-relaxed">
              {pendingStatus === MerchantStatus.ACTIVE && t('merchantProfile.statusToggle.confirmActivate')}
              {pendingStatus === MerchantStatus.SUSPENDED && t('merchantProfile.statusToggle.confirmSuspend')}
              {pendingStatus === MerchantStatus.BLOCKED && t('merchantProfile.statusToggle.confirmBlock')}
            </p>

            {merchant && (
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
            )}
          </div>

          <div className="flex gap-4">
            <button
              type="button"
              onClick={() => setIsStatusModalOpen(false)}
              disabled={isActionLoading}
              className="flex-1 px-6 py-4 rounded-xl text-on-surface-variant font-bold hover:bg-surface-container-high transition-colors disabled:opacity-50"
            >
              {t('merchantProfile.statusToggle.cancel')}
            </button>
            <Button
              onClick={confirmStatusChange}
              disabled={isActionLoading}
              className={`flex-1 py-4 shadow-lg ${
                pendingStatus === MerchantStatus.ACTIVE ? 'bg-emerald-500 hover:bg-emerald-600 shadow-emerald-500/20' :
                pendingStatus === MerchantStatus.SUSPENDED ? 'bg-orange-500 hover:bg-orange-600 shadow-orange-500/20' :
                'bg-rose-500 hover:bg-rose-600 shadow-rose-500/20'
              }`}
            >
              {isActionLoading ? (
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

    </div>
  );
}
