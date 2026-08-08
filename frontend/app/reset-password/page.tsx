'use client';
import { useState } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { Lock, Loader2, ArrowLeft } from 'lucide-react';
import { api } from '@/lib/api';
import toast from 'react-hot-toast';

export default function ResetPasswordPage() {
  const [pw,setPw]=useState(''); const [cp,setCp]=useState(''); const [l,setL]=useState(false);
  const router=useRouter(); const sp=useSearchParams(); const token=sp.get('token');
  const h=async(e:React.FormEvent)=>{e.preventDefault();if(pw!==cp){toast.error('Passwords do not match');return;}setL(true);try{await api.post('/auth/reset-password',{token,password:pw});toast.success('Reset! Login now.');router.push('/auth/login');}catch(err:any){toast.error(err.message);}finally{setL(false);}};
  if(!token) return <div className="min-h-screen flex items-center justify-center"><div className="text-center"><h2 className="text-xl font-bold text-navy">Invalid reset link</h2><Link href="/auth/login" className="text-saffron mt-4 block">Back to login</Link></div></div>;
  return (<div className="min-h-screen flex items-center justify-center bg-ivory px-4"><div className="w-full max-w-md"><div className="text-center mb-10"><h1 className="text-3xl font-bold text-navy">Reset Password</h1></div><div className="neumorphic-card p-8"><form onSubmit={h} className="space-y-5"><div><label className="block text-sm font-semibold text-navy mb-1.5">New Password</label><div className="relative"><Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-charcoal/40"/><input type="password" value={pw} onChange={e=>setPw(e.target.value)} placeholder="Min 6 chars" className="input-field pl-11" required minLength={6}/></div></div><div><label className="block text-sm font-semibold text-navy mb-1.5">Confirm</label><div className="relative"><Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-charcoal/40"/><input type="password" value={cp} onChange={e=>setCp(e.target.value)} placeholder="Re-enter" className="input-field pl-11" required/></div></div><button type="submit" disabled={l} className="btn-primary w-full">{l?<Loader2 className="w-5 h-5 animate-spin"/>:'Reset Password'}</button></form><div className="mt-6 text-center"><Link href="/auth/login" className="inline-flex items-center gap-1 text-sm text-charcoal/60 hover:text-saffron"><ArrowLeft className="w-4 h-4"/> Back</Link></div></div></div></div>);
}
