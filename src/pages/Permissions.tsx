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
  Lock,
  RefreshCw
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { Button, IconButton, Modal, PageHeader, SearchInput, StatsCard, StatusBadge } from '../components/ui';
import type { StatusType } from '../components/ui';
import { permissionsService } from '../services';
import type { PermissionResponse, CreatePermissionRequest } from '../types/api';

export function Permissions() {
  const { t } = useLanguage();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [permissions, setPermissions] = useState<PermissionResponse[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);
  
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const initialFormState: CreatePermissionRequest = {
    code: '',
    name: '',
    resource: '',
    action: '',
    description: '',
    isActive: true
  };
  const [formData, setFormData] = useState<CreatePermissionRequest>(initialFormState);

  const fetchPermissions = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const data = await permissionsService.list();
      setPermissions(data || []);
    } catch (err: any) {
      console.error(err);
      setError(err?.response?.data?.message || 'Failed to fetch permissions');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchPermissions();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setIsLoading(true);
      setError(null);
      if (editingId) {
        await permissionsService.update(editingId, formData);
      } else {
        await permissionsService.create(formData);
      }
      setIsModalOpen(false);
      setFormData(initialFormState);
      setEditingId(null);
      fetchPermissions();
    } catch (err: any) {
      console.error(err);
      setError(err?.response?.data?.message || `Failed to ${editingId ? 'update' : 'create'} permission`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleEdit = (perm: PermissionResponse) => {
    setEditingId(perm.id);
    setFormData({
      code: perm.code,
      name: perm.name,
      resource: perm.resource,
      action: perm.action,
      description: perm.description || '',
      isActive: perm.isActive
    });
    setIsModalOpen(true);
  };

  const confirmDelete = async () => {
    if (!deleteConfirmId) return;
    try {
      setIsLoading(true);
      await permissionsService.delete(deleteConfirmId);
      setDeleteConfirmId(null);
      fetchPermissions();
    } catch (err: any) {
      console.error(err);
      alert(err?.response?.data?.message || 'Failed to delete permission');
    } finally {
      setIsLoading(false);
    }
  };

  const activeCount = permissions.filter(p => p.isActive).length;
  const inactiveCount = permissions.length - activeCount;
  const filteredPermissions = permissions.filter(p => 
    p.code.toLowerCase().includes(searchQuery.toLowerCase()) || 
    p.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="max-w-7xl mx-auto">
      <PageHeader
        title={t('permissions.title')}
        subtitle={t('permissions.subtitle')}
        actions={
          <div className="flex items-center gap-3">
            <Button variant="outline" onClick={fetchPermissions} disabled={isLoading}>
              <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
              {t('common.refresh')}
            </Button>
            <Button onClick={() => {
              setEditingId(null);
              setFormData(initialFormState);
              setIsModalOpen(true);
            }}>
              <Plus className="w-4 h-4" />
              {t('permissions.create')}
            </Button>
          </div>
        }
      />

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
        <div className="p-8">
          <div className="flex justify-between items-start mb-8">
            <div>
              <h3 className="text-2xl font-bold text-primary mb-1">
                {editingId ? t('common.edit') || 'Edit Permission' : t('permissions.create')}
              </h3>
            </div>
            <button
              onClick={() => setIsModalOpen(false)}
              className="p-2 hover:bg-surface-container-high rounded-full transition-colors"
            >
              <X className="w-5 h-5 text-on-surface-variant" />
            </button>
          </div>

          <form className="space-y-6" onSubmit={handleSubmit}>
            {error && <div className="p-3 bg-error/10 text-error text-sm font-bold rounded-lg">{error}</div>}

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2 col-span-2">
                <label className="text-[10px] font-bold text-primary uppercase tracking-widest">{t('permissions.table.code')}</label>
                <input
                  type="text"
                  required
                  value={formData.code}
                  onChange={e => setFormData({ ...formData, code: e.target.value })}
                  placeholder="e.g. users:read"
                  className="w-full bg-surface-container-high border-none rounded-lg p-4 text-sm focus:ring-2 focus:ring-primary/20 transition-all"
                />
              </div>

              <div className="space-y-2 col-span-2">
                <label className="text-[10px] font-bold text-primary uppercase tracking-widest">{t('permissions.table.name')}</label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={e => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Content Name"
                  className="w-full bg-surface-container-high border-none rounded-lg p-4 text-sm focus:ring-2 focus:ring-primary/20 transition-all"
                />
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-bold text-primary uppercase tracking-widest">{t('permissions.table.resource')}</label>
                <input
                  type="text"
                  required
                  value={formData.resource}
                  onChange={e => setFormData({ ...formData, resource: e.target.value })}
                  placeholder="e.g. users"
                  className="w-full bg-surface-container-high border-none rounded-lg p-4 text-sm focus:ring-2 focus:ring-primary/20 transition-all"
                />
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-bold text-primary uppercase tracking-widest">{t('permissions.table.action')}</label>
                <input
                  type="text"
                  required
                  value={formData.action}
                  onChange={e => setFormData({ ...formData, action: e.target.value })}
                  placeholder="e.g. read, write, delete"
                  className="w-full bg-surface-container-high border-none rounded-lg p-4 text-sm focus:ring-2 focus:ring-primary/20 transition-all"
                />
              </div>

              <div className="space-y-2 col-span-2">
                <label className="text-[10px] font-bold text-primary uppercase tracking-widest">{t('permissions.table.description')}</label>
                <input
                  type="text"
                  value={formData.description || ''}
                  onChange={e => setFormData({ ...formData, description: e.target.value })}
                  placeholder={t('permissions.table.description')}
                  className="w-full bg-surface-container-high border-none rounded-lg p-4 text-sm focus:ring-2 focus:ring-primary/20 transition-all"
                />
              </div>

              <div className="space-y-2 col-span-2 flex items-center gap-3 pt-4 border-t border-outline-variant/10">
                <input
                  type="checkbox"
                  id="isActive"
                  checked={formData.isActive}
                  onChange={e => setFormData({ ...formData, isActive: e.target.checked })}
                  className="w-5 h-5 text-primary border-outline-variant rounded focus:ring-primary"
                />
                <label htmlFor="isActive" className="text-sm font-bold text-on-surface-variant cursor-pointer">
                  {t('permissions.activePermission')}
                </label>
              </div>
            </div>

            <div className="mt-10 space-y-4">
              <button 
                type="submit"
                disabled={isLoading}
                className={`w-full text-white py-4 rounded-xl font-bold flex items-center justify-center gap-2 transition-all shadow-lg shadow-primary/20 ${isLoading ? 'bg-primary/50 cursor-not-allowed' : 'bg-primary hover:opacity-90'}`}
              >
                {isLoading ? t('common.saving') : (editingId ? t('common.saveChanges') : t('permissions.save'))}
              </button>
            </div>
          </form>
        </div>
      </Modal>

      <Modal isOpen={!!deleteConfirmId} onClose={() => setDeleteConfirmId(null)}>
        <div className="p-8">
          <div className="flex justify-between items-start mb-6">
            <h3 className="text-2xl font-bold text-error flex items-center gap-2">
              <ShieldAlert className="w-6 h-6" />
              Confirm Deletion
            </h3>
            <button onClick={() => setDeleteConfirmId(null)} className="p-2 hover:bg-surface-container-high rounded-full transition-colors">
              <X className="w-5 h-5 text-on-surface-variant" />
            </button>
          </div>
          <p className="text-on-surface-variant mb-8">{t('permissions.deleteConfirm')}</p>
          <div className="flex gap-4">
            <Button variant="outline" onClick={() => setDeleteConfirmId(null)} className="flex-1 justify-center rounded-xl p-4 min-w-0">
              {t('common.cancel')}
            </Button>
            <button 
              onClick={confirmDelete} 
              disabled={isLoading} 
              className={`flex-1 rounded-xl p-4 font-bold text-white transition-all shadow-lg shadow-error/20 ${isLoading ? 'bg-error/50 cursor-not-allowed' : 'bg-error hover:bg-error/90'}`}
            >
              {isLoading ? t('common.saving') : t('common.submit')}
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

        <div className="overflow-x-auto relative min-h-[200px]">
          {isLoading && permissions.length === 0 ? (
            <div className="absolute inset-0 flex items-center justify-center bg-surface-container-lowest/50 backdrop-blur-sm z-10">
              <div className="w-10 h-10 border-4 border-primary/20 border-t-primary rounded-full animate-spin"></div>
            </div>
          ) : null}

          {error && permissions.length === 0 && (
             <div className="p-8 text-center bg-error/5 m-4 rounded-xl border border-error/20 text-error">
                <ShieldAlert className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <h3 className="font-bold mb-1">{t('permissions.error.load')}</h3>
                <p className="text-sm opacity-80">{error}</p>
             </div>
          )}

          {!error && permissions.length === 0 && !isLoading && (
             <div className="p-12 text-center text-on-surface-variant">
               <Key className="w-12 h-12 mx-auto mb-4 opacity-20" />
               <p>{t('permissions.empty')}</p>
             </div>
          )}

          {filteredPermissions.length > 0 && (
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
                {filteredPermissions.map((perm) => (
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
                        <IconButton 
                          icon={Edit2} 
                          size="md" 
                          className="rounded-full" 
                          onClick={() => handleEdit(perm)}
                        />
                        <IconButton 
                          icon={Trash2} 
                          size="md" 
                          className="rounded-full text-error hover:bg-error/10 hover:text-error" 
                          onClick={() => setDeleteConfirmId(perm.id)}
                        />
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}
