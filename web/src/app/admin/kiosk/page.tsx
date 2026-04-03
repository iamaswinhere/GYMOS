"use client";
import React, { useState, useEffect } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { motion } from 'framer-motion';
import { ShieldCheck, Clock, Zap } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function KioskPage() {
  const [token, setToken] = useState("");
  const [pinCode, setPinCode] = useState("");
  const [currentTime, setCurrentTime] = useState("");
  const router = useRouter();

  // In a real production environment, this token would be fetched from the backend daily or hourly.
  // For now, we will generate time-based tokens on the client.
  useEffect(() => {
    const generateTokens = async () => {
      // Current time
      const now = new Date();
      // IST Offset (UTC+5:30)
      const istOffset = 5.5 * 60 * 60 * 1000;
      const istDate = new Date(now.getTime() + istOffset);
      
      const dateString = `${istDate.getUTCFullYear()}-${istDate.getUTCMonth()}-${istDate.getUTCDate()}-${istDate.getUTCHours()}`;
      setToken(btoa(`gymos_secure_${dateString}`));

      // Generate the alternative 6-digit PIN code
      const encoder = new TextEncoder();
      const data = encoder.encode('gymos_pin_' + dateString);
      try {
        const hashBuffer = await crypto.subtle.digest('SHA-256', data);
        const hashArray = Array.from(new Uint8Array(hashBuffer));
        const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
        const shortCode = parseInt(hashHex.substring(0, 8), 16).toString().substring(0, 6).padStart(6, '0');
        setPinCode(shortCode);
      } catch (err) {
        setPinCode("000000");
      }
    };

    generateTokens();
    const interval = setInterval(generateTokens, 60000); // Check every minute if the hour changed

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setCurrentTime(now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit' }));
    };
    updateTime();
    const timeInterval = setInterval(updateTime, 1000);
    return () => clearInterval(timeInterval);
  }, []);

  return (
    <div className="min-h-screen bg-black flex flex-col items-center justify-center p-6 relative overflow-hidden">
      {/* Background Ambience */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-primary/5 rounded-full blur-[100px] pointer-events-none"></div>

      <div className="relative z-10 w-full max-w-2xl flex flex-col items-center">
        
        {/* Header */}
        <div className="flex flex-col items-center mb-12">
            <h1 className="text-4xl md:text-6xl font-black text-white tracking-tighter uppercase italic text-center mb-4">
              ELITE <span className="text-primary text-glow">CHECK-IN</span>
            </h1>
            <div className="flex items-center gap-2 bg-white/5 border border-white/10 px-6 py-2 rounded-full">
                <Clock size={16} className="text-primary" />
                <span className="text-xl font-bold tracking-widest font-mono text-white">{currentTime || "00:00:00"}</span>
            </div>
        </div>

        {/* QR Code Container */}
        <motion.div 
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: 'spring', damping: 20 }}
            className="bg-white p-8 rounded-[40px] shadow-[0_0_50px_rgba(255,196,0,0.2)] relative group"
        >
          {/* Scanning Animation line */}
          <div className="absolute top-0 left-0 w-full h-[3px] bg-primary/80 shadow-[0_0_20px_rgba(255,196,0,1)] animate-[scan_2s_ease-in-out_infinite]"></div>

          <div className="border-[8px] border-black rounded-[24px] p-6 bg-white relative">
            <div className="absolute top-[-16px] left-1/2 -translate-x-1/2 bg-black text-white text-[10px] font-black uppercase tracking-widest px-4 py-1 rounded-full">
                SCAN WITH GYMOS APP
            </div>
            {token ? (
              <QRCodeSVG 
                value={`gymos://checkin?token=${token}`} 
                size={280} 
                level="H"
                fgColor="#000000"
                bgColor="#ffffff"
                imageSettings={{
                    src: "/logo.png",
                    height: 50,
                    width: 50,
                    excavate: true,
                }}
              />
            ) : (
                <div className="w-[280px] h-[280px] flex items-center justify-center bg-gray-100 rounded-xl">
                    <Zap size={32} className="text-primary animate-pulse" />
                </div>
            )}
          </div>
        </motion.div>

        {/* Instructions */}
        <div className="flex flex-col items-center mt-12 space-y-4">
            <p className="text-gray-400 font-bold uppercase tracking-widest text-sm flex items-center gap-2">
                <ShieldCheck className="text-green-500" size={18} />
                Secure Auto-Rotating Token
            </p>

            <div className="bg-white/5 border border-white/10 px-8 py-4 rounded-2xl flex flex-col items-center mt-4 w-full">
                <p className="text-gray-400 text-xs font-bold uppercase tracking-widest mb-2">Alternative Check-in Code</p>
                {pinCode ? (
                  <p className="text-3xl md:text-5xl font-black text-white tracking-[0.5em]">{pinCode}</p>
                ) : (
                  <Zap size={32} className="text-primary animate-pulse" />
                )}
            </div>

            <button 
                onClick={() => router.push('/admin')} 
                className="text-[10px] uppercase font-black tracking-widest text-gray-500 hover:text-white transition-colors mt-8"
            >
                Return to Dashboard
            </button>
        </div>

      </div>
    </div>
  );
}
