import React from 'react';
import { X, ShieldAlert } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import { Modal, Button } from '../ui';

interface PermissionDeleteModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  isLoading: boolean;
}

export function PermissionDeleteModal({
  isOpen,
  onClose,
  onConfirm,
  isLoading
}: PermissionDeleteModalProps) {
  const { t } = useLanguage();

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <div className="p-8">
        <div className="flex justify-between items-start mb-6">
          <h3 className="text-2xl font-bold text-error flex items-center gap-2">
            <ShieldAlert className="w-6 h-6" />
            Confirm Deletion
          </h3>
          <button onClick={onClose} className="p-2 hover:bg-surface-container-high rounded-full transition-colors">
            <X className="w-5 h-5 text-on-surface-variant" />
          </button>
        </div>
        <p className="text-on-surface-variant leading-relaxed mb-8">{t('permissions.deleteConfirm')}</p>
        <div className="flex gap-4">
          <Button variant="outline" onClick={onClose} className="flex-1 justify-center rounded-xl p-4 min-w-0">
            {t('common.cancel')}
          </Button>
          <button
            onClick={onConfirm}
            disabled={isLoading}
            className={`flex-1 rounded-xl p-4 font-bold text-white transition-all shadow-lg shadow-error/20 ${isLoading ? 'bg-error/50 cursor-not-allowed' : 'bg-error hover:bg-error/90'}`}
          >
            {isLoading ? t('common.saving') : t('common.submit')}
          </button>
        </div>
      </div>
    </Modal>
  );
}
