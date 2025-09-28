import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse, AxiosError } from 'axios';
import config from './config';

// Custom error types
export interface APIError {
  message: string;
  status?: number;
  field?: string;
  code?: string;
  error_id?: string;
  timestamp?: string;
  details?: Record<string, any>;
}

export interface APIResponse<T = any> {
  data: T;
  message?: string;
  status: number;
}

export interface SiteStats {
  happy_students: string;
  papers_delivered: string;
  expert_writers: string;
  success_rate: string;
  source: 'database' | 'fallback';
  error?: string;
}

export interface Review {
  id: string;
  rating: number;
  review: string;
  subject: string;
  order_type: string;
  service: string;
  created_at: string;
  month_year: string;
}

export interface ReviewsResponse {
  reviews: Review[];
  total_count: number;
  source: 'database' | 'fallback';
  error?: string;
}

// Token management utilities
class TokenManager {
  private static ACCESS_TOKEN_KEY = 'gcts_access_token';
  private static REFRESH_TOKEN_KEY = 'gcts_refresh_token';

  static getAccessToken(): string | null {
    if (typeof window === 'undefined') return null;
    return localStorage.getItem(this.ACCESS_TOKEN_KEY);
  }

  static getRefreshToken(): string | null {
    if (typeof window === 'undefined') return null;
    return localStorage.getItem(this.REFRESH_TOKEN_KEY);
  }

  static setTokens(accessToken: string, refreshToken: string): void {
    if (typeof window === 'undefined') return;
    localStorage.setItem(this.ACCESS_TOKEN_KEY, accessToken);
    localStorage.setItem(this.REFRESH_TOKEN_KEY, refreshToken);
  }

  static clearTokens(): void {
    if (typeof window === 'undefined') return;
    localStorage.removeItem(this.ACCESS_TOKEN_KEY);
    localStorage.removeItem(this.REFRESH_TOKEN_KEY);
  }

  static isAuthenticated(): boolean {
    return !!this.getAccessToken();
  }
}

// Create axios instance
const api: AxiosInstance = axios.create({
  baseURL: config.getApiUrl(),
  timeout: 30000, // 30 seconds
  headers: {
    'Content-Type': 'application/json',
  },
});

// Track if we're currently refreshing token to avoid multiple refresh calls
let isRefreshing = false;
let failedQueue: Array<{
  resolve: (value?: any) => void;
  reject: (reason?: any) => void;
}> = [];

const processQueue = (error: any, token: string | null = null) => {
  failedQueue.forEach(({ resolve, reject }) => {
    if (error) {
      reject(error);
    } else {
      resolve(token);
    }
  });
  
  failedQueue = [];
};

// Request interceptor to include JWT token
api.interceptors.request.use(
  (config: AxiosRequestConfig): any => {
    const token = TokenManager.getAccessToken();
    
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    // Add request timestamp for debugging
    if (process.env.NODE_ENV === 'development') {
      console.log(`🚀 API Request: ${config.method?.toUpperCase()} ${config.url}`, {
        data: config.data,
        params: config.params,
      });
    }
    
    return config;
  },
  (error: AxiosError) => {
    console.error('❌ Request Error:', error);
    return Promise.reject(error);
  }
);

