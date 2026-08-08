'use client';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { UtensilsCrossed, MapPin, Leaf, Search } from 'lucide-react';
import { useState } from 'react';

const foodRegions = [
  { name:'Awadhi Biryani',location:'Lucknow',cuisine:'Mughlai',priceRange:'₹200-500',isVeg:false,desc:'Slow-cooked fragrant rice with tender meat, a royal delicacy from the Nawabs of Awadh.'},
  { name:'Banarasi Chaat',location:'Varanasi',cuisine:'Street Food',priceRange:'₹30-150',isVeg:true,desc:'Tangy, spicy, sweet explosion of flavors.'},
  { name:'Rajasthani Thali',location:'Jaipur',cuisine:'Rajasthani',priceRange:'₹300-800',isVeg:true,desc:'Dal bati churma, gatte ki sabzi — a royal vegetarian feast.'},
  { name:'Goan Fish Curry',location:'Goa',cuisine:'Coastal',priceRange:'₹250-600',isVeg:false,desc:'Fresh catch simmered in coconut milk with tangy kokum.'},
  { name:'Kerala Sadya',location:'Kochi',cuisine:'South Indian',priceRange:'₹150-350',isVeg:true,desc:'24+ dishes served on a banana leaf — a vegetarian banquet.'},
  { name:'Kashmiri Wazwan',location:'Srinagar',cuisine:'Kashmiri',priceRange:'₹800-2000',isVeg:false,desc:'36-course royal feast. Rogan josh, rista, gushtaba.'},
  { name:'Lucknowi Kebabs',location:'Lucknow',cuisine:'Mughlai',priceRange:'₹150-400',isVeg:false,desc:'Melt-in-your-mouth galouti kebabs, legendary Tunday kebab.'},
  { name:'South Indian Breakfast',location:'Chennai',cuisine:'South Indian',priceRange:'₹50-200',isVeg:true,desc:'Crispy dosas, fluffy idlis, vada dunked in sambar, filter coffee.'},
];

export default function FoodPage(){
  const [search,setSearch]=useState('');
  const filtered=foodRegions.filter(f=>f.name.toLowerCase().includes(search.toLowerCase())||f.location.toLowerCase().includes(search.toLowerCase()));
  return (<div className="pt-24 pb-16 bg-ivory min-h-screen"><div className="max-w-7xl mx-auto px-4"><div className="text-center mb-12"><UtensilsCrossed className="w-12 h-12 text-saffron mx-auto mb-3"/><h1 className="text-4xl font-bold text-navy">Taste of India</h1><p className="text-charcoal/60 mt-2">Every 100km the food changes. Explore the flavors.</p></div><div className="relative max-w-md mx-auto mb-10"><Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-charcoal/40"/><input type="text" value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search dishes or locations..." className="input-field pl-12"/></div><div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">{filtered.map((food,i)=><motion.div key={food.name} initial={{opacity:0,y:20}} animate={{opacity:1,y:0}} transition={{delay:i*0.05}}><div className="neumorphic-card p-6 h-full"><div className="flex items-start justify-between mb-2"><h3 className="text-lg font-bold text-navy">{food.name}</h3>{food.isVeg?<span className="px-2 py-0.5 rounded-full bg-emerald/10 text-emerald text-xs flex items-center gap-1"><Leaf className="w-3 h-3"/>Veg</span>:<span className="px-2 py-0.5 rounded-full bg-red-50 text-red-500 text-xs">Non-veg</span>}</div><div className="flex items-center gap-3 text-xs text-charcoal/50 mb-2"><span className="flex items-center gap-1"><MapPin className="w-3 h-3"/>{food.location}</span><span>{food.priceRange}</span></div><p className="text-sm text-charcoal/70 leading-relaxed">{food.desc}</p><Link href={`/destinations?search=${food.location}`} className="inline-flex items-center gap-1 text-saffron text-sm font-semibold mt-3 hover:underline">Explore {food.location} →</Link></div></motion.div>)}</div></div></div>);
}
