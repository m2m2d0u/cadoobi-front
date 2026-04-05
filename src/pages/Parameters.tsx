import React, { useState, useEffect } from 'react';
import { Plus, RefreshCw, Settings, DollarSign, Edit2, Trash2, Check, X } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { Button, PageHeader, Pagination, Modal, IconButton, StatusBadge } from '../components/ui';
import { parametersService } from '../services';
import type {
  ParameterResponse,
  CreateParameterRequest,
  UpdateParameterRequest,
  DefaultMerchantFeeResponse,
  CreateDefaultMerchantFeeRequest
} from '../types/api';
import { FeeType } from '../types/enums';
import { PermissionGuard } from '../components/auth';

export function Parameters() {
  const { t } = useLanguage();

  // Tab state
  const [activeTab, setActiveTab] = useState<'parameters' | 'fees'>('parameters');

  // Parameters state
  const [parameters, setParameters] = useState<ParameterResponse[]>([]);
  const [isLoadingParams, setIsLoadingParams] = useState(false);
  const [paramsError, setParamsError] = useState<string | null>(null);

  // Default fees state
  const [defaultFees, setDefaultFees] = useState<DefaultMerchantFeeResponse[]>([]);
  const [isLoadingFees, setIsLoadingFees] = useState(false);
  const [feesError, setFeesError] = useState<string | null>(null);

  // Pagination for parameters
  const [currentPage, setCurrentPage] = useState(0);
  const [pageSize, setPageSize] = useState(20);
  const [totalElements, setTotalElements] = useState(0);
  const [totalPages, setTotalPages] = useState(0);

  // Category filter
  const [categoryFilter, setCategoryFilter] = useState('ALL');

  // Modals
  const [isParamModalOpen, setIsParamModalOpen] = useState(false);
  const [isFeeModalOpen, setIsFeeModalOpen] = useState(false);
  const [editingParam, setEditingParam] = useState<ParameterResponse | null>(null);
  const [editingFee, setEditingFee] = useState<DefaultMerchantFeeResponse | null>(null);

  // Form data
  const [paramForm, setParamForm] = useState<CreateParameterRequest>({
    key: '',
    value: '',
    category: 'SYSTEM',
    description: '',
    isActive: true,
    isSystem: false
  });

  const [feeForm, setFeeForm] = useState<CreateDefaultMerchantFeeRequest>({
    description: '',
    feeType: FeeType.PERCENTAGE,
    feePercentage: 0,
    feeFixed: 0,
    minAmount: 0,
    maxAmount: 1000000,
    currency: 'XOF',
    isActive: true
  });

  const fetchParameters = async () => {
    try {
      setIsLoadingParams(true);
      setParamsError(null);
      const response = await parametersService.list({
        page: currentPage,
        size: pageSize,
        sort: 'category,asc'
      });

      const paramsData = response?.data;
      if (Array.isArray(paramsData)) {
        setParameters(paramsData);
      } else if (paramsData && typeof paramsData === 'object' && 'content' in paramsData) {
        const pageData = paramsData as { content: ParameterResponse[] };
        setParameters(Array.isArray(pageData.content) ? pageData.content : []);
      } else {
        setParameters([]);
      }

      setTotalElements(response?.pagination?.totalElements || 0);
      setTotalPages(response?.pagination?.totalPages || 0);
    } catch (err: any) {
      console.error('Error fetching parameters:', err);
      setParamsError(err?.response?.data?.message || 'Failed to load parameters');
      setParameters([]);
    } finally {
      setIsLoadingParams(false);
    }
  };

  const fetchDefaultFees = async () => {
    try {
      setIsLoadingFees(true);
      setFeesError(null);
      const response = await parametersService.getDefaultFees();
      setDefaultFees(response?.data || []);
    } catch (err: any) {
      console.error('Error fetching default fees:', err);
      setFeesError(err?.response?.data?.message || 'Failed to load default fees');
      setDefaultFees([]);
    } finally {
      setIsLoadingFees(false);
    }
  };

  useEffect(() => {
    if (activeTab === 'parameters') {
      fetchParameters();
    } else {
      fetchDefaultFees();
    }
  }, [activeTab, currentPage, pageSize]);

  const handleCreateParameter = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setIsLoadingParams(true);
      if (editingParam) {
        await parametersService.update(editingParam.id, paramForm);
      } else {
        await parametersService.create(paramForm);
      }
      setIsParamModalOpen(false);
      setEditingParam(null);
      setParamForm({
        key: '',
        value: '',
        category: 'SYSTEM',
        description: '',
        isActive: true,
        isSystem: false
      });
      fetchParameters();
    } catch (err: any) {
      setParamsError(err?.response?.data?.message || 'Failed to save parameter');
    } finally {
      setIsLoadingParams(false);
    }
  };

  const handleDeleteParameter = async (id: string) => {
    if (!confirm('Are you sure you want to delete this parameter?')) return;
    try {
      await parametersService.delete(id);
      fetchParameters();
    } catch (err: any) {
      setParamsError(err?.response?.data?.message || 'Failed to delete parameter');
    }
  };

  const handleCreateFee = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setIsLoadingFees(true);
      if (editingFee) {
        await parametersService.updateDefaultFee(editingFee.id, feeForm);
      } else {
        await parametersService.createDefaultFee(feeForm);
      }
      setIsFeeModalOpen(false);
      setEditingFee(null);
      setFeeForm({
        description: '',
        feeType: FeeType.PERCENTAGE,
        feePercentage: 0,
        feeFixed: 0,
        minAmount: 0,
        maxAmount: 1000000,
        currency: 'XOF',
        isActive: true
      });
      fetchDefaultFees();
    } catch (err: any) {
      setFeesError(err?.response?.data?.message || 'Failed to save default fee');
    } finally {
      setIsLoadingFees(false);
    }
  };

  const handleDeleteFee = async (id: string) => {
    if (!confirm('Are you sure you want to delete this default fee?')) return;
    try {
      await parametersService.deleteDefaultFee(id);
      fetchDefaultFees();
    } catch (err: any) {
      setFeesError(err?.response?.data?.message || 'Failed to delete default fee');
    }
  };

  const filteredParameters = categoryFilter === 'ALL'
    ? parameters
    : parameters.filter(p => p.category === categoryFilter);

  const categories = ['ALL', 'PAYMENT', 'PAYOUT', 'NOTIFICATION', 'SYSTEM', 'FEES'];

  return (
    <div className="max-w-7xl mx-auto">
      <PageHeader
        title={t('parameters.title')}
        subtitle={t('parameters.subtitle')}
        actions={
          <Button
            variant="outline"
            size="sm"
            onClick={() => activeTab === 'parameters' ? fetchParameters() : fetchDefaultFees()}
            disabled={isLoadingParams || isLoadingFees}
          >
            <RefreshCw className={`w-4 h-4 ${(isLoadingParams || isLoadingFees) ? 'animate-spin' : ''}`} />
            {t('common.refresh')}
          </Button>
        }
      />

      {/* Tabs */}
      <div className="mb-6 flex gap-2 border-b border-outline-variant/20">
        <button
          onClick={() => setActiveTab('parameters')}
          className={`px-6 py-3 font-bold transition-all ${
            activeTab === 'parameters'
              ? 'text-primary border-b-2 border-primary'
              : 'text-on-surface-variant hover:text-primary'
          }`}
        >
          <div className="flex items-center gap-2">
            <Settings className="w-5 h-5" />
            {t('parameters.tabs.parameters')}
          </div>
        </button>
        <button
          onClick={() => setActiveTab('fees')}
          className={`px-6 py-3 font-bold transition-all ${
            activeTab === 'fees'
              ? 'text-primary border-b-2 border-primary'
              : 'text-on-surface-variant hover:text-primary'
          }`}
        >
          <div className="flex items-center gap-2">
            <DollarSign className="w-5 h-5" />
            {t('parameters.tabs.fees')}
          </div>
        </button>
      </div>

      {/* Parameters Tab */}
      {activeTab === 'parameters' && (
        <div className="space-y-6">
          {/* Error */}
          {paramsError && (
            <div className="p-4 bg-error/10 border border-error/20 rounded-xl text-error text-sm">
              <strong>{t('common.error')}:</strong> {paramsError}
            </div>
          )}

          {/* Filters and Actions */}
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <label className="text-sm font-bold text-on-surface-variant">{t('parameters.filter.category')}:</label>
              <select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                className="bg-surface-container-high text-primary font-bold border-none rounded-lg text-sm px-4 py-2 cursor-pointer"
              >
                <option value="ALL">{t('parameters.filter.allCategories')}</option>
                {categories.filter(c => c !== 'ALL').map(cat => (
                  <option key={cat} value={cat}>{t(`parameters.category.${cat}`)}</option>
                ))}
              </select>
            </div>
            <PermissionGuard permission="parameter:create">
              <Button onClick={() => {
                setEditingParam(null);
                setParamForm({
                  key: '',
                  value: '',
                  category: 'SYSTEM',
                  description: '',
                  isActive: true,
                  isSystem: false
                });
                setIsParamModalOpen(true);
              }}>
                <Plus className="w-4 h-4" />
                {t('parameters.create')}
              </Button>
            </PermissionGuard>
          </div>

          {/* Parameters Table */}
          <div className="bg-surface-container-lowest rounded-2xl border border-outline-variant/10 overflow-hidden shadow-sm">
            {isLoadingParams && parameters.length === 0 ? (
              <div className="p-12 text-center">
                <div className="w-10 h-10 border-4 border-primary/20 border-t-primary rounded-full animate-spin mx-auto mb-4"></div>
                <p className="text-on-surface-variant">{t('parameters.loading')}</p>
              </div>
            ) : filteredParameters.length === 0 ? (
              <div className="p-12 text-center text-on-surface-variant">
                <Settings className="w-12 h-12 mx-auto mb-4 opacity-20" />
                <p className="font-bold">{t('parameters.empty')}</p>
                <p className="text-sm mt-2">{t('parameters.emptyDesc')}</p>
              </div>
            ) : (
              <>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-surface-container-high/50">
                      <tr className="border-b border-outline-variant/10">
                        <th className="px-6 py-4 text-left text-xs font-bold text-on-surface-variant uppercase">{t('parameters.table.key')}</th>
                        <th className="px-6 py-4 text-left text-xs font-bold text-on-surface-variant uppercase">{t('parameters.table.value')}</th>
                        <th className="px-6 py-4 text-left text-xs font-bold text-on-surface-variant uppercase">{t('parameters.table.category')}</th>
                        <th className="px-6 py-4 text-left text-xs font-bold text-on-surface-variant uppercase">{t('parameters.table.description')}</th>
                        <th className="px-6 py-4 text-left text-xs font-bold text-on-surface-variant uppercase">{t('parameters.table.status')}</th>
                        <th className="px-6 py-4 text-right text-xs font-bold text-on-surface-variant uppercase">{t('parameters.table.actions')}</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-outline-variant/10">
                      {filteredParameters.map((param) => (
                        <tr key={param.id} className="hover:bg-surface-container-low/50 transition-colors group">
                          <td className="px-6 py-4">
                            <span className="text-sm font-mono font-bold text-primary">{param.key}</span>
                            {param.isSystem && (
                              <span className="ml-2 text-xs px-2 py-0.5 rounded-full bg-secondary/10 text-secondary">
                                {t('parameters.badge.system')}
                              </span>
                            )}
                          </td>
                          <td className="px-6 py-4 text-sm text-on-surface-variant font-mono">{param.value}</td>
                          <td className="px-6 py-4">
                            <span className="text-xs px-3 py-1 rounded-lg bg-primary/10 text-primary font-bold">
                              {param.category}
                            </span>
                          </td>
                          <td className="px-6 py-4 text-sm text-on-surface-variant max-w-md truncate">{param.description}</td>
                          <td className="px-6 py-4">
                            <StatusBadge
                              status={param.isActive ? 'Active' : 'Blocked'}
                              label={param.isActive ? t('common.active') : t('common.inactive')}
                              variant="dot"
                            />
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                              <PermissionGuard permission="parameter:update">
                                <IconButton
                                  icon={Edit2}
                                  size="md"
                                  onClick={() => {
                                    setEditingParam(param);
                                    setParamForm({
                                      key: param.key,
                                      value: param.value,
                                      category: param.category,
                                      description: param.description,
                                      isActive: param.isActive,
                                      isSystem: param.isSystem
                                    });
                                    setIsParamModalOpen(true);
                                  }}
                                  className="rounded-full bg-surface-container-low hover:bg-surface-container-high"
                                />
                              </PermissionGuard>
                              {!param.isSystem && (
                                <PermissionGuard permission="parameter:delete">
                                  <IconButton
                                    icon={Trash2}
                                    size="md"
                                    onClick={() => handleDeleteParameter(param.id)}
                                    className="rounded-full text-error bg-surface-container-low hover:bg-error/10"
                                  />
                                </PermissionGuard>
                              )}
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                <Pagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  totalElements={totalElements}
                  pageSize={pageSize}
                  onPageChange={setCurrentPage}
                  onPageSizeChange={(size) => {
                    setPageSize(size);
                    setCurrentPage(0);
                  }}
                />
              </>
            )}
          </div>
        </div>
      )}

      {/* Default Fees Tab */}
      {activeTab === 'fees' && (
        <div className="space-y-6">
          {/* Error */}
          {feesError && (
            <div className="p-4 bg-error/10 border border-error/20 rounded-xl text-error text-sm">
              <strong>{t('common.error')}:</strong> {feesError}
            </div>
          )}

          {/* Actions */}
          <div className="flex justify-end">
            <PermissionGuard permission="parameter:create">
              <Button onClick={() => {
                setEditingFee(null);
                setFeeForm({
                  description: '',
                  feeType: FeeType.PERCENTAGE,
                  feePercentage: 0,
                  feeFixed: 0,
                  minAmount: 0,
                  maxAmount: 1000000,
                  currency: 'XOF',
                  isActive: true
                });
                setIsFeeModalOpen(true);
              }}>
                <Plus className="w-4 h-4" />
                {t('parameters.createFee')}
              </Button>
            </PermissionGuard>
          </div>

          {/* Fees Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {isLoadingFees && defaultFees.length === 0 ? (
              <div className="col-span-full p-12 text-center">
                <div className="w-10 h-10 border-4 border-primary/20 border-t-primary rounded-full animate-spin mx-auto mb-4"></div>
                <p className="text-on-surface-variant">{t('parameters.fees.loading')}</p>
              </div>
            ) : defaultFees.length === 0 ? (
              <div className="col-span-full p-12 text-center text-on-surface-variant">
                <DollarSign className="w-12 h-12 mx-auto mb-4 opacity-20" />
                <p className="font-bold">{t('parameters.fees.empty')}</p>
                <p className="text-sm mt-2">{t('parameters.fees.emptyDesc')}</p>
              </div>
            ) : (
              defaultFees.map((fee) => (
                <div key={fee.id} className="bg-surface-container-low p-6 rounded-xl border border-outline-variant/10 hover:border-primary/20 transition-colors">
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex-1">
                      <h4 className="font-bold text-primary mb-1">{fee.description}</h4>
                      <span className="text-xs px-2 py-1 rounded bg-primary/10 text-primary font-bold">
                        {t(`parameters.feeType.${fee.feeType}`)}
                      </span>
                    </div>
                    <div className="flex gap-1">
                      <PermissionGuard permission="parameter:update">
                        <IconButton
                          icon={Edit2}
                          size="sm"
                          onClick={() => {
                            setEditingFee(fee);
                            setFeeForm({
                              description: fee.description,
                              feeType: fee.feeType,
                              feePercentage: fee.feePercentage,
                              feeFixed: fee.feeFixed,
                              minAmount: fee.minAmount,
                              maxAmount: fee.maxAmount,
                              currency: fee.currency,
                              isActive: fee.isActive,
                              effectiveTo: fee.effectiveTo || undefined
                            });
                            setIsFeeModalOpen(true);
                          }}
                          className="rounded-full"
                        />
                      </PermissionGuard>
                      <PermissionGuard permission="parameter:delete">
                        <IconButton
                          icon={Trash2}
                          size="sm"
                          onClick={() => handleDeleteFee(fee.id)}
                          className="rounded-full text-error hover:bg-error/10"
                        />
                      </PermissionGuard>
                    </div>
                  </div>

                  <div className="space-y-2 text-sm">
                    {fee.feeType === 'PERCENTAGE' && (
                      <p className="text-on-surface-variant">
                        <span className="font-bold">{t('parameters.fees.rate')}:</span> {(fee.feePercentage * 100).toFixed(2)}%
                      </p>
                    )}
                    {fee.feeType === 'FIXED' && (
                      <p className="text-on-surface-variant">
                        <span className="font-bold">{t('parameters.fees.amount')}:</span> {fee.feeFixed} {fee.currency}
                      </p>
                    )}
                    {fee.feeType === 'MIXED' && (
                      <>
                        <p className="text-on-surface-variant">
                          <span className="font-bold">{t('parameters.fees.rate')}:</span> {(fee.feePercentage * 100).toFixed(2)}%
                        </p>
                        <p className="text-on-surface-variant">
                          <span className="font-bold">{t('parameters.fees.fixed')}:</span> {fee.feeFixed} {fee.currency}
                        </p>
                      </>
                    )}
                    <p className="text-on-surface-variant">
                      <span className="font-bold">{t('parameters.fees.range')}:</span> {fee.minAmount} - {fee.maxAmount} {fee.currency}
                    </p>
                    <div className="pt-2 flex items-center justify-between border-t border-outline-variant/10">
                      <StatusBadge
                        status={fee.isActive ? 'Active' : 'Blocked'}
                        label={fee.isActive ? t('common.active') : t('common.inactive')}
                        variant="dot"
                      />
                      {fee.effectiveTo && (
                        <span className="text-xs text-on-surface-variant">
                          {t('parameters.fees.until')} {new Date(fee.effectiveTo).toLocaleDateString()}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* Parameter Modal */}
      <Modal isOpen={isParamModalOpen} onClose={() => setIsParamModalOpen(false)} size="md">
        <div className="p-6">
          <h3 className="text-xl font-bold text-primary mb-4">
            {editingParam ? t('parameters.edit') : t('parameters.create')}
          </h3>
          <form onSubmit={handleCreateParameter} className="space-y-4">
            <div>
              <label className="block text-sm font-bold text-on-surface-variant mb-2">{t('parameters.form.key')}</label>
              <input
                type="text"
                value={paramForm.key}
                onChange={(e) => setParamForm({ ...paramForm, key: e.target.value })}
                disabled={!!editingParam}
                className="w-full bg-surface-container-high border-none rounded-lg p-3 text-sm font-mono"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-bold text-on-surface-variant mb-2">{t('parameters.form.value')}</label>
              <input
                type="text"
                value={paramForm.value}
                onChange={(e) => setParamForm({ ...paramForm, value: e.target.value })}
                className="w-full bg-surface-container-high border-none rounded-lg p-3 text-sm"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-bold text-on-surface-variant mb-2">{t('parameters.form.category')}</label>
              <select
                value={paramForm.category}
                onChange={(e) => setParamForm({ ...paramForm, category: e.target.value })}
                className="w-full bg-surface-container-high border-none rounded-lg p-3 text-sm"
              >
                {categories.filter(c => c !== 'ALL').map(cat => (
                  <option key={cat} value={cat}>{t(`parameters.category.${cat}`)}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-bold text-on-surface-variant mb-2">{t('parameters.form.description')}</label>
              <textarea
                value={paramForm.description}
                onChange={(e) => setParamForm({ ...paramForm, description: e.target.value })}
                className="w-full bg-surface-container-high border-none rounded-lg p-3 text-sm"
                rows={3}
              />
            </div>

            <div className="flex items-center gap-4">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={paramForm.isActive}
                  onChange={(e) => setParamForm({ ...paramForm, isActive: e.target.checked })}
                  className="w-4 h-4"
                />
                <span className="text-sm font-bold text-on-surface-variant">{t('parameters.form.active')}</span>
              </label>

              {!editingParam && (
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={paramForm.isSystem}
                    onChange={(e) => setParamForm({ ...paramForm, isSystem: e.target.checked })}
                    className="w-4 h-4"
                  />
                  <span className="text-sm font-bold text-on-surface-variant">{t('parameters.form.systemParameter')}</span>
                </label>
              )}
            </div>

            <div className="flex justify-end gap-3 pt-4 border-t border-outline-variant/10">
              <Button type="button" variant="outline" onClick={() => setIsParamModalOpen(false)}>
                {t('parameters.form.cancel')}
              </Button>
              <Button type="submit" disabled={isLoadingParams}>
                {editingParam ? t('parameters.form.update') : t('parameters.form.create')}
              </Button>
            </div>
          </form>
        </div>
      </Modal>

      {/* Fee Modal */}
      <Modal isOpen={isFeeModalOpen} onClose={() => setIsFeeModalOpen(false)} size="md">
        <div className="p-6">
          <h3 className="text-xl font-bold text-primary mb-4">
            {editingFee ? t('parameters.editFee') : t('parameters.createFee')}
          </h3>
          <form onSubmit={handleCreateFee} className="space-y-4">
            <div>
              <label className="block text-sm font-bold text-on-surface-variant mb-2">{t('parameters.fees.description')}</label>
              <input
                type="text"
                value={feeForm.description}
                onChange={(e) => setFeeForm({ ...feeForm, description: e.target.value })}
                className="w-full bg-surface-container-high border-none rounded-lg p-3 text-sm"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-bold text-on-surface-variant mb-2">{t('parameters.fees.feeType')}</label>
              <select
                value={feeForm.feeType}
                onChange={(e) => setFeeForm({ ...feeForm, feeType: e.target.value as FeeType })}
                className="w-full bg-surface-container-high border-none rounded-lg p-3 text-sm"
              >
                <option value={FeeType.PERCENTAGE}>{t('parameters.feeType.PERCENTAGE')}</option>
                <option value={FeeType.FIXED}>{t('parameters.feeType.FIXED')}</option>
                <option value={FeeType.MIXED}>{t('parameters.feeType.MIXED')}</option>
              </select>
            </div>

            {(feeForm.feeType === FeeType.PERCENTAGE || feeForm.feeType === FeeType.MIXED) && (
              <div>
                <label className="block text-sm font-bold text-on-surface-variant mb-2">
                  {t('parameters.fees.feePercentageLabel')}
                </label>
                <input
                  type="number"
                  step="0.001"
                  value={feeForm.feePercentage}
                  onChange={(e) => setFeeForm({ ...feeForm, feePercentage: parseFloat(e.target.value) })}
                  className="w-full bg-surface-container-high border-none rounded-lg p-3 text-sm"
                  required
                />
              </div>
            )}

            {(feeForm.feeType === FeeType.FIXED || feeForm.feeType === FeeType.MIXED) && (
              <div>
                <label className="block text-sm font-bold text-on-surface-variant mb-2">{t('parameters.fees.feeFixed')}</label>
                <input
                  type="number"
                  value={feeForm.feeFixed}
                  onChange={(e) => setFeeForm({ ...feeForm, feeFixed: parseFloat(e.target.value) })}
                  className="w-full bg-surface-container-high border-none rounded-lg p-3 text-sm"
                  required
                />
              </div>
            )}

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-bold text-on-surface-variant mb-2">{t('parameters.fees.minAmount')}</label>
                <input
                  type="number"
                  value={feeForm.minAmount}
                  onChange={(e) => setFeeForm({ ...feeForm, minAmount: parseFloat(e.target.value) })}
                  className="w-full bg-surface-container-high border-none rounded-lg p-3 text-sm"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-on-surface-variant mb-2">{t('parameters.fees.maxAmount')}</label>
                <input
                  type="number"
                  value={feeForm.maxAmount}
                  onChange={(e) => setFeeForm({ ...feeForm, maxAmount: parseFloat(e.target.value) })}
                  className="w-full bg-surface-container-high border-none rounded-lg p-3 text-sm"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-bold text-on-surface-variant mb-2">{t('parameters.fees.currency')}</label>
              <input
                type="text"
                value={feeForm.currency}
                onChange={(e) => setFeeForm({ ...feeForm, currency: e.target.value })}
                className="w-full bg-surface-container-high border-none rounded-lg p-3 text-sm"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-bold text-on-surface-variant mb-2">
                {t('parameters.fees.effectiveTo')}
              </label>
              <input
                type="date"
                value={feeForm.effectiveTo || ''}
                onChange={(e) => setFeeForm({ ...feeForm, effectiveTo: e.target.value })}
                className="w-full bg-surface-container-high border-none rounded-lg p-3 text-sm"
              />
            </div>

            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={feeForm.isActive}
                onChange={(e) => setFeeForm({ ...feeForm, isActive: e.target.checked })}
                className="w-4 h-4"
              />
              <span className="text-sm font-bold text-on-surface-variant">{t('parameters.form.active')}</span>
            </label>

            <div className="flex justify-end gap-3 pt-4 border-t border-outline-variant/10">
              <Button type="button" variant="outline" onClick={() => setIsFeeModalOpen(false)}>
                {t('parameters.form.cancel')}
              </Button>
              <Button type="submit" disabled={isLoadingFees}>
                {editingFee ? t('parameters.form.update') : t('parameters.form.create')}
              </Button>
            </div>
          </form>
        </div>
      </Modal>
    </div>
  );
}
