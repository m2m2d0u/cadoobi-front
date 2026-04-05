import React from 'react';
import { ShieldCheck, ShieldAlert } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import { RoleTableRow } from './RoleTableRow';
import type { RoleResponse } from '../../types/api';

interface RolesTableProps {
  roles: RoleResponse[];
  isLoading: boolean;
  error: string | null;
  onEdit: (role: RoleResponse) => void;
  onDelete: (id: string) => void;
}

export function RolesTable({ roles, isLoading, error, onEdit, onDelete }: RolesTableProps) {
  const { t } = useLanguage();

  if (isLoading && roles.length === 0) {
    return (
      <div className="absolute inset-0 flex items-center justify-center bg-surface-container-lowest/50 backdrop-blur-sm z-10">
        <div className="w-10 h-10 border-4 border-primary/20 border-t-primary rounded-full animate-spin"></div>
      </div>
    );
  }

  if (error && roles.length === 0) {
    return (
      <div className="p-8 text-center bg-error/5 m-4 rounded-xl border border-error/20 text-error">
        <ShieldAlert className="w-12 h-12 mx-auto mb-4 opacity-50" />
        <h3 className="font-bold mb-1">{t('roles.error.load')}</h3>
        <p className="text-sm opacity-80">{error}</p>
      </div>
    );
  }

  if (!error && roles.length === 0 && !isLoading) {
    return (
      <div className="p-12 text-center text-on-surface-variant">
        <ShieldCheck className="w-12 h-12 mx-auto mb-4 opacity-20" />
        <p>{t('roles.empty')}</p>
      </div>
    );
  }

  return (
    <table className="w-full text-left border-collapse">
      <thead>
        <tr className="bg-surface-container-low border-b border-outline-variant/10">
          <th className="px-6 py-4 text-[10px] font-bold text-on-surface-variant uppercase tracking-widest">{t('roles.table.role')}</th>
          <th className="px-6 py-4 text-[10px] font-bold text-on-surface-variant uppercase tracking-widest">{t('roles.table.code')}</th>
          <th className="px-6 py-4 text-[10px] font-bold text-on-surface-variant uppercase tracking-widest">{t('roles.table.usersCount')}</th>
          <th className="px-6 py-4 text-[10px] font-bold text-on-surface-variant uppercase tracking-widest">{t('roles.table.status')}</th>
          <th className="px-6 py-4 text-[10px] font-bold text-on-surface-variant uppercase tracking-widest text-right">{t('roles.table.actions')}</th>
        </tr>
      </thead>
      <tbody className="divide-y divide-outline-variant/5">
        {roles.map((role) => (
          <RoleTableRow
            key={role.id}
            role={role}
            onEdit={onEdit}
            onDelete={onDelete}
          />
        ))}
      </tbody>
    </table>
  );
}
