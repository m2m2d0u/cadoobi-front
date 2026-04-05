import React, { useState, useEffect } from 'react';
import { Plus, RefreshCw } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { Button, PageHeader, Pagination } from '../components/ui';
import { rolesService, permissionsService } from '../services';
import type { RoleResponse, CreateRoleRequest, PermissionResponse } from '../types/api';
import {
  RoleFormModal,
  RoleDeleteModal,
  RolesStatsSection,
  RolesTableFilters,
  RolesTable
} from '../components/roles';

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
        permissionsService.list({ size: 500 })
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

      {/* Form Modal */}
      <RoleFormModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        formData={formData}
        setFormData={setFormData}
        onSubmit={handleSubmit}
        onTogglePermission={handleTogglePermission}
        availablePermissions={availablePermissions}
        isLoading={isLoading}
        error={error}
        editingId={editingId}
      />

      {/* Delete Modal */}
      <RoleDeleteModal
        isOpen={!!deleteConfirmId}
        onClose={() => setDeleteConfirmId(null)}
        onConfirm={confirmDelete}
        isLoading={isLoading}
      />

      {/* Stats Section */}
      <RolesStatsSection totalElements={totalElements} roles={roles} />

      <div className="bg-surface-container-lowest rounded-2xl border border-outline-variant/10 overflow-hidden shadow-sm">
        {/* Filters */}
        <RolesTableFilters searchQuery={searchQuery} onSearchChange={setSearchQuery} />

        {/* Table */}
        <div className="overflow-x-auto relative min-h-[200px]">
          <RolesTable
            roles={filteredRoles}
            isLoading={isLoading}
            error={error}
            onEdit={handleEdit}
            onDelete={setDeleteConfirmId}
          />
        </div>

        {/* Pagination */}
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
