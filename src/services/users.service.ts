import { api } from '../lib/axios';
import type { 
  ApiResponse, 
  UserResponse, 
  CreateUserRequest, 
  UpdateUserRequest, 
  ChangePasswordRequest
} from '../types/api';
import type { UserStatus } from '../types/enums';

export const usersService = {
  list: (params?: { status?: UserStatus; page?: number; size?: number; sort?: string }) =>
    api.get<ApiResponse<UserResponse[]>>('/users', { params }).then((r) => r.data),

  getById: (id: string) =>
    api.get<ApiResponse<UserResponse>>(`/users/${id}`).then((r) => r.data.data),

  getByEmail: (email: string) =>
    api.get<ApiResponse<UserResponse>>(`/users/email/${email}`).then((r) => r.data.data),

  create: (payload: CreateUserRequest) =>
    api.post<ApiResponse<UserResponse>>('/users', payload).then((r) => r.data.data),

  update: (id: string, payload: UpdateUserRequest) =>
    api.put<ApiResponse<UserResponse>>(`/users/${id}`, payload).then((r) => r.data.data),

  delete: (id: string) =>
    api.delete<ApiResponse<void>>(`/users/${id}`).then((r) => r.data.data),

  changePassword: (id: string, payload: ChangePasswordRequest) =>
    api.post<ApiResponse<void>>(`/users/${id}/change-password`, payload).then((r) => r.data.data),

  activate: (id: string) =>
    api.post<ApiResponse<UserResponse>>(`/users/${id}/activate`).then((r) => r.data.data),

  suspend: (id: string) =>
    api.post<ApiResponse<UserResponse>>(`/users/${id}/suspend`).then((r) => r.data.data),

  resetFailedLogins: (id: string) =>
    api.post<ApiResponse<void>>(`/users/${id}/reset-failed-logins`).then((r) => r.data.data),
};
