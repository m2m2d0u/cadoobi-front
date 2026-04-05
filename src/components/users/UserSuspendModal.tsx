import React from 'react';
import { X, ShieldAlert } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import { Modal } from '../ui';
import type { UserResponse } from '../../types/api';

interface UserSuspendModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: UserResponse | null;
  onConfirm: () => void;
  isLoading: boolean;
}

export function UserSuspendModal({
  isOpen,
  onClose,
  user,
  onConfirm,
  isLoading
}: UserSuspendModalProps) {
  const { t } = useLanguage();

  if (!user) return null;

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <div className="p-8">
        <div className="flex justify-between items-start mb-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-error/10 flex items-center justify-center">
              <ShieldAlert className="w-6 h-6 text-error" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-error mb-1">{t('users.modal.suspendTitle')}</h3>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-surface-container-high rounded-full transition-colors"
          >
            <X className="w-5 h-5 text-on-surface-variant" />
          </button>
        </div>

        <div className="mb-8">
          <p className="text-on-surface-variant text-sm bg-surface-container-low p-4 rounded-xl border border-outline-variant/10 leading-relaxed">
            {t('users.modal.suspendDesc')}
            <br /><br />
            <span className="font-bold text-primary">{user.fullName}</span> <span className="opacity-70">({user.email})</span>
          </p>
        </div>

        <div className="flex gap-4">
          <button
            onClick={onClose}
            className="flex-1 py-4 text-sm font-bold bg-surface-container-highest rounded-xl text-on-surface-variant hover:text-primary transition-colors"
            disabled={isLoading}
          >
            {t('users.modal.cancel')}
          </button>
          <button
            onClick={onConfirm}
            className={`flex-[2] py-4 text-sm font-bold text-white rounded-xl transition-all shadow-lg shadow-error/20 flex items-center justify-center gap-2 ${isLoading ? 'bg-error/50 cursor-not-allowed' : 'bg-error hover:bg-error/90'}`}
            disabled={isLoading}
          >
            {isLoading ? t('common.saving') : t('users.modal.suspendConfirm')}
          </button>
        </div>
      </div>
    </Modal>
  );
}
