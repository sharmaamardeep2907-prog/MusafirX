const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api';

class ApiClient {
  private getToken(): string | null {
    if (typeof window === 'undefined') return null;
    return localStorage.getItem('accessToken');
  }
  private async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const token = this.getToken();
    const headers: HeadersInit = { 'Content-Type': 'application/json', ...(token ? { Authorization: `Bearer ${token}` } : {}), ...options.headers };
    const res = await fetch(`${API_URL}${endpoint}`, { ...options, headers });
    if (res.status === 401) {
      const refreshToken = localStorage.getItem('refreshToken');
      if (refreshToken && !endpoint.includes('refresh-token')) {
        try {
          const refreshRes = await fetch(`${API_URL}/auth/refresh-token`, { method:'POST', headers:{'Content-Type':'application/json'}, body:JSON.stringify({refreshToken}) });
          if (refreshRes.ok) { const data = await refreshRes.json(); localStorage.setItem('accessToken',data.accessToken); localStorage.setItem('refreshToken',data.refreshToken); return this.request(endpoint,options); }
        } catch {}
      }
      localStorage.removeItem('accessToken'); localStorage.removeItem('refreshToken');
      if (typeof window !== 'undefined') window.location.href = '/auth/login';
      throw new Error('Unauthorized');
    }
    if (!res.ok) { const error = await res.json().catch(() => ({ message: 'Request failed' })); throw new Error(error.message); }
    return res.json();
  }
  get<T>(endpoint: string, params?: Record<string, string>) { const query = params ? '?' + new URLSearchParams(params).toString() : ''; return this.request<T>(`${endpoint}${query}`); }
  post<T>(endpoint: string, data?: any) { return this.request<T>(endpoint, { method:'POST', body: data ? JSON.stringify(data) : undefined }); }
  patch<T>(endpoint: string, data?: any) { return this.request<T>(endpoint, { method:'PATCH', body: data ? JSON.stringify(data) : undefined }); }
  delete<T>(endpoint: string) { return this.request<T>(endpoint, { method:'DELETE' }); }
}
export const api = new ApiClient();
