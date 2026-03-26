"use client";
import React, { useState } from 'react';
import { Dumbbell, ArrowRight, Loader2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useMember } from '@/lib/context/MemberContext';

export default function MemberLogin() {
  const [mobileNumber, setMobileNumber] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { login } = useMember();
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    if (!mobileNumber || mobileNumber.length !== 10) {
      setError('Please enter a valid 10-digit mobile number');
      return;
    }

    try {
      setLoading(true);
      await login(mobileNumber);
      router.push('/member');
    } catch (err: any) {
      setError(err.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col justify-center px-6 md:px-12 lg:px-24 relative overflow-hidden bg-black py-12">
      {/* Background Gradients */}
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-primary/10 blur-[120px] rounded-full pointer-events-none animate-pulse" />
      <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-white/5 blur-[100px] rounded-full pointer-events-none" />

      <div className="max-w-md w-full mx-auto relative z-10">
        <div className="flex flex-col items-center mb-12 transform hover:scale-105 transition-transform duration-500 cursor-default">
          <div className="w-20 h-20 bg-primary/10 rounded-[2rem] flex items-center justify-center mb-6 border border-primary/20 shadow-[0_0_50px_rgba(255,196,0,0.1)]">
            <Dumbbell className="text-primary w-10 h-10" />
          </div>
          <h1 className="text-6xl font-black text-white tracking-tighter leading-none">
            GYM<span className="text-primary italic">OS</span>
          </h1>
          <div className="h-1 w-12 bg-primary mt-4 rounded-full"></div>
          <p className="text-gray-500 font-black uppercase tracking-widest text-[10px] mt-6 bg-white/5 px-4 py-1.5 rounded-full border border-white/10">Member Portal</p>
        </div>

        <div className="bg-[#0D0D0D] border border-white/5 rounded-[40px] p-8 md:p-10 shadow-2xl relative overflow-hidden">
          <form onSubmit={handleLogin} className="space-y-8 relative z-10">
            <div>
              <h2 className="text-3xl font-black text-white mb-2 uppercase tracking-tighter">Welcome Back</h2>
              <p className="text-sm text-gray-500 font-medium">Authentication via mobile secured by GYMOS.</p>
            </div>

            {error && (
              <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-2xl text-red-500 text-sm font-bold flex items-center gap-2">
                <span className="w-2 h-2 bg-red-500 rounded-full animate-ping"></span>
                {error}
              </div>
            )}

            <div className="space-y-2">
              <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-2">Registered Phone Number</label>
              <div className="flex items-center bg-white/5 border border-white/10 rounded-2xl px-6 h-18 focus-within:border-primary/50 focus-within:bg-white/10 transition-all shadow-inner">
                <span className="text-primary font-black mr-4 border-r border-white/10 pr-4">+91</span>
                <input
                  type="tel"
                  value={mobileNumber}
                  onChange={(e) => setMobileNumber(e.target.value.replace(/\D/g, '').slice(0, 10))}
                  placeholder="00000 00000"
                  className="flex-1 bg-transparent text-white font-black text-xl outline-none placeholder:text-gray-800 tracking-wider"
                  maxLength={10}
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full h-18 bg-primary text-black font-black uppercase tracking-widest rounded-2xl flex items-center justify-center gap-3 hover:shadow-[0_20px_40px_rgba(255,196,0,0.3)] hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-70 disabled:hover:scale-100 py-5"
            >
              {loading ? (
                <Loader2 className="animate-spin" />
              ) : (
                <>
                  CONTINUE <ArrowRight size={20} strokeWidth={3} className="ml-1" />
                </>
              )}
            </button>
          </form>
          
          <div className="absolute -top-20 -left-20 w-40 h-40 bg-primary/5 blur-[80px] rounded-full pointer-events-none"></div>
        </div>

        <p className="text-center text-gray-600 text-[10px] font-black mt-12 pb-8 uppercase tracking-[0.2em]">
          Elite Fitness Management System v2.0
        </p>
      </div>
    </div>
  );
}
