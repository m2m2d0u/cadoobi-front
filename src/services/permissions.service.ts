import { api } from '../lib/axios';
import type { 
  ApiResponse, 
  PermissionResponse, 
  CreatePermissionRequest 
} from '../types/api';

export const permissionsService = {
  list: (params?: { activeOnly?: boolean }) =>
    api.get<ApiResponse<PermissionResponse[]>>('/permissions', { params }).then((r) => r.data.data),

  getById: (id: string) =>
    api.get<ApiResponse<PermissionResponse>>(`/permissions/${id}`).then((r) => r.data.data),

  getByCode: (code: string) =>
    api.get<ApiResponse<PermissionResponse>>(`/permissions/code/${code}`).then((r) => r.data.data),

  getByResource: (resource: string) =>
    api.get<ApiResponse<PermissionResponse[]>>(`/permissions/resource/${resource}`).then((r) => r.data.data),

  create: (payload: CreatePermissionRequest) =>
    api.post<ApiResponse<PermissionResponse>>('/permissions', payload).then((r) => r.data.data),

  update: (id: string, payload: CreatePermissionRequest) =>
    api.put<ApiResponse<PermissionResponse>>(`/permissions/${id}`, payload).then((r) => r.data.data),

  delete: (id: string) =>
    api.delete<ApiResponse<void>>(`/permissions/${id}`).then((r) => r.data.data),
};
