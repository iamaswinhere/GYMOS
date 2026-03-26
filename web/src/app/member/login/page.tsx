"use client";
import React, { useState, useEffect } from 'react';
import { Dumbbell, ArrowRight, Loader2, ShieldCheck, Fingerprint } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useMember } from '@/lib/context/MemberContext';
import { motion, AnimatePresence } from 'framer-motion';

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
      setError('Invalid Access Token (Phone Number)');
      return;
    }

    try {
      setLoading(true);
      await login(mobileNumber);
      router.push('/member');
    } catch (err: any) {
      setError(err.message || 'Authentication Failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 sm:px-6 relative overflow-hidden bg-[#050505] selection:bg-primary selection:text-black">
      {/* Dynamic Background Elements */}
      <div className="absolute top-[-10%] right-[-10%] w-[500px] h-[500px] bg-primary/10 blur-[120px] rounded-full pointer-events-none animate-pulse" />
      <div className="absolute bottom-[-5%] left-[-5%] w-[400px] h-[400px] bg-white/5 blur-[100px] rounded-full pointer-events-none" />
      
      {/* Decorative Grid */}
      <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-[0.03] pointer-events-none"></div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-md w-full relative z-10"
      >
        {/* Brand Identity */}
        <div className="flex flex-col items-center mb-10">
          <motion.div 
            whileHover={{ scale: 1.05, rotate: 5 }}
            className="w-20 h-20 bg-gradient-to-br from-primary/20 to-transparent rounded-[2rem] flex items-center justify-center mb-6 border border-primary/20 shadow-[0_0_50px_rgba(255,196,0,0.15)] backdrop-blur-sm"
          >
            <Dumbbell className="text-primary w-10 h-10" />
          </motion.div>
          
          <h1 className="text-6xl font-black text-white tracking-tighter leading-none flex items-baseline">
            GYM<span className="text-primary italic">OS</span>
            <span className="ml-1 w-2 h-2 bg-primary rounded-full animate-bounce"></span>
          </h1>
          
          <div className="flex items-center gap-2 mt-4">
             <div className="h-[1px] w-8 bg-white/10"></div>
             <p className="text-gray-500 font-black uppercase tracking-[0.3em] text-[9px] bg-white/5 px-4 py-1.5 rounded-full border border-white/5 backdrop-blur-md">
               Elite Membership Access
             </p>
             <div className="h-[1px] w-8 bg-white/10"></div>
          </div>
        </div>

        {/* Login Container */}
        <div className="bg-[#0A0A0A]/80 backdrop-blur-2xl border border-white/10 rounded-[45px] p-8 md:p-10 shadow-[0_25px_50px_-12px_rgba(0,0,0,0.5)] relative overflow-hidden group">
          
          {/* Subtle Scanning Line Animation */}
          <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-primary/30 to-transparent animate-scan pointer-events-none"></div>

          <form onSubmit={handleLogin} className="space-y-8 relative z-10">
            <div className="space-y-1">
              <h2 className="text-2xl font-black text-white uppercase tracking-tight flex items-center gap-2">
                <Fingerprint className="text-primary" size={24} /> 
                Initialize <span className="text-primary italic">Session</span>
              </h2>
              <p className="text-xs text-gray-500 font-bold uppercase tracking-widest opacity-60">Verified Member Protocol</p>
            </div>

            <AnimatePresence>
              {error && (
                <motion.div 
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="p-4 bg-red-500/10 border border-red-500/20 rounded-2xl text-red-500 text-[10px] font-black uppercase tracking-widest flex items-center gap-3"
                >
                  <div className="w-2 h-2 bg-red-500 rounded-full animate-ping shrink-0"></div>
                  {error}
                </motion.div>
              )}
            </AnimatePresence>

            <div className="space-y-3">
              <div className="flex justify-between items-center ml-2">
                <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Mobile Identity</label>
                <div className="flex items-center gap-1">
                   <ShieldCheck size={10} className="text-green-500" />
                   <span className="text-[8px] text-green-500 font-black uppercase tracking-widest">Encrypted</span>
                </div>
              </div>
              
              <div className="flex items-center bg-black border border-white/10 rounded-2xl px-6 h-20 focus-within:border-primary/50 focus-within:ring-1 focus-within:ring-primary/20 transition-all shadow-[inset_0_2px_10px_rgba(0,0,0,0.5)]">
                <span className="text-primary font-black text-lg mr-4 border-r border-white/10 pr-4 italic">+91</span>
                <input
                  type="tel"
                  autoFocus
                  value={mobileNumber}
                  onChange={(e) => setMobileNumber(e.target.value.replace(/\D/g, '').slice(0, 10))}
                  placeholder="00000 00000"
                  className="flex-1 bg-transparent text-white font-black text-2xl outline-none placeholder:text-gray-900 tracking-[0.2em] w-full"
                  maxLength={10}
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="group w-full h-20 bg-primary text-black font-black uppercase tracking-[0.2em] rounded-[24px] flex items-center justify-center gap-3 shadow-[0_15px_35px_rgba(255,196,0,0.2)] hover:shadow-[0_20px_50px_rgba(255,196,0,0.3)] hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-70 disabled:hover:scale-100 py-6 text-sm"
            >
              {loading ? (
                <div className="flex items-center gap-3">
                   <Loader2 className="animate-spin" size={20} />
                   <span className="animate-pulse">Authorizing...</span>
                </div>
              ) : (
                <>
                  Enter Dashboard <ArrowRight size={20} strokeWidth={4} className="group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </button>
          </form>
          
          {/* Subtle Inner Glow */}
          <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 blur-[60px] rounded-full pointer-events-none group-hover:bg-primary/10 transition-colors"></div>
        </div>

        {/* Security Meta */}
        <div className="mt-12 flex flex-col items-center gap-4 pb-10">
           <div className="flex items-center gap-6">
              <div className="flex flex-col items-center">
                 <p className="text-[8px] text-gray-600 font-black uppercase tracking-widest">Server</p>
                 <p className="text-[9px] text-primary font-black uppercase tracking-tighter">Cloud-Optimized</p>
              </div>
              <div className="h-4 w-[1px] bg-white/10"></div>
              <div className="flex flex-col items-center">
                 <p className="text-[8px] text-gray-600 font-black uppercase tracking-widest">Protocol</p>
                 <p className="text-[9px] text-primary font-black uppercase tracking-tighter">AES-256 Auth</p>
              </div>
           </div>
           
           <p className="text-center text-gray-800 text-[9px] font-black uppercase tracking-[0.4em]">
             GYMOS ELITE OS v2.4.0
           </p>
        </div>
      </motion.div>

      <style jsx global>{`
        @keyframes scan {
          0% { transform: translateY(0); opacity: 0; }
          20% { opacity: 1; }
          80% { opacity: 1; }
          100% { transform: translateY(400px); opacity: 0; }
        }
        .animate-scan {
          animation: scan 3s linear infinite;
        }
      `}</style>
    </div>
  );
}
