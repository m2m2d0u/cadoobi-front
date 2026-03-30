import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Store, Mail, Phone, MapPin, Calendar, ShieldCheck, 
  Building2, CreditCard, Smartphone, User, ChevronLeft,
  Briefcase, Globe, Edit2, ShieldAlert, X
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
      await merchantsService.update(id, formData);
      setIsEditModalOpen(false);
      fetchMerchant();
    } catch (err: any) {
      console.error(err);
      setError(err?.response?.data?.message || 'Failed to update merchant');
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
        <h3 className="font-bold mb-1">Error Loading Profile</h3>
        <p className="text-sm opacity-80">{error || 'Merchant not found'}</p>
        <button onClick={() => navigate('/merchants')} className="mt-4 text-sm font-bold underline hover:opacity-80 transition-opacity">Go Back to Directory</button>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto">
      <div className="mb-8 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button onClick={() => navigate('/merchants')} className="p-2 bg-surface-container-high rounded-full hover:bg-surface-container-highest transition-colors">
            <ChevronLeft className="w-5 h-5 text-on-surface-variant" />
          </button>
          <PageHeader title={merchant.name} subtitle={`Merchant Dashboard / ${merchant.code}`} customMargin="mb-0" />
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
                   variant="default"
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
                  <Edit2 className="w-4 h-4" /> Edit Profile
                </Button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="flex items-center gap-4 p-4 bg-surface-container-low rounded-2xl border border-outline-variant/10 hover:border-outline-variant/30 transition-colors">
                  <div className="w-10 h-10 bg-surface-container-high rounded-xl flex items-center justify-center shrink-0">
                    <Mail className="w-5 h-5 text-on-surface-variant" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest">Business Email</p>
                    <p className="text-sm font-medium text-primary truncate">{merchant.email}</p>
                  </div>
                </div>
                <div className="flex items-center gap-4 p-4 bg-surface-container-low rounded-2xl border border-outline-variant/10 hover:border-outline-variant/30 transition-colors">
                  <div className="w-10 h-10 bg-surface-container-high rounded-xl flex items-center justify-center shrink-0">
                    <Phone className="w-5 h-5 text-on-surface-variant" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest">Business Phone</p>
                    <p className="text-sm font-medium text-primary truncate">{merchant.phone}</p>
                  </div>
                </div>
                <div className="flex items-center gap-4 p-4 bg-surface-container-low rounded-2xl border border-outline-variant/10 hover:border-outline-variant/30 transition-colors">
                  <div className="w-10 h-10 bg-surface-container-high rounded-xl flex items-center justify-center shrink-0">
                    <MapPin className="w-5 h-5 text-on-surface-variant" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest">Address</p>
                    <p className="text-sm font-medium text-primary truncate" title={merchant.address}>{merchant.address}</p>
                  </div>
                </div>
                <div className="flex items-center gap-4 p-4 bg-surface-container-low rounded-2xl border border-outline-variant/10 hover:border-outline-variant/30 transition-colors">
                  <div className="w-10 h-10 bg-surface-container-high rounded-xl flex items-center justify-center shrink-0">
                    <Globe className="w-5 h-5 text-on-surface-variant" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest">Country</p>
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
                  <h4 className="text-lg font-bold text-primary">Owner Details</h4>
               </div>
             </div>
             
             <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6 bg-surface-container-low rounded-2xl border border-outline-variant/5">
                <div>
                   <p className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest mb-1.5 flex items-center gap-1.5"><User className="w-3 h-3" /> Full Name</p>
                   <p className="text-sm font-bold text-primary">{merchant.ownerFullName}</p>
                </div>
                <div>
                   <p className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest mb-1.5 flex items-center gap-1.5"><Mail className="w-3 h-3" /> Email</p>
                   <p className="text-sm font-bold text-primary">{merchant.ownerEmail}</p>
                </div>
                <div>
                   <p className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest mb-1.5 flex items-center gap-1.5"><Phone className="w-3 h-3" /> Phone Number</p>
                   <p className="text-sm font-bold text-primary">{merchant.ownerPhone}</p>
                </div>
                <div>
                   <p className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest mb-1.5 flex items-center gap-1.5"><ShieldCheck className="w-3 h-3" /> Owner CNI</p>
                   <p className="text-sm font-bold text-primary">{merchant.ownerCni || '—'}</p>
                </div>
             </div>
          </div>
        </div>

        {/* Right Column: Settlement & Meta */}
        <div className="space-y-8">
          
          <div className="bg-surface-container-lowest p-8 rounded-3xl border border-outline-variant/10 shadow-sm">
            <h4 className="text-lg font-bold text-primary mb-6 flex items-center gap-2">
              <CreditCard className="w-5 h-5 text-on-surface-variant" /> Settlement Routing
            </h4>
            
            <div className={`p-6 rounded-2xl mb-6 shadow-sm border ${merchant.compensationAccount.type === 'BANK' ? 'bg-primary/5 border-primary/20' : 'bg-secondary/5 border-secondary/20'}`}>
               <div className="flex items-center gap-3 mb-6">
                 <div className={`w-12 h-12 rounded-xl flex items-center justify-center shadow-sm ${merchant.compensationAccount.type === 'BANK' ? 'bg-white text-primary' : 'bg-white text-secondary'}`}>
                   {merchant.compensationAccount.type === 'BANK' ? <Building2 className="w-6 h-6" /> : <Smartphone className="w-6 h-6" />}
                 </div>
                 <div>
                   <h5 className={`font-bold ${merchant.compensationAccount.type === 'BANK' ? 'text-primary' : 'text-secondary'}`}>
                     {merchant.compensationAccount.type === 'BANK' ? 'Bank Wire Transfer' : 'Mobile Money'}
                   </h5>
                   <p className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest mt-0.5">Active Payout Endpoint</p>
                 </div>
               </div>
               
               {merchant.compensationAccount.type === 'BANK' && (
                 <div className="space-y-4 pt-4 border-t border-outline-variant/10">
                   <div>
                     <p className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest mb-1">Bank Name</p>
                     <p className="text-sm font-bold text-primary bg-white/50 px-3 py-2 rounded-lg">{merchant.compensationAccount.bankName}</p>
                   </div>
                   <div>
                     <p className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest mb-1">Account Number (IBAN)</p>
                     <p className="text-sm font-mono font-bold text-primary bg-white/50 px-3 py-2 rounded-lg">{merchant.compensationAccount.accountNumber}</p>
                   </div>
                 </div>
               )}

               {merchant.compensationAccount.type === 'OPERATOR' && (
                 <div className="space-y-4 pt-4 border-t border-outline-variant/10">
                   <div>
                     <p className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest mb-1">Telecom Operator</p>
                     <p className="text-sm font-bold text-primary bg-white/50 px-3 py-2 rounded-lg uppercase">{merchant.compensationAccount.operatorCode}</p>
                   </div>
                   <div>
                     <p className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest mb-1">Wallet Endpoint</p>
                     <p className="text-sm font-mono font-bold text-primary bg-white/50 px-3 py-2 rounded-lg">{merchant.compensationAccount.operatorPhone}</p>
                   </div>
                 </div>
               )}
            </div>
            
            <div className="flex flex-col gap-3">
              <div className="flex justify-between items-center p-4 bg-surface-container-low rounded-xl border border-outline-variant/5">
                <div className="flex items-center gap-2">
                   <Calendar className="w-4 h-4 text-on-surface-variant" />
                   <span className="text-sm text-on-surface-variant font-bold">Joined Date</span>
                </div>
                <span className="text-sm font-bold text-primary">{new Date(merchant.createdAt).toLocaleDateString()}</span>
              </div>
              <div className="flex justify-between items-center p-4 bg-surface-container-low rounded-xl border border-outline-variant/5">
                <div className="flex items-center gap-2">
                   <Calendar className="w-4 h-4 text-on-surface-variant" />
                   <span className="text-sm text-on-surface-variant font-bold">Last Updated</span>
                </div>
                <span className="text-sm font-bold text-primary">{new Date(merchant.updatedAt).toLocaleDateString()}</span>
              </div>
            </div>
          </div>
          
        </div>
      </div>

      {/* Edit Modal */}
      <Modal isOpen={isEditModalOpen} onClose={() => !isActionLoading && setIsEditModalOpen(false)} size="lg">
        <div className="p-8">
           <div className="flex justify-between items-center mb-8 pb-4 border-b border-outline-variant/10">
             <h3 className="text-xl font-bold text-primary flex items-center gap-3"><Edit2 className="w-6 h-6" /> Edit Merchant Configuration</h3>
             <button onClick={() => !isActionLoading && setIsEditModalOpen(false)} className="p-2 hover:bg-surface-container-high rounded-full transition-colors">
               <X className="w-5 h-5 text-on-surface-variant" />
             </button>
           </div>
           
           <form onSubmit={handleEditSubmit} className="space-y-8">
              {/* Basic Fields */}
              <div>
                <h4 className="text-sm font-bold text-primary mb-4 uppercase tracking-widest">Business Information</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6 bg-surface-container-lowest rounded-2xl border border-outline-variant/10">
                   <div className="space-y-2">
                     <label className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest">Business Name</label>
                     <input type="text" required value={formData.name || ''} onChange={e => setFormData({...formData, name: e.target.value})}
                       className="w-full bg-surface-container-high border-none rounded-lg p-3 text-sm font-bold focus:ring-2 focus:ring-primary/20" />
                   </div>
                   <div className="space-y-2">
                     <label className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest">Business Email</label>
                     <input type="email" required value={formData.email || ''} onChange={e => setFormData({...formData, email: e.target.value})}
                       className="w-full bg-surface-container-high border-none rounded-lg p-3 text-sm font-bold focus:ring-2 focus:ring-primary/20" />
                   </div>
                   <div className="space-y-2">
                     <label className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest">Phone Number</label>
                     <input type="tel" required value={formData.phone || ''} onChange={e => setFormData({...formData, phone: e.target.value})}
                       className="w-full bg-surface-container-high border-none rounded-lg p-3 text-sm font-bold focus:ring-2 focus:ring-primary/20" />
                   </div>
                   <div className="space-y-2">
                     <label className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest">Physical Address</label>
                     <input type="text" required value={formData.address || ''} onChange={e => setFormData({...formData, address: e.target.value})}
                       className="w-full bg-surface-container-high border-none rounded-lg p-3 text-sm font-bold focus:ring-2 focus:ring-primary/20" />
                   </div>
                   <div className="space-y-2">
                     <label className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest">Business Type</label>
                     <input type="text" required value={formData.businessType || ''} onChange={e => setFormData({...formData, businessType: e.target.value})}
                       className="w-full bg-surface-container-high border-none rounded-lg p-3 text-sm font-bold focus:ring-2 focus:ring-primary/20" />
                   </div>
                   <div className="space-y-2">
                      <label className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest">Account Status</label>
                      <select required value={formData.status || ''} onChange={e => setFormData({...formData, status: e.target.value as MerchantStatus})}
                        className="w-full bg-surface-container-high border-none rounded-lg p-3 text-sm font-bold focus:ring-2 focus:ring-primary/20">
                         <option value={MerchantStatus.ACTIVE}>Active</option>
                         <option value={MerchantStatus.PENDING}>Pending</option>
                         <option value={MerchantStatus.SUSPENDED}>Suspended</option>
                         <option value={MerchantStatus.BLOCKED}>Blocked</option>
                      </select>
                   </div>
                </div>
              </div>

              {/* Settlement Edit snippet */}
              <div>
                <h4 className="text-sm font-bold text-primary mb-4 uppercase tracking-widest">Settlement Endpoint</h4>
                <div className="p-6 bg-surface-container-lowest rounded-2xl border border-outline-variant/10">
                   <div className="grid grid-cols-2 gap-4 mb-6">
                      <button type="button" onClick={() => handleSettlementTypeChange(CompensationAccountType.BANK)}
                        className={`py-3 px-4 rounded-xl text-sm font-bold flex items-center justify-center gap-2 border-2 transition-all ${formData.compensationAccount?.type === 'BANK' ? 'border-primary bg-primary/10 text-primary' : 'border-transparent bg-surface-container-high text-on-surface-variant hover:bg-surface-container-highest'}`}>
                        <Building2 className="w-4 h-4" /> Bank Account
                      </button>
                      <button type="button" onClick={() => handleSettlementTypeChange(CompensationAccountType.OPERATOR)}
                        className={`py-3 px-4 rounded-xl text-sm font-bold flex items-center justify-center gap-2 border-2 transition-all ${formData.compensationAccount?.type === 'OPERATOR' ? 'border-primary bg-primary/10 text-primary' : 'border-transparent bg-surface-container-high text-on-surface-variant hover:bg-surface-container-highest'}`}>
                        <Smartphone className="w-4 h-4" /> Mobile Wallet
                      </button>
                   </div>

                   {formData.compensationAccount?.type === 'BANK' ? (
                     <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-surface-container-low p-4 rounded-xl">
                       <div className="space-y-2">
                          <label className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest">Bank Name</label>
                          <input type="text" required value={formData.compensationAccount.bankName || ''} onChange={e => setFormData({...formData, compensationAccount: {...formData.compensationAccount, bankName: e.target.value}} as any)}
                            className="w-full bg-surface-container-high border-none rounded-lg p-3 text-sm font-bold focus:ring-2 focus:ring-primary/20" />
                       </div>
                       <div className="space-y-2">
                          <label className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest">Account Details (IBAN)</label>
                          <input type="text" required value={formData.compensationAccount.accountNumber || ''} onChange={e => setFormData({...formData, compensationAccount: {...formData.compensationAccount, accountNumber: e.target.value}} as any)}
                            className="w-full bg-surface-container-high border-none rounded-lg p-3 text-sm font-mono font-bold focus:ring-2 focus:ring-primary/20" />
                       </div>
                     </div>
                   ) : (
                     <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-surface-container-low p-4 rounded-xl">
                       <div className="space-y-2">
                          <label className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest">Operator Code</label>
                          <select required value={formData.compensationAccount?.operatorCode || ''} onChange={e => setFormData({...formData, compensationAccount: {...formData.compensationAccount, operatorCode: e.target.value}} as any)}
                            className="w-full bg-surface-container-high border-none rounded-lg p-3 text-sm font-bold focus:ring-2 focus:ring-primary/20">
                            <option value="" disabled>Select Operator...</option>
                            <option value="WAVE">Wave</option>
                            <option value="OM">Orange Money</option>
                            <option value="FREE">Free Money</option>
                          </select>
                       </div>
                       <div className="space-y-2">
                          <label className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest">Wallet Number</label>
                          <input type="text" required value={formData.compensationAccount?.operatorPhone || ''} onChange={e => setFormData({...formData, compensationAccount: {...formData.compensationAccount, operatorPhone: e.target.value}} as any)}
                            className="w-full bg-surface-container-high border-none rounded-lg p-3 text-sm font-mono font-bold focus:ring-2 focus:ring-primary/20" />
                       </div>
                     </div>
                   )}
                </div>
              </div>

              <div className="flex gap-4 pt-6 border-t border-outline-variant/10">
                 <button type="button" onClick={() => setIsEditModalOpen(false)} className="px-6 py-4 rounded-xl text-on-surface-variant font-bold hover:bg-surface-container-high transition-colors">
                   Cancel Edit
                 </button>
                 <Button type="submit" className="grow py-4 shadow-lg shadow-primary/20" disabled={isActionLoading}>
                    {isActionLoading ? 'Saving Profile...' : 'Save Merchant Configuration'}
                 </Button>
              </div>
           </form>
        </div>
      </Modal>

    </div>
  );
}
