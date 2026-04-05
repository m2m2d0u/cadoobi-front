import React from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { SearchInput } from '../ui';

interface RolesTableFiltersProps {
  searchQuery: string;
  onSearchChange: (value: string) => void;
}

export function RolesTableFilters({ searchQuery, onSearchChange }: RolesTableFiltersProps) {
  const { t } = useLanguage();

  return (
    <div className="p-4 border-b border-outline-variant/10 flex gap-4 items-center">
      <SearchInput
        value={searchQuery}
        onChange={onSearchChange}
        placeholder={t('roles.search.placeholder')}
        className="grow"
      />
    </div>
  );
}
