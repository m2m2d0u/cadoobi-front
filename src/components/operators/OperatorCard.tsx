import React from 'react';
import { Settings } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import { StatusBadge } from '../ui';
import type { StatusType } from '../ui';
import type { OperatorResponse } from '../../types/api';

interface OperatorCardProps {
  operator: OperatorResponse;
  onManageFees: (operator: OperatorResponse) => void;
}

export function OperatorCard({ operator, onManageFees }: OperatorCardProps) {
  const { t } = useLanguage();

  return (
    <div className="bg-surface-container-lowest p-6 rounded-2xl border border-outline-variant/10 shadow-sm hover:shadow-md transition-shadow relative">
      <div className="flex justify-between items-start mb-6">
        <div className="w-12 h-12 rounded-xl flex items-center justify-center text-white font-bold text-xl shadow-inner bg-primary">
          {operator.name.charAt(0).toUpperCase()}
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => onManageFees(operator)}
            className="p-2 hover:bg-surface-container-high rounded-full transition-colors group relative"
            title={t('operators.fees.manage') || 'Manage Fees'}
          >
            <Settings className="w-5 h-5 text-on-surface-variant group-hover:text-primary transition-colors cursor-pointer" />
          </button>
          <StatusBadge
            status={operator.isActive ? 'Healthy' as StatusType : 'Degraded' as StatusType}
            label={operator.isActive ? t('common.active') || 'Active' : t('common.inactive') || 'Inactive'}
            variant="badge"
          />
        </div>
      </div>

      <h4 className="font-bold text-lg text-primary mb-1 truncate">{operator.name}</h4>
      <p className="font-mono text-[10px] text-on-surface-variant mb-6">{operator.code}</p>

      <div className="space-y-3">
        <div className="flex justify-between items-center text-xs">
          <span className="text-on-surface-variant">{t('operators.form.country')}</span>
          <span className="font-bold text-primary truncate max-w-[120px]">{operator.country}</span>
        </div>
        <div className="flex justify-between items-center text-xs">
          <span className="text-on-surface-variant">URL</span>
          <span className="font-mono font-[10px] text-primary truncate max-w-[140px]" title={operator.apiBaseUrl}>{operator.apiBaseUrl}</span>
        </div>
        <div className="flex justify-between items-center text-[10px] font-bold mt-4 pt-4 border-t border-outline-variant/10">
          <div className={`px-2 py-1 rounded ${operator.supportsPayin ? 'bg-secondary/10 text-secondary' : 'bg-outline-variant/10 text-on-surface-variant/50'}`}>PAY-IN</div>
          <div className={`px-2 py-1 rounded ${operator.supportsPayout ? 'bg-primary/10 text-primary' : 'bg-outline-variant/10 text-on-surface-variant/50'}`}>PAY-OUT</div>
        </div>
      </div>
    </div>
  );
}
