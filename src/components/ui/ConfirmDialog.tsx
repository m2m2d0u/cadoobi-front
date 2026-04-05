import React from 'react';
import { AlertTriangle } from 'lucide-react';
import { Modal } from './Modal';
import { Button } from './Button';

interface ConfirmDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  variant?: 'danger' | 'warning';
  isLoading?: boolean;
}

export function ConfirmDialog({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  variant = 'danger',
  isLoading = false
}: ConfirmDialogProps) {
  const handleConfirm = () => {
    onConfirm();
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="sm">
      <div className="p-6">
        <div className="flex items-start gap-4 mb-6">
          <div className={`p-3 rounded-full ${variant === 'danger' ? 'bg-error/10' : 'bg-secondary/10'}`}>
            <AlertTriangle className={`w-6 h-6 ${variant === 'danger' ? 'text-error' : 'text-secondary'}`} />
          </div>
          <div className="flex-1">
            <h3 className="text-xl font-bold text-primary mb-2">{title}</h3>
            <p className="text-sm text-on-surface-variant">{message}</p>
          </div>
        </div>

        <div className="flex justify-end gap-3">
          <Button
            type="button"
            variant="outline"
            onClick={onClose}
            disabled={isLoading}
          >
            {cancelText}
          </Button>
          <Button
            type="button"
            onClick={handleConfirm}
            disabled={isLoading}
            className={variant === 'danger' ? 'bg-error hover:bg-error/90 text-on-error' : ''}
          >
            {confirmText}
          </Button>
        </div>
      </div>
    </Modal>
  );
}
