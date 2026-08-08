'use client';
import { useState } from 'react';
import Link from 'next/link';
import { BookOpen, Sparkles, Loader2, ArrowLeft, MapPin } from 'lucide-react';
import { api } from '@/lib/api';
import toast from 'react-hot-toast';

export default function JournalPage(){
 const[notes,sn]=useState('');const[dest,sd]=useState('');const[enh,se]=useState('');const[l,sl]=useState(false);
 const enhance=async()=>{if(!notes.trim()){toast.error('Write notes first!');return;}sl(true);try{const r=await api.post<any>('/ai/enhance-journal',{notes,destination:dest});se(r.enhanced);toast.success('Enhanced!');}catch{toast.error('Failed');}finally{sl(false);}};
 return(<div className="pt-24 pb-16 bg-ivory min-h-screen"><div className="max-w-4xl mx-auto px-4"><div className="text-center mb-10"><BookOpen className="w-12 h-12 text-saffron mx-auto mb-3"/><h1 className="text-4xl font-bold">Travel Journal</h1></div><div className="grid lg:grid-cols-2 gap-8"><div className="neumorphic-card p-6"><h3 className="font-bold mb-4">Your Notes</h3><div className="mb-3"><div className="relative"><MapPin className="absolute left-3 top-3 w-4 h-4 text-charcoal/40"/><input value={dest} onChange={e=>sd(e.target.value)} placeholder="Where did you go?" className="input-field pl-10 text-sm"/></div></div><textarea value={notes} onChange={e=>sn(e.target.value)} placeholder="Went to Varanasi. Sunrise at Ganga..." className="input-field min-h-[250px] text-sm resize-none"/><button onClick={enhance} disabled={l} className="btn-primary w-full mt-4 flex items-center justify-center gap-2">{l?<Loader2 className="w-5 h-5 animate-spin"/>:<Sparkles className="w-5 h-5"/>}{l?'Transforming...':'Transform into Story'}</button></div><div className="neumorphic-card p-6 bg-navy text-white"><h3 className="font-bold mb-4"><Sparkles className="w-5 h-5 text-saffron inline mr-2"/>Enhanced Story</h3>{enh?<p className="text-white/80 text-sm leading-relaxed whitespace-pre-wrap">{enh}</p>:<div className="text-center py-20 text-white/30"><BookOpen className="w-12 h-12 mx-auto mb-3"/><p>Your enhanced story will appear here</p></div>}</div></div><div className="text-center mt-8"><Link href="/dashboard" className="inline-flex items-center gap-2 text-charcoal/60 hover:text-saffron text-sm"><ArrowLeft className="w-4 h-4"/>Back to Dashboard</Link></div></div></div>);
}
