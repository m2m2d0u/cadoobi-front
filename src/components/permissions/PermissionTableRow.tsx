import React from 'react';
import { Edit2, Trash2 } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import { IconButton, StatusBadge } from '../ui';
import type { StatusType } from '../ui';
import type { PermissionResponse } from '../../types/api';
import { PermissionGuard } from '../auth';
import { PERMISSION_UPDATE, PERMISSION_DELETE } from '../../lib/permissions';

interface PermissionTableRowProps {
  permission: PermissionResponse;
  onEdit: (permission: PermissionResponse) => void;
  onDelete: (id: string) => void;
}

export function PermissionTableRow({ permission, onEdit, onDelete }: PermissionTableRowProps) {
  const { t } = useLanguage();

  return (
    <tr className="hover:bg-surface-container-low/50 transition-colors group">
      <td className="px-6 py-4">
        <span className="font-bold text-primary text-sm font-mono bg-surface-container-low px-2 py-1 rounded-md">{permission.code}</span>
      </td>
      <td className="px-6 py-4 text-sm text-primary font-medium">{permission.name}</td>
      <td className="px-6 py-4 text-sm text-on-surface-variant">{permission.resource}</td>
      <td className="px-6 py-4">
        <StatusBadge
          status={(permission.isActive ? 'Active' : 'Blocked') as StatusType}
          label={permission.isActive ? t('common.active') : t('common.inactive') || 'Inactive'}
          variant="dot"
        />
      </td>
      <td className="px-6 py-4 text-right">
        <div className="flex justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          <PermissionGuard permission={PERMISSION_UPDATE}>
            <IconButton
              icon={Edit2}
              size="md"
              className="rounded-full bg-surface-container-low hover:bg-surface-container-high text-on-surface-variant hover:text-primary"
              onClick={() => onEdit(permission)}
            />
          </PermissionGuard>
          <PermissionGuard permission={PERMISSION_DELETE}>
            <IconButton
              icon={Trash2}
              size="md"
              className="rounded-full text-error bg-surface-container-low hover:bg-error/10 hover:text-error"
              onClick={() => onDelete(permission.id)}
            />
          </PermissionGuard>
        </div>
      </td>
    </tr>
  );
}
