"use client";
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Dumbbell, Lock, User, ArrowRight } from 'lucide-react';

export default function LoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (username === 'admin' && password === 'admin') {
      localStorage.setItem('gymos_admin_session', 'active');
      router.push('/');
    } else {
      setError('Invalid credentials. Hint: use admin/admin');
    }
  };

  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-6 relative overflow-hidden">
      {/* Background Decor */}
      <div className="absolute top-0 -left-20 w-96 h-96 bg-primary/10 rounded-full blur-[120px]"></div>
      <div className="absolute bottom-0 -right-20 w-96 h-96 bg-primary/10 rounded-full blur-[120px]"></div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md"
      >
        <div className="flex flex-col items-center mb-10">
          <div className="w-20 h-20 bg-primary/10 rounded-2xl flex items-center justify-center text-primary mb-6 border border-primary/20">
            <Dumbbell size={40} strokeWidth={3} />
          </div>
          <h1 className="text-4xl font-black text-white tracking-tighter">GYM<span className="text-primary">OS</span> ADMIN</h1>
          <p className="text-gray-500 mt-2 font-medium">Elevate Your Management</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-4">
          <div className="bg-[#121212] border border-white/5 rounded-2xl p-2 focus-within:border-primary/50 transition-all">
            <div className="flex items-center px-4 py-3 gap-3">
              <User size={20} className="text-gray-500" />
              <input 
                type="text" 
                placeholder="Username" 
                className="bg-transparent border-none outline-none text-white w-full font-medium"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="bg-[#121212] border border-white/5 rounded-2xl p-2 focus-within:border-primary/50 transition-all">
            <div className="flex items-center px-4 py-3 gap-3">
              <Lock size={20} className="text-gray-500" />
              <input 
                type="password" 
                placeholder="Password" 
                className="bg-transparent border-none outline-none text-white w-full font-medium"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
          </div>

          {error ? <p className="text-red-500 text-sm font-bold text-center">{error}</p> : null}

          <button 
            type="submit" 
            className="w-full bg-primary text-black font-black py-4 rounded-2xl flex items-center justify-center gap-2 hover:scale-[1.02] active:scale-[0.98] transition-all"
          >
            LOGIN TO DASHBOARD <ArrowRight size={20} strokeWidth={3} />
          </button>
        </form>

        <p className="text-center text-gray-600 mt-8 text-sm font-bold uppercase tracking-widest">
          Secure Access Only
        </p>
      </motion.div>
    </div>
  );
}
