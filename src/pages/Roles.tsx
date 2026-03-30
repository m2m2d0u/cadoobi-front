import React, { useState, useEffect } from 'react';
import {
  ShieldCheck,
  Plus,
  Users,
  Key,
  MoreVertical,
  X,
  Edit2,
  Trash2
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { Button, IconButton, Modal, PageHeader, SearchInput, StatsCard, StatusBadge } from '../components/ui';
import type { StatusType } from '../components/ui';
import { rolesService } from '../services';
import type { RoleResponse } from '../types/api';

const fallbackRoles: RoleResponse[] = [
  { id: '1', code: 'SUPER_ADMIN', name: 'Super Admin', description: 'Full system access', isSystemRole: true, isActive: true, permissions: [], userCount: 2, createdAt: '', updatedAt: '' },
  { id: '2', code: 'SUPPORT_AGENT', name: 'Support Agent', description: 'Can view users and transactions', isSystemRole: false, isActive: true, permissions: [], userCount: 15, createdAt: '', updatedAt: '' },
  { id: '3', code: 'FINANCE_MANAGER', name: 'Finance Manager', description: 'Can issue refunds and view reports', isSystemRole: false, isActive: false, permissions: [], userCount: 4, createdAt: '', updatedAt: '' },
];

export function Roles() {
  const { t } = useLanguage();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [roles, setRoles] = useState<RoleResponse[]>(fallbackRoles);
  const [searchQuery, setSearchQuery] = useState('');

  // Uncomment to fetch real data
  /*
  useEffect(() => {
    rolesService.list().then(setRoles).catch(console.error);
  }, []);
  */

  const systemCount = roles.filter(r => r.isSystemRole).length;
  const customCount = roles.length - systemCount;

  return (
    <div className="max-w-7xl mx-auto">
      <PageHeader
        title={t('roles.title')}
        subtitle={t('roles.subtitle')}
        actions={
          <Button onClick={() => setIsModalOpen(true)}>
            <Plus className="w-4 h-4" />
            {t('roles.create')}
          </Button>
        }
      />

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
        <div className="p-8">
          <div className="flex justify-between items-start mb-8">
            <div>
              <h3 className="text-2xl font-bold text-primary mb-1">{t('roles.create')}</h3>
            </div>
            <button
              onClick={() => setIsModalOpen(false)}
              className="p-2 hover:bg-surface-container-high rounded-full transition-colors"
            >
              <X className="w-5 h-5 text-on-surface-variant" />
            </button>
          </div>

          <div className="space-y-6">
            <div className="space-y-2">
              <label className="text-[10px] font-bold text-primary uppercase tracking-widest">Role Name</label>
              <input
                type="text"
                placeholder="e.g. Finance Officer"
                className="w-full bg-surface-container-high border-none rounded-lg p-4 text-sm focus:ring-2 focus:ring-primary/20 transition-all"
              />
            </div>
            
            <div className="space-y-2">
              <label className="text-[10px] font-bold text-primary uppercase tracking-widest">Role Code (Must be unique uppercase)</label>
              <input
                type="text"
                placeholder="FINANCE_OFFICER"
                className="w-full bg-surface-container-high border-none rounded-lg p-4 text-sm focus:ring-2 focus:ring-primary/20 transition-all"
              />
            </div>

            <div className="p-4 bg-surface-container-low border border-outline-variant/10 rounded-xl">
              <p className="text-sm font-bold text-primary mb-2">Assign Permissions</p>
              <div className="space-y-2 max-h-40 overflow-y-auto pr-2">
                {['users:read', 'users:write', 'payments:refund', 'reports:export'].map(perm => (
                  <label key={perm} className="flex items-center gap-3 p-2 hover:bg-surface-container-high rounded-lg cursor-pointer">
                    <input type="checkbox" className="w-4 h-4 text-primary border-outline-variant rounded focus:ring-primary" />
                    <span className="text-sm text-on-surface-variant font-mono">{perm}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>

          <div className="mt-10 space-y-4">
            <button className="w-full bg-primary text-white py-4 rounded-xl font-bold flex items-center justify-center gap-2 hover:opacity-90 transition-all shadow-lg shadow-primary/20">
              Save Role
            </button>
          </div>
        </div>
      </Modal>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        <StatsCard
          label={t('roles.stats.total')}
          value={roles.length.toString()}
          icon={ShieldCheck}
          iconColor="primary"
        />
        <StatsCard
          label={t('roles.stats.system')}
          value={systemCount.toString()}
          icon={Key}
          iconColor="secondary"
        />
        <StatsCard
          label={t('roles.stats.custom')}
          value={customCount.toString()}
          icon={Users}
          iconColor="amber"
        />
      </div>

      <div className="bg-surface-container-lowest rounded-2xl border border-outline-variant/10 overflow-hidden shadow-sm">
        <div className="p-4 border-b border-outline-variant/10 flex gap-4 items-center">
          <SearchInput
            value={searchQuery}
            onChange={setSearchQuery}
            placeholder={t('roles.search.placeholder')}
            className="grow"
          />
        </div>

        <div className="overflow-x-auto">
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
              {roles.filter(r => r.name.toLowerCase().includes(searchQuery.toLowerCase()) || r.code.toLowerCase().includes(searchQuery.toLowerCase())).map((role) => (
                <tr key={role.id} className="hover:bg-surface-container-low/50 transition-colors group">
                  <td className="px-6 py-4">
                    <div className="flex flex-col">
                      <span className="font-bold text-primary text-sm flex items-center gap-2">
                        {role.name}
                        {role.isSystemRole && <span className="text-[10px] px-2 py-0.5 rounded-full bg-secondary/10 text-secondary uppercase">System</span>}
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
                      <IconButton icon={Edit2} size="md" className="rounded-full" />
                      {!role.isSystemRole && (
                        <IconButton icon={Trash2} size="md" className="rounded-full text-error hover:bg-error/10 hover:text-error" />
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
