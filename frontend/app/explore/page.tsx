'use client';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Compass, Map, Users, BookOpen, Sparkles, ArrowRight } from 'lucide-react';

const exploreTypes = [{icon:Compass,label:'By State',href:'/destinations',desc:'Browse all Indian states'},{icon:Map,label:'By Experience',href:'/destinations',desc:'Mountains, beaches, heritage & more'},{icon:Sparkles,label:'AI Planner',href:'/planner',desc:'Let AI craft your perfect itinerary'},{icon:Users,label:'Community Trips',href:'/community',desc:'Trips shared by travelers'},{icon:BookOpen,label:'Travel Guides',href:'/guides',desc:'Curated destination guides'}];

export default function ExplorePage() {
  return (<div className="pt-24 pb-16 bg-ivory min-h-screen"><div className="max-w-7xl mx-auto px-4"><div className="text-center mb-16"><h1 className="text-4xl md:text-5xl font-display font-bold text-navy mb-4">Explore India</h1><p className="text-lg text-charcoal/60">Every corner of India has a story. Find yours.</p></div><div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">{exploreTypes.map((item,i)=>(<motion.div key={item.label} initial={{opacity:0,y:20}} animate={{opacity:1,y:0}} transition={{delay:i*0.1}}><Link href={item.href}><div className="neumorphic-card p-8 hover:-translate-y-1 transition-all group text-center"><div className="w-16 h-16 rounded-2xl bg-saffron/10 flex items-center justify-center mx-auto mb-4"><item.icon className="w-8 h-8 text-saffron"/></div><h3 className="text-xl font-bold text-navy mb-2">{item.label}</h3><p className="text-charcoal/60 text-sm mb-4">{item.desc}</p><span className="inline-flex items-center gap-1 text-saffron font-semibold text-sm">Explore <ArrowRight className="w-4 h-4"/></span></div></Link></motion.div>))}</div></div></div>);
}
