'use client';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api';
import { ArrowLeft, Star, MapPin, Wifi, Coffee, Car, Waves, Phone, Loader2, AlertCircle } from 'lucide-react';

const ai:Record<string,any>={'WiFi':Wifi,'Restaurant':Coffee,'Parking':Car,'Pool':Waves};

export default function HotelDetailPage(){
 const {slug}=useParams<{slug:string}>();
 const {data:h,isLoading,error}=useQuery({queryKey:['hotel',slug],queryFn:()=>api.get<any>(`/hotels?destination=${slug}`).then(r=>r.hotels?.[0]),enabled:!!slug});
 if(isLoading)return<div className="pt-24 flex justify-center"><Loader2 className="w-8 h-8 animate-spin text-saffron"/></div>;
 if(error||!h)return<div className="pt-24 text-center"><AlertCircle className="w-16 h-16 text-charcoal/20 mx-auto mb-4"/><h2 className="text-xl font-bold">Not found</h2><Link href="/destinations" className="text-saffron">← Back</Link></div>;
 return(<div className="pt-20 pb-16 bg-ivory min-h-screen"><div className="max-w-4xl mx-auto px-4"><Link href="/destinations" className="inline-flex items-center gap-2 text-charcoal/60 hover:text-saffron mb-6"><ArrowLeft className="w-4 h-4"/>Back</Link><div className="neumorphic-card overflow-hidden"><div className="h-64 bg-cover bg-center" style={{backgroundImage:`url(${h.imageUrl||''})`}}/><div className="p-8"><h1 className="text-3xl font-bold text-navy">{h.name}</h1><div className="flex items-center gap-4 mt-2 text-sm"><span className="flex items-center gap-1"><Star className="w-4 h-4 fill-saffron text-saffron"/>{h.rating}</span>{h.pricePerNight&&<span className="text-emerald font-bold">₹{h.pricePerNight}/night</span>}</div><p className="mt-4 text-charcoal/70">{h.description}</p>{h.amenities&&<div className="mt-6"><h3 className="font-semibold mb-3">Amenities</h3><div className="flex flex-wrap gap-3">{h.amenities.map((a:string)=>{const Icon=ai[a];return<span key={a} className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-ivory text-sm">{Icon&&<Icon className="w-4 h-4 text-saffron"/>}{a}</span>;})}</div></div>}{h.address&&<p className="mt-4 text-sm text-charcoal/50"><MapPin className="w-4 h-4 inline"/>{h.address}</p>}{h.phone&&<p className="text-sm text-charcoal/50"><Phone className="w-4 h-4 inline"/>{h.phone}</p>}</div></div></div></div>);
}
