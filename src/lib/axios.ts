import axios, { type AxiosError, type InternalAxiosRequestConfig } from 'axios';

const BASE_URL = import.meta.env.VITE_API_BASE_URL ?? '/api/v1';

export const api = axios.create({
  baseURL: BASE_URL,
  timeout: 15_000,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
});

// ─── Request interceptor ──────────────────────────────────────────────────────

api.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = localStorage.getItem('access_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error: AxiosError) => Promise.reject(error),
);

// ─── Response interceptor ─────────────────────────────────────────────────────

api.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & { _retry?: boolean };

    // Auto-refresh token on 401
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const refreshToken = localStorage.getItem('refresh_token');
        const { data } = await axios.post<{ data: { token: string; refreshToken: string } }>(`${BASE_URL}/auth/refresh`, { refreshToken });

        localStorage.setItem('access_token', data.data.token);
        localStorage.setItem('refresh_token', data.data.refreshToken);
        originalRequest.headers.Authorization = `Bearer ${data.data.token}`;

        return api(originalRequest);
      } catch {
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        window.location.href = '/login';
      }
    }

    return Promise.reject(normalizeError(error));
  },
);

// ─── Error normalizer ─────────────────────────────────────────────────────────

export interface ApiError {
  message: string;
  status: number | null;
  code?: string;
}

function normalizeError(error: AxiosError): ApiError {
  if (error.response) {
    const data = error.response.data as Record<string, unknown>;
    return {
      status: error.response.status,
      message: (data?.message as string) ?? error.message,
      code: data?.code as string | undefined,
    };
  }

  if (error.request) {
    return { status: null, message: 'No response from server. Check your connection.' };
  }

  return { status: null, message: error.message };
}
