import React from 'react';
import { ChevronLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../../context/LanguageContext';
import { PageHeader } from '../ui';

interface MerchantHeaderProps {
  merchantName: string;
  merchantCode: string;
}

export function MerchantHeader({ merchantName, merchantCode }: MerchantHeaderProps) {
  const navigate = useNavigate();
  const { t } = useLanguage();

  return (
    <div className="mb-8 flex items-center justify-between">
      <div className="flex items-center gap-4">
        <button
          onClick={() => navigate('/merchants')}
          className="p-2 bg-surface-container-high rounded-full hover:bg-surface-container-highest transition-colors"
        >
          <ChevronLeft className="w-5 h-5 text-on-surface-variant" />
        </button>
        <PageHeader
          title={merchantName}
          subtitle={`${t('merchantProfile.dashboard')} / ${merchantCode}`}
          customMargin="mb-0"
        />
      </div>
    </div>
  );
}
