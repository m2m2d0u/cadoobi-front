import React from 'react';
import { X, ChevronDown, Send } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import { Modal } from '../ui';
import type { UpdateUserRequest, RoleResponse } from '../../types/api';

interface UserEditModalProps {
  isOpen: boolean;
  onClose: () => void;
  formData: UpdateUserRequest;
  setFormData: React.Dispatch<React.SetStateAction<UpdateUserRequest>>;
  onSubmit: (e: React.FormEvent) => void;
  roles: RoleResponse[];
  isLoading: boolean;
  error: string | null;
}

export function UserEditModal({
  isOpen,
  onClose,
  formData,
  setFormData,
  onSubmit,
  roles,
  isLoading,
  error
}: UserEditModalProps) {
  const { t } = useLanguage();

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <div className="p-8">
        <div className="flex justify-between items-start mb-8">
          <div>
            <h3 className="text-2xl font-bold text-primary mb-1">{t('users.modal.editTitle')}</h3>
            <p className="text-sm text-on-surface-variant">{t('users.modal.editSubtitle')}</p>
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
            <label className="text-[10px] font-bold text-primary uppercase tracking-widest">{t('users.modal.fullName')}</label>
            <input
              type="text"
              required
              value={formData.fullName || ''}
              onChange={e => setFormData({ ...formData, fullName: e.target.value })}
              className="w-full bg-surface-container-high border-none rounded-lg p-4 text-sm focus:ring-2 focus:ring-primary/20 transition-all font-bold"
            />
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-bold text-primary uppercase tracking-widest">{t('users.modal.email')}</label>
            <input
              type="email"
              required
              value={formData.email || ''}
              onChange={e => setFormData({ ...formData, email: e.target.value })}
              className="w-full bg-surface-container-high border-none rounded-lg p-4 text-sm focus:ring-2 focus:ring-primary/20 transition-all"
            />
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-bold text-primary uppercase tracking-widest">{t('users.modal.assignRole')}</label>
            <div className="relative">
              <select
                required
                value={formData.roleIds?.[0] || ''}
                onChange={e => setFormData({ ...formData, roleIds: [e.target.value] })}
                className="w-full bg-surface-container-high border-2 border-primary/10 rounded-lg p-4 text-sm appearance-none focus:ring-2 focus:ring-primary/20 transition-all pr-12 font-bold cursor-pointer"
              >
                <option value="" disabled>Select a designated role...</option>
                {roles.filter(r => r.isActive).map(r => (
                  <option key={r.id} value={r.id}>{r.name} ({r.code})</option>
                ))}
              </select>
              <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-on-surface-variant pointer-events-none" />
            </div>
          </div>

          <div className="mt-10 flex gap-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-4 text-sm font-bold bg-surface-container-highest rounded-xl text-on-surface-variant hover:text-primary transition-colors"
              disabled={isLoading}
            >
              {t('users.modal.cancel')}
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className={`flex-[2] text-white py-4 rounded-xl font-bold flex items-center justify-center gap-2 hover:opacity-90 transition-all shadow-lg shadow-primary/20 ${isLoading ? 'bg-primary/50 cursor-not-allowed' : 'bg-primary'}`}
            >
              {isLoading ? t('common.saving') : t('users.modal.saveChanges')}
              {!isLoading && <Send className="w-4 h-4 -rotate-45" />}
            </button>
          </div>
        </form>
      </div>
    </Modal>
  );
}
