'use client';
import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/auth';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import toast from 'react-hot-toast';
import { Compass, Mail, Lock, User, Eye, EyeOff, Loader2 } from 'lucide-react';

const signupSchema = z.object({ name: z.string().min(2), email: z.string().email(), password: z.string().min(6), confirmPassword: z.string() }).refine(d=>d.password===d.confirmPassword,{message:'Passwords do not match',path:['confirmPassword']});
type SignupForm = z.infer<typeof signupSchema>;

export default function SignupPage() {
  const router = useRouter();
  const signup = useAuthStore(s=>s.signup);
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const {register,handleSubmit,formState:{errors}} = useForm<SignupForm>({resolver:zodResolver(signupSchema)});

  const onSubmit = async (data:SignupForm) => { setIsLoading(true); try { await signup(data.name,data.email,data.password); toast.success('Welcome to MusafirX! 🎉'); router.push('/'); } catch(err:any) { toast.error(err.message||'Signup failed'); } finally { setIsLoading(false); } };

  return (
    <div className="min-h-screen flex items-center justify-center bg-ivory px-4 py-12"><div className="w-full max-w-md"><div className="text-center mb-10"><Link href="/" className="inline-flex items-center gap-2 mb-6"><div className="w-10 h-10 rounded-xl bg-navy flex items-center justify-center"><span className="text-white font-bold text-xl">M</span></div><span className="font-display font-bold text-2xl text-navy">Musafir<span className="text-saffron">X</span></span></Link><h1 className="text-3xl font-display font-bold text-navy">Start your journey</h1><p className="text-charcoal/60 mt-2">Join MusafirX and discover India</p></div>
    <div className="neumorphic-card p-8"><form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
      <div><label className="block text-sm font-semibold text-navy mb-1.5">Name</label><div className="relative"><User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-charcoal/40"/><input {...register('name')} type="text" placeholder="Your name" className="input-field pl-11"/></div>{errors.name&&<p className="text-red-500 text-xs mt-1">{errors.name.message}</p>}</div>
      <div><label className="block text-sm font-semibold text-navy mb-1.5">Email</label><div className="relative"><Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-charcoal/40"/><input {...register('email')} type="email" placeholder="you@example.com" className="input-field pl-11"/></div>{errors.email&&<p className="text-red-500 text-xs mt-1">{errors.email.message}</p>}</div>
      <div><label className="block text-sm font-semibold text-navy mb-1.5">Password</label><div className="relative"><Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-charcoal/40"/><input {...register('password')} type={showPassword?'text':'password'} placeholder="Min 6 characters" className="input-field pl-11 pr-11"/><button type="button" onClick={()=>setShowPassword(!showPassword)} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-charcoal/40">{showPassword?<EyeOff className="w-5 h-5"/>:<Eye className="w-5 h-5"/>}</button></div>{errors.password&&<p className="text-red-500 text-xs mt-1">{errors.password.message}</p>}</div>
      <div><label className="block text-sm font-semibold text-navy mb-1.5">Confirm Password</label><div className="relative"><Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-charcoal/40"/><input {...register('confirmPassword')} type="password" placeholder="Confirm password" className="input-field pl-11"/></div>{errors.confirmPassword&&<p className="text-red-500 text-xs mt-1">{errors.confirmPassword.message}</p>}</div>
      <button type="submit" disabled={isLoading} className="btn-primary w-full flex items-center justify-center gap-2">{isLoading?<Loader2 className="w-5 h-5 animate-spin"/>:<Compass className="w-5 h-5"/>}{isLoading?'Creating account...':'Create Account'}</button></form>
    <div className="mt-6 text-center"><p className="text-sm text-charcoal/60">Already have an account? <Link href="/auth/login" className="text-saffron font-semibold hover:underline">Sign in</Link></p></div></div></div></div>
  );
}
