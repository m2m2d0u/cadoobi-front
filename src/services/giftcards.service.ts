import { api } from '../lib/axios';
import type { ApiResponse, GiftCardBalanceResponse, RedeemGiftCardRequest, RedemptionResponse } from '../types/api';

export const giftCardsService = {
  getCardBalance: (cardCode: string) =>
    api.get<ApiResponse<GiftCardBalanceResponse>>(`/cards/${cardCode}/balance`).then((r) => r.data.data),

  redeem: (cardCode: string, payload: RedeemGiftCardRequest) =>
    api.post<ApiResponse<RedemptionResponse>>(`/cards/${cardCode}/redeem`, payload).then((r) => r.data.data),
};
