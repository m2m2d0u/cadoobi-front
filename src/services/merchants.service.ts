import { api } from '../lib/axios';
import type { ApiResponse, MerchantResponse, CreateMerchantRequest, UpdateMerchantRequest } from '../types/api';
import type { MerchantStatus } from '../types/enums';

export const merchantsService = {
  list: (params?: { status?: MerchantStatus; page?: number; size?: number; sort?: string }) =>
    api.get<ApiResponse<MerchantResponse[]>>('/merchants', { params }).then((r) => r.data),

  getById: (id: string) =>
    api.get<ApiResponse<MerchantResponse>>(`/merchants/${id}`).then((r) => r.data.data),

  getByCode: (code: string) =>
    api.get<ApiResponse<MerchantResponse>>(`/merchants/code/${code}`).then((r) => r.data.data),

  create: (payload: CreateMerchantRequest) =>
    api.post<ApiResponse<MerchantResponse>>('/merchants', payload).then((r) => r.data.data),

  update: (id: string, payload: UpdateMerchantRequest) =>
    api.put<ApiResponse<MerchantResponse>>(`/merchants/${id}`, payload).then((r) => r.data.data),

  delete: (id: string) =>
    api.delete<ApiResponse<void>>(`/merchants/${id}`).then((r) => r.data.data),
};
