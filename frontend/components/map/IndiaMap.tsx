'use client';
import { useState } from 'react';
import { motion } from 'framer-motion';
import { MapPin } from 'lucide-react';

const stateHotspots = [
  { name: 'Rajasthan', x: 25, y: 45, dests: ['Jaipur','Udaipur','Jaisalmer'] },
  { name: 'Kerala', x: 35, y: 85, dests: ['Munnar','Alleppey','Kochi'] },
  { name: 'Goa', x: 15, y: 78, dests: ['North Goa','South Goa'] },
  { name: 'Himachal', x: 30, y: 15, dests: ['Manali','Dharamshala','Spiti'] },
  { name: 'Uttarakhand', x: 40, y: 18, dests: ['Rishikesh','Nainital'] },
  { name: 'Ladakh', x: 35, y: 5, dests: ['Leh','Nubra','Pangong'] },
  { name: 'Karnataka', x: 28, y: 80, dests: ['Hampi','Coorg'] },
  { name: 'UP', x: 45, y: 30, dests: ['Varanasi','Agra'] },
  { name: 'Meghalaya', x: 65, y: 25, dests: ['Cherrapunji','Shillong'] },
  { name: 'Gujarat', x: 10, y: 50, dests: ['Rann of Kutch'] },
];

export function IndiaMap() {
  const [activeState, setActiveState] = useState<string | null>(null);
  return (
    <div className="relative w-full max-w-md mx-auto aspect-[3/4]">
      <svg viewBox="0 0 100 100" className="w-full h-full">
        <path d="M35,5 L45,3 L55,8 L62,18 L68,15 L72,22 L78,25 L75,32 L70,42 L68,50 L62,55 L60,60 L55,65 L50,70 L48,75 L45,80 L42,82 L38,85 L35,88 L30,90 L25,88 L20,85 L18,80 L12,75 L10,68 L8,60 L5,50 L8,40 L12,30 L18,20 L22,15 L28,8 Z" fill="#F8F8F5" stroke="#D1D5DB" strokeWidth="0.5" />
        {stateHotspots.map((s) => (
          <g key={s.name} className="cursor-pointer" onClick={() => setActiveState(s.name === activeState ? null : s.name)}>
            <motion.circle cx={s.x} cy={s.y} r={activeState===s.name?3.5:2} className={`fill-current ${activeState===s.name?'text-saffron':'text-navy'}`} whileHover={{scale:1.5}}/>
          </g>
        ))}
      </svg>
      {activeState && (
        <motion.div initial={{opacity:0,y:5}} animate={{opacity:1,y:0}} className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-10 glass rounded-2xl p-4 shadow-xl min-w-[200px]">
          <h4 className="font-bold text-navy text-sm mb-2">{activeState}</h4>
          <div className="space-y-1">{stateHotspots.find(s=>s.name===activeState)?.dests.map((d:string)=><div key={d} className="flex items-center gap-2 text-xs text-charcoal/70"><MapPin className="w-3 h-3 text-saffron flex-shrink-0"/>{d}</div>)}</div>
        </motion.div>
      )}
      <div className="absolute bottom-2 left-2 text-xs text-charcoal/40"><p>🗺️ Click dots to explore</p><p>📍 {stateHotspots.length} regions mapped</p></div>
    </div>
  );
}
