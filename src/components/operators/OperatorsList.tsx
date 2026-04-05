import React from 'react';
import { Activity, ShieldAlert } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import { OperatorCard } from './OperatorCard';
import type { OperatorResponse } from '../../types/api';

interface OperatorsListProps {
  operators: OperatorResponse[];
  isLoading: boolean;
  error: string | null;
  onManageFees: (operator: OperatorResponse) => void;
}

export function OperatorsList({ operators, isLoading, error, onManageFees }: OperatorsListProps) {
  const { t } = useLanguage();

  if (isLoading && operators.length === 0) {
    return (
      <div className="h-48 flex items-center justify-center bg-surface-container-lowest border border-outline-variant/10 rounded-2xl">
        <div className="w-8 h-8 border-4 border-primary/20 border-t-primary rounded-full animate-spin"></div>
      </div>
    );
  }

  if (error && operators.length === 0) {
    return (
      <div className="p-8 text-center bg-error/5 border border-error/20 text-error rounded-2xl">
        <ShieldAlert className="w-12 h-12 mx-auto mb-4 opacity-50" />
        <h3 className="font-bold mb-1">{t('operators.error.load')}</h3>
        <p className="text-sm opacity-80">{error}</p>
      </div>
    );
  }

  if (operators.length === 0) {
    return (
      <div className="p-12 text-center text-on-surface-variant flex flex-col items-center justify-center bg-surface-container-lowest border border-outline-variant/10 rounded-2xl">
        <Activity className="w-12 h-12 mb-4 opacity-20" />
        <p>{t('operators.empty')}</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {operators.map((op) => (
        <OperatorCard
          key={op.id}
          operator={op}
          onManageFees={onManageFees}
        />
      ))}
    </div>
  );
}
