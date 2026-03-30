import React from 'react';
import {
  TrendingUp,
  TrendingDown,
  Wallet,
  Store,
  Clock,
  ArrowRight,
  Send,
  UserPlus,
  PieChart as PieChartIcon
} from 'lucide-react';
import {
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  AreaChart,
  Area,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import { cn } from '@/src/lib/utils';
import { useLanguage } from '../context/LanguageContext';
import { PageHeader } from '../components/ui';

const trendData = [
  { time: '08:00', value: 1.2 },
  { time: '10:00', value: 2.1 },
  { time: '12:00', value: 1.8 },
  { time: '14:00', value: 2.5 },
  { time: '16:00', value: 2.2 },
  { time: '18:00', value: 3.1 },
  { time: '20:00', value: 3.8 },
  { time: '22:00', value: 3.5 },
];

const operatorData = [
  { name: 'Orange Money', value: 45, color: '#ff8c00' },
  { name: 'Free Money', value: 30, color: '#ec1c24' },
  { name: 'Wave', value: 25, color: '#00a9e0' },
];

export function Dashboard() {
  const { t } = useLanguage();

  return (
    <div className="max-w-7xl mx-auto">
      <PageHeader
        title={t('dashboard.title')}
        subtitle={t('dashboard.subtitle')}
        actions={
          <div className="flex items-center gap-2 px-4 py-2 bg-surface-container-lowest text-primary font-semibold rounded-lg shadow-sm border border-outline-variant/10 text-sm">
            <Clock className="w-4 h-4" />
            {t('dashboard.today')}: Oct 24, 2023
          </div>
        }
      />

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard 
          label={t('dashboard.totalPayments')} 
          value="XOF 4.5M" 
          trend="+12.5%" 
          trendUp={true} 
          icon={Wallet}
          color="primary"
        />
        <StatCard 
          label={t('dashboard.activeMerchants')} 
          value="842" 
          trend="+3%" 
          trendUp={true} 
          icon={Store}
          color="secondary"
        />
        <StatCard 
          label={t('dashboard.pendingTransactions')} 
          value="28" 
          trend="-5%" 
          trendUp={false} 
          icon={Clock}
          color="neutral"
        />
        <StatCard 
          label={t('dashboard.totalRevenue')} 
          value="XOF 1.2M" 
          trend="+8%" 
          trendUp={true} 
          icon={TrendingUp}
          color="primary-container"
        />
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-12 gap-6 mb-8">
        <div className="col-span-12 lg:col-span-8 bg-surface-container-low p-6 rounded-xl">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h4 className="text-lg font-bold font-headline">{t('dashboard.paymentTrends')}</h4>
              <p className="text-xs text-on-surface-variant">{t('dashboard.trendsSubtitle')}</p>
            </div>
            <div className="flex bg-surface-container-high rounded-lg p-1">
              <button className="px-3 py-1 text-xs font-bold bg-white text-primary rounded shadow-sm">{t('dashboard.daily')}</button>
              <button className="px-3 py-1 text-xs font-medium text-on-surface-variant">{t('dashboard.weekly')}</button>
              <button className="px-3 py-1 text-xs font-medium text-on-surface-variant">{t('dashboard.monthly')}</button>
            </div>
          </div>
          <div className="h-75 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={trendData}>
                <defs>
                  <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#006e0c" stopOpacity={0.1}/>
                    <stop offset="95%" stopColor="#006e0c" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e4e2e1" />
                <XAxis 
                  dataKey="time" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fontSize: 10, fill: '#43474d' }}
                  dy={10}
                />
                <YAxis 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fontSize: 10, fill: '#43474d' }}
                  tickFormatter={(value) => `${value}M`}
                />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#ffffff', 
                    borderRadius: '8px', 
                    border: 'none', 
                    boxShadow: '0 4px 12px rgba(0,0,0,0.1)' 
                  }} 
                />
                <Area 
                  type="monotone" 
                  dataKey="value" 
                  stroke="#006e0c" 
                  strokeWidth={3}
                  fillOpacity={1} 
                  fill="url(#colorValue)" 
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="col-span-12 lg:col-span-4 bg-surface-container-low p-6 rounded-xl flex flex-col">
          <h4 className="text-lg font-bold font-headline mb-1">{t('dashboard.operatorShare')}</h4>
          <p className="text-xs text-on-surface-variant mb-8">{t('dashboard.marketDistribution')}</p>
          <div className="flex-1 flex flex-col items-center justify-center">
            <div className="relative w-48 h-48 mb-8">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={operatorData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {operatorData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-3xl font-bold font-headline">100%</span>
                <span className="text-[10px] font-bold text-on-surface-variant uppercase tracking-tighter">{t('dashboard.capacity')}</span>
              </div>
            </div>
            <div className="w-full space-y-3">
              {operatorData.map((op) => (
                <div key={op.name} className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2">
                    <span className="w-3 h-3 rounded-full" style={{ backgroundColor: op.color }}></span>
                    <span className="font-medium">{op.name}</span>
                  </div>
                  <span className="font-bold tabular-nums">{op.value}%</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Recent Transactions */}
      <div className="bg-surface-container-low rounded-xl overflow-hidden">
        <div className="px-6 py-5 border-b border-outline-variant/10 flex justify-between items-center">
          <h4 className="text-lg font-bold font-headline">{t('dashboard.recentTransactions')}</h4>
          <button className="text-xs font-bold text-secondary hover:underline">{t('dashboard.viewAll')}</button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="text-[11px] font-bold text-on-surface-variant uppercase tracking-widest bg-surface-container-high/30">
                <th className="px-6 py-4">{t('dashboard.table.reference')}</th>
                <th className="px-6 py-4">{t('dashboard.table.merchant')}</th>
                <th className="px-6 py-4">{t('dashboard.table.amount')}</th>
                <th className="px-6 py-4">{t('dashboard.table.operator')}</th>
                <th className="px-6 py-4">{t('dashboard.table.status')}</th>
                <th className="px-6 py-4">{t('dashboard.table.timestamp')}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-outline-variant/5">
              <TransactionRow 
                refNo="#TRX-829104" 
                merchant="Auchan Senegal" 
                amount="45,000" 
                operator="Orange" 
                status="Success" 
                time="24 Oct, 14:20" 
              />
              <TransactionRow 
                refNo="#TRX-829103" 
                merchant="Super U Market" 
                amount="12,400" 
                operator="Wave" 
                status="Pending" 
                time="24 Oct, 14:15" 
              />
              <TransactionRow 
                refNo="#TRX-829102" 
                merchant="Baobab Pharmacy" 
                amount="2,500" 
                operator="Free" 
                status="Success" 
                time="24 Oct, 13:58" 
              />
            </tbody>
          </table>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
        <QuickActionCard 
          title={t('dashboard.quickActions.initiatePayment')} 
          desc={t('dashboard.quickActions.initiatePaymentDesc')} 
          icon={Send} 
          variant="primary"
        />
        <QuickActionCard 
          title={t('dashboard.quickActions.addMerchant')} 
          desc={t('dashboard.quickActions.addMerchantDesc')} 
          icon={UserPlus} 
          variant="secondary"
        />
        <QuickActionCard 
          title={t('dashboard.quickActions.generateReport')} 
          desc={t('dashboard.quickActions.generateReportDesc')} 
          icon={PieChartIcon} 
          variant="neutral"
        />
      </div>
    </div>
  );
}

function StatCard({ label, value, trend, trendUp, icon: Icon, color }: any) {
  return (
    <div className="bg-surface-container-low p-6 rounded-xl relative overflow-hidden group">
      <div className="absolute top-0 right-0 w-24 h-24 bg-primary/5 -mr-8 -mt-8 rounded-full transition-transform group-hover:scale-110"></div>
      <div className="flex justify-between items-start mb-4">
        <div className={cn(
          "p-2 rounded-lg text-white",
          color === 'primary' ? "bg-primary" : 
          color === 'secondary' ? "bg-secondary" : 
          color === 'neutral' ? "bg-surface-container-highest text-primary" : "bg-primary-container"
        )}>
          <Icon className="w-5 h-5" />
        </div>
        <span className={cn(
          "flex items-center text-xs font-bold px-2 py-1 rounded",
          trendUp ? "text-secondary bg-secondary/10" : "text-error bg-error/10"
        )}>
          {trendUp ? <TrendingUp className="w-3 h-3 mr-1" /> : <TrendingDown className="w-3 h-3 mr-1" />}
          {trend}
        </span>
      </div>
      <p className="text-on-surface-variant text-xs font-semibold uppercase tracking-wider mb-1">{label}</p>
      <h3 className="text-2xl font-bold font-headline tabular-nums">{value}</h3>
    </div>
  );
}

function TransactionRow({ refNo, merchant, amount, operator, status, time }: any) {
  return (
    <tr className="hover:bg-surface-container-high/40 transition-colors group">
      <td className="px-6 py-4 font-mono text-xs font-semibold text-primary">{refNo}</td>
      <td className="px-6 py-4">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded bg-primary-container text-white flex items-center justify-center font-bold text-xs">
            {merchant.substring(0, 2).toUpperCase()}
          </div>
          <span className="text-sm font-semibold">{merchant}</span>
        </div>
      </td>
      <td className="px-6 py-4 font-bold tabular-nums text-sm">{amount}</td>
      <td className="px-6 py-4">
        <span className={cn(
          "px-2 py-1 rounded text-[10px] font-bold uppercase",
          operator === 'Orange' ? "bg-orange-100 text-orange-700" : 
          operator === 'Wave' ? "bg-blue-100 text-blue-700" : "bg-red-100 text-red-700"
        )}>
          {operator}
        </span>
      </td>
      <td className="px-6 py-4">
        <div className="flex items-center gap-2">
          <span className={cn(
            "w-2 h-2 rounded-full",
            status === 'Success' ? "bg-secondary" : "bg-amber-500"
          )}></span>
          <span className="text-xs font-bold text-on-surface">{status}</span>
        </div>
      </td>
      <td className="px-6 py-4 text-xs text-on-surface-variant tabular-nums">{time}</td>
    </tr>
  );
}

function QuickActionCard({ title, desc, icon: Icon, variant }: any) {
  return (
    <button className={cn(
      "p-4 rounded-xl flex items-center gap-4 text-left group transition-all",
      variant === 'primary' ? "bg-primary text-white hover:bg-primary-container" : "bg-surface-container-low hover:bg-surface-container-high border border-outline-variant/5"
    )}>
      <div className={cn(
        "w-12 h-12 rounded-lg flex items-center justify-center",
        variant === 'primary' ? "bg-white/10 text-white" : 
        variant === 'secondary' ? "bg-secondary/10 text-secondary" : "bg-primary-fixed-dim/20 text-primary"
      )}>
        <Icon className="w-6 h-6" />
      </div>
      <div>
        <h5 className={cn("font-bold text-sm", variant === 'primary' ? "text-white" : "text-primary")}>{title}</h5>
        <p className={cn("text-[11px]", variant === 'primary' ? "text-white/60" : "text-on-surface-variant")}>{desc}</p>
      </div>
      <ArrowRight className={cn(
        "w-5 h-5 ml-auto transition-transform group-hover:translate-x-1",
        variant === 'primary' ? "text-white/20" : "text-slate-300"
      )} />
    </button>
  );
}
