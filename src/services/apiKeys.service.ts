import { api } from '../lib/axios';
import type {
  ApiResponse,
  ApiKeyResponse,
  CreateApiKeyRequest,
  UpdateApiKeyRequest
} from '../types/api';

export const apiKeysService = {
  /**
   * Get all API keys for the authenticated user (masked)
   */
  getAll: () =>
    api.get<ApiResponse<ApiKeyResponse[]>>('/api-keys')
      .then((r) => r.data),

  /**
   * Get specific API key by ID
   */
  getById: (id: string) =>
    api.get<ApiResponse<ApiKeyResponse>>(`/api-keys/${id}`)
      .then((r) => r.data.data),

  /**
   * Create a new API key
   * Returns full API key only once - must be saved immediately
   */
  create: (payload: CreateApiKeyRequest) =>
    api.post<ApiResponse<ApiKeyResponse>>('/api-keys', payload)
      .then((r) => r.data.data),

  /**
   * Update an existing API key
   */
  update: (id: string, payload: UpdateApiKeyRequest) =>
    api.put<ApiResponse<ApiKeyResponse>>(`/api-keys/${id}`, payload)
      .then((r) => r.data.data),

  /**
   * Delete an API key
   */
  delete: (id: string) =>
    api.delete<ApiResponse<void>>(`/api-keys/${id}`)
      .then((r) => r.data),
};
