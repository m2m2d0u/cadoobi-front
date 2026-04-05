import React from 'react';
import { RefreshCw, Plus } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import { Button } from '../ui';
import { FeeType } from '../../types/enums';
import type { OperatorFeeResponse } from '../../types/api';

interface FeesListProps {
  fees: OperatorFeeResponse[];
  isLoading: boolean;
  onAddFee: () => void;
}

export function FeesList({ fees, isLoading, onAddFee }: FeesListProps) {
  const { t } = useLanguage();

  if (isLoading) {
    return (
      <div className="py-12 flex justify-center">
        <RefreshCw className="w-8 h-8 text-primary animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-end">
        <Button size="sm" onClick={onAddFee}>
          <Plus className="w-4 h-4" />
          {t('operators.fees.add')}
        </Button>
      </div>

      {fees.length === 0 ? (
        <div className="py-12 text-center text-on-surface-variant bg-surface-container-lowest rounded-xl border border-outline-variant/10">
          <p className="font-bold">{t('operators.fees.empty')}</p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-outline-variant/10 text-[10px] uppercase tracking-widest text-on-surface-variant">
                <th className="p-3 font-bold">{t('operators.fees.table.operation')}</th>
                <th className="p-3 font-bold">{t('operators.fees.table.type')}</th>
                <th className="p-3 font-bold">{t('operators.fees.table.amount')}</th>
                <th className="p-3 font-bold">{t('operators.fees.table.value')}</th>
              </tr>
            </thead>
            <tbody>
              {fees.map(fee => (
                <tr key={fee.id} className="border-b border-outline-variant/5 text-sm hover:bg-surface-container-lowest transition-colors">
                  <td className="p-3 font-bold text-primary">{fee.operationType}</td>
                  <td className="p-3">
                    <span className="px-2 py-1 rounded bg-secondary/10 text-secondary text-[10px] font-bold uppercase">{fee.feeType}</span>
                  </td>
                  <td className="p-3 font-mono text-xs">{fee.minAmount} - {fee.maxAmount} {fee.currency}</td>
                  <td className="p-3 font-bold text-primary">
                    {fee.feeType === FeeType.FIXED ? `${fee.feeFixed} ${fee.currency}` :
                     fee.feeType === FeeType.PERCENTAGE ? `${fee.feePercentage}%` :
                     `${fee.feeFixed} ${fee.currency} + ${fee.feePercentage}%`}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
