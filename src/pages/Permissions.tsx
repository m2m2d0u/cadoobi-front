import React, { useState, useEffect } from 'react';
import {
  Key,
  Plus,
  ShieldAlert,
  Search,
  MoreVertical,
  X,
  Edit2,
  Trash2,
  Lock
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { Button, IconButton, Modal, PageHeader, SearchInput, StatsCard, StatusBadge } from '../components/ui';
import type { StatusType } from '../components/ui';
import { permissionsService } from '../services';
import type { PermissionResponse } from '../types/api';

// Fallback mock data in case API is unavailable
const fallbackPermissions: PermissionResponse[] = [
  { id: '1', code: 'users:read', name: 'Read Users', description: 'Can view users', resource: 'users', action: 'read', isActive: true, createdAt: '', updatedAt: '' },
  { id: '2', code: 'users:write', name: 'Write Users', description: 'Can edit users', resource: 'users', action: 'write', isActive: true, createdAt: '', updatedAt: '' },
  { id: '3', code: 'payments:refund', name: 'Refund Payments', description: 'Can refund transactions', resource: 'payments', action: 'refund', isActive: false, createdAt: '', updatedAt: '' },
];

export function Permissions() {
  const { t } = useLanguage();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [permissions, setPermissions] = useState<PermissionResponse[]>(fallbackPermissions);
  const [searchQuery, setSearchQuery] = useState('');

  // Uncomment to fetch real data
  /*
  useEffect(() => {
    permissionsService.list().then(setPermissions).catch(console.error);
  }, []);
  */

  const activeCount = permissions.filter(p => p.isActive).length;
  const inactiveCount = permissions.length - activeCount;

  return (
    <div className="max-w-7xl mx-auto">
      <PageHeader
        title={t('permissions.title')}
        subtitle={t('permissions.subtitle')}
        actions={
          <Button onClick={() => setIsModalOpen(true)}>
            <Plus className="w-4 h-4" />
            {t('permissions.create')}
          </Button>
        }
      />

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
        <div className="p-8">
          <div className="flex justify-between items-start mb-8">
            <div>
              <h3 className="text-2xl font-bold text-primary mb-1">{t('permissions.create')}</h3>
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
              <label className="text-[10px] font-bold text-primary uppercase tracking-widest">Code</label>
              <input
                type="text"
                placeholder="e.g. users:read"
                className="w-full bg-surface-container-high border-none rounded-lg p-4 text-sm focus:ring-2 focus:ring-primary/20 transition-all"
              />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-bold text-primary uppercase tracking-widest">{t('permissions.table.name')}</label>
              <input
                type="text"
                placeholder="Content Name"
                className="w-full bg-surface-container-high border-none rounded-lg p-4 text-sm focus:ring-2 focus:ring-primary/20 transition-all"
              />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-bold text-primary uppercase tracking-widest">{t('permissions.table.resource')}</label>
              <input
                type="text"
                placeholder="e.g. users"
                className="w-full bg-surface-container-high border-none rounded-lg p-4 text-sm focus:ring-2 focus:ring-primary/20 transition-all"
              />
            </div>
          </div>

          <div className="mt-10 space-y-4">
            <button className="w-full bg-primary text-white py-4 rounded-xl font-bold flex items-center justify-center gap-2 hover:opacity-90 transition-all shadow-lg shadow-primary/20">
              {t('common.submit') || 'Save Permission'}
            </button>
          </div>
        </div>
      </Modal>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        <StatsCard
          label={t('permissions.stats.total')}
          value={permissions.length.toString()}
          icon={Key}
          iconColor="primary"
        />
        <StatsCard
          label={t('permissions.stats.active')}
          value={activeCount.toString()}
          icon={ShieldAlert}
          iconColor="secondary"
        />
        <StatsCard
          label={t('permissions.stats.inactive')}
          value={inactiveCount.toString()}
          icon={Lock}
          iconColor="amber"
        />
      </div>

      <div className="bg-surface-container-lowest rounded-2xl border border-outline-variant/10 overflow-hidden shadow-sm">
        <div className="p-4 border-b border-outline-variant/10 flex gap-4 items-center">
          <SearchInput
            value={searchQuery}
            onChange={setSearchQuery}
            placeholder={t('permissions.search.placeholder')}
            className="grow"
          />
        </div>

        <div className="overflow-x-auto">
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
              {permissions.filter(p => p.code.includes(searchQuery) || p.name.includes(searchQuery)).map((perm) => (
                <tr key={perm.id} className="hover:bg-surface-container-low/50 transition-colors group">
                  <td className="px-6 py-4">
                    <span className="font-bold text-primary text-sm font-mono bg-surface-container-low px-2 py-1 rounded-md">{perm.code}</span>
                  </td>
                  <td className="px-6 py-4 text-sm text-primary font-medium">{perm.name}</td>
                  <td className="px-6 py-4 text-sm text-on-surface-variant">{perm.resource}</td>
                  <td className="px-6 py-4">
                    <StatusBadge
                      status={(perm.isActive ? 'Active' : 'Blocked') as StatusType}
                      label={perm.isActive ? t('common.active') : t('common.inactive') || 'Inactive'}
                      variant="dot"
                    />
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <IconButton icon={Edit2} size="md" className="rounded-full" />
                      <IconButton icon={Trash2} size="md" className="rounded-full text-error hover:bg-error/10 hover:text-error" />
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
