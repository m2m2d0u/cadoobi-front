import React from 'react';
import { Store, Mail, Phone, MapPin, Briefcase, Globe, Edit2 } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import { StatusBadge, Button } from '../ui';
import type { MerchantResponse } from '../../types/api';

interface MerchantBusinessInfoProps {
  merchant: MerchantResponse;
  onEdit: () => void;
}

export function MerchantBusinessInfo({ merchant, onEdit }: MerchantBusinessInfoProps) {
  const { t } = useLanguage();

  return (
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
          <Button onClick={onEdit}>
            <Edit2 className="w-4 h-4" /> {t('merchantProfile.editProfile')}
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <InfoCard icon={Mail} label={t('merchantProfile.businessEmail')} value={merchant.email} />
          <InfoCard icon={Phone} label={t('merchantProfile.businessPhone')} value={merchant.phone} />
          <InfoCard icon={MapPin} label={t('merchantProfile.address')} value={merchant.address} title={merchant.address} />
          <InfoCard icon={Globe} label={t('merchantProfile.country')} value={merchant.country} />
        </div>
      </div>
    </div>
  );
}

interface InfoCardProps {
  icon: React.ElementType;
  label: string;
  value: string;
  title?: string;
}

function InfoCard({ icon: Icon, label, value, title }: InfoCardProps) {
  return (
    <div className="flex items-center gap-4 p-4 bg-surface-container-low rounded-2xl border border-outline-variant/10 hover:border-outline-variant/30 transition-colors">
      <div className="w-10 h-10 bg-surface-container-high rounded-xl flex items-center justify-center shrink-0">
        <Icon className="w-5 h-5 text-on-surface-variant" />
      </div>
      <div className="min-w-0">
        <p className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest">{label}</p>
        <p className="text-sm font-medium text-primary truncate" title={title}>{value}</p>
      </div>
    </div>
  );
}
