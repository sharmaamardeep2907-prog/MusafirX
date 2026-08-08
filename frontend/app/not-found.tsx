import Link from 'next/link';
import { Compass } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-ivory flex items-center justify-center">
      <div className="text-center max-w-md px-4">
        <Compass className="w-20 h-20 text-charcoal/20 mx-auto mb-4" />
        <h1 className="text-6xl font-display font-bold text-navy mb-2">404</h1>
        <h2 className="text-xl font-semibold text-navy mb-4">Lost your way?</h2>
        <p className="text-charcoal/60 mb-8">This page doesn't exist. But there's a whole India waiting!</p>
        <div className="flex gap-3 justify-center">
          <Link href="/destinations" className="btn-primary">Explore Destinations</Link>
          <Link href="/" className="btn-outline">Go Home</Link>
        </div>
      </div>
    </div>
  );
}