// Response interceptor for token refresh and error handling
api.interceptors.response.use(
  (response: AxiosResponse): AxiosResponse => {
    // Log successful responses in development
    if (process.env.NODE_ENV === 'development') {
      console.log(`✅ API Response: ${response.config.method?.toUpperCase()} ${response.config.url}`, {
        status: response.status,
        data: response.data,
      });
    }
    
    return response;
  },
  async (error: AxiosError): Promise<any> => {
    const originalRequest = error.config;
    
    if (process.env.NODE_ENV === 'development') {
      console.error(`❌ API Error: ${originalRequest?.method?.toUpperCase()} ${originalRequest?.url}`, {
        status: error.response?.status,
        data: error.response?.data,
      });
    }

    // Handle 401 errors (token expired)
    if (error.response?.status === 401 && originalRequest && !(originalRequest as any)._retry) {
      if (isRefreshing) {
        // If already refreshing, queue this request
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        }).then(token => {
          if (originalRequest.headers) {
            originalRequest.headers.Authorization = `Bearer ${token}`;
          }
          return api(originalRequest);
        });
      }

      (originalRequest as any)._retry = true;
      isRefreshing = true;

      const refreshToken = TokenManager.getRefreshToken();
      
      if (!refreshToken) {
        TokenManager.clearTokens();
        processQueue(error, null);
        // Redirect to login in Next.js
        if (typeof window !== 'undefined') {
          window.location.href = '/login';
        }
        return Promise.reject(error);
      }

      try {
        const response = await axios.post(`${config.getApiUrl()}/auth/token/refresh/`, {
          refresh: refreshToken,
        });

        const { access, refresh } = response.data;
        TokenManager.setTokens(access, refresh);
        
        // Update authorization header for original request
        if (originalRequest.headers) {
          originalRequest.headers.Authorization = `Bearer ${access}`;
        }

        processQueue(null, access);
        return api(originalRequest);
        
      } catch (refreshError) {
        processQueue(refreshError, null);
        TokenManager.clearTokens();
        
        // Redirect to login
        if (typeof window !== 'undefined') {
          window.location.href = '/login';
        }
        
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    // Handle other errors
    const apiError: APIError = {
      message: 'An unexpected error occurred',
      status: error.response?.status,
    };

    if (error.response?.data) {
      const errorData = error.response.data as any;

      // Handle new standardized backend error format
      if (errorData.error) {
        if (typeof errorData.error === 'string') {
          apiError.message = errorData.error;
        } else if (typeof errorData.error === 'object') {
          const backendError = errorData.error;
          apiError.message = backendError.message || apiError.message;
          apiError.code = backendError.code;
          apiError.error_id = backendError.error_id;
          apiError.timestamp = backendError.timestamp;
          apiError.details = backendError.details;

          // Handle field-specific errors from details
          if (backendError.details) {
            if (backendError.details.field) {
              apiError.field = backendError.details.field;
            }

            // Handle DRF validation errors nested in details
            if (backendError.details && typeof backendError.details === 'object') {
              // Handle non_field_errors specifically
              if (backendError.details.non_field_errors && Array.isArray(backendError.details.non_field_errors)) {
                apiError.message = backendError.details.non_field_errors[0];
              } else {
                // Look for other field validation errors in details
                const fieldErrors = Object.keys(backendError.details).find(key =>
                  Array.isArray(backendError.details[key]) &&
                  typeof backendError.details[key][0] === 'string'
                );

                if (fieldErrors) {
                  apiError.field = fieldErrors;
                  apiError.message = backendError.details[fieldErrors][0];
                }
              }
            }
          }
        }
      }
      // Handle details field directly (our new backend format)
      else if (errorData.details) {
        apiError.details = errorData.details;
        if (errorData.details.field) {
          apiError.field = errorData.details.field;
        }
      }
      // Handle legacy error formats
      else if (typeof errorData === 'string') {
        apiError.message = errorData;
      } else if (errorData.message) {
        apiError.message = errorData.message;
      } else if (errorData.detail) {
        apiError.message = errorData.detail;
      }

      // Handle DRF field-specific errors (legacy format)
      if (errorData.errors && typeof errorData.errors === 'object') {
        const firstField = Object.keys(errorData.errors)[0];
        if (firstField && errorData.errors[firstField]) {
          apiError.field = firstField;
          apiError.message = Array.isArray(errorData.errors[firstField]) 
            ? errorData.errors[firstField][0] 
            : errorData.errors[firstField];
        }
      }
      
      // Handle non_field_errors from DRF
      if (errorData.non_field_errors && Array.isArray(errorData.non_field_errors)) {
        apiError.message = errorData.non_field_errors[0];
      }
    } else if (error.request) {
      apiError.message = 'Network error. Please check your connection.';
    }

    return Promise.reject(apiError);
  }
);

// API client class with typed methods
export class APIClient {
  static async get<T = any>(url: string, config?: AxiosRequestConfig): Promise<T> {
    const response = await api.get<T>(url, config);
    return response.data;
  }

  static async post<T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
    const response = await api.post<T>(url, data, config);
    return response.data;
  }

  static async put<T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
    const response = await api.put<T>(url, data, config);
    return response.data;
  }

  static async patch<T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
    const response = await api.patch<T>(url, data, config);
    return response.data;
  }

  static async delete<T = any>(url: string, config?: AxiosRequestConfig): Promise<T> {
    const response = await api.delete<T>(url, config);
    return response.data;
  }

  // Get site statistics
  static async getStats(): Promise<SiteStats> {
    try {
      // Use the public endpoint, no authentication required
      const response = await api.get<SiteStats>('/public/stats/');
      return response.data;
    } catch (error) {
      // Return fallback values if API fails
      console.warn('Failed to fetch stats from API, using fallback values:', error);
      return {
        happy_students: '10,000+',
        papers_delivered: '25,000+',
        expert_writers: '500+',
        success_rate: '98%',
        source: 'fallback',
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }

  // Get public reviews
  static async getReviews(): Promise<ReviewsResponse> {
    try {
      // Use the public endpoint, no authentication required
      const response = await api.get<ReviewsResponse>('/public/reviews/');
      return response.data;
    } catch (error) {
      // Return empty reviews if API fails
      console.warn('Failed to fetch reviews from API, using fallback values:', error);
      return {
        reviews: [],
        total_count: 0,
        source: 'fallback',
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }

  // File upload helper
  static async uploadFile<T = any>(
    url: string,
    file: File,
    onProgress?: (progress: number) => void
  ): Promise<T> {
    const formData = new FormData();
    formData.append('file', file);

    const response = await api.post<T>(url, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      onUploadProgress: (progressEvent) => {
        if (onProgress && progressEvent.total) {
          const progress = Math.round((progressEvent.loaded * 100) / progressEvent.total);
          onProgress(progress);
        }
      },
    });

    return response.data;
  }
}

// Export token manager and axios instance
export { TokenManager, api as axiosInstance };
export default api;