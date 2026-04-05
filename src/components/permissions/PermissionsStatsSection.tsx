import React from 'react';
import { Key, ShieldAlert, Lock } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import { StatsCard } from '../ui';
import type { PermissionResponse } from '../../types/api';

interface PermissionsStatsSectionProps {
  totalElements: number;
  permissions: PermissionResponse[];
}

export function PermissionsStatsSection({ totalElements, permissions }: PermissionsStatsSectionProps) {
  const { t } = useLanguage();

  const activeCount = permissions.filter(p => p.isActive).length;
  const inactiveCount = permissions.length - activeCount;

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
      <StatsCard
        label={t('permissions.stats.total')}
        value={totalElements.toString()}
        icon={Key}
        iconColor="primary"
      />
      <StatsCard
        label={t('permissions.stats.active')}
        value={activeCount.toString()}
        icon={ShieldAlert}
        iconColor="secondary"
      />
      <StatsCard
        label={t('permissions.stats.inactive')}
        value={inactiveCount.toString()}
        icon={Lock}
        iconColor="amber"
      />
    </div>
  );
}
