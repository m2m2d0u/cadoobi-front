import { api } from '../lib/axios';
import type { ApiResponse, SystemAccountBalanceResponse, SystemAccountEntryResponse } from '../types/api';

export const systemAccountService = {
  /**
   * Get all system account balances (all currencies)
   */
  getAllBalances: () =>
    api.get<ApiResponse<SystemAccountBalanceResponse[]>>('/system-account/balances')
      .then((r) => r.data),

  /**
   * Get system account balance for a specific currency
   */
  getBalance: (currency: string = 'XOF') =>
    api.get<ApiResponse<SystemAccountBalanceResponse>>('/system-account/balance', {
      params: { currency }
    }).then((r) => r.data),

  /**
   * Get system account entries (platform earnings history)
   */
  getEntries: (params?: {
    currency?: string;
    page?: number;
    size?: number;
    sort?: string;
  }) =>
    api.get<ApiResponse<SystemAccountEntryResponse[]>>('/system-account/entries', {
      params: {
        currency: params?.currency || 'XOF',
        page: params?.page ?? 0,
        size: params?.size ?? 20,
        sort: params?.sort ?? 'createdAt,desc'
      }
    }).then((r) => r.data),
};
