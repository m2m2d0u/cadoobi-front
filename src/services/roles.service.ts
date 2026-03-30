import { api } from '../lib/axios';
import type { 
  ApiResponse, 
  RoleResponse, 
  CreateRoleRequest,
  UpdateRoleRequest
} from '../types/api';

export const rolesService = {
  list: (params?: { activeOnly?: boolean }) =>
    api.get<ApiResponse<RoleResponse[]>>('/roles', { params }).then((r) => r.data.data),

  getById: (id: string) =>
    api.get<ApiResponse<RoleResponse>>(`/roles/${id}`).then((r) => r.data.data),

  getByCode: (code: string) =>
    api.get<ApiResponse<RoleResponse>>(`/roles/code/${code}`).then((r) => r.data.data),

  create: (payload: CreateRoleRequest) =>
    api.post<ApiResponse<RoleResponse>>('/roles', payload).then((r) => r.data.data),

  update: (id: string, payload: UpdateRoleRequest) =>
    api.put<ApiResponse<RoleResponse>>(`/roles/${id}`, payload).then((r) => r.data.data),

  delete: (id: string) =>
    api.delete<ApiResponse<void>>(`/roles/${id}`).then((r) => r.data.data),

  addPermissions: (id: string, permissionIds: string[]) =>
    api.post<ApiResponse<RoleResponse>>(`/roles/${id}/permissions`, permissionIds).then((r) => r.data.data),

  removePermissions: (id: string, permissionIds: string[]) =>
    api.delete<ApiResponse<RoleResponse>>(`/roles/${id}/permissions`, { data: permissionIds }).then((r) => r.data.data),
};
