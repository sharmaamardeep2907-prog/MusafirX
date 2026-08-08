import Link from 'next/link';
import { Compass, Map, Instagram, Twitter, Youtube } from 'lucide-react';

export function Footer() {
  return (
    <footer className="bg-navy text-white/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-8">
          <div className="col-span-2 lg:col-span-1">
            <Link href="/" className="flex items-center gap-2 mb-4">
              <div className="w-9 h-9 rounded-xl bg-saffron flex items-center justify-center"><span className="text-white font-bold text-lg">M</span></div>
              <span className="font-display font-bold text-xl text-white">Musafir<span className="text-saffron">X</span></span>
            </Link>
            <p className="text-sm leading-relaxed mb-6 text-white/60">Discover India, plan smarter, and turn every trip into a story. Your AI-powered travel companion.</p>
          </div>
          <div><h4 className="text-white font-semibold mb-4">Explore</h4><ul className="space-y-2.5 text-sm">{['Destinations','States','Hidden Gems','Trending Trips','Experiences'].map(i=><li key={i}><Link href="/explore" className="hover:text-saffron transition-colors">{i}</Link></li>)}</ul></div>
          <div><h4 className="text-white font-semibold mb-4">Plan</h4><ul className="space-y-2.5 text-sm">{['AI Trip Planner','Budget Calculator','Packing Assistant','Weather Guide'].map(i=><li key={i}><Link href="/planner" className="hover:text-saffron transition-colors">{i}</Link></li>)}</ul></div>
          <div><h4 className="text-white font-semibold mb-4">Community</h4><ul className="space-y-2.5 text-sm">{['Travel Stories','Trip Reviews','Blog'].map(i=><li key={i}><Link href="/community" className="hover:text-saffron transition-colors">{i}</Link></li>)}</ul></div>
          <div><h4 className="text-white font-semibold mb-4">MusafirX</h4><ul className="space-y-2.5 text-sm">{['About','Contact','Privacy','Terms'].map(i=><li key={i}><Link href="#" className="hover:text-saffron transition-colors">{i}</Link></li>)}</ul></div>
        </div>
        <div className="mt-12 pt-8 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-white/40">
          <p>© 2024 MusafirX. All rights reserved.</p><p>Made with ❤️ in India</p>
        </div>
      </div>
    </footer>
  );
}
