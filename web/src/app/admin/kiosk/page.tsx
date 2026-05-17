"use client";
import React from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { motion } from 'framer-motion';
import { ShieldCheck, Zap } from 'lucide-react';
import { useRouter } from 'next/navigation';

// Hardcoded static values — never change unless intentionally updated
const STATIC_QR_VALUE = "gymos://checkin?token=Z3ltb3Nfc3RhdGljX3FyX2NoZWNraW5fdG9rZW5fdjE=";
const STATIC_PIN = "839214";

export default function KioskPage() {
  const router = useRouter();

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
        </div>

        {/* QR Code Container — static, no animation line */}
        <motion.div 
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: 'spring', damping: 20 }}
            className="bg-white p-8 rounded-[40px] shadow-[0_0_50px_rgba(255,196,0,0.2)] relative"
        >
          <div className="border-[8px] border-black rounded-[24px] p-6 bg-white relative">
            <div className="absolute top-[-16px] left-1/2 -translate-x-1/2 bg-black text-white text-[10px] font-black uppercase tracking-widest px-4 py-1 rounded-full">
                SCAN WITH GYMOS APP
            </div>
            <QRCodeSVG 
              value={STATIC_QR_VALUE}
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
          </div>
        </motion.div>

        {/* Instructions */}
        <div className="flex flex-col items-center mt-12 space-y-4">
            <p className="text-gray-400 font-bold uppercase tracking-widest text-sm flex items-center gap-2">
                <ShieldCheck className="text-green-500" size={18} />
                Static QR For Physical Print
            </p>

            <div className="bg-white/5 border border-white/10 px-8 py-4 rounded-2xl flex flex-col items-center mt-4 w-full">
                <p className="text-gray-400 text-xs font-bold uppercase tracking-widest mb-2">Alternative Check-in Code</p>
                <p className="text-3xl md:text-5xl font-black text-white tracking-[0.5em]">{STATIC_PIN}</p>
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
