import React, { useState, useEffect } from 'react';
import { Plus, RefreshCw } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { Button, PageHeader } from '../components/ui';
import { operatorsService } from '../services';
import type { OperatorResponse, CreateOperatorRequest, OperatorFeeResponse, CreateOperatorFeeRequest } from '../types/api';
import { OperationType, FeeType } from '../types/enums';
import {
  OperatorFormModal,
  FeesModal,
  OperatorsList,
  NetworkLoadCard,
  PerformanceMetrics
} from '../components/operators';
import { PermissionGuard } from '../components/auth';
import { OPERATOR_CREATE } from '../lib/permissions';

export function Operators() {
  const { t } = useLanguage();
  const [operators, setOperators] = useState<OperatorResponse[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const initialFormState: CreateOperatorRequest = {
    code: '',
    name: '',
    country: '',
    apiBaseUrl: '',
    supportsPayin: false,
    supportsPayout: false,
    isActive: true
  };
  const [formData, setFormData] = useState<CreateOperatorRequest>(initialFormState);

  // Fees State
  const [selectedOperatorForFees, setSelectedOperatorForFees] = useState<OperatorResponse | null>(null);
  const [feesList, setFeesList] = useState<OperatorFeeResponse[]>([]);
  const [feesLoading, setFeesLoading] = useState(false);
  const [feesError, setFeesError] = useState<string | null>(null);
  const [isAddFeeMode, setIsAddFeeMode] = useState(false);

  const initialFeeFormState: CreateOperatorFeeRequest = {
    operationType: OperationType.PAYIN,
    feeType: FeeType.PERCENTAGE,
    feePercentage: 0,
    feeFixed: 0,
    minAmount: 0,
    maxAmount: 1000000,
    currency: 'XOF',
    isActive: true,
    effectiveFrom: new Date().toISOString().split('T')[0]
  };
  const [feeFormData, setFeeFormData] = useState<CreateOperatorFeeRequest>(initialFeeFormState);

  const fetchOperators = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const data = await operatorsService.listActive();
      setOperators(data || []);
    } catch (err: any) {
      console.error(err);
      setError(err?.response?.data?.message || t('operators.error.load') || 'Failed to fetch operators');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchOperators();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setIsLoading(true);
      setError(null);
      await operatorsService.create(formData);
      setIsModalOpen(false);
      setFormData(initialFormState);
      fetchOperators();
    } catch (err: any) {
      console.error(err);
      setError(err?.response?.data?.message || 'Failed to create operator');
    } finally {
      setIsLoading(false);
    }
  };

  const fetchFees = async (operatorId: string) => {
    try {
      setFeesLoading(true);
      setFeesError(null);
      const data = await operatorsService.getFees(operatorId);
      setFeesList(data || []);
    } catch (err: any) {
      console.error(err);
      setFeesError(err?.response?.data?.message || 'Failed to load fees');
    } finally {
      setFeesLoading(false);
    }
  };

  const handleOpenFees = (op: OperatorResponse) => {
    setSelectedOperatorForFees(op);
    setIsAddFeeMode(false);
    setFeeFormData(initialFeeFormState);
    fetchFees(op.id);
  };

  const handleFeeSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedOperatorForFees) return;
    try {
      setFeesLoading(true);
      setFeesError(null);

      const payload = { ...feeFormData };
      // Strip irrelevant fields based on FeeType choice to pass validation
      if (payload.feeType === FeeType.FIXED) payload.feePercentage = undefined;
      if (payload.feeType === FeeType.PERCENTAGE) payload.feeFixed = undefined;

      await operatorsService.createFee(selectedOperatorForFees.id, payload);
      setIsAddFeeMode(false);
      setFeeFormData(initialFeeFormState);
      fetchFees(selectedOperatorForFees.id);
    } catch (err: any) {
      console.error(err);
      setFeesError(err?.response?.data?.message || 'Failed to create fee');
    } finally {
      setFeesLoading(false);
    }
  };

  const handleCloseFeesModal = () => {
    setSelectedOperatorForFees(null);
    setIsAddFeeMode(false);
  };

  return (
    <div className="max-w-7xl mx-auto">
      <PageHeader
        title={t('operators.title')}
        subtitle={t('operators.subtitle')}
        actions={
          <>
            <Button variant="outline" size="sm" onClick={fetchOperators} disabled={isLoading}>
              <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
              {t('common.refresh')}
            </Button>
            <PermissionGuard permission={OPERATOR_CREATE}>
              <Button onClick={() => setIsModalOpen(true)}>
                <Plus className="w-4 h-4" />
                {t('operators.create')}
              </Button>
            </PermissionGuard>
          </>
        }
      />

      {/* Operator Form Modal */}
      <OperatorFormModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        formData={formData}
        setFormData={setFormData}
        onSubmit={handleSubmit}
        isLoading={isLoading}
        error={error}
      />

      {/* Fees Modal */}
      <FeesModal
        isOpen={!!selectedOperatorForFees}
        onClose={handleCloseFeesModal}
        operator={selectedOperatorForFees}
        fees={feesList}
        isAddMode={isAddFeeMode}
        feeFormData={feeFormData}
        setFeeFormData={setFeeFormData}
        onFeeSubmit={handleFeeSubmit}
        onSetAddMode={setIsAddFeeMode}
        isLoading={feesLoading}
        error={feesError}
      />

      {/* Grid rendering operators and the static Load card */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-10">
        <div className="lg:col-span-3">
          <OperatorsList
            operators={operators}
            isLoading={isLoading}
            error={error}
            onManageFees={handleOpenFees}
          />
        </div>

        <NetworkLoadCard />
      </div>

      {/* Performance Metrics */}
      <PerformanceMetrics />
    </div>
  );
}
