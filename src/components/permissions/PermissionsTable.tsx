import React from 'react';
import { Key, ShieldAlert } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import { PermissionTableRow } from './PermissionTableRow';
import type { PermissionResponse } from '../../types/api';

interface PermissionsTableProps {
  permissions: PermissionResponse[];
  isLoading: boolean;
  error: string | null;
  onEdit: (permission: PermissionResponse) => void;
  onDelete: (id: string) => void;
}

export function PermissionsTable({ permissions, isLoading, error, onEdit, onDelete }: PermissionsTableProps) {
  const { t } = useLanguage();

  if (isLoading && permissions.length === 0) {
    return (
      <div className="absolute inset-0 flex items-center justify-center bg-surface-container-lowest/50 backdrop-blur-sm z-10">
        <div className="w-10 h-10 border-4 border-primary/20 border-t-primary rounded-full animate-spin"></div>
      </div>
    );
  }

  if (error && permissions.length === 0) {
    return (
      <div className="p-8 text-center bg-error/5 m-4 rounded-xl border border-error/20 text-error">
        <ShieldAlert className="w-12 h-12 mx-auto mb-4 opacity-50" />
        <h3 className="font-bold mb-1">{t('permissions.error.load')}</h3>
        <p className="text-sm opacity-80">{error}</p>
      </div>
    );
  }

  if (!error && permissions.length === 0 && !isLoading) {
    return (
      <div className="p-12 text-center text-on-surface-variant">
        <Key className="w-12 h-12 mx-auto mb-4 opacity-20" />
        <p>{t('permissions.empty')}</p>
      </div>
    );
  }

  return (
    <table className="w-full text-left border-collapse">
      <thead>
        <tr className="bg-surface-container-low border-b border-outline-variant/10">
          <th className="px-6 py-4 text-[10px] font-bold text-on-surface-variant uppercase tracking-widest">{t('permissions.table.code')}</th>
          <th className="px-6 py-4 text-[10px] font-bold text-on-surface-variant uppercase tracking-widest">{t('permissions.table.name')}</th>
          <th className="px-6 py-4 text-[10px] font-bold text-on-surface-variant uppercase tracking-widest">{t('permissions.table.resource')}</th>
          <th className="px-6 py-4 text-[10px] font-bold text-on-surface-variant uppercase tracking-widest">{t('permissions.table.status')}</th>
          <th className="px-6 py-4 text-[10px] font-bold text-on-surface-variant uppercase tracking-widest text-right">{t('permissions.table.actions')}</th>
        </tr>
      </thead>
      <tbody className="divide-y divide-outline-variant/5">
        {permissions.map((permission) => (
          <PermissionTableRow
            key={permission.id}
            permission={permission}
            onEdit={onEdit}
            onDelete={onDelete}
          />
        ))}
      </tbody>
    </table>
  );
}
