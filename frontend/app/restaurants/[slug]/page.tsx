'use client';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api';
import { ArrowLeft, Star, Clock, Leaf, Loader2, AlertCircle } from 'lucide-react';

export default function RestaurantDetailPage(){
 const {slug}=useParams<{slug:string}>();
 const {data:r,isLoading,error}=useQuery({queryKey:['restaurant',slug],queryFn:()=>api.get<any>(`/restaurants?destination=${slug}`).then(x=>x.restaurants?.[0]),enabled:!!slug});
 if(isLoading)return<div className="pt-24 flex justify-center"><Loader2 className="w-8 h-8 animate-spin text-saffron"/></div>;
 if(error||!r)return<div className="pt-24 text-center"><AlertCircle className="w-16 h-16 text-charcoal/20 mx-auto mb-4"/><h2 className="text-xl font-bold">Not found</h2><Link href="/destinations" className="text-saffron">← Back</Link></div>;
 return(<div className="pt-20 pb-16 bg-ivory min-h-screen"><div className="max-w-4xl mx-auto px-4"><Link href="/destinations" className="inline-flex items-center gap-2 text-charcoal/60 hover:text-saffron mb-6"><ArrowLeft className="w-4 h-4"/>Back</Link><div className="neumorphic-card overflow-hidden"><div className="h-56 bg-cover bg-center" style={{backgroundImage:`url(${r.imageUrl||''})`}}/><div className="p-8"><div className="flex items-start justify-between"><div><h1 className="text-3xl font-bold text-navy">{r.name}</h1><p className="text-charcoal/50">{r.cuisine||'Multi-cuisine'}</p></div><div className="text-right"><span className="text-lg">{r.priceRange||'₹₹'}</span>{r.isVeg&&<span className="block text-xs text-emerald"><Leaf className="w-3 h-3 inline"/>Pure Veg</span>}</div></div><div className="flex items-center gap-4 mt-3 text-sm"><span className="flex items-center gap-1"><Star className="w-4 h-4 fill-saffron text-saffron"/>{r.rating}</span>{r.openingHours&&<span className="flex items-center gap-1"><Clock className="w-4 h-4"/>{r.openingHours}</span>}</div><p className="mt-4 text-charcoal/70">{r.description}</p>{r.popularDishes?.length>0&&<div className="mt-6"><h3 className="font-semibold mb-2">Popular Dishes</h3><div className="flex flex-wrap gap-2">{r.popularDishes.map((d:string)=><span key={d} className="px-3 py-1.5 rounded-full bg-saffron/5 text-saffron text-sm">{d}</span>)}</div></div>}</div></div></div></div>);
}
