import React from 'react';
import { CheckCircle, AlertCircle, X } from 'lucide-react';

interface NotificationToastProps {
  type: 'success' | 'error';
  message: string;
  onClose: () => void;
}

export function NotificationToast({ type, message, onClose }: NotificationToastProps) {
  return (
    <div className={`fixed top-4 right-4 z-50 flex items-center gap-3 px-6 py-4 rounded-xl shadow-lg border transition-all animate-in slide-in-from-top-5 ${
      type === 'success'
        ? 'bg-emerald-50 border-emerald-200 text-emerald-700'
        : 'bg-rose-50 border-rose-200 text-rose-700'
    }`}>
      {type === 'success' ? (
        <CheckCircle className="w-5 h-5 shrink-0 text-emerald-500" />
      ) : (
        <AlertCircle className="w-5 h-5 shrink-0 text-rose-500" />
      )}
      <span className="font-bold text-sm">{message}</span>
      <button onClick={onClose} className="ml-2 hover:opacity-70 transition-opacity">
        <X className="w-4 h-4" />
      </button>
    </div>
  );
}
