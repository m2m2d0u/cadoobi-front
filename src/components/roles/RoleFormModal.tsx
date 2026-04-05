import React from 'react';
import { X } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import { Modal } from '../ui';
import type { CreateRoleRequest, PermissionResponse } from '../../types/api';

interface RoleFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  formData: CreateRoleRequest;
  setFormData: React.Dispatch<React.SetStateAction<CreateRoleRequest>>;
  onSubmit: (e: React.FormEvent) => void;
  onTogglePermission: (permissionId: string) => void;
  availablePermissions: PermissionResponse[];
  isLoading: boolean;
  error: string | null;
  editingId: string | null;
}

export function RoleFormModal({
  isOpen,
  onClose,
  formData,
  setFormData,
  onSubmit,
  onTogglePermission,
  availablePermissions,
  isLoading,
  error,
  editingId
}: RoleFormModalProps) {
  const { t } = useLanguage();

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <div className="p-8">
        <div className="flex justify-between items-start mb-8">
          <div>
            <h3 className="text-2xl font-bold text-primary mb-1">
              {editingId ? t('common.edit') || 'Edit Role' : t('roles.create')}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-surface-container-high rounded-full transition-colors"
          >
            <X className="w-5 h-5 text-on-surface-variant" />
          </button>
        </div>

        <form className="space-y-6" onSubmit={onSubmit}>
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
                    onChange={() => onTogglePermission(perm.id)}
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
  );
}
