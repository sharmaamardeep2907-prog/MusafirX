'use client';
import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/auth';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import toast from 'react-hot-toast';
import { Compass, Mail, Lock, Eye, EyeOff, Loader2 } from 'lucide-react';

const loginSchema = z.object({ email: z.string().email('Invalid email'), password: z.string().min(6, 'Password must be at least 6 characters') });
type LoginForm = z.infer<typeof loginSchema>;

export default function LoginPage() {
  const router = useRouter();
  const login = useAuthStore((s) => s.login);
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { register, handleSubmit, formState: { errors } } = useForm<LoginForm>({ resolver: zodResolver(loginSchema) });

  const onSubmit = async (data: LoginForm) => { setIsLoading(true); try { await login(data.email, data.password); toast.success('Welcome back!'); router.push('/'); } catch (err: any) { toast.error(err.message || 'Login failed'); } finally { setIsLoading(false); } };

  return (
    <div className="min-h-screen flex items-center justify-center bg-ivory px-4 py-12"><div className="w-full max-w-md"><div className="text-center mb-10"><Link href="/" className="inline-flex items-center gap-2 mb-6"><div className="w-10 h-10 rounded-xl bg-navy flex items-center justify-center"><span className="text-white font-bold text-xl">M</span></div><span className="font-display font-bold text-2xl text-navy">Musafir<span className="text-saffron">X</span></span></Link><h1 className="text-3xl font-display font-bold text-navy">Welcome back</h1><p className="text-charcoal/60 mt-2">Continue your journey</p></div>
    <div className="neumorphic-card p-8"><form onSubmit={handleSubmit(onSubmit)} className="space-y-5"><div><label className="block text-sm font-semibold text-navy mb-1.5">Email</label><div className="relative"><Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-charcoal/40" /><input {...register('email')} type="email" placeholder="demo@musafirx.com" className="input-field pl-11" /></div>{errors.email && <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>}</div>
    <div><label className="block text-sm font-semibold text-navy mb-1.5">Password</label><div className="relative"><Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-charcoal/40" /><input {...register('password')} type={showPassword?'text':'password'} placeholder="Demo@12345" className="input-field pl-11 pr-11" /><button type="button" onClick={()=>setShowPassword(!showPassword)} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-charcoal/40">{showPassword?<EyeOff className="w-5 h-5"/>:<Eye className="w-5 h-5"/>}</button></div>{errors.password && <p className="text-red-500 text-xs mt-1">{errors.password.message}</p>}</div>
    <button type="submit" disabled={isLoading} className="btn-primary w-full flex items-center justify-center gap-2">{isLoading?<Loader2 className="w-5 h-5 animate-spin"/>:<Compass className="w-5 h-5"/>}{isLoading?'Signing in...':'Sign In'}</button></form>
    <div className="mt-6 text-center"><p className="text-sm text-charcoal/60">Don't have an account? <Link href="/auth/signup" className="text-saffron font-semibold hover:underline">Create one</Link></p></div>
    <div className="mt-6 pt-6 border-t border-softgray"><div className="text-xs text-charcoal/40 text-center mb-2">Demo Credentials</div><div className="grid grid-cols-2 gap-2 text-xs text-charcoal/50"><div className="text-center p-2 rounded-lg bg-ivory"><p className="font-semibold text-navy">User</p><p>demo@musafirx.com</p><p>Demo@12345</p></div><div className="text-center p-2 rounded-lg bg-ivory"><p className="font-semibold text-navy">Admin</p><p>admin@musafirx.com</p><p>Admin@12345</p></div></div></div></div></div></div>
  );
}
