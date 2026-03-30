import React from 'react';
import {
  BarChart3,
  Download,
  Calendar,
  Filter,
  TrendingUp,
  ArrowUpRight,
  FileText,
  Share2,
  RefreshCw
} from 'lucide-react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import { cn } from '@/src/lib/utils';
import { useLanguage } from '../context/LanguageContext';
import { Button, PageHeader } from '../components/ui';

const data = [
  { name: 'Mon', value: 4000 },
  { name: 'Tue', value: 3000 },
  { name: 'Wed', value: 2000 },
  { name: 'Thu', value: 2780 },
  { name: 'Fri', value: 1890 },
  { name: 'Sat', value: 2390 },
  { name: 'Sun', value: 3490 },
];

const pieData = [
  { name: 'Orange Money', value: 400, color: '#FF7900' },
  { name: 'Wave', value: 300, color: '#1E90FF' },
  { name: 'Free Money', value: 200, color: '#E10000' },
  { name: 'E-Money', value: 100, color: '#004A99' },
];

export function Reports() {
  const { t } = useLanguage();

  return (
    <div className="max-w-7xl mx-auto">
      <PageHeader
        title={t('reports.title')}
        subtitle={t('reports.subtitle')}
        actions={
          <>
            <Button variant="outline" size="sm">
              <Share2 className="w-4 h-4" />
              {t('reports.share')}
            </Button>
            <Button>
              <Download className="w-4 h-4" />
              {t('reports.export')}
            </Button>
          </>
        }
      />

      <div className="flex gap-4 mb-8">
        <div className="flex bg-surface-container-low p-1 rounded-lg border border-outline-variant/10">
          {[
            { key: 'Daily', label: t('reports.filter.daily') },
            { key: 'Weekly', label: t('reports.filter.weekly') },
            { key: 'Monthly', label: t('reports.filter.monthly') },
            { key: 'Quarterly', label: t('reports.filter.quarterly') },
          ].map((item) => (
            <button key={item.key} className={cn(
              'px-4 py-1.5 rounded-md text-xs font-bold transition-all',
              item.key === 'Weekly' ? 'bg-white text-primary shadow-sm' : 'text-on-surface-variant hover:text-primary'
            )}>{item.label}</button>
          ))}
        </div>
        <button className="flex items-center gap-2 px-4 py-2 bg-surface-container-low border border-outline-variant/10 rounded-lg text-xs font-bold text-primary">
          <Calendar className="w-4 h-4" />
          Mar 23 - Mar 30, 2026
        </button>
        <button className="flex items-center gap-2 px-4 py-2 bg-surface-container-low border border-outline-variant/10 rounded-lg text-xs font-bold text-primary">
          <Filter className="w-4 h-4" />
          {t('reports.filter.more')}
        </button>
        <button className="p-2 bg-surface-container-low border border-outline-variant/10 rounded-lg text-on-surface-variant hover:text-primary transition-colors ml-auto">
          <RefreshCw className="w-4 h-4" />
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
        <div className="lg:col-span-2 bg-surface-container-lowest p-8 rounded-2xl border border-outline-variant/10 shadow-sm">
          <div className="flex justify-between items-start mb-8">
            <div>
              <h3 className="font-bold text-primary text-lg">{t('reports.revenue.title')}</h3>
              <p className="text-xs text-on-surface-variant">{t('reports.revenue.desc')}</p>
            </div>
            <div className="text-right">
              <span className="text-2xl font-bold text-primary">XOF 124.5M</span>
              <div className="flex items-center justify-end gap-1 text-[10px] font-bold text-secondary">
                <ArrowUpRight className="w-3 h-3" /> +14.2%
              </div>
            </div>
          </div>
          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data}>
                <defs>
                  <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#000f22" stopOpacity={0.1} />
                    <stop offset="95%" stopColor="#000f22" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#666' }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#666' }} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#fff', borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                  itemStyle={{ fontSize: '12px', fontWeight: 'bold' }}
                />
                <Area type="monotone" dataKey="value" stroke="#000f22" strokeWidth={3} fillOpacity={1} fill="url(#colorValue)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-surface-container-lowest p-8 rounded-2xl border border-outline-variant/10 shadow-sm">
          <h3 className="font-bold text-primary text-lg mb-1">{t('reports.operator.title')}</h3>
          <p className="text-xs text-on-surface-variant mb-8">{t('reports.operator.desc')}</p>
          <div className="h-48 w-full mb-8">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={pieData} cx="50%" cy="50%" innerRadius={60} outerRadius={80} paddingAngle={5} dataKey="value">
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="space-y-4">
            {pieData.map((item) => (
              <div key={item.name} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full" style={{ backgroundColor: item.color }} />
                  <span className="text-xs font-medium text-primary">{item.name}</span>
                </div>
                <span className="text-xs font-bold text-primary">{item.value}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="bg-surface-container-low p-6 rounded-2xl border border-outline-variant/10">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-primary/10 text-primary rounded-lg flex items-center justify-center">
              <FileText className="w-5 h-5" />
            </div>
            <h4 className="font-bold text-primary">{t('reports.scheduled.title')}</h4>
          </div>
          <div className="space-y-4">
            <div className="p-3 bg-white rounded-lg border border-outline-variant/5 flex justify-between items-center">
              <div>
                <p className="text-xs font-bold text-primary">{t('reports.scheduled.monthly')}</p>
                <p className="text-[10px] text-on-surface-variant">{t('reports.scheduled.next')}: April 1st, 2026</p>
              </div>
              <button className="text-[10px] font-bold text-secondary">{t('common.edit')}</button>
            </div>
            <div className="p-3 bg-white rounded-lg border border-outline-variant/5 flex justify-between items-center">
              <div>
                <p className="text-xs font-bold text-primary">{t('reports.scheduled.merchant')}</p>
                <p className="text-[10px] text-on-surface-variant">{t('reports.scheduled.next')}: {t('reports.scheduled.everyMonday')}</p>
              </div>
              <button className="text-[10px] font-bold text-secondary">{t('common.edit')}</button>
            </div>
          </div>
        </div>

        <div className="md:col-span-2 bg-primary text-white p-8 rounded-2xl relative overflow-hidden">
          <div className="relative z-10">
            <h3 className="text-2xl font-bold font-headline mb-2">{t('reports.insights.title')}</h3>
            <p className="text-white/70 text-sm max-w-md mb-6">{t('reports.insights.desc')}</p>
            <button className="px-6 py-2.5 bg-white text-primary font-bold text-xs rounded-lg hover:bg-white/90 transition-colors">
              {t('reports.insights.read')}
            </button>
          </div>
          <TrendingUp className="absolute -right-8 -bottom-8 w-48 h-48 text-white/5" />
        </div>
      </div>
    </div>
  );
}
