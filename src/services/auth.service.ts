import { api } from '../lib/axios';
import type { ApiResponse } from '../types/api';

export interface LoginPayload {
  email: string;
  password: string;
}

export interface AuthResponse {
  token: string;
  refreshToken: string;
  expiresIn: number;
  userId: string;
  email: string;
  fullName: string;
  status: string;
  roles: string[];
  permissions: string[];
}

export const authService = {
  login: (payload: LoginPayload) =>
    api.post<ApiResponse<AuthResponse>>('/auth/login', payload).then((r) => r.data.data),

  refresh: (refreshToken: string) =>
    api.post<ApiResponse<AuthResponse>>('/auth/refresh', { refreshToken }).then((r) => r.data.data),

  logout: () =>
    api.post<ApiResponse<void>>('/auth/logout').then((r) => r.data),

  me: () =>
    api.get<ApiResponse<AuthResponse>>('/auth/me').then((r) => r.data.data),
};
