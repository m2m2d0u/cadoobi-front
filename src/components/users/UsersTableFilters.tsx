import React from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { SearchInput } from '../ui';
import type { RoleResponse } from '../../types/api';

interface UsersTableFiltersProps {
  roles: RoleResponse[];
}

export function UsersTableFilters({ roles }: UsersTableFiltersProps) {
  const { t } = useLanguage();

  return (
    <div className="p-4 border-b border-outline-variant/10 flex gap-4 items-center">
      <SearchInput
        value=""
        onChange={() => { }}
        placeholder={t('users.search.placeholder')}
        className="grow"
      />
      <select className="bg-surface-container-high border-none rounded-lg text-sm px-4 py-2 font-bold text-primary cursor-pointer">
        <option>{t('users.filter.allRoles')}</option>
        {roles.map(r => (
          <option key={r.id} value={r.id}>{r.name}</option>
        ))}
      </select>
    </div>
  );
}
