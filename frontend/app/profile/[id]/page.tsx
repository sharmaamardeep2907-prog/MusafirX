'use client';
import { useAuthStore } from '@/store/auth';
import { MapPin, Award, Star, Mountain, Waves, Compass, Camera } from 'lucide-react';

const bi:Record<string,any>={'Mountain Explorer':Mountain,'Foodie':Star,'Heritage Hunter':Compass,'Beach Lover':Waves,'Road Tripper':Camera,'Photographer':Camera};
export default function ProfilePage(){
 const{user}=useAuthStore();if(!user)return<div className="pt-24 text-center">Loading...</div>;
 return(<div className="pt-24 pb-16 bg-ivory min-h-screen"><div className="max-w-3xl mx-auto px-4"><div className="neumorphic-card overflow-hidden"><div className="h-40 bg-navy"/><div className="px-8 pb-8 -mt-16"><div className="w-24 h-24 rounded-2xl bg-saffron/20 border-4 border-white flex items-center justify-center text-3xl font-bold text-saffron">{user.name?.charAt(0)}</div><h1 className="text-2xl font-bold mt-4">{user.name}</h1><p className="text-charcoal/60">{user.bio||'Travel enthusiast'}</p><div className="flex items-center gap-4 mt-3 text-sm text-charcoal/50"><span className="flex items-center gap-1"><MapPin className="w-4 h-4"/>{user.profile?.location||'India'}</span><span>23 trips · 87 destinations</span></div>{user.profile?.badges&&<div className="mt-6"><h3 className="font-semibold mb-3"><Award className="w-5 h-5 text-saffron inline mr-2"/>Travel Badges</h3><div className="flex flex-wrap gap-3">{user.profile.badges.map((b:string)=>{const Icon=bi[b]||Star;return<div key={b} className="flex items-center gap-2 px-4 py-2 rounded-xl bg-saffron/5 text-sm font-medium"><Icon className="w-4 h-4 text-saffron"/>{b}</div>;})}</div></div>}</div></div></div></div>);
}
