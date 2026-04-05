import React from 'react';
import { Users, Edit2, Trash2 } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import { IconButton, StatusBadge } from '../ui';
import type { StatusType } from '../ui';
import type { RoleResponse } from '../../types/api';
import { PermissionGuard } from '../auth';
import { ROLE_UPDATE, ROLE_DELETE } from '../../lib/permissions';

interface RoleTableRowProps {
  role: RoleResponse;
  onEdit: (role: RoleResponse) => void;
  onDelete: (id: string) => void;
}

export function RoleTableRow({ role, onEdit, onDelete }: RoleTableRowProps) {
  const { t } = useLanguage();

  return (
    <tr className="hover:bg-surface-container-low/50 transition-colors group">
      <td className="px-6 py-4">
        <div className="flex flex-col">
          <span className="font-bold text-primary text-sm flex items-center gap-2">
            {role.name}
            {role.isSystemRole && <span className="text-[10px] px-2 py-0.5 rounded-full bg-secondary/10 text-secondary uppercase">{t('roles.table.system')}</span>}
          </span>
          <span className="text-xs text-on-surface-variant truncate max-w-[200px]">{role.description}</span>
        </div>
      </td>
      <td className="px-6 py-4 text-sm font-mono text-on-surface-variant">
        {role.code}
      </td>
      <td className="px-6 py-4 text-sm font-bold text-primary">
        <div className="flex items-center gap-2">
          <Users className="w-3.5 h-3.5 text-on-surface-variant" />
          {role.userCount}
        </div>
      </td>
      <td className="px-6 py-4">
        <StatusBadge
          status={(role.isActive ? 'Active' : 'Blocked') as StatusType}
          label={role.isActive ? t('common.active') : t('common.inactive') || 'Inactive'}
          variant="dot"
        />
      </td>
      <td className="px-6 py-4 text-right">
        <div className="flex justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          <PermissionGuard permission={ROLE_UPDATE}>
            <IconButton
              icon={Edit2}
              size="md"
              className="rounded-full bg-surface-container-low hover:bg-surface-container-high"
              onClick={() => onEdit(role)}
            />
          </PermissionGuard>
          {!role.isSystemRole && (
            <PermissionGuard permission={ROLE_DELETE}>
              <IconButton
                icon={Trash2}
                size="md"
                className="rounded-full text-error bg-surface-container-low hover:bg-error/10 hover:text-error"
                onClick={() => onDelete(role.id)}
              />
            </PermissionGuard>
          )}
        </div>
      </td>
    </tr>
  );
}
