import { api } from '../lib/axios';
import type { 
  ApiResponse, 
  InitiatePaymentRequest, 
  PaymentResponse 
} from '../types/api';

export const paymentsService = {
  initiate: (payload: InitiatePaymentRequest) =>
    api.post<ApiResponse<PaymentResponse>>('/payments', payload).then((r) => r.data.data),

  getByReference: (reference: string) =>
    api.get<ApiResponse<PaymentResponse>>(`/payments/${reference}`).then((r) => r.data.data),

  handleCallback: (operatorCode: string, payload: unknown) =>
    api.post<ApiResponse<void>>(`/payments/callbacks/${operatorCode}`, payload).then((r) => r.data.data),
};
