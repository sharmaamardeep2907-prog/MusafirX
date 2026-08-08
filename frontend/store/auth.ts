import { create } from 'zustand';
import { api } from '@/lib/api';

interface User { id: string; name: string; email: string; role: string; avatar?: string; bio?: string; profile?: any; }

interface AuthState {
  user: User | null; isAuthenticated: boolean; isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (name: string, email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  checkAuth: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null, isAuthenticated: false, isLoading: true,
  login: async (email, password) => {
    const res = await api.post<any>('/auth/login', { email, password });
    localStorage.setItem('accessToken', res.accessToken); localStorage.setItem('refreshToken', res.refreshToken);
    set({ user: res.user, isAuthenticated: true });
  },
  signup: async (name, email, password) => {
    const res = await api.post<any>('/auth/signup', { name, email, password });
    localStorage.setItem('accessToken', res.accessToken); localStorage.setItem('refreshToken', res.refreshToken);
    set({ user: res.user, isAuthenticated: true });
  },
  logout: async () => {
    try { await api.post('/auth/logout'); } catch {}
    localStorage.removeItem('accessToken'); localStorage.removeItem('refreshToken');
    set({ user: null, isAuthenticated: false });
  },
  checkAuth: async () => {
    try {
      const token = localStorage.getItem('accessToken');
      if (!token) { set({ isLoading: false }); return; }
      const user = await api.get<User>('/auth/me');
      set({ user, isAuthenticated: true, isLoading: false });
    } catch { localStorage.removeItem('accessToken'); localStorage.removeItem('refreshToken'); set({ user: null, isAuthenticated: false, isLoading: false }); }
  },
}));
