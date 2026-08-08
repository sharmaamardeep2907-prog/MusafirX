'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/auth';
import { useUIStore } from '@/store/ui';
import { api } from '@/lib/api';
import { cn } from '@/lib/utils';
import { useQuery } from '@tanstack/react-query';
import { Search, Menu, X, Heart, Compass, Map, Users, BookOpen, Sparkles, LogIn, PlusCircle, UserCircle, LogOut, ChevronDown, MapPin } from 'lucide-react';

const navLinks = [
  { href: '/explore', label: 'Explore', icon: Compass },
  { href: '/destinations', label: 'Destinations', icon: Map },
  { href: '/trips', label: 'Trips', icon: Sparkles },
  { href: '/community', label: 'Community', icon: Users },
  { href: '/guides', label: 'Travel Guides', icon: BookOpen },
];

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const { user, isAuthenticated, logout } = useAuthStore();
  const { isMobileMenuOpen, toggleMobileMenu, isSearchOpen, toggleSearch, toggleAIChat } = useUIStore();
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const router = useRouter();
  const searchInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => { const h = () => setScrolled(window.scrollY > 50); window.addEventListener('scroll',h,{passive:true}); return () => window.removeEventListener('scroll',h); }, []);
  useEffect(() => { if (isSearchOpen) searchInputRef.current?.focus(); }, [isSearchOpen]);

  const { data: searchResults } = useQuery({ queryKey: ['global-search', searchQuery], queryFn: () => api.get<any>('/search', { q: searchQuery }), enabled: searchQuery.length >= 2 });

  const handleSearchNavigate = (e: React.FormEvent) => { e.preventDefault(); if (searchQuery.trim()) { router.push(`/destinations?search=${encodeURIComponent(searchQuery)}`); toggleSearch(); setSearchQuery(''); } };
  const handleLogout = async () => { await logout(); setUserMenuOpen(false); router.push('/'); };

  return (
    <>
      <nav className={cn('fixed top-0 left-0 right-0 z-50 transition-all duration-300', scrolled ? 'glass shadow-sm py-2' : 'bg-transparent py-4')}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"><div className="flex items-center justify-between h-14">
          <Link href="/" className="flex items-center gap-2 group"><div className="w-9 h-9 rounded-xl bg-navy flex items-center justify-center group-hover:bg-saffron transition-colors"><span className="text-white font-bold text-lg">M</span></div><span className={cn('font-display font-bold text-xl tracking-tight transition-colors',scrolled?'text-navy':'text-white')}>Musafir<span className="text-saffron">X</span></span></Link>
          <div className="hidden lg:flex items-center gap-1">{navLinks.map(link=><Link key={link.href} href={link.href} className={cn('px-3 py-2 rounded-lg text-sm font-medium transition-colors',scrolled?'text-charcoal hover:text-saffron hover:bg-saffron/5':'text-white/90 hover:text-white hover:bg-white/10')}>{link.label}</Link>)}</div>
          <div className="flex items-center gap-2">
            <button onClick={toggleSearch} className={cn('p-2 rounded-lg transition-colors',scrolled?'hover:bg-softgray text-charcoal':'text-white/90 hover:text-white hover:bg-white/10')}><Search className="w-5 h-5" /></button>
            <button onClick={toggleAIChat} className={cn('p-2 rounded-lg transition-colors relative',scrolled?'hover:bg-softgray text-saffron':'text-saffron hover:bg-white/10')}><Sparkles className="w-5 h-5" /><span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-emerald rounded-full animate-pulse" /></button>
            {isAuthenticated && user ? (<>
              <Link href="/planner" className="hidden sm:flex items-center gap-1.5 bg-saffron text-white px-4 py-2 rounded-xl text-sm font-semibold hover:bg-saffron-600 transition-colors"><PlusCircle className="w-4 h-4" /> Create Trip</Link>
              <div className="relative"><button onClick={()=>setUserMenuOpen(!userMenuOpen)} className="flex items-center gap-1.5 p-1 rounded-xl hover:bg-softgray/50 transition-colors"><div className="w-8 h-8 rounded-full bg-saffron/20 flex items-center justify-center text-saffron font-semibold text-sm">{user.name.charAt(0)}</div><ChevronDown className="w-4 h-4 text-charcoal hidden sm:block" /></button>
                {userMenuOpen && (<><div className="fixed inset-0 z-10" onClick={()=>setUserMenuOpen(false)} /><div className="absolute right-0 mt-2 w-56 glass rounded-2xl shadow-xl z-20 py-2 animate-scale-in"><div className="px-4 py-2 border-b border-softgray"><p className="text-sm font-semibold text-navy">{user.name}</p><p className="text-xs text-charcoal/60">{user.email}</p></div><Link href="/dashboard" className="flex items-center gap-3 px-4 py-2.5 text-sm text-charcoal hover:bg-saffron/5 transition-colors" onClick={()=>setUserMenuOpen(false)}><UserCircle className="w-4 h-4" /> Dashboard</Link><Link href="/trips" className="flex items-center gap-3 px-4 py-2.5 text-sm text-charcoal hover:bg-saffron/5 transition-colors" onClick={()=>setUserMenuOpen(false)}><Sparkles className="w-4 h-4" /> My Trips</Link><Link href="/dashboard?tab=saved" className="flex items-center gap-3 px-4 py-2.5 text-sm text-charcoal hover:bg-saffron/5 transition-colors" onClick={()=>setUserMenuOpen(false)}><Heart className="w-4 h-4" /> Saved Places</Link><hr className="my-1 border-softgray" /><button onClick={handleLogout} className="flex items-center gap-3 px-4 py-2.5 text-sm text-red-500 hover:bg-red-50 w-full text-left transition-colors"><LogOut className="w-4 h-4" /> Logout</button></div></>)}</div></>) : (<Link href="/auth/login" className={cn('flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-semibold transition-colors',scrolled?'bg-navy text-white hover:bg-navy-600':'bg-white/20 text-white hover:bg-white/30 backdrop-blur-sm')}><LogIn className="w-4 h-4" /> Login</Link>)}
            <button onClick={toggleMobileMenu} className={cn('lg:hidden p-2 rounded-lg',scrolled?'text-charcoal':'text-white')}>{isMobileMenuOpen?<X className="w-5 h-5"/>:<Menu className="w-5 h-5"/>}</button>
          </div>
        </div></div>
        {isMobileMenuOpen && (<div className="lg:hidden glass border-t border-softgray animate-slide-down"><div className="px-4 py-4 space-y-1">{navLinks.map(link=><Link key={link.href} href={link.href} onClick={()=>useUIStore.getState().closeAll()} className="flex items-center gap-3 px-3 py-3 rounded-xl text-charcoal hover:bg-saffron/5 transition-colors"><link.icon className="w-5 h-5 text-saffron"/>{link.label}</Link>)}<Link href="/planner" onClick={()=>useUIStore.getState().closeAll()} className="flex items-center gap-3 px-3 py-3 rounded-xl bg-saffron text-white font-semibold transition-colors mt-2"><Sparkles className="w-5 h-5"/> AI Trip Planner</Link></div></div>)}
      </nav>
      {isSearchOpen && (<div className="fixed inset-0 z-[60] bg-navy/60 backdrop-blur-sm flex items-start justify-center pt-32"><div className="w-full max-w-2xl mx-4" onClick={e=>e.stopPropagation()}><form onSubmit={handleSearchNavigate} className="glass rounded-2xl shadow-2xl overflow-hidden"><div className="flex items-center p-4 border-b border-softgray"><Search className="w-5 h-5 text-charcoal/40 flex-shrink-0"/><input ref={searchInputRef} type="text" value={searchQuery} onChange={e=>setSearchQuery(e.target.value)} placeholder="Search destinations, hotels, restaurants..." className="flex-1 ml-3 bg-transparent text-navy placeholder:text-charcoal/40 focus:outline-none text-lg"/><button type="button" onClick={toggleSearch} className="p-1.5 rounded-lg hover:bg-softgray transition-colors ml-2"><X className="w-5 h-5 text-charcoal/50"/></button></div>{searchQuery.length>=2&&searchResults&&(<div className="max-h-80 overflow-y-auto p-2">{searchResults.destinations?.length>0&&(<div className="mb-3"><p className="text-xs font-semibold text-charcoal/40 uppercase px-3 py-1">Destinations</p>{searchResults.destinations.map((d:any)=><Link key={d.id} href={`/destinations/${d.slug}`} onClick={toggleSearch} className="flex items-center gap-3 px-3 py-2 rounded-xl hover:bg-saffron/5 transition-colors"><MapPin className="w-4 h-4 text-saffron flex-shrink-0"/><div><p className="text-sm font-medium text-navy">{d.name}</p><p className="text-xs text-charcoal/40">{d.stateId?.name}</p></div></Link>)}</div>)}{!searchResults.destinations?.length&&(<p className="text-center py-4 text-charcoal/40 text-sm">No results found.</p>)}</div>)}</form><div className="fixed inset-0 -z-10" onClick={toggleSearch}/></div></div>)}
    </>
  );
}