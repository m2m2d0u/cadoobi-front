import React from 'react';
import { RefreshCw, Users as UsersIcon } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import { UserTableRow } from './UserTableRow';
import type { UserResponse } from '../../types/api';

interface UsersTableProps {
  users: UserResponse[];
  isLoading: boolean;
  isActionLoading: boolean;
  onResetAuth: (id: string) => void;
  onSuspend: (user: UserResponse) => void;
  onActivate: (id: string) => void;
  onEdit: (user: UserResponse) => void;
}

export function UsersTable({
  users,
  isLoading,
  isActionLoading,
  onResetAuth,
  onSuspend,
  onActivate,
  onEdit
}: UsersTableProps) {
  const { t } = useLanguage();

  if (isLoading && users.length === 0) {
    return (
      <div className="p-12 flex justify-center">
        <RefreshCw className="w-8 h-8 text-primary animate-spin" />
      </div>
    );
  }

  if (users.length === 0) {
    return (
      <div className="p-12 text-center text-on-surface-variant flex flex-col items-center">
        <UsersIcon className="w-12 h-12 mb-4 opacity-20" />
        <p className="font-bold">No users provisioned yet in the system.</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left border-collapse relative">
        <thead>
          <tr className="bg-surface-container-low border-b border-outline-variant/10">
            <th className="px-6 py-4 text-[10px] font-bold text-on-surface-variant uppercase tracking-widest">{t('users.table.user')}</th>
            <th className="px-6 py-4 text-[10px] font-bold text-on-surface-variant uppercase tracking-widest">{t('users.table.role')}</th>
            <th className="px-6 py-4 text-[10px] font-bold text-on-surface-variant uppercase tracking-widest">{t('users.table.status')}</th>
            <th className="px-6 py-4 text-[10px] font-bold text-on-surface-variant uppercase tracking-widest">{t('users.table.lastActive')}</th>
            <th className="px-6 py-4 text-[10px] font-bold text-on-surface-variant uppercase tracking-widest text-right">{t('users.table.actions')}</th>
          </tr>
        </thead>
        <tbody className={`divide-y divide-outline-variant/5 transition-opacity ${isActionLoading || isLoading ? 'opacity-50 pointer-events-none' : ''}`}>
          {users.map((user) => (
            <UserTableRow
              key={user.id}
              user={user}
              onResetAuth={onResetAuth}
              onSuspend={onSuspend}
              onActivate={onActivate}
              onEdit={onEdit}
            />
          ))}
        </tbody>
      </table>
    </div>
  );
}
