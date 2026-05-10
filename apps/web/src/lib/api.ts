import type { ApiResponse, ApiErrorResponse } from '@portfolioai/types';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4005';

class ApiClient {
  private baseUrl: string;

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl;
  }

  private getHeaders(): HeadersInit {
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
    };

    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('portfolioai-auth');
      if (stored) {
        try {
          const parsed = JSON.parse(stored);
          if (parsed.state?.accessToken) {
            headers['Authorization'] = `Bearer ${parsed.state.accessToken}`;
          }
        } catch {
          // ignore parse errors
        }
      }
    }

    return headers;
  }

  async request<T>(
    endpoint: string,
    options: RequestInit = {},
  ): Promise<ApiResponse<T>> {
    const url = `${this.baseUrl}${endpoint}`;

    const response = await fetch(url, {
      ...options,
      headers: {
        ...this.getHeaders(),
        ...(options.headers || {}),
      },
      credentials: 'include',
    });

    if (!response.ok) {
      const errorData: ApiErrorResponse = await response.json().catch(() => ({
        success: false as const,
        error: {
          code: 'UNKNOWN_ERROR',
          message: `HTTP ${response.status}: ${response.statusText}`,
        },
        timestamp: new Date().toISOString(),
      }));
      throw new ApiError(
        errorData.error.message,
        response.status,
        errorData.error.code,
        errorData.error.details,
      );
    }

    return response.json();
  }

  async get<T>(endpoint: string) {
    return this.request<T>(endpoint, { method: 'GET' });
  }

  async post<T>(endpoint: string, data?: unknown) {
    return this.request<T>(endpoint, {
      method: 'POST',
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  async put<T>(endpoint: string, data?: unknown) {
    return this.request<T>(endpoint, {
      method: 'PUT',
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  async patch<T>(endpoint: string, data?: unknown) {
    return this.request<T>(endpoint, {
      method: 'PATCH',
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  async delete<T>(endpoint: string) {
    return this.request<T>(endpoint, { method: 'DELETE' });
  }
}

export class ApiError extends Error {
  constructor(
    message: string,
    public statusCode: number,
    public code: string,
    public details?: Record<string, string[]>,
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

export const api = new ApiClient(API_URL);
