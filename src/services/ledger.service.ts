import { api } from '../lib/axios';
import type {
  ApiResponse,
  MerchantBalanceResponse,
  LedgerEntryResponse
} from '../types/api';

export const ledgerService = {
  /**
   * Get all balances for a merchant (one per currency)
   */
  getAllBalances: (merchantId: string) =>
    api.get<ApiResponse<MerchantBalanceResponse[]>>(`/merchants/${merchantId}/ledger/balances`)
      .then((r) => r.data.data),

  /**
   * Get balance for a specific merchant and currency
   */
  getBalance: (merchantId: string, currency: string = 'XOF') =>
    api.get<ApiResponse<MerchantBalanceResponse>>(`/merchants/${merchantId}/ledger/balance`, {
      params: { currency }
    }).then((r) => r.data.data),

  /**
   * Get paginated ledger entries for a merchant account
   */
  getEntries: (merchantId: string, params?: {
    currency?: string;
    page?: number;
    size?: number;
    sort?: string;
  }) =>
    api.get<ApiResponse<LedgerEntryResponse[]>>(`/merchants/${merchantId}/ledger/entries`, {
      params: {
        currency: params?.currency || 'XOF',
        page: params?.page ?? 0,
        size: params?.size ?? 20,
        sort: params?.sort || 'createdAt,desc'
      }
    }).then((r) => r.data),

  /**
   * Get all ledger entries (system-wide with role-based access)
   * SUPER_ADMIN and ADMIN can view all entries
   * Other users can only view entries for their merchant accounts
   */
  getAllLedgerEntries: (params?: {
    page?: number;
    size?: number;
    sort?: string;
  }) =>
    api.get<ApiResponse<LedgerEntryResponse[]>>('/ledger/entries', {
      params: {
        page: params?.page ?? 0,
        size: params?.size ?? 20,
        sort: params?.sort || 'createdAt,desc'
      }
    }).then((r) => r.data),
};
