import React, { useState, useEffect } from 'react';
import { Plus, RefreshCw } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { Button, PageHeader, Pagination } from '../components/ui';
import { permissionsService } from '../services';
import type { PermissionResponse, CreatePermissionRequest } from '../types/api';
import {
  PermissionFormModal,
  PermissionDeleteModal,
  PermissionsStatsSection,
  PermissionsTableFilters,
  PermissionsTable
} from '../components/permissions';

export function Permissions() {
  const { t } = useLanguage();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [permissions, setPermissions] = useState<PermissionResponse[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);
  
  // Pagination State
  const [currentPage, setCurrentPage] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [totalElements, setTotalElements] = useState(0);
  const [totalPages, setTotalPages] = useState(0);

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
      const data = await permissionsService.list({ page: currentPage, size: pageSize, search: searchQuery });
      setPermissions(data?.data || []);
      setTotalElements(data?.pagination?.totalElements || 0);
      setTotalPages(data?.pagination?.totalPages || 0);
    } catch (err: any) {
      console.error(err);
      setError(err?.response?.data?.message || 'Failed to fetch permissions');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchPermissions();
  }, [currentPage, pageSize]);

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

      {/* Form Modal */}
      <PermissionFormModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        formData={formData}
        setFormData={setFormData}
        onSubmit={handleSubmit}
        isLoading={isLoading}
        error={error}
        editingId={editingId}
      />

      {/* Delete Modal */}
      <PermissionDeleteModal
        isOpen={!!deleteConfirmId}
        onClose={() => setDeleteConfirmId(null)}
        onConfirm={confirmDelete}
        isLoading={isLoading}
      />

      {/* Stats Section */}
      <PermissionsStatsSection totalElements={totalElements} permissions={permissions} />

      <div className="bg-surface-container-lowest rounded-2xl border border-outline-variant/10 overflow-hidden shadow-sm">
        {/* Filters */}
        <PermissionsTableFilters searchQuery={searchQuery} onSearchChange={setSearchQuery} />

        {/* Table */}
        <div className="overflow-x-auto relative min-h-[200px]">
          <PermissionsTable
            permissions={filteredPermissions}
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
