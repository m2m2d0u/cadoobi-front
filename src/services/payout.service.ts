import { api } from '../lib/axios';
import type { ApiResponse, CreatePayoutRequest, PayoutResponse, UpdatePayoutStatusRequest } from '../types/api';
import type { PayoutStatus } from '../types/enums';

export const payoutService = {
  /**
   * Create a new payout transaction
   * POST /payouts
   */
  create: (payload: CreatePayoutRequest) =>
    api.post<ApiResponse<PayoutResponse>>('/payouts', payload)
      .then((r) => r.data.data),

  /**
   * Get a specific payout by ID
   * GET /payouts/{id}
   */
  getById: (id: string) =>
    api.get<ApiResponse<PayoutResponse>>(`/payouts/${id}`)
      .then((r) => r.data.data),

  /**
   * List all payouts for a merchant with pagination
   * GET /payouts?merchantId={merchantId}&page={page}&size={size}
   */
  list: (params?: {
    merchantId?: string;
    page?: number;
    size?: number;
    sort?: string;
  }) =>
    api.get<ApiResponse<PayoutResponse[]>>('/payouts', {
      params: {
        merchantId: params?.merchantId,
        page: params?.page ?? 0,
        size: params?.size ?? 20,
        sort: params?.sort ?? 'createdAt,desc'
      }
    }).then((r) => r.data),

  /**
   * Update payout status
   * PUT /payouts/{id}/status?status={status}&operatorTransactionId={operatorTransactionId}
   */
  updateStatus: (id: string, request: UpdatePayoutStatusRequest) =>
    api.put<ApiResponse<PayoutResponse>>(`/payouts/${id}/status`, null, {
      params: {
        status: request.status,
        operatorTransactionId: request.operatorTransactionId
      }
    }).then((r) => r.data.data),
};
