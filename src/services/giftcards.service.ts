import { api } from '../lib/axios';

export interface GiftCard {
  id: string;
  merchant: string;
  type: 'Digital' | 'Physical';
  value: string;
  status: 'Active' | 'Redeemed' | 'Expired';
  expiry: string;
  code: string;
}

export interface IssueGiftCardPayload {
  merchantId: number;
  type: 'Digital' | 'Physical';
  value: number;
  expiryMonths: number;
}

export const giftCardsService = {
  list: (params?: { search?: string; status?: string }) =>
    api.get<GiftCard[]>('/gift-cards', { params }).then((r) => r.data),

  issue: (payload: IssueGiftCardPayload) =>
    api.post<GiftCard>('/gift-cards', payload).then((r) => r.data),

  export: () =>
    api.get('/gift-cards/export', { responseType: 'blob' }).then((r) => r.data),
};
