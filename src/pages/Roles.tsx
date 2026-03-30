import React, { useState, useEffect } from 'react';
import {
  ShieldCheck,
  Plus,
  Users,
  Key,
  X,
  Edit2,
  Trash2,
  ShieldAlert,
  RefreshCw
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { Button, IconButton, Modal, PageHeader, SearchInput, StatsCard, StatusBadge, Pagination } from '../components/ui';
import type { StatusType } from '../components/ui';
import { rolesService, permissionsService } from '../services';
import type { RoleResponse, CreateRoleRequest, PermissionResponse } from '../types/api';

export function Roles() {
  const { t } = useLanguage();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [roles, setRoles] = useState<RoleResponse[]>([]);
  const [availablePermissions, setAvailablePermissions] = useState<PermissionResponse[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);
  
  // Pagination state
  const [currentPage, setCurrentPage] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [totalElements, setTotalElements] = useState(0);
  const [totalPages, setTotalPages] = useState(0);

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const initialFormState: CreateRoleRequest = {
    code: '',
    name: '',
    description: '',
    permissionIds: [],
    isActive: true
  };
  const [formData, setFormData] = useState<CreateRoleRequest>(initialFormState);

  const fetchRoles = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const [rRes, pRes] = await Promise.all([
        rolesService.list({ page: currentPage, size: pageSize }),
        permissionsService.list({ size: 500 }) // Load permissions for form allocation
      ]);
      
      setRoles(rRes?.data || []);
      setTotalElements(rRes?.pagination?.totalElements || 0);
      setTotalPages(rRes?.pagination?.totalPages || 0);
      
      setAvailablePermissions(pRes?.data || []);
    } catch (err: any) {
      console.error(err);
      setError(err?.response?.data?.message || 'Failed to load roles and permissions');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchRoles();
  }, [currentPage, pageSize]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setIsLoading(true);
      setError(null);
      if (editingId) {
        await rolesService.update(editingId, formData);
      } else {
        await rolesService.create(formData);
      }
      setIsModalOpen(false);
      setFormData(initialFormState);
      setEditingId(null);
      fetchRoles();
    } catch (err: any) {
      console.error(err);
      setError(err?.response?.data?.message || `Failed to ${editingId ? 'update' : 'create'} role`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleEdit = (role: RoleResponse) => {
    setEditingId(role.id);
    setFormData({
      code: role.code,
      name: role.name,
      description: role.description || '',
      permissionIds: role.permissions.map(p => p.id),
      isActive: role.isActive
    });
    setIsModalOpen(true);
  };

  const confirmDelete = async () => {
    if (!deleteConfirmId) return;
    try {
      setIsLoading(true);
      await rolesService.delete(deleteConfirmId);
      setDeleteConfirmId(null);
      fetchRoles();
    } catch (err: any) {
      console.error(err);
      alert(err?.response?.data?.message || 'Failed to delete role');
    } finally {
      setIsLoading(false);
    }
  };

  const handleTogglePermission = (permissionId: string) => {
    setFormData(prev => {
      const isSelected = prev.permissionIds.includes(permissionId);
      if (isSelected) {
        return { ...prev, permissionIds: prev.permissionIds.filter(id => id !== permissionId) };
      }
      return { ...prev, permissionIds: [...prev.permissionIds, permissionId] };
    });
  };

  const systemCount = roles.filter(r => r.isSystemRole).length;
  const customCount = roles.length - systemCount;
  const filteredRoles = roles.filter(r => 
    r.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    r.code.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="max-w-7xl mx-auto">
      <PageHeader
        title={t('roles.title')}
        subtitle={t('roles.subtitle')}
        actions={
          <div className="flex items-center gap-3">
             <Button variant="outline" onClick={fetchRoles} disabled={isLoading}>
              <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
              {t('common.refresh')}
            </Button>
            <Button onClick={() => {
              setEditingId(null);
              setFormData(initialFormState);
              setIsModalOpen(true);
            }}>
              <Plus className="w-4 h-4" />
              {t('roles.create')}
            </Button>
          </div>
        }
      />

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
        <div className="p-8">
          <div className="flex justify-between items-start mb-8">
            <div>
              <h3 className="text-2xl font-bold text-primary mb-1">
                {editingId ? t('common.edit') || 'Edit Role' : t('roles.create')}
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

            <div className="space-y-2">
              <label className="text-[10px] font-bold text-primary uppercase tracking-widest">{t('roles.form.name')}</label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={e => setFormData({ ...formData, name: e.target.value })}
                placeholder="e.g. Finance Officer"
                className="w-full bg-surface-container-high border-none rounded-lg p-4 text-sm focus:ring-2 focus:ring-primary/20 transition-all font-bold"
              />
            </div>
            
            <div className="space-y-2">
              <label className="text-[10px] font-bold text-primary uppercase tracking-widest">{t('roles.form.code')}</label>
              <input
                type="text"
                required
                value={formData.code}
                onChange={e => setFormData({ ...formData, code: e.target.value.toUpperCase() })}
                placeholder="FINANCE_OFFICER"
                disabled={!!editingId}
                className={`w-full bg-surface-container-high border-none rounded-lg p-4 text-sm font-mono focus:ring-2 focus:ring-primary/20 transition-all ${editingId ? 'opacity-50 cursor-not-allowed' : ''}`}
              />
            </div>
            
            <div className="space-y-2">
              <label className="text-[10px] font-bold text-primary uppercase tracking-widest">{t('roles.form.description')}</label>
              <input
                type="text"
                value={formData.description || ''}
                onChange={e => setFormData({ ...formData, description: e.target.value })}
                placeholder={t('roles.form.description')}
                className="w-full bg-surface-container-high border-none rounded-lg p-4 text-sm focus:ring-2 focus:ring-primary/20 transition-all"
              />
            </div>

            <div className="space-y-2 flex items-center gap-3 pt-2">
              <input
                type="checkbox"
                id="isRoleActive"
                checked={formData.isActive}
                onChange={e => setFormData({ ...formData, isActive: e.target.checked })}
                className="w-5 h-5 text-primary border-outline-variant rounded focus:ring-primary"
              />
              <label htmlFor="isRoleActive" className="text-sm font-bold text-on-surface-variant cursor-pointer">
                {t('roles.form.active')}
              </label>
            </div>

            <div className="p-4 bg-surface-container-low border border-outline-variant/10 rounded-xl">
              <p className="text-sm font-bold text-primary mb-2">{t('roles.form.assignPermissions')}</p>
              <div className="space-y-2 max-h-48 overflow-y-auto pr-2">
                {availablePermissions.length === 0 && <span className="text-xs text-on-surface-variant">{t('roles.form.noPermissions')}</span>}
                {availablePermissions.map(perm => (
                  <label key={perm.id} className="flex items-center gap-3 p-2 hover:bg-surface-container-high rounded-lg cursor-pointer transition-colors">
                    <input 
                      type="checkbox" 
                      checked={formData.permissionIds.includes(perm.id)}
                      onChange={() => handleTogglePermission(perm.id)}
                      className="w-4 h-4 text-primary border-outline-variant rounded focus:ring-primary" 
                    />
                    <div className="flex flex-col">
                       <span className="text-sm text-primary font-bold">{perm.name}</span>
                       <span className="text-[10px] text-on-surface-variant font-mono">{perm.code}</span>
                    </div>
                  </label>
                ))}
              </div>
            </div>

            <div className="mt-10 space-y-4">
              <button 
                type="submit"
                disabled={isLoading}
                className={`w-full text-white py-4 rounded-xl font-bold flex items-center justify-center gap-2 transition-all shadow-lg shadow-primary/20 ${isLoading ? 'bg-primary/50 cursor-not-allowed' : 'bg-primary hover:opacity-90'}`}
              >
                 {isLoading ? t('common.saving') : (editingId ? t('common.saveChanges') : t('roles.form.save'))}
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
          <p className="text-on-surface-variant leading-relaxed mb-8">{t('roles.deleteConfirm')}</p>
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
          label={t('roles.stats.total')}
          value={totalElements.toString()}
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

        <div className="overflow-x-auto relative min-h-[200px]">
          {isLoading && roles.length === 0 ? (
            <div className="absolute inset-0 flex items-center justify-center bg-surface-container-lowest/50 backdrop-blur-sm z-10">
              <div className="w-10 h-10 border-4 border-primary/20 border-t-primary rounded-full animate-spin"></div>
            </div>
          ) : null}

          {error && roles.length === 0 && (
             <div className="p-8 text-center bg-error/5 m-4 rounded-xl border border-error/20 text-error">
                <ShieldAlert className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <h3 className="font-bold mb-1">{t('roles.error.load')}</h3>
                <p className="text-sm opacity-80">{error}</p>
             </div>
          )}

          {!error && roles.length === 0 && !isLoading && (
             <div className="p-12 text-center text-on-surface-variant">
               <ShieldCheck className="w-12 h-12 mx-auto mb-4 opacity-20" />
               <p>{t('roles.empty')}</p>
             </div>
          )}

          {filteredRoles.length > 0 && (
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
                {filteredRoles.map((role) => (
                  <tr key={role.id} className="hover:bg-surface-container-low/50 transition-colors group">
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
                        <IconButton 
                          icon={Edit2} 
                          size="md" 
                          className="rounded-full bg-surface-container-low hover:bg-surface-container-high" 
                          onClick={() => handleEdit(role)}
                        />
                        {!role.isSystemRole && (
                          <IconButton 
                            icon={Trash2} 
                            size="md"  
                            className="rounded-full text-error bg-surface-container-low hover:bg-error/10 hover:text-error" 
                            onClick={() => setDeleteConfirmId(role.id)}
                          />
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
        
        <Pagination 
          currentPage={currentPage}
          totalPages={totalPages}
          totalElements={totalElements}
          pageSize={pageSize}
          onPageChange={setCurrentPage}
          onPageSizeChange={(size) => {
             setPageSize(size);
             setCurrentPage(0);
          }}
        />
        
      </div>
    </div>
  );
}
