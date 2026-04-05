import React from 'react';
import { X } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import { Modal } from '../ui';
import type { CreatePermissionRequest } from '../../types/api';

interface PermissionFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  formData: CreatePermissionRequest;
  setFormData: React.Dispatch<React.SetStateAction<CreatePermissionRequest>>;
  onSubmit: (e: React.FormEvent) => void;
  isLoading: boolean;
  error: string | null;
  editingId: string | null;
}

export function PermissionFormModal({
  isOpen,
  onClose,
  formData,
  setFormData,
  onSubmit,
  isLoading,
  error,
  editingId
}: PermissionFormModalProps) {
  const { t } = useLanguage();

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <div className="p-8">
        <div className="flex justify-between items-start mb-8">
          <div>
            <h3 className="text-2xl font-bold text-primary mb-1">
              {editingId ? t('common.edit') || 'Edit Permission' : t('permissions.create')}
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

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2 col-span-2">
              <label className="text-[10px] font-bold text-primary uppercase tracking-widest">{t('permissions.table.code')}</label>
              <input
                type="text"
                required
                value={formData.code}
                onChange={e => setFormData({ ...formData, code: e.target.value })}
                placeholder="e.g. users:read"
                className="w-full bg-surface-container-high border-none rounded-lg p-4 text-sm focus:ring-2 focus:ring-primary/20 transition-all font-bold"
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
  );
}
