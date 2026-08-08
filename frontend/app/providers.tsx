'use client';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useState, useEffect } from 'react';
import { Toaster } from 'react-hot-toast';
import { useAuthStore } from '@/store/auth';

export function Providers({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(() => new QueryClient({
    defaultOptions: { queries: { staleTime: 60 * 1000, retry: 1 } },
  }));
  const checkAuth = useAuthStore((s) => s.checkAuth);
  useEffect(() => { checkAuth(); }, [checkAuth]);

  return (
    <QueryClientProvider client={queryClient}>
      {children}
      <Toaster position="top-right" toastOptions={{
        style: { background: '#0B2341', color: '#F8F8F5', borderRadius: '12px', fontSize: '14px' },
        success: { iconTheme: { primary: '#138A4B', secondary: '#F8F8F5' } },
        error: { iconTheme: { primary: '#EF4444', secondary: '#F8F8F5' } },
      }} />
    </QueryClientProvider>
  );
}
