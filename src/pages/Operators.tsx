import React, { useState, useEffect } from 'react';
import {
  Activity,
  CheckCircle2,
  BarChart3,
  ArrowUpRight,
  ArrowDownRight,
  Zap,
  Plus,
  ShieldAlert,
  X,
  RefreshCw,
  Settings
} from 'lucide-react';
import { cn } from '@/src/lib/utils';
import { useLanguage } from '../context/LanguageContext';
import { Button, PageHeader, StatusBadge, Modal } from '../components/ui';
import type { StatusType } from '../components/ui';
import { operatorsService } from '../services';
import type { OperatorResponse, CreateOperatorRequest, OperatorFeeResponse, CreateOperatorFeeRequest } from '../types/api';
import { OperationType, FeeType } from '../types/enums';

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
            <Button onClick={() => setIsModalOpen(true)}>
              <Plus className="w-4 h-4" />
              {t('operators.create')}
            </Button>
          </>
        }
      />

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
        <div className="p-8">
          <div className="flex justify-between items-start mb-8">
            <div>
              <h3 className="text-2xl font-bold text-primary mb-1">{t('operators.create')}</h3>
            </div>
            <button
              onClick={() => setIsModalOpen(false)}
              className="p-2 hover:bg-surface-container-high rounded-full transition-colors"
            >
              <X className="w-5 h-5 text-on-surface-variant" />
            </button>
          </div>

          <form className="space-y-6" onSubmit={handleSubmit}>
            {error && <div className="p-3 bg-error/10 text-error text-sm font-bold rounded-lg">{error}</div>}

            <div className="space-y-2">
              <label className="text-[10px] font-bold text-primary uppercase tracking-widest">{t('operators.form.name')}</label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={e => setFormData({ ...formData, name: e.target.value })}
                placeholder="e.g. Orange Money"
                className="w-full bg-surface-container-high border-none rounded-lg p-4 text-sm focus:ring-2 focus:ring-primary/20 transition-all"
              />
            </div>
            
            <div className="space-y-2">
              <label className="text-[10px] font-bold text-primary uppercase tracking-widest">{t('operators.form.code')}</label>
              <input
                type="text"
                required
                value={formData.code}
                onChange={e => setFormData({ ...formData, code: e.target.value.toUpperCase() })}
                placeholder="e.g. SN_OM"
                className="w-full bg-surface-container-high border-none rounded-lg p-4 text-sm focus:ring-2 focus:ring-primary/20 transition-all"
              />
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-bold text-primary uppercase tracking-widest">{t('operators.form.country')}</label>
              <input
                type="text"
                required
                value={formData.country}
                onChange={e => setFormData({ ...formData, country: e.target.value })}
                placeholder="e.g. Senegal"
                className="w-full bg-surface-container-high border-none rounded-lg p-4 text-sm focus:ring-2 focus:ring-primary/20 transition-all"
              />
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-bold text-primary uppercase tracking-widest">{t('operators.form.apiBaseUrl')}</label>
              <input
                type="url"
                required
                value={formData.apiBaseUrl}
                onChange={e => setFormData({ ...formData, apiBaseUrl: e.target.value })}
                placeholder="https://api.gateway.com/"
                className="w-full bg-surface-container-high border-none rounded-lg p-4 text-sm focus:ring-2 focus:ring-primary/20 transition-all"
              />
            </div>

            <div className="grid grid-cols-2 gap-4 pt-4 border-t border-outline-variant/10">
              <div className="space-y-2 flex items-center gap-3">
                <input
                  type="checkbox"
                  id="supportsPayin"
                  checked={formData.supportsPayin}
                  onChange={e => setFormData({ ...formData, supportsPayin: e.target.checked })}
                  className="w-5 h-5 text-primary border-outline-variant rounded focus:ring-primary"
                />
                <label htmlFor="supportsPayin" className="text-sm font-bold text-on-surface-variant cursor-pointer">
                  {t('operators.form.supportsPayin')}
                </label>
              </div>

              <div className="space-y-2 flex items-center gap-3">
                <input
                  type="checkbox"
                  id="supportsPayout"
                  checked={formData.supportsPayout}
                  onChange={e => setFormData({ ...formData, supportsPayout: e.target.checked })}
                  className="w-5 h-5 text-primary border-outline-variant rounded focus:ring-primary"
                />
                <label htmlFor="supportsPayout" className="text-sm font-bold text-on-surface-variant cursor-pointer">
                  {t('operators.form.supportsPayout')}
                </label>
              </div>
            </div>

            <div className="space-y-2 flex items-center gap-3 pt-2">
              <input
                type="checkbox"
                id="isActive"
                checked={formData.isActive}
                onChange={e => setFormData({ ...formData, isActive: e.target.checked })}
                className="w-5 h-5 text-primary border-outline-variant rounded focus:ring-primary"
              />
              <label htmlFor="isActive" className="text-sm font-bold text-on-surface-variant cursor-pointer">
                {t('operators.form.isActive')}
              </label>
            </div>

            <div className="mt-10 space-y-4">
              <button 
                type="submit"
                disabled={isLoading}
                className={`w-full text-white py-4 rounded-xl font-bold flex items-center justify-center gap-2 transition-all shadow-lg shadow-primary/20 ${isLoading ? 'bg-primary/50 cursor-not-allowed' : 'bg-primary hover:opacity-90'}`}
              >
                 {isLoading ? t('common.saving') : t('operators.form.save')}
              </button>
            </div>
          </form>
        </div>
      </Modal>

      {/* Fees Modal */}
      <Modal isOpen={!!selectedOperatorForFees} onClose={() => { setSelectedOperatorForFees(null); setIsAddFeeMode(false); }}>
        <div className="p-8">
           <div className="flex justify-between items-start mb-8">
            <div>
              <h3 className="text-2xl font-bold text-primary mb-1">
                 {isAddFeeMode ? t('operators.fees.add') : t('operators.fees.manage')}
              </h3>
              <p className="text-on-surface-variant text-sm font-bold">{selectedOperatorForFees?.name}</p>
            </div>
            <button
              onClick={() => { setSelectedOperatorForFees(null); setIsAddFeeMode(false); }}
              className="p-2 hover:bg-surface-container-high rounded-full transition-colors"
            >
              <X className="w-5 h-5 text-on-surface-variant" />
            </button>
          </div>

          {feesError && <div className="p-3 mb-6 bg-error/10 text-error text-sm font-bold rounded-lg">{feesError}</div>}

          {!isAddFeeMode ? (
             <div className="space-y-6">
               <div className="flex justify-end">
                  <Button size="sm" onClick={() => setIsAddFeeMode(true)}>
                     <Plus className="w-4 h-4" />
                     {t('operators.fees.add')}
                  </Button>
               </div>
               
               {feesLoading ? (
                  <div className="py-12 flex justify-center"><RefreshCw className="w-8 h-8 text-primary animate-spin" /></div>
               ) : feesList.length === 0 ? (
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
                        {feesList.map(fee => (
                           <tr key={fee.id} className="border-b border-outline-variant/5 text-sm hover:bg-surface-container-lowest transition-colors">
                              <td className="p-3 font-bold text-primary">{fee.operationType}</td>
                              <td className="p-3">
                                 <span className="px-2 py-1 rounded bg-secondary/10 text-secondary text-[10px] font-bold uppercase">{fee.feeType}</span>
                              </td>
                              <td className="p-3 font-mono text-xs">{fee.minAmount} - {fee.maxAmount} {fee.currency}</td>
                              <td className="p-3 font-bold text-primary">
                                 {fee.feeType === FeeType.FIXED ? `${fee.feeFixed} ${fee.currency}` : fee.feeType === FeeType.PERCENTAGE ? `${fee.feePercentage}%` : `${fee.feeFixed} ${fee.currency} + ${fee.feePercentage}%`}
                              </td>
                           </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
               )}
             </div>
          ) : (
             <form className="space-y-6" onSubmit={handleFeeSubmit}>
               <div className="grid grid-cols-2 gap-4">
                 <div className="space-y-2">
                    <label className="text-[10px] font-bold text-primary uppercase tracking-widest">{t('operators.fees.form.operation')}</label>
                    <select
                      required
                      value={feeFormData.operationType}
                      onChange={e => setFeeFormData({...feeFormData, operationType: e.target.value as OperationType})}
                      className="w-full bg-surface-container-high border-none rounded-lg p-4 text-sm font-bold text-primary focus:ring-2 focus:ring-primary/20 transition-all cursor-pointer"
                    >
                      <option value={OperationType.PAYIN}>PAY-IN</option>
                      <option value={OperationType.PAYOUT}>PAY-OUT</option>
                    </select>
                 </div>
                 <div className="space-y-2">
                    <label className="text-[10px] font-bold text-primary uppercase tracking-widest">{t('operators.fees.form.feeType')}</label>
                    <select
                      required
                      value={feeFormData.feeType}
                      onChange={e => setFeeFormData({...feeFormData, feeType: e.target.value as FeeType})}
                      className="w-full bg-surface-container-high border-none rounded-lg p-4 text-sm font-bold text-primary focus:ring-2 focus:ring-primary/20 transition-all cursor-pointer"
                    >
                      <option value={FeeType.PERCENTAGE}>PERCENTAGE</option>
                      <option value={FeeType.FIXED}>FIXED</option>
                      <option value={FeeType.MIXED}>MIXED</option>
                    </select>
                 </div>
               </div>

               <div className="grid grid-cols-2 gap-4">
                 {(feeFormData.feeType === FeeType.PERCENTAGE || feeFormData.feeType === FeeType.MIXED) && (
                   <div className="space-y-2">
                      <label className="text-[10px] font-bold text-primary uppercase tracking-widest">{t('operators.fees.form.feePercentage')}</label>
                      <input
                        type="number"
                        step="0.01"
                        required
                        value={feeFormData.feePercentage || ''}
                        onChange={e => setFeeFormData({...feeFormData, feePercentage: parseFloat(e.target.value)})}
                        className="w-full bg-surface-container-high border-none rounded-lg p-4 text-sm focus:ring-2 focus:ring-primary/20 transition-all"
                      />
                   </div>
                 )}
                 {(feeFormData.feeType === FeeType.FIXED || feeFormData.feeType === FeeType.MIXED) && (
                   <div className="space-y-2">
                      <label className="text-[10px] font-bold text-primary uppercase tracking-widest">{t('operators.fees.form.feeFixed')}</label>
                      <input
                        type="number"
                        required
                        value={feeFormData.feeFixed || ''}
                        onChange={e => setFeeFormData({...feeFormData, feeFixed: parseFloat(e.target.value)})}
                        className="w-full bg-surface-container-high border-none rounded-lg p-4 text-sm focus:ring-2 focus:ring-primary/20 transition-all"
                      />
                   </div>
                 )}
               </div>

               <div className="grid grid-cols-3 gap-4">
                  <div className="space-y-2">
                      <label className="text-[10px] font-bold text-primary uppercase tracking-widest">{t('operators.fees.form.minAmount')}</label>
                      <input
                        type="number"
                        required
                        value={feeFormData.minAmount}
                        onChange={e => setFeeFormData({...feeFormData, minAmount: parseFloat(e.target.value)})}
                        className="w-full bg-surface-container-high border-none rounded-lg p-4 text-sm focus:ring-2 focus:ring-primary/20 transition-all"
                      />
                   </div>
                   <div className="space-y-2">
                      <label className="text-[10px] font-bold text-primary uppercase tracking-widest">{t('operators.fees.form.maxAmount')}</label>
                      <input
                        type="number"
                        required
                        value={feeFormData.maxAmount}
                        onChange={e => setFeeFormData({...feeFormData, maxAmount: parseFloat(e.target.value)})}
                        className="w-full bg-surface-container-high border-none rounded-lg p-4 text-sm focus:ring-2 focus:ring-primary/20 transition-all"
                      />
                   </div>
                   <div className="space-y-2">
                      <label className="text-[10px] font-bold text-primary uppercase tracking-widest">{t('operators.fees.form.currency')}</label>
                      <input
                        type="text"
                        required
                        value={feeFormData.currency}
                        onChange={e => setFeeFormData({...feeFormData, currency: e.target.value.toUpperCase()})}
                        className="w-full bg-surface-container-high border-none rounded-lg p-4 text-sm font-bold focus:ring-2 focus:ring-primary/20 transition-all"
                      />
                   </div>
               </div>

                <div className="grid grid-cols-2 gap-4">
                   <div className="space-y-2">
                      <label className="text-[10px] font-bold text-primary uppercase tracking-widest">{t('operators.fees.form.effectiveFrom')}</label>
                      <input
                        type="date"
                        required
                        value={feeFormData.effectiveFrom}
                        onChange={e => setFeeFormData({...feeFormData, effectiveFrom: e.target.value})}
                        className="w-full bg-surface-container-high border-none rounded-lg p-4 text-sm focus:ring-2 focus:ring-primary/20 transition-all cursor-pointer"
                      />
                   </div>
                   <div className="space-y-2">
                      <label className="text-[10px] font-bold text-primary uppercase tracking-widest">{t('operators.fees.form.effectiveTo')}</label>
                      <input
                        type="date"
                        value={feeFormData.effectiveTo || ''}
                        onChange={e => setFeeFormData({...feeFormData, effectiveTo: e.target.value || undefined})}
                        className="w-full bg-surface-container-high border-none rounded-lg p-4 text-sm focus:ring-2 focus:ring-primary/20 transition-all cursor-pointer"
                      />
                   </div>
                </div>

               <div className="flex gap-4 pt-4 border-t border-outline-variant/10">
                 <Button type="button" variant="outline" className="flex-1" onClick={() => setIsAddFeeMode(false)}>
                    {t('common.cancel')}
                 </Button>
                 <button 
                  type="submit"
                  disabled={feesLoading}
                  className={`flex-1 text-white py-4 rounded-xl font-bold flex items-center justify-center gap-2 transition-all shadow-lg shadow-primary/20 ${feesLoading ? 'bg-primary/50 cursor-not-allowed' : 'bg-primary hover:opacity-90'}`}
                 >
                   {feesLoading ? t('common.saving') : t('operators.fees.form.save')}
                 </button>
               </div>
             </form>
          )}
        </div>
      </Modal>

      {/* Grid rendering operators and the static Load card */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-10">
        <div className="lg:col-span-3">
          
          {isLoading && operators.length === 0 ? (
            <div className="h-48 flex items-center justify-center bg-surface-container-lowest border border-outline-variant/10 rounded-2xl">
              <div className="w-8 h-8 border-4 border-primary/20 border-t-primary rounded-full animate-spin"></div>
            </div>
          ) : error && operators.length === 0 ? (
             <div className="p-8 text-center bg-error/5 border border-error/20 text-error rounded-2xl">
                <ShieldAlert className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <h3 className="font-bold mb-1">{t('operators.error.load')}</h3>
                <p className="text-sm opacity-80">{error}</p>
             </div>
          ) : operators.length === 0 ? (
             <div className="p-12 text-center text-on-surface-variant flex flex-col items-center justify-center bg-surface-container-lowest border border-outline-variant/10 rounded-2xl">
               <Activity className="w-12 h-12 mb-4 opacity-20" />
               <p>{t('operators.empty')}</p>
             </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {operators.map((op) => (
                <div key={op.id} className="bg-surface-container-lowest p-6 rounded-2xl border border-outline-variant/10 shadow-sm hover:shadow-md transition-shadow relative">
                  <div className="flex justify-between items-start mb-6">
                    <div className="w-12 h-12 rounded-xl flex items-center justify-center text-white font-bold text-xl shadow-inner bg-primary">
                      {op.name.charAt(0).toUpperCase()}
                    </div>
                    <div className="flex items-center gap-2">
                       <button onClick={() => handleOpenFees(op)} className="p-2 hover:bg-surface-container-high rounded-full transition-colors group relative" title={t('operators.fees.manage') || 'Manage Fees'}>
                          <Settings className="w-5 h-5 text-on-surface-variant group-hover:text-primary transition-colors cursor-pointer" />
                       </button>
                       <StatusBadge
                        status={op.isActive ? 'Healthy' as StatusType : 'Degraded' as StatusType}
                        label={op.isActive ? t('common.active') || 'Active' : t('common.inactive') || 'Inactive'}
                        variant="badge"
                       />
                    </div>
                  </div>

                  <h4 className="font-bold text-lg text-primary mb-1 truncate">{op.name}</h4>
                  <p className="font-mono text-[10px] text-on-surface-variant mb-6">{op.code}</p>

                  <div className="space-y-3">
                    <div className="flex justify-between items-center text-xs">
                      <span className="text-on-surface-variant">{t('operators.form.country')}</span>
                      <span className="font-bold text-primary truncate max-w-[120px]">{op.country}</span>
                    </div>
                    <div className="flex justify-between items-center text-xs">
                      <span className="text-on-surface-variant">URL</span>
                      <span className="font-mono font-[10px] text-primary truncate max-w-[140px]" title={op.apiBaseUrl}>{op.apiBaseUrl}</span>
                    </div>
                    <div className="flex justify-between items-center text-[10px] font-bold mt-4 pt-4 border-t border-outline-variant/10">
                      <div className={`px-2 py-1 rounded ${op.supportsPayin ? 'bg-secondary/10 text-secondary' : 'bg-outline-variant/10 text-on-surface-variant/50'}`}>PAY-IN</div>
                      <div className={`px-2 py-1 rounded ${op.supportsPayout ? 'bg-primary/10 text-primary' : 'bg-outline-variant/10 text-on-surface-variant/50'}`}>PAY-OUT</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="bg-primary text-white p-6 rounded-2xl flex flex-col justify-between relative overflow-hidden h-full min-h-[200px]">
          <Zap className="absolute -right-4 -top-4 w-32 h-32 text-white/5 rotate-12" />
          <div>
            <p className="text-[10px] font-bold uppercase tracking-widest text-white/60 mb-2">{t('operators.load.title')}</p>
            <h3 className="text-4xl font-bold font-headline mb-4">82%</h3>
            <p className="text-xs text-white/70 leading-relaxed">{t('operators.load.desc')}</p>
          </div>
          <button className="mt-8 w-full py-3 bg-white/10 hover:bg-white/20 rounded-lg text-xs font-bold transition-colors backdrop-blur-sm border border-white/10">
            {t('operators.load.logs')}
          </button>
        </div>
      </div>

      <div className="bg-surface-container-lowest rounded-2xl border border-outline-variant/10 overflow-hidden shadow-sm">
        <div className="p-6 border-b border-outline-variant/10 flex justify-between items-center">
          <h3 className="font-bold text-primary flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-secondary" />
            {t('operators.metrics.title')}
          </h3>
          <div className="flex gap-2">
            {['1h', '6h', '24h', '7d'].map((val) => (
              <button key={val} className={cn(
                'px-3 py-1 rounded text-[10px] font-bold uppercase transition-colors',
                val === '1h' ? 'bg-primary text-white' : 'hover:bg-surface-container-high text-on-surface-variant'
              )}>{val}</button>
            ))}
          </div>
        </div>

        <div className="p-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="space-y-1">
              <p className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest">{t('operators.metrics.avgResponse')}</p>
              <div className="flex items-baseline gap-2">
                <span className="text-2xl font-bold text-primary">142ms</span>
                <span className="text-[10px] font-bold text-secondary flex items-center">
                  <ArrowDownRight className="w-3 h-3" /> 12%
                </span>
              </div>
            </div>
            <div className="space-y-1">
              <p className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest">{t('operators.metrics.apiCalls')}</p>
              <div className="flex items-baseline gap-2">
                <span className="text-2xl font-bold text-primary">1.2M</span>
                <span className="text-[10px] font-bold text-secondary flex items-center">
                  <ArrowUpRight className="w-3 h-3" /> 8%
                </span>
              </div>
            </div>
            <div className="space-y-1">
              <p className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest">{t('operators.metrics.errorRate')}</p>
              <div className="flex items-baseline gap-2">
                <span className="text-2xl font-bold text-primary">0.04%</span>
                <span className="text-[10px] font-bold text-error flex items-center">
                  <ArrowUpRight className="w-3 h-3" /> 0.01%
                </span>
              </div>
            </div>
            <div className="space-y-1">
              <p className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest">{t('operators.metrics.activeNodes')}</p>
              <div className="flex items-baseline gap-2">
                <span className="text-2xl font-bold text-primary">12/12</span>
                <span className="text-[10px] font-bold text-secondary flex items-center">
                  <CheckCircle2 className="w-3 h-3" /> {t('operators.metrics.stable')}
                </span>
              </div>
            </div>
          </div>

          <div className="mt-10 h-48 w-full bg-surface-container-low rounded-xl flex items-end gap-1 p-4">
            {Array.from({ length: 48 }).map((_, i) => (
              <div
                key={i}
                className="grow bg-primary/20 hover:bg-primary transition-colors rounded-t-sm"
                style={{ height: `${Math.random() * 80 + 20}%` }}
              />
            ))}
          </div>
          <div className="flex justify-between mt-2 text-[10px] font-bold text-on-surface-variant uppercase tracking-widest px-1">
            <span>60m {t('operators.metrics.ago')}</span>
            <span>30m {t('operators.metrics.ago')}</span>
            <span>{t('operators.metrics.now')}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
