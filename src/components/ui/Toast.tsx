import React, { useEffect } from 'react';
import { CheckCircle2, X, AlertCircle, Info } from 'lucide-react';
import { cn } from '@/src/lib/utils';

interface ToastProps {
  message: string;
  type?: 'success' | 'error' | 'info';
  isOpen: boolean;
  onClose: () => void;
  duration?: number;
}

export function Toast({ message, type = 'success', isOpen, onClose, duration = 3000 }: ToastProps) {
  useEffect(() => {
    if (isOpen && duration > 0) {
      const timer = setTimeout(() => {
        onClose();
      }, duration);
      return () => clearTimeout(timer);
    }
  }, [isOpen, duration, onClose]);

  if (!isOpen) return null;

  const icons = {
    success: CheckCircle2,
    error: AlertCircle,
    info: Info,
  };

  const styles = {
    success: 'bg-secondary text-on-secondary border-secondary',
    error: 'bg-error text-on-error border-error',
    info: 'bg-primary text-on-primary border-primary',
  };

  const Icon = icons[type];

  return (
    <div className="fixed top-4 right-4 z-[9999] animate-in slide-in-from-top-2 fade-in">
      <div className={cn(
        'flex items-center gap-3 px-6 py-4 rounded-xl shadow-lg border-2 min-w-[300px] max-w-md',
        styles[type]
      )}>
        <Icon className="w-5 h-5 shrink-0" />
        <p className="flex-1 text-sm font-bold">{message}</p>
        <button
          onClick={onClose}
          className="shrink-0 hover:opacity-70 transition-opacity"
        >
          <X className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
}
