import React from 'react';
import { Users as UsersIcon, Shield, Lock } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import { StatsCard } from '../ui';
import type { UserResponse } from '../../types/api';

interface UsersStatsSectionProps {
  totalElements: number;
  users: UserResponse[];
  rolesCount: number;
}

export function UsersStatsSection({ totalElements, users, rolesCount }: UsersStatsSectionProps) {
  const { t } = useLanguage();

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
      <StatsCard
        label={t('users.stats.totalTeam')}
        value={totalElements.toString()}
        icon={UsersIcon}
        iconColor="primary"
        badge={<span className="text-[10px] font-bold text-secondary uppercase tracking-widest">{t('users.stats.newThisWeek')}</span>}
      />
      <StatsCard
        label={t('users.stats.security')}
        value="98%"
        icon={Shield}
        iconColor="secondary"
        badge={<span className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest">{rolesCount} Roles</span>}
      />
      <StatsCard
        label={t('users.stats.activeSessions')}
        value={users.filter(u => u.status === 'ACTIVE').length.toString()}
        icon={Lock}
        iconColor="amber"
        badge={<span className="text-[10px] font-bold text-error uppercase tracking-widest">{t('users.stats.failedLogins')}</span>}
      />
    </div>
  );
}
