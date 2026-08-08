'use client';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api';
import { BookOpen, Clock, Tag, Star } from 'lucide-react';
import { useState } from 'react';

const cats=['All','Destination Guides','Budget Travel','Food','Adventure','Solo Travel','Road Trips'];
export default function BlogsPage(){
  const [cat,setCat]=useState('All');
  const {data,isLoading}=useQuery({queryKey:['blogs',cat],queryFn:()=>api.get<any>('/blogs',cat!=='All'?{category:cat}:{})});
  const blogs=data?.blogs||[];
  return (<div className="pt-24 pb-16 bg-ivory min-h-screen"><div className="max-w-7xl mx-auto px-4"><div className="text-center mb-12"><BookOpen className="w-12 h-12 text-saffron mx-auto mb-3"/><h1 className="text-4xl font-bold text-navy">Travel Guides & Stories</h1><p className="text-charcoal/60 mt-2">Expert tips, destination guides, and travel inspiration</p></div><div className="flex flex-wrap gap-2 justify-center mb-10">{cats.map(c=><button key={c} onClick={()=>setCat(c)} className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${cat===c?'bg-navy text-white':'bg-white text-charcoal border border-softgray hover:bg-saffron/5'}`}>{c}</button>)}</div>{isLoading?<div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">{Array.from({length:6}).map((_,i)=><div key={i} className="neumorphic-card h-64 skeleton"/>)}</div>:<div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">{blogs.map((b:any,i:number)=><motion.div key={b.id||i} initial={{opacity:0,y:20}} animate={{opacity:1,y:0}} transition={{delay:i*0.05}}><Link href={`/blogs/${b.slug}`}><div className="neumorphic-card overflow-hidden group h-full"><div className="h-44 bg-cover bg-center" style={{backgroundImage:`url(${b.imageUrl||''})`}}><div className="w-full h-full bg-gradient-to-t from-black/60 to-transparent p-4 flex items-end"><span className="px-2.5 py-1 rounded-full bg-saffron/80 text-white text-xs">{b.category||'Travel'}</span></div></div><div className="p-5"><h3 className="font-bold text-navy group-hover:text-saffron transition-colors mb-2">{b.title}</h3><p className="text-sm text-charcoal/60 line-clamp-2 mb-3">{b.excerpt}</p><div className="flex items-center gap-3 text-xs text-charcoal/40">{b.readTime&&<span className="flex items-center gap-1"><Clock className="w-3 h-3"/>{b.readTime}</span>}{b.tags?.slice(0,2).map((t:string)=><span key={t} className="flex items-center gap-1"><Tag className="w-3 h-3"/>{t}</span>)}</div></div></div></Link></motion.div>)}</div>}</div></div>);
}
