'use client';

import Link from 'next/link';
import { AlertTriangle, RefreshCw } from 'lucide-react';

export default function Error({ error, reset }: { error: Error; reset: () => void }) {
  return (
    <div className="min-h-screen bg-ivory flex items-center justify-center">
      <div className="text-center max-w-md px-4">
        <AlertTriangle className="w-16 h-16 text-saffron mx-auto mb-4" />
        <h2 className="text-2xl font-display font-bold text-navy mb-2">Something went wrong</h2>
        <p className="text-charcoal/60 mb-6">{error.message || 'An unexpected error occurred.'}</p>
        <div className="flex gap-3 justify-center">
          <button onClick={reset} className="btn-outline flex items-center gap-2"><RefreshCw className="w-4 h-4" /> Try Again</button>
          <Link href="/" className="btn-primary flex items-center gap-2">Go Home</Link>
        </div>
      </div>
    </div>
  );
}
