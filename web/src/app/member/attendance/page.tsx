"use client";
import React, { useEffect, useState, useRef } from 'react';
import { ArrowLeft } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useMember } from '@/lib/context/MemberContext';
import { Html5Qrcode } from 'html5-qrcode';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001/api';

export default function MemberAttendance() {
  const router = useRouter();
  const { member, token } = useMember();
  const [scanResult, setScanResult] = useState<string | null>(null);
  const [isScanning, setIsScanning] = useState(true);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const scannerRef = useRef<Html5Qrcode | null>(null);

  useEffect(() => {
    if (!member) return;

    const startScanner = async () => {
      try {
        scannerRef.current = new Html5Qrcode("reader");
        await scannerRef.current.start(
          { facingMode: "environment" },
          { fps: 10, qrbox: { width: 250, height: 250 } },
          (decodedText) => {
            if (isScanning) {
              handleScan(decodedText);
            }
          },
          (errorMessage) => {
            // ignore scan errors (they happen every frame that doesn't have a QR)
          }
        );
      } catch (err) {
        setErrorMsg("Failed to start camera. Please ensure permissions are granted.");
      }
    };

    if (isScanning && !scannerRef.current) {
      startScanner();
    }

    return () => {
      if (scannerRef.current?.isScanning) {
        scannerRef.current.stop().catch(console.error);
      }
    };
  }, [member, isScanning]);

  const handleScan = async (data: string) => {
    setIsScanning(false);
    if (scannerRef.current?.isScanning) {
      await scannerRef.current.stop();
    }
    
    // Extract token from gymos://checkin?token=...
    const extractedToken = data.includes('token=') ? data.split('token=')[1] : null;

    try {
      const response = await fetch(`${API_URL}/attendance/mark`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ 
           memberId: member?._id,
           token: extractedToken
        })
      });

      const resData = await response.json();

      if (response.ok) {
        setScanResult('Success! Attendance marked.');
        setTimeout(() => router.push('/member'), 2000);
      } else {
        setScanResult(null);
        setErrorMsg(resData.message || 'Could not mark attendance.');
      }
    } catch (error) {
      setScanResult(null);
      setErrorMsg('Network error. Please try again.');
    }
  };

  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-6">
      <div className="w-full max-w-2xl bg-[#0D0D0D] border border-white/5 rounded-[40px] p-8 md:p-12 shadow-2xl relative overflow-hidden">
        <div className="flex justify-between items-start mb-8 relative z-10">
          <button
            onClick={() => router.back()}
            className="w-12 h-12 bg-white/5 rounded-2xl flex items-center justify-center hover:bg-white/10 transition-colors"
          >
            <ArrowLeft className="text-white" size={24} />
          </button>
          <div className="text-right">
            <h1 className="text-3xl font-black text-white tracking-tighter uppercase leading-none mb-2">Scan GYM <span className="text-primary italic">QR</span></h1>
            <p className="text-gray-500 text-xs font-bold uppercase tracking-widest">Attendance System</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center relative z-10">
          <div className="order-2 md:order-1">
             <h2 className="text-xl font-black text-white mb-4 uppercase tracking-tight">Instructions</h2>
             <ul className="space-y-4 text-gray-400 font-medium text-sm">
                <li className="flex gap-3">
                   <span className="w-6 h-6 bg-primary/20 text-primary flex items-center justify-center rounded-lg text-[10px] font-black shrink-0">01</span>
                   <span>Point your camera at the official GYMOS QR code displayed at the front desk.</span>
                </li>
                <li className="flex gap-3">
                   <span className="w-6 h-6 bg-primary/20 text-primary flex items-center justify-center rounded-lg text-[10px] font-black shrink-0">02</span>
                   <span>Wait for the scan to complete automatically.</span>
                </li>
                <li className="flex gap-3">
                   <span className="w-6 h-6 bg-primary/20 text-primary flex items-center justify-center rounded-lg text-[10px] font-black shrink-0">03</span>
                   <span>Your session will be logged instantly after success.</span>
                </li>
             </ul>
          </div>

          <div className="order-1 md:order-2">
            <div className="bg-black border border-white/10 rounded-[32px] overflow-hidden shadow-2xl relative aspect-square">
              {errorMsg ? (
                 <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center z-20 bg-red-500/5">
                    <p className="text-red-500 font-bold mb-4">{errorMsg}</p>
                    <button 
                      onClick={() => { setErrorMsg(null); setIsScanning(true); }}
                      className="bg-primary/20 text-primary px-6 py-3 rounded-xl font-bold uppercase tracking-widest text-xs"
                    >
                      Try Again
                    </button>
                 </div>
              ) : scanResult ? (
                 <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center z-20 bg-green-500/10 backdrop-blur-sm">
                    <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mb-4">
                        <div className="w-8 h-8 bg-green-500 rounded-full animate-ping opacity-20" />
                    </div>
                    <p className="text-green-500 font-black text-xl mb-2">{scanResult}</p>
                    <p className="text-green-500/50 text-xs uppercase tracking-widest font-bold animate-pulse">Redirecting...</p>
                 </div>
              ) : (
                <div id="reader" className="w-full h-full relative z-10 bg-black">
                  {/* html5-qrcode mounts here */}
                </div>
              )}
              
              <div className="absolute inset-0 pointer-events-none border-2 border-primary/20 rounded-[32px] z-30 m-4 shadow-[inset_0_0_40px_rgba(255,196,0,0.1)]"></div>
            </div>
          </div>
        </div>

        <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 blur-[100px] rounded-full pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/5 blur-[80px] rounded-full pointer-events-none"></div>
      </div>
    </div>
  );
}
