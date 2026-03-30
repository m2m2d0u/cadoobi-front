import { api } from '../lib/axios';

export interface Transaction {
  ref: string;
  merchant: string;
  phone: string;
  amount: string;
  operator: string;
  status: 'Success' | 'Pending' | 'Failed';
  time: string;
}

export interface TransactionFilters {
  status?: string;
  operator?: string;
  merchant?: string;
  from?: string;
  to?: string;
  page?: number;
  limit?: number;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
}

export const transactionsService = {
  list: (filters?: TransactionFilters) =>
    api.get<PaginatedResponse<Transaction>>('/transactions', { params: filters }).then((r) => r.data),

  get: (ref: string) =>
    api.get<Transaction>(`/transactions/${ref}`).then((r) => r.data),

  initiate: (payload: Omit<Transaction, 'ref' | 'status' | 'time'>) =>
    api.post<Transaction>('/transactions', payload).then((r) => r.data),

  export: (filters?: TransactionFilters) =>
    api.get('/transactions/export', { params: filters, responseType: 'blob' }).then((r) => r.data),
};
