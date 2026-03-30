import { api } from '../lib/axios';

export interface Operator {
  id: number;
  name: string;
  region: string;
  status: 'Healthy' | 'Degraded';
  latency: string;
  successRate: string;
  volume: string;
}

export interface OperatorMetrics {
  avgResponseMs: number;
  apiCalls: number;
  errorRate: number;
  activeNodes: number;
  totalNodes: number;
  networkLoad: number;
  history: { timestamp: string; value: number }[];
}

export const operatorsService = {
  list: () =>
    api.get<Operator[]>('/operators').then((r) => r.data),

  metrics: (window: '1h' | '6h' | '24h' | '7d' = '1h') =>
    api.get<OperatorMetrics>('/operators/metrics', { params: { window } }).then((r) => r.data),
};
