import React from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { SearchInput } from '../ui';
import type { RoleResponse } from '../../types/api';

interface UsersTableFiltersProps {
  searchQuery: string;
  onSearchChange: (value: string) => void;
  roles: RoleResponse[];
}

export function UsersTableFilters({ searchQuery, onSearchChange, roles }: UsersTableFiltersProps) {
  const { t } = useLanguage();

  return (
    <div className="p-4 border-b border-outline-variant/10 flex gap-4 items-center">
      <SearchInput
        value={searchQuery}
        onChange={onSearchChange}
        placeholder={t('users.search.placeholder')}
        className="grow"
      />
    </div>
  );
}
