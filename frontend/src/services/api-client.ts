// Centralized API client for frontend-backend communication
import { getAuthToken } from './auth-service';

// Base configuration
const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8000';

// Custom error class for API errors
export class ApiError extends Error {
  public status: number;
  public data: any;

  constructor(message: string, status: number, data: any = null) {
    super(message);
    this.status = status;
    this.data = data;
    this.name = 'ApiError';
  }
}

// Main API client
class ApiClient {
  private baseUrl: string;

  constructor() {
    this.baseUrl = API_BASE_URL;
  }

  // Generic request method
  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${this.baseUrl}${endpoint}`;

    // Get auth token if available and add to headers
    const token = await getAuthToken();
    const headers = new Headers({
      'Content-Type': 'application/json',
      ...options.headers as Record<string, string>,
    });

    if (token) {
      headers.set('Authorization', `Bearer ${token}`);
    }

    const config: RequestInit = {
      ...options,
      headers,
    };

    try {
      const response = await fetch(url, config);

      // Handle different response status codes
      if (!response.ok) {
        const errorData = await response.json().catch(() => null);
        throw new ApiError(
          errorData?.message || `HTTP error! status: ${response.status}`,
          response.status,
          errorData
        );
      }

      // Handle different content types
      const contentType = response.headers.get('content-type');
      if (contentType && contentType.includes('application/json')) {
        return await response.json();
      } else {
        // For non-JSON responses, return text or empty object
        const text = await response.text();
        return text ? JSON.parse(text) : {};
      }
    } catch (error) {
      if (error instanceof TypeError) {
        // Network error
        throw new ApiError('Network error or server unavailable', 0);
      }
      throw error;
    }
  }

  // GET request
  public async get<T>(endpoint: string, params?: Record<string, string>): Promise<T> {
    const queryString = params ? `?${new URLSearchParams(params).toString()}` : '';
    return this.request<T>(`${endpoint}${queryString}`, { method: 'GET' });
  }

  // POST request
  public async post<T>(endpoint: string, data?: any): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'POST',
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  // PUT request
  public async put<T>(endpoint: string, data?: any): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'PUT',
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  // PATCH request
  public async patch<T>(endpoint: string, data?: any): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'PATCH',
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  // DELETE request
  public async delete<T>(endpoint: string): Promise<T> {
    return this.request<T>(endpoint, { method: 'DELETE' });
  }
}

// Export a singleton instance
export const apiClient = new ApiClient();

// Export utility functions
export const apiGet = <T>(endpoint: string, params?: Record<string, string>) =>
  apiClient.get<T>(endpoint, params);

export const apiPost = <T>(endpoint: string, data?: any) =>
  apiClient.post<T>(endpoint, data);

export const apiPut = <T>(endpoint: string, data?: any) =>
  apiClient.put<T>(endpoint, data);

export const apiPatch = <T>(endpoint: string, data?: any) =>
  apiClient.patch<T>(endpoint, data);

export const apiDelete = <T>(endpoint: string) =>
  apiClient.delete<T>(endpoint);