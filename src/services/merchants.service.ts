import { api } from '../lib/axios';

export interface Merchant {
  id: number;
  name: string;
  category: string;
  location: string;
  status: 'Active' | 'Pending' | 'Blocked';
  volume: string;
  joined: string;
}

export interface RegisterMerchantPayload {
  businessName: string;
  merchantCode: string;
  contactPerson: string;
  phone: string;
  email: string;
  address: string;
  settlement: {
    type: 'bank' | 'mobile';
    bankName?: string;
    iban?: string;
    mobileNumber?: string;
  };
}

export const merchantsService = {
  list: (params?: { search?: string; category?: string }) =>
    api.get<Merchant[]>('/merchants', { params }).then((r) => r.data),

  get: (id: number) =>
    api.get<Merchant>(`/merchants/${id}`).then((r) => r.data),

  register: (payload: RegisterMerchantPayload) =>
    api.post<Merchant>('/merchants', payload).then((r) => r.data),

  update: (id: number, payload: Partial<RegisterMerchantPayload>) =>
    api.patch<Merchant>(`/merchants/${id}`, payload).then((r) => r.data),

  block: (id: number) =>
    api.patch(`/merchants/${id}/block`).then((r) => r.data),
};
