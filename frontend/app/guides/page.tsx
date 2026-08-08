'use client';
import Link from 'next/link';
import { BookOpen } from 'lucide-react';

export default function GuidesPage() {
  return (<div className="pt-24 pb-16 bg-ivory min-h-screen"><div className="max-w-7xl mx-auto px-4 text-center"><BookOpen className="w-20 h-20 text-charcoal/20 mx-auto mb-6"/><h1 className="text-4xl md:text-5xl font-display font-bold text-navy mb-4">Travel Guides</h1><p className="text-lg text-charcoal/60 max-w-2xl mx-auto mb-8">Expert-curated guides on destinations, budget, food, and hidden gems.</p><Link href="/destinations" className="btn-outline inline-flex items-center gap-2">Browse Destinations</Link></div></div>);
}
