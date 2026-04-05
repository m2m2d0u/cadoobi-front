import React from 'react';
import { Mail, Shield, RefreshCw, Lock, Edit2 } from 'lucide-react';
import { IconButton, StatusBadge } from '../ui';
import type { StatusType } from '../ui';
import type { UserResponse } from '../../types/api';
import { PermissionGuard } from '../auth';
import { USER_UPDATE } from '../../lib/permissions';

interface UserTableRowProps {
  user: UserResponse;
  onResetAuth: (id: string) => void;
  onSuspend: (user: UserResponse) => void;
  onActivate: (id: string) => void;
  onEdit: (user: UserResponse) => void;
}

export function UserTableRow({ user, onResetAuth, onSuspend, onActivate, onEdit }: UserTableRowProps) {
  const mapStatus = (status: string): StatusType => {
    if (status === 'ACTIVE') return 'Active';
    if (status === 'PENDING') return 'Pending';
    if (status === 'SUSPENDED' || status === 'LOCKED' || status === 'BLOCKED') return 'Blocked';
    return 'Pending';
  };

  return (
    <tr className="hover:bg-surface-container-low/50 transition-colors group">
      <td className="px-6 py-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-primary text-white flex items-center justify-center font-bold text-sm">
            {user.fullName.split(' ').map(n => n[0]).join('')}
          </div>
          <div className="flex flex-col">
            <span className="font-bold text-primary text-sm">{user.fullName}</span>
            <span className="text-xs text-on-surface-variant flex items-center gap-1">
              <Mail className="w-3 h-3 opacity-50" /> {user.email}
            </span>
          </div>
        </div>
      </td>
      <td className="px-6 py-4">
        <div className="flex flex-wrap gap-1">
          {user.roles && user.roles.length > 0 ? user.roles.map(role => (
            <div key={role.id} className="flex items-center gap-1.5 bg-surface-container-high px-2 py-1 rounded">
              <Shield className="w-3.5 h-3.5 text-secondary" />
              <span className="text-xs font-bold text-primary">{role.name}</span>
            </div>
          )) : (
            <span className="text-xs text-on-surface-variant italic">No roles</span>
          )}
        </div>
      </td>
      <td className="px-6 py-4">
        <StatusBadge
          status={mapStatus(user.status)}
          label={user.status}
          variant="icon"
        />
      </td>
      <td className="px-6 py-4 text-xs font-mono text-on-surface-variant font-medium">
        {user.lastLoginAt ? new Date(user.lastLoginAt).toLocaleString() : 'Never'}
      </td>
      <td className="px-6 py-4 text-right">
        <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
          <PermissionGuard permission={USER_UPDATE}>
            <IconButton
              icon={RefreshCw}
              size="md"
              className="rounded-full bg-surface-container-low hover:bg-surface-container-high"
              title="Reset Failed Logins"
              onClick={() => onResetAuth(user.id)}
            />
          </PermissionGuard>
          <PermissionGuard permission={USER_UPDATE}>
            <IconButton
              icon={Lock}
              size="md"
              className={`rounded-full ${user.status === 'ACTIVE' ? 'bg-error/5 text-error hover:bg-error/20 hover:text-error' : 'bg-primary/5 text-primary hover:bg-primary/20 hover:text-primary'} transition-colors`}
              title={user.status === 'ACTIVE' ? 'Suspend Account' : 'Activate Account'}
              onClick={() => user.status === 'ACTIVE' ? onSuspend(user) : onActivate(user.id)}
            />
          </PermissionGuard>
          <PermissionGuard permission={USER_UPDATE}>
            <IconButton
              icon={Edit2}
              size="md"
              className="rounded-full hover:bg-outline-variant/10 text-on-surface-variant"
              title="Edit User"
              onClick={() => onEdit(user)}
            />
          </PermissionGuard>
        </div>
      </td>
    </tr>
  );
}
