import { api } from '../lib/axios';

export interface LoginPayload {
  email: string;
  password: string;
}

export interface AuthResponse {
  accessToken: string;
  refreshToken: string;
  user: {
    id: string;
    name: string;
    email: string;
    role: string;
  };
}

export const authService = {
  login: (payload: LoginPayload) =>
    api.post<AuthResponse>('/auth/login', payload).then((r) => r.data),

  logout: () =>
    api.post('/auth/logout').then((r) => r.data),

  me: () =>
    api.get<AuthResponse['user']>('/auth/me').then((r) => r.data),
};
