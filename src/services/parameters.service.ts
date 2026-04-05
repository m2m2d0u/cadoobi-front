import { api } from '../lib/axios';
import type {
  ApiResponse,
  ParameterResponse,
  CreateParameterRequest,
  UpdateParameterRequest,
  DefaultMerchantFeeResponse,
  CreateDefaultMerchantFeeRequest
} from '../types/api';

export const parametersService = {
  // ── System Parameters ────────────────────────────────────────────────────────

  /**
   * Get all system parameters (paginated)
   */
  list: (params?: { page?: number; size?: number; sort?: string }) =>
    api.get<ApiResponse<ParameterResponse[]>>('/parameters', {
      params: {
        page: params?.page ?? 0,
        size: params?.size ?? 20,
        sort: params?.sort ?? 'category,asc'
      }
    }).then((r) => r.data),

  /**
   * Get parameters by category
   */
  getByCategory: (category: string) =>
    api.get<ApiResponse<ParameterResponse[]>>(`/parameters/category/${category}`)
      .then((r) => r.data),

  /**
   * Get parameter by ID
   */
  getById: (id: string) =>
    api.get<ApiResponse<ParameterResponse>>(`/parameters/${id}`)
      .then((r) => r.data.data),

  /**
   * Get parameter by key
   */
  getByKey: (key: string) =>
    api.get<ApiResponse<ParameterResponse>>(`/parameters/key/${key}`)
      .then((r) => r.data.data),

  /**
   * Create a new parameter
   */
  create: (payload: CreateParameterRequest) =>
    api.post<ApiResponse<ParameterResponse>>('/parameters', payload)
      .then((r) => r.data.data),

  /**
   * Update a parameter
   */
  update: (id: string, payload: UpdateParameterRequest) =>
    api.put<ApiResponse<ParameterResponse>>(`/parameters/${id}`, payload)
      .then((r) => r.data.data),

  /**
   * Delete a parameter
   */
  delete: (id: string) =>
    api.delete<ApiResponse<void>>(`/parameters/${id}`)
      .then((r) => r.data),

  // ── Default Merchant Fees ────────────────────────────────────────────────────

  /**
   * Get all default merchant fees
   */
  getDefaultFees: () =>
    api.get<ApiResponse<DefaultMerchantFeeResponse[]>>('/parameters/merchant-fees/defaults')
      .then((r) => r.data),

  /**
   * Create a new default merchant fee
   */
  createDefaultFee: (payload: CreateDefaultMerchantFeeRequest) =>
    api.post<ApiResponse<DefaultMerchantFeeResponse>>('/parameters/merchant-fees/defaults', payload)
      .then((r) => r.data.data),

  /**
   * Update a default merchant fee
   */
  updateDefaultFee: (id: string, payload: CreateDefaultMerchantFeeRequest) =>
    api.put<ApiResponse<DefaultMerchantFeeResponse>>(`/parameters/merchant-fees/defaults/${id}`, payload)
      .then((r) => r.data.data),

  /**
   * Delete a default merchant fee
   */
  deleteDefaultFee: (id: string) =>
    api.delete<ApiResponse<void>>(`/parameters/merchant-fees/defaults/${id}`)
      .then((r) => r.data),
};
