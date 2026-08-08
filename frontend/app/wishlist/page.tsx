'use client';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/api';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { Heart, MapPin, Trash2, Loader2, Compass, Plus } from 'lucide-react';
import { useAuthStore } from '@/store/auth';
import toast from 'react-hot-toast';

export default function WishlistPage(){
 const {isAuthenticated}=useAuthStore();
 const qc=useQueryClient();
 const {data:w,isLoading}=useQuery({queryKey:['wishlist'],queryFn:()=>api.get<any[]>('/wishlist'),enabled:isAuthenticated});
 const rm=useMutation({mutationFn:(id:string)=>api.delete(`/saved/${id}`),onSuccess:()=>{qc.invalidateQueries({queryKey:['wishlist']});toast.success('Removed');}});
 if(!isAuthenticated)return<div className="pt-24 text-center"><Heart className="w-16 h-16 text-charcoal/20 mx-auto mb-4"/><h2 className="text-xl font-bold">Sign in to see your wishlist</h2><Link href="/auth/login" className="btn-primary inline-flex items-center gap-2 mt-4">Sign In</Link></div>;
 return(<div className="pt-24 pb-16 bg-ivory min-h-screen"><div className="max-w-7xl mx-auto px-4"><div className="text-center mb-10"><Heart className="w-12 h-12 text-saffron mx-auto mb-3"/><h1 className="text-4xl font-bold text-navy">Places Worth Remembering</h1></div>{isLoading?<div className="grid grid-cols-3 gap-4">{Array.from({length:6}).map((_,i)=><div key={i} className="skeleton h-48 rounded-2xl"/>)}</div>:w&&w.length>0?<div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">{w.map((item:any,i:number)=><motion.div key={item.id} initial={{opacity:0,y:20}} animate={{opacity:1,y:0}} transition={{delay:i*0.05}}><div className="neumorphic-card overflow-hidden group relative"><button onClick={()=>rm.mutate(item.destinationId?.id||item.destinationId)} className="absolute top-3 right-3 z-10 p-2 rounded-xl bg-white/80 hover:bg-red-50"><Trash2 className="w-4 h-4 text-red-400"/></button><Link href={`/destinations/${item.destinationId?.slug||item.destination?.slug}`}><div className="h-44 bg-cover bg-center" style={{backgroundImage:`url(${item.destinationId?.imageUrl||''})`}}><div className="w-full h-full bg-gradient-to-t from-black/60 to-transparent p-4 flex items-end"><div><h3 className="text-lg font-bold text-white">{item.destinationId?.name||item.destination?.name}</h3><p className="text-xs text-white/70 flex items-center gap-1"><MapPin className="w-3 h-3"/>{item.destinationId?.stateId?.name}</p></div></div></div></Link></div></motion.div>)}</div>:<div className="text-center py-20"><Compass className="w-16 h-16 text-charcoal/20 mx-auto mb-4"/><h3 className="text-xl font-bold">Your wishlist is empty</h3><Link href="/destinations" className="btn-outline inline-flex items-center gap-2 mt-4"><Plus className="w-5 h-5"/>Explore</Link></div>}</div></div>);
}
