import { api } from '../lib/axios';
import type { 
  ApiResponse, 
  InitiatePaymentRequest, 
  PaymentResponse 
} from '../types/api';

export const paymentsService = {
  /**
   * List all payments with pagination and filtering
   * NOTE: This endpoint needs to be implemented in the backend
   * Suggested endpoint: GET /payments?page=0&size=20&status=COMPLETED&merchantId=xxx
   */
  list: (params?: {
    page?: number;
    size?: number;
    status?: string;
    merchantId?: string;
    operatorCode?: string;
    startDate?: string;
    endDate?: string;
    search?: string;
    sort?: string;
  }) =>
    api.get<ApiResponse<PaymentResponse[]>>('/payments', {
      params: {
        page: params?.page ?? 0,
        size: params?.size ?? 20,
        sort: params?.sort || 'createdAt,desc',
        ...params
      }
    }).then((r) => r.data),

  initiate: (payload: InitiatePaymentRequest) =>
    api.post<ApiResponse<PaymentResponse>>('/payments', payload).then((r) => r.data.data),

  getByReference: (reference: string) =>
    api.get<ApiResponse<PaymentResponse>>(`/payments/${reference}`).then((r) => r.data.data),

  handleCallback: (operatorCode: string, payload: unknown) =>
    api.post<ApiResponse<void>>(`/payments/callbacks/${operatorCode}`, payload).then((r) => r.data.data),
};
