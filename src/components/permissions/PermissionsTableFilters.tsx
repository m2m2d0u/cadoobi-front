import React from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { SearchInput } from '../ui';

interface PermissionsTableFiltersProps {
  searchQuery: string;
  onSearchChange: (value: string) => void;
}

export function PermissionsTableFilters({ searchQuery, onSearchChange }: PermissionsTableFiltersProps) {
  const { t } = useLanguage();

  return (
    <div className="p-4 border-b border-outline-variant/10 flex gap-4 items-center">
      <SearchInput
        value={searchQuery}
        onChange={onSearchChange}
        placeholder={t('permissions.search.placeholder')}
        className="grow"
      />
    </div>
  );
}
