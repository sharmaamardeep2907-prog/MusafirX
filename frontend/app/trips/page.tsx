'use client';
import Link from 'next/link';
import { Plane } from 'lucide-react';

export default function TripsPage() {
  return (<div className="pt-24 pb-16 bg-ivory min-h-screen"><div className="max-w-7xl mx-auto px-4 text-center"><Plane className="w-20 h-20 text-charcoal/20 mx-auto mb-6"/><h1 className="text-4xl md:text-5xl font-display font-bold text-navy mb-4">My Trips</h1><p className="text-lg text-charcoal/60 max-w-2xl mx-auto mb-8">View and manage your trips, track expenses, and share adventures.</p><Link href="/dashboard" className="btn-primary inline-flex items-center gap-2">Go to Dashboard</Link></div></div>);
}
