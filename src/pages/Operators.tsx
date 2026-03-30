import React from 'react';
import {
  Activity,
  Settings,
  CheckCircle2,
  BarChart3,
  ArrowUpRight,
  ArrowDownRight,
  Zap
} from 'lucide-react';
import { cn } from '@/src/lib/utils';
import { useLanguage } from '../context/LanguageContext';
import { Button, PageHeader, StatusBadge } from '../components/ui';
import type { StatusType } from '../components/ui';

const operators = [
  { id: 1, name: 'Orange Money', region: 'Senegal', status: 'Healthy', latency: '120ms', successRate: '99.4%', volume: 'XOF 450M', color: 'bg-orange-500' },
  { id: 2, name: 'Wave', region: 'Senegal', status: 'Healthy', latency: '85ms', successRate: '99.8%', volume: 'XOF 380M', color: 'bg-blue-400' },
  { id: 3, name: 'Free Money', region: 'Senegal', status: 'Degraded', latency: '450ms', successRate: '92.1%', volume: 'XOF 120M', color: 'bg-red-600' },
  { id: 4, name: 'E-Money', region: 'Senegal', status: 'Healthy', latency: '150ms', successRate: '98.9%', volume: 'XOF 45M', color: 'bg-blue-800' },
];

export function Operators() {
  const { t } = useLanguage();

  return (
    <div className="max-w-7xl mx-auto">
      <PageHeader
        title={t('operators.title')}
        subtitle={t('operators.subtitle')}
        actions={
          <>
            <Button variant="outline" size="sm">
              <Activity className="w-4 h-4" />
              {t('operators.health')}
            </Button>
            <Button>
              <Settings className="w-4 h-4" />
              {t('operators.config')}
            </Button>
          </>
        }
      />

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-10">
        <div className="lg:col-span-3 grid grid-cols-1 md:grid-cols-3 gap-6">
          {operators.map((op) => (
            <div key={op.id} className="bg-surface-container-lowest p-6 rounded-2xl border border-outline-variant/10 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex justify-between items-start mb-6">
                <div className={cn('w-12 h-12 rounded-xl flex items-center justify-center text-white font-bold text-xl shadow-inner', op.color)}>
                  {op.name.charAt(0)}
                </div>
                <StatusBadge
                  status={op.status as StatusType}
                  label={op.status === 'Healthy' ? t('common.healthy') : t('common.degraded')}
                  variant="badge"
                />
              </div>

              <h4 className="font-bold text-lg text-primary mb-1">{op.name}</h4>
              <p className="text-xs text-on-surface-variant mb-6">{op.region} {t('operators.card.gateway')}</p>

              <div className="space-y-3">
                <div className="flex justify-between items-center text-xs">
                  <span className="text-on-surface-variant">{t('operators.card.successRate')}</span>
                  <span className="font-bold text-primary">{op.successRate}</span>
                </div>
                <div className="h-1.5 w-full bg-surface-container-high rounded-full overflow-hidden">
                  <div
                    className={cn('h-full rounded-full', op.status === 'Healthy' ? 'bg-secondary' : 'bg-error')}
                    style={{ width: op.successRate }}
                  />
                </div>
                <div className="flex justify-between items-center text-xs pt-2">
                  <span className="text-on-surface-variant">{t('operators.card.latency')}</span>
                  <span className="font-mono font-bold text-primary">{op.latency}</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="bg-primary text-white p-6 rounded-2xl flex flex-col justify-between relative overflow-hidden">
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
