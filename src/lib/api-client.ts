const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000/api/v1';

export const ACCESS_TOKEN_KEY = 'aura_access_token';
export const REFRESH_TOKEN_KEY = 'aura_refresh_token';

class ApiClient {
  private readonly requestTimeoutMs = 8000;
  private isRefreshing = false;
  private refreshSubscribers: ((token: string | null) => void)[] = [];

  private subscribeTokenRefresh(cb: (token: string | null) => void) {
    this.refreshSubscribers.push(cb);
  }

  private onRefreshed(token: string | null) {
    this.refreshSubscribers.forEach((cb) => cb(token));
    this.refreshSubscribers = [];
  }

  clearTokens() {
    localStorage.removeItem(ACCESS_TOKEN_KEY);
    localStorage.removeItem(REFRESH_TOKEN_KEY);
  }

  async request<T>(
    endpoint: string,
    options: RequestInit = {},
    isRetry = false
  ): Promise<T> {
    const url = `${API_BASE_URL}${endpoint.startsWith('/') ? endpoint : `/${endpoint}`}`;
    const headers: Record<string, string> = {
      ...(options.headers as Record<string, string>),
    };

    // Default JSON content-type if not FormData
    if (!(options.body instanceof FormData) && !headers['Content-Type']) {
      headers['Content-Type'] = 'application/json';
    }

    const token = typeof window !== 'undefined' ? localStorage.getItem(ACCESS_TOKEN_KEY) : null;
    if (token && !headers['Authorization']) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    const controller = new AbortController();
    const timeoutId = window.setTimeout(() => controller.abort(), this.requestTimeoutMs);
    const abortExternalRequest = () => controller.abort();
    options.signal?.addEventListener('abort', abortExternalRequest, { once: true });

    try {
      const response = await fetch(url, {
        ...options,
        signal: controller.signal,
        credentials: 'include',
        headers,
      });

      // Handle 401 Unauthorized - Attempt Token Refresh
      if (response.status === 401 && !isRetry) {
        if (!this.isRefreshing) {
          this.isRefreshing = true;
          try {
            const refreshRes = await fetch(`${API_BASE_URL}/auth/refresh`, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              credentials: 'include',
              body: JSON.stringify({}),
            });

            if (refreshRes.ok) {
              this.isRefreshing = false;
              this.onRefreshed('cookie');

              // Retry original request
              return this.request<T>(endpoint, { ...options, headers }, true);
            } else {
              this.clearTokens();
              this.isRefreshing = false;
              this.onRefreshed(null);
            }
          } catch {
            this.clearTokens();
            this.isRefreshing = false;
            this.onRefreshed(null);
          }
        } else {
          // Wait for refresh to complete
          return new Promise<T>((resolve, reject) => {
            this.subscribeTokenRefresh((newToken) => {
              if (!newToken) {
                reject(new Error('Your session has expired. Please sign in again.'));
                return;
              }
              headers['Authorization'] = `Bearer ${newToken}`;
              resolve(this.request<T>(endpoint, { ...options, headers }, true));
            });
          });
        }
      }

      if (!response.ok) {
        let errorData: any = {};
        try {
          errorData = await response.json();
        } catch {
          errorData = { message: `Request failed with status ${response.status}` };
        }
        const message = errorData.message || errorData.error || `HTTP ${response.status}`;
        throw new Error(Array.isArray(message) ? message.join(', ') : message);
      }

      const json = await response.json();
      return json.data !== undefined ? json.data : json;
    } finally {
      window.clearTimeout(timeoutId);
      options.signal?.removeEventListener('abort', abortExternalRequest);
    }
  }

  get<T>(endpoint: string, headers?: Record<string, string>): Promise<T> {
    return this.request<T>(endpoint, { method: 'GET', headers });
  }

  post<T>(endpoint: string, body?: any, headers?: Record<string, string>): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'POST',
      body: body instanceof FormData ? body : JSON.stringify(body),
      headers,
    });
  }

  patch<T>(endpoint: string, body?: any, headers?: Record<string, string>): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'PATCH',
      body: JSON.stringify(body),
      headers,
    });
  }

  delete<T>(endpoint: string, headers?: Record<string, string>): Promise<T> {
    return this.request<T>(endpoint, { method: 'DELETE', headers });
  }

  upload<T>(endpoint: string, formData: FormData): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'POST',
      body: formData,
    });
  }
}

export const apiClient = new ApiClient();
