import { api } from '../lib/axios';

export type ReportWindow = 'Daily' | 'Weekly' | 'Monthly' | 'Quarterly';

export interface RevenueData {
  name: string;
  value: number;
}

export interface OperatorShare {
  name: string;
  value: number;
  color: string;
}

export interface ReportSummary {
  totalRevenue: string;
  revenueGrowth: string;
  revenueHistory: RevenueData[];
  operatorShare: OperatorShare[];
}

export const reportsService = {
  summary: (window: ReportWindow = 'Weekly', from?: string, to?: string) =>
    api.get<ReportSummary>('/reports/summary', { params: { window, from, to } }).then((r) => r.data),

  export: (window: ReportWindow) =>
    api.get('/reports/export', { params: { window }, responseType: 'blob' }).then((r) => r.data),
};
