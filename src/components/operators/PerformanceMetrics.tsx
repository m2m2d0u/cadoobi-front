import React from 'react';
import { BarChart3, CheckCircle2, ArrowUpRight, ArrowDownRight } from 'lucide-react';
import { cn } from '@/src/lib/utils';
import { useLanguage } from '../../context/LanguageContext';

export function PerformanceMetrics() {
  const { t } = useLanguage();

  return (
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
  );
}
