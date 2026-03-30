import { api } from '../lib/axios';
import type { 
  ApiResponse, 
  OperatorResponse, 
  CreateOperatorRequest, 
  OperatorFeeResponse, 
  CreateOperatorFeeRequest 
} from '../types/api';

export const operatorsService = {
  listActive: () =>
    api.get<ApiResponse<OperatorResponse[]>>('/operators').then((r) => r.data.data),

  getById: (id: string) =>
    api.get<ApiResponse<OperatorResponse>>(`/operators/${id}`).then((r) => r.data.data),

  create: (payload: CreateOperatorRequest) =>
    api.post<ApiResponse<OperatorResponse>>('/operators', payload).then((r) => r.data.data),

  getFees: (id: string) =>
    api.get<ApiResponse<OperatorFeeResponse[]>>(`/operators/${id}/fees`).then((r) => r.data.data),

  createFee: (id: string, payload: CreateOperatorFeeRequest) =>
    api.post<ApiResponse<OperatorFeeResponse>>(`/operators/${id}/fees`, payload).then((r) => r.data.data),
};
