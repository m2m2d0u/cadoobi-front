import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ShieldAlert } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { merchantsService } from '../services';
import type { MerchantResponse, UpdateMerchantRequest } from '../types/api';
import { CompensationAccountType, MerchantStatus } from '../types/enums';
import {
  NotificationToast,
  MerchantHeader,
  MerchantBusinessInfo,
  MerchantOwnerInfo,
  MerchantStatusActions,
  MerchantSettlement,
  StatusChangeModal,
  MerchantEditModal,
} from '../components/merchant';

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
      setTimeout(() => setNotification(null), 5000);
    } catch (err: any) {
      console.error(err);
      const errorMessage = err?.response?.data?.message || t('merchantProfile.editModal.errorMessage');
      setNotification({ type: 'error', message: errorMessage });
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
        <NotificationToast
          type={notification.type}
          message={notification.message}
          onClose={() => setNotification(null)}
        />
      )}

      {/* Header */}
      <MerchantHeader merchantId={merchant.id} merchantName={merchant.name} merchantCode={merchant.code} />

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Business & Owner Details */}
        <div className="lg:col-span-2 space-y-8">
          <MerchantBusinessInfo merchant={merchant} onEdit={() => setIsEditModalOpen(true)} />
          <MerchantOwnerInfo merchant={merchant} />
        </div>

        {/* Right Column: Status & Settlement */}
        <div className="space-y-8">
          <MerchantStatusActions
            currentStatus={merchant.status}
            onStatusChange={handleStatusChange}
            isLoading={isActionLoading}
          />
          <MerchantSettlement merchant={merchant} />
        </div>
      </div>

      {/* Edit Modal */}
      <MerchantEditModal
        isOpen={isEditModalOpen}
        onClose={() => !isActionLoading && setIsEditModalOpen(false)}
        formData={formData}
        setFormData={setFormData}
        onSubmit={handleEditSubmit}
        onSettlementTypeChange={handleSettlementTypeChange}
        isLoading={isActionLoading}
      />

      {/* Status Change Confirmation Modal */}
      <StatusChangeModal
        isOpen={isStatusModalOpen}
        onClose={() => !isActionLoading && setIsStatusModalOpen(false)}
        merchant={merchant}
        pendingStatus={pendingStatus}
        onConfirm={confirmStatusChange}
        isLoading={isActionLoading}
      />
    </div>
  );
}
