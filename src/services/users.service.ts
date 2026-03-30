import { api } from '../lib/axios';

export interface User {
  id: number;
  name: string;
  email: string;
  role: string;
  status: 'Active' | 'Pending' | 'Blocked';
  lastActive: string;
}

export interface InviteUserPayload {
  name: string;
  email: string;
  role: string;
  sendWelcomeEmail: boolean;
}

export const usersService = {
  list: (params?: { search?: string; role?: string }) =>
    api.get<User[]>('/users', { params }).then((r) => r.data),

  invite: (payload: InviteUserPayload) =>
    api.post<User>('/users/invite', payload).then((r) => r.data),

  resetPassword: (id: number) =>
    api.post(`/users/${id}/reset-password`).then((r) => r.data),

  block: (id: number) =>
    api.patch(`/users/${id}/block`).then((r) => r.data),
};
