import React from 'react';
import { ShieldCheck, Key, Users } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import { StatsCard } from '../ui';
import type { RoleResponse } from '../../types/api';

interface RolesStatsSectionProps {
  totalElements: number;
  roles: RoleResponse[];
}

export function RolesStatsSection({ totalElements, roles }: RolesStatsSectionProps) {
  const { t } = useLanguage();

  const systemCount = roles.filter(r => r.isSystemRole).length;
  const customCount = roles.length - systemCount;

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
      <StatsCard
        label={t('roles.stats.total')}
        value={totalElements.toString()}
        icon={ShieldCheck}
        iconColor="primary"
      />
      <StatsCard
        label={t('roles.stats.system')}
        value={systemCount.toString()}
        icon={Key}
        iconColor="secondary"
      />
      <StatsCard
        label={t('roles.stats.custom')}
        value={customCount.toString()}
        icon={Users}
        iconColor="amber"
      />
    </div>
  );
}
