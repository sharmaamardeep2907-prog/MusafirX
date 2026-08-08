'use client';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/api';
import { formatCurrency, formatDate } from '@/lib/utils';
import { useAuthStore } from '@/store/auth';
import toast from 'react-hot-toast';
import { ArrowLeft, MapPin, Calendar, IndianRupee, Users, Trash2, Plus, Loader2, Sparkles, AlertCircle, Plane, Clock, ChevronRight, Star } from 'lucide-react';

const cats=['Transport','Hotel','Food','Activities','Shopping','Other'];

export default function TripDetailPage(){
 const{id}=useParams<{id:string}>();
 const{isAuthenticated}=useAuthStore();
 const qc=useQueryClient();
 const[showF,setShowF]=useState(false);
 const[f,sf]=useState({category:'Other',description:'',amount:''});

 const{data:trip,isLoading,error}=useQuery({queryKey:['trip',id],queryFn:()=>api.get(`/trips/${id}`),enabled:!!id&&isAuthenticated});
 const del=useMutation({mutationFn:()=>api.delete(`/trips/${id}`),onSuccess:()=>{toast.success('Trip deleted');window.location.href='/dashboard';}});
 const add=useMutation({mutationFn:(d)=>{return api.post('/expenses',{...d,tripId:id,amount:parseFloat(d.amount)});},onSuccess:()=>{qc.invalidateQueries({queryKey:['trip',id]});toast.success('Expense added!');setShowF(false);sf({category:'Other',description:'',amount:''});}});

 if(isLoading)return<div className="pt-24 flex justify-center"><Loader2 className="w-8 h-8 animate-spin text-saffron"/></div>;
 if(error||!trip)return<div className="pt-24 text-center py-20"><AlertCircle className="w-16 h-16 text-charcoal/20 mx-auto mb-4"/><h2 className="text-xl font-bold">Trip not found</h2><Link href="/dashboard" className="text-saffron">← Back</Link></div>;

 const bl=(trip.budget||0)-(trip.spentSoFar||0);
 const bp=trip.budget?Math.min(100,((trip.spentSoFar||0)/trip.budget)*100):0;

 return(<div className="pt-24 pb-16 bg-ivory min-h-screen"><div className="max-w-5xl mx-auto px-4"><Link href="/dashboard" className="inline-flex items-center gap-2 text-charcoal/60 hover:text-saffron mb-6"><ArrowLeft className="w-4 h-4"/>Back to Dashboard</Link>
 <div className="flex items-start justify-between flex-wrap gap-4 mb-8"><div><h1 className="text-3xl md:text-4xl font-bold text-navy">{trip.title}</h1><div className="flex items-center gap-3 mt-2 text-charcoal/60"><span><MapPin className="w-4 h-4 inline"/>{trip.destinationId?.name||'Unknown'}</span><span><Calendar className="w-4 h-4 inline"/>{trip.totalDays} days</span>{trip.travelers>1&&<span><Users className="w-4 h-4 inline"/>{trip.travelers}</span>}</div></div><div className="flex gap-2"><span className={`px-3 py-1.5 rounded-full text-sm font-medium ${trip.status==='PLANNED'?'bg-blue-50 text-blue-600':trip.status==='ACTIVE'?'bg-emerald-50 text-emerald':'bg-softgray text-charcoal/60'}`}>{trip.status}</span><button onClick={()=>del.mutate()} className="p-2 rounded-xl bg-red-50 text-red-500"><Trash2 className="w-4 h-4"/></button></div></div>
 <div className="grid lg:grid-cols-3 gap-6"><div className="lg:col-span-2 space-y-6">
 <div className="neumorphic-card p-6"><h2 className="text-lg font-bold mb-4"><IndianRupee className="w-5 h-5 text-saffron inline mr-2"/>Budget</h2><div className="grid grid-cols-3 gap-4 mb-4"><div className="text-center p-3 rounded-xl bg-saffron/5"><p className="text-xs">Total</p><p className="text-lg font-bold">{formatCurrency(trip.budget||0)}</p></div><div className="text-center p-3 rounded-xl bg-red-50"><p className="text-xs">Spent</p><p className="text-lg font-bold text-red-500">{formatCurrency(trip.spentSoFar||0)}</p></div><div className="text-center p-3 rounded-xl bg-emerald-50"><p className="text-xs">Remaining</p><p className="text-lg font-bold text-emerald">₹{bl.toLocaleString()}</p></div></div><div className="w-full bg-softgray rounded-full h-2.5"><div className="h-full rounded-full bg-saffron" style={{width:`${bp}%`}}/></div></div>
 <div className="neumorphic-card p-6"><div className="flex items-center justify-between mb-4"><h2 className="text-lg font-bold">Expenses</h2><button onClick={()=>setShowF(!showF)} className="btn-primary text-sm py-2 px-4 flex items-center gap-1.5"><Plus className="w-4 h-4"/>Add</button></div>
 {showF&&<form onSubmit={e=>{e.preventDefault();add.mutate(f);}} className="mb-4 p-4 rounded-xl bg-ivory space-y-3"><select value={f.category} onChange={e=>sf({...f,category:e.target.value})} className="input-field text-sm">{cats.map(c=><option key={c}>{c}</option>)}</select><input type="text" placeholder="Description" value={f.description} onChange={e=>sf({...f,description:e.target.value})} className="input-field text-sm" required/><input type="number" placeholder="Amount" value={f.amount} onChange={e=>sf({...f,amount:e.target.value})} className="input-field text-sm" required min="1"/><div className="flex gap-2"><button type="submit" disabled={add.isPending} className="btn-primary text-sm py-2 px-4 flex-1">{add.isPending?<Loader2 className="w-4 h-4 animate-spin"/>:'Save'}</button><button type="button" onClick={()=>setShowF(false)} className="btn-ghost text-sm">Cancel</button></div></form>}
 {trip.expenses&&trip.expenses.length>0?<div className="space-y-2">{trip.expenses.map((exp:any)=><div key={exp.id} className="flex justify-between p-3 rounded-xl bg-ivory"><div><p className="text-sm font-medium text-navy">{exp.description}</p><p className="text-xs text-charcoal/50">{exp.category} · {formatDate(exp.date)}</p></div><span className="font-semibold text-red-500">₹{exp.amount.toLocaleString()}</span></div>)}</div>:<div className="text-center py-8 text-charcoal/40 text-sm">No expenses yet.</div>}</div>
 </div><div className="space-y-6"><div className="neumorphic-card p-6"><h3 className="font-semibold mb-3">Trip Details</h3><div className="space-y-2 text-sm"><div className="flex justify-between"><span>Status</span><span>{trip.status}</span></div><div className="flex justify-between"><span>Days</span><span>{trip.totalDays}</span></div><div className="flex justify-between"><span>Travelers</span><span>{trip.travelers}</span></div><div className="flex justify-between"><span>Budget</span><span>{formatCurrency(trip.budget||0)}</span></div>{trip.travelStyle&&<div className="flex justify-between"><span>Style</span><span>{trip.travelStyle}</span></div>}</div></div><Link href="/planner" className="neumorphic-card p-4 block hover:-translate-y-1 transition-all"><div className="flex items-center gap-3"><div className="w-10 h-10 rounded-xl bg-saffron/10 flex items-center justify-center"><Sparkles className="w-5 h-5 text-saffron"/></div><div><p className="font-semibold text-sm">Plan Another Trip</p><p className="text-xs text-charcoal/50">Create a new adventure</p></div></div></Link></div></div></div></div>);
}
