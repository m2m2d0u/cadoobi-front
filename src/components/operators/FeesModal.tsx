import React from 'react';
import { X } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import { Modal } from '../ui';
import { FeesList } from './FeesList';
import { FeeForm } from './FeeForm';
import type { OperatorResponse, OperatorFeeResponse, CreateOperatorFeeRequest } from '../../types/api';

interface FeesModalProps {
  isOpen: boolean;
  onClose: () => void;
  operator: OperatorResponse | null;
  fees: OperatorFeeResponse[];
  isAddMode: boolean;
  feeFormData: CreateOperatorFeeRequest;
  setFeeFormData: React.Dispatch<React.SetStateAction<CreateOperatorFeeRequest>>;
  onFeeSubmit: (e: React.FormEvent) => void;
  onSetAddMode: (mode: boolean) => void;
  isLoading: boolean;
  error: string | null;
}

export function FeesModal({
  isOpen,
  onClose,
  operator,
  fees,
  isAddMode,
  feeFormData,
  setFeeFormData,
  onFeeSubmit,
  onSetAddMode,
  isLoading,
  error
}: FeesModalProps) {
  const { t } = useLanguage();

  if (!operator) return null;

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <div className="p-8">
        <div className="flex justify-between items-start mb-8">
          <div>
            <h3 className="text-2xl font-bold text-primary mb-1">
              {isAddMode ? t('operators.fees.add') : t('operators.fees.manage')}
            </h3>
            <p className="text-on-surface-variant text-sm font-bold">{operator.name}</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-surface-container-high rounded-full transition-colors"
          >
            <X className="w-5 h-5 text-on-surface-variant" />
          </button>
        </div>

        {error && <div className="p-3 mb-6 bg-error/10 text-error text-sm font-bold rounded-lg">{error}</div>}

        {!isAddMode ? (
          <FeesList
            fees={fees}
            isLoading={isLoading}
            onAddFee={() => onSetAddMode(true)}
          />
        ) : (
          <FeeForm
            formData={feeFormData}
            setFormData={setFeeFormData}
            onSubmit={onFeeSubmit}
            onCancel={() => onSetAddMode(false)}
            isLoading={isLoading}
          />
        )}
      </div>
    </Modal>
  );
}
