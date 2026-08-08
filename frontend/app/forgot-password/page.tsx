'use client';
import { useState } from 'react';
import Link from 'next/link';
import { Mail, Loader2, ArrowLeft, CheckCircle } from 'lucide-react';
import { api } from '@/lib/api';
import toast from 'react-hot-toast';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const handleSubmit = async (e: React.FormEvent) => { e.preventDefault(); setIsLoading(true); try { await api.post('/auth/forgot-password', { email }); setSent(true); } catch(err:any) { toast.error(err.message); } finally { setIsLoading(false); } };
  return (<div className="min-h-screen flex items-center justify-center bg-ivory px-4"><div className="w-full max-w-md"><div className="text-center mb-10"><Link href="/" className="inline-flex items-center gap-2 mb-6"><div className="w-10 h-10 rounded-xl bg-navy flex items-center justify-center"><span className="text-white font-bold text-xl">M</span></div><span className="font-display font-bold text-2xl text-navy">Musafir<span className="text-saffron">X</span></span></Link><h1 className="text-3xl font-display font-bold text-navy">Forgot Password</h1></div><div className="neumorphic-card p-8">{sent?<div className="text-center"><CheckCircle className="w-16 h-16 text-emerald mx-auto mb-4"/><h3 className="text-xl font-bold text-navy mb-2">Check your email!</h3><Link href="/auth/login" className="text-saffron font-semibold hover:underline">← Back to login</Link></div>:<form onSubmit={handleSubmit} className="space-y-5"><div><label className="block text-sm font-semibold text-navy mb-1.5">Email</label><div className="relative"><Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-charcoal/40"/><input type="email" value={email} onChange={e=>setEmail(e.target.value)} placeholder="Enter your email" className="input-field pl-11" required/></div></div><button type="submit" disabled={isLoading} className="btn-primary w-full">{isLoading?<Loader2 className="w-5 h-5 animate-spin"/>:'Send Reset Link'}</button></form>}<div className="mt-6 text-center"><Link href="/auth/login" className="inline-flex items-center gap-1 text-sm text-charcoal/60 hover:text-saffron"><ArrowLeft className="w-4 h-4"/> Back to Login</Link></div></div></div></div>);
}
