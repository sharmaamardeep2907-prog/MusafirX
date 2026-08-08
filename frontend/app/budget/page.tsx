'use client';
import { useState } from 'react';
import { motion } from 'framer-motion';
import { IndianRupee, Calculator, PieChart, Sparkles } from 'lucide-react';
import Link from 'next/link';
import toast from 'react-hot-toast';

const db={Hotels:8000,Transport:4000,Food:3500,Activities:2000,Shopping:1500,Emergency:1000};
export default function BudgetPage(){
 const [f,sf]=useState({destination:'',days:5,travelers:2,budget:20000});
 const [bd,sbd]=useState(db);
 const calc=()=>{const pd=f.budget/f.days;sbd({Hotels:Math.round(pd*f.days*.4),Transport:Math.round(pd*f.days*.2),Food:Math.round(pd*f.days*.18),Activities:Math.round(pd*f.days*.1),Shopping:Math.round(pd*f.days*.07),Emergency:Math.round(pd*f.days*.05)});toast.success('Calculated!');};
 const t=Object.values(bd).reduce((a,b)=>a+b,0);
 return(<div className="pt-24 pb-16 bg-ivory min-h-screen"><div className="max-w-4xl mx-auto px-4"><div className="text-center mb-10"><Calculator className="w-12 h-12 text-saffron mx-auto mb-3"/><h1 className="text-4xl font-bold text-navy">Plan Your Spend</h1></div><div className="grid lg:grid-cols-2 gap-8"><motion.div initial={{opacity:0,x:-20}} animate={{opacity:1,x:0}} className="neumorphic-card p-6"><h3 className="font-bold mb-4">Trip Details</h3><div className="space-y-4"><div><input type="text" value={f.destination} onChange={e=>sf({...f,destination:e.target.value})} placeholder="e.g. Goa" className="input-field text-sm"/></div><div className="grid grid-cols-3 gap-3"><input type="number" value={f.days} onChange={e=>sf({...f,days:+e.target.value||1})} className="input-field text-sm" min="1"/><input type="number" value={f.travelers} onChange={e=>sf({...f,travelers:+e.target.value||1})} className="input-field text-sm" min="1"/><input type="number" value={f.budget} onChange={e=>sf({...f,budget:+e.target.value||0})} className="input-field text-sm" min="0"/></div><button onClick={calc} className="btn-primary w-full"><Calculator className="w-5 h-5 inline mr-2"/>Calculate</button></div></motion.div><motion.div initial={{opacity:0,x:20}} animate={{opacity:1,x:0}} className="neumorphic-card p-6 bg-navy text-white"><h3 className="font-bold mb-4"><PieChart className="w-5 h-5 text-saffron inline mr-2"/>Budget Breakdown</h3><div className="space-y-2">{Object.entries(bd).map(([k,v])=><div key={k} className="flex justify-between text-sm"><span className="text-white/70">{k}</span><span>₹{(v as number).toLocaleString()}</span></div>)}<hr className="border-white/20 my-2"/><div className="flex justify-between font-bold"><span>Total</span><span className="text-saffron text-lg">₹{t.toLocaleString()}</span></div></div><div className="mt-4 text-center text-white/50 text-xs">PP: ₹{Math.round(t/f.travelers).toLocaleString()} · PD: ₹{Math.round(t/f.days).toLocaleString()}</div></motion.div></div><div className="text-center mt-8"><Link href="/planner" className="btn-primary inline-flex items-center gap-2"><Sparkles className="w-5 h-5"/>AI Trip Planner</Link></div></div></div>);
}
