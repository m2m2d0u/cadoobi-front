import { api } from '../lib/axios';
import type {
  ApiResponse,
  WebhookConfigurationResponse,
  CreateWebhookConfigurationRequest,
  UpdateWebhookConfigurationRequest
} from '../types/api';

export const webhooksService = {
  /**
   * Get all webhook configurations for the authenticated user (masked secrets)
   */
  getAll: () =>
    api.get<ApiResponse<WebhookConfigurationResponse[]>>('/webhooks')
      .then((r) => r.data),

  /**
   * Get specific webhook configuration by ID
   */
  getById: (id: string) =>
    api.get<ApiResponse<WebhookConfigurationResponse>>(`/webhooks/${id}`)
      .then((r) => r.data.data),

  /**
   * Create a new webhook configuration
   * Returns full secret only once - must be saved immediately
   */
  create: (payload: CreateWebhookConfigurationRequest) =>
    api.post<ApiResponse<WebhookConfigurationResponse>>('/webhooks', payload)
      .then((r) => r.data.data),

  /**
   * Update an existing webhook configuration
   */
  update: (id: string, payload: UpdateWebhookConfigurationRequest) =>
    api.put<ApiResponse<WebhookConfigurationResponse>>(`/webhooks/${id}`, payload)
      .then((r) => r.data.data),

  /**
   * Regenerate webhook secret
   * Returns new full secret only once - must be saved immediately
   */
  regenerateSecret: (id: string) =>
    api.post<ApiResponse<WebhookConfigurationResponse>>(`/webhooks/${id}/regenerate-secret`)
      .then((r) => r.data.data),

  /**
   * Delete a webhook configuration
   */
  delete: (id: string) =>
    api.delete<ApiResponse<void>>(`/webhooks/${id}`)
      .then((r) => r.data),
};
