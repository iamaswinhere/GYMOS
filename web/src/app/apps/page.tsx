"use client";
import React from 'react';
import Navbar from '@/components/landing/Navbar';
import Footer from '@/components/landing/Footer';
import CustomCursor from '@/components/landing/CustomCursor';
import { Smartphone, Download, Globe, Zap, CheckCircle2, Monitor } from 'lucide-react';

export default function AppsPage() {
  const steps = [
    {
      title: "iOS (iPhone/iPad)",
      platform: "Apple",
      icon: <Smartphone className="w-8 h-8" />,
      method: "PWA (Fastest & Free)",
      instructions: [
        "Open this site in Safari.",
        "Tap the 'Share' icon (square with arrow).",
        "Scroll down and tap 'Add to Home Screen'.",
        "It's now a standalone app on your home screen!"
      ],
      color: "bg-blue-500/10 text-blue-500"
    },
    {
      title: "Android (Samsung/Pixel)",
      platform: "Google",
      icon: <Download className="w-8 h-8" />,
      method: "Direct APK / PWA",
      instructions: [
        "Open this site in Chrome.",
        "Tap the three dots in the corner.",
        "Tap 'Install App' or 'Add to Home Screen'.",
        "Alternatively: Download our APK from GitHub."
      ],
      color: "bg-green-500/10 text-green-500"
    },
    {
      title: "Internal/Testing",
      platform: "Universal",
      icon: <Monitor className="w-8 h-8" />,
      method: "Expo Go",
      instructions: [
        "Download 'Expo Go' from your app store.",
        "Scan the QR code from our development build.",
        "Instant live updates without installation.",
        "Only for gym staff and testers."
      ],
      color: "bg-purple-500/10 text-purple-500"
    }
  ];

  return (
    <main className="min-h-screen bg-black text-white">
      <CustomCursor />
      <Navbar />
      
      <div className="container mx-auto px-6 pt-32 pb-20">
        <header className="max-w-4xl mx-auto text-center mb-20">
           <div className="inline-flex items-center gap-2 px-6 py-2 rounded-full border border-primary/20 bg-primary/5 text-primary mb-8 font-black uppercase text-sm tracking-widest animate-pulse">
              <Zap className="w-4 h-4" /> Zero-Fee Hosting Active
           </div>
           <h1 className="text-6xl md:text-8xl font-black mb-8 leading-tight uppercase italic tracking-tighter">
             GET THE <span className="text-primary">MOBILE APP</span> FOR FREE
           </h1>
           <p className="text-xl text-gray-400 font-medium leading-relaxed max-w-2xl mx-auto">
             Experience GYMOS anywhere. No app store fees, no complicated installs. 
             Just your performance, tracked in real-time.
           </p>
        </header>

        <div className="grid lg:grid-cols-3 gap-8">
            {steps.map((step, idx) => (
                <div key={idx} className="glass-card p-10 bg-gradient-to-br from-[#121212] to-black border border-white/5 group hover:border-primary/30 transition-all duration-500">
                    <div className={`w-16 h-16 rounded-2xl flex items-center justify-center mb-8 border border-white/10 group-hover:scale-110 transition-transform ${step.color}`}>
                        {step.icon}
                    </div>
                    <div className="mb-8">
                        <span className="text-xs font-black uppercase tracking-widest text-gray-500 mb-2 block">{step.platform}</span>
                        <h2 className="text-3xl font-black uppercase mb-4">{step.title}</h2>
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded bg-white/5 text-xs font-bold text-gray-300">
                            <Zap className="w-3 h-3 text-primary" /> {step.method}
                        </div>
                    </div>
                    
                    <ul className="space-y-4 mb-10">
                        {step.instructions.map((inst, i) => (
                            <li key={i} className="flex gap-4 items-start group/item">
                                <div className="w-6 h-6 rounded bg-primary/10 text-primary flex items-center justify-center flex-shrink-0 text-xs font-black group-hover/item:bg-primary group-hover/item:text-black transition-colors">
                                    {i + 1}
                                </div>
                                <span className="text-gray-400 group-hover/item:text-white transition-colors">{inst}</span>
                            </li>
                        ))}
                    </ul>

                    <button className="w-full py-4 bg-white text-black font-black uppercase tracking-widest hover:bg-primary transition-all duration-300 group-hover:shadow-[0_0_30px_rgba(255,255,255,0.1)]">
                        Launch Mobile View
                    </button>
                </div>
            ))}
        </div>

        {/* Technical Notice */}
        <div className="max-w-4xl mx-auto mt-32 p-12 glass-card bg-[#0a0a0a] border-l-8 border-primary relative overflow-hidden">
             <div className="absolute top-0 right-0 p-8 text-primary/5">
                <Globe className="w-48 h-48 -mr-20 -mt-20" />
             </div>
             <div className="relative z-10">
                <h3 className="text-3xl font-black uppercase mb-6 flex items-center gap-4">
                    <CheckCircle2 className="w-10 h-10 text-primary" />
                    Production Ready Distribution
                </h3>
                <div className="grid md:grid-cols-2 gap-12 mt-12">
                    <div>
                        <h4 className="text-primary font-black uppercase tracking-widest mb-4">PWA Strategy</h4>
                        <p className="text-gray-500 leading-relaxed">
                            Our primary distribution uses Progressive Web App technology. This allows us to "host" the app for free on 
                            edge servers (Vercel) while maintaining high performance, offline support, and deep system integration on Safari and Chrome.
                        </p>
                    </div>
                    <div>
                        <h4 className="text-primary font-black uppercase tracking-widest mb-4">Free Android Hosting</h4>
                        <p className="text-gray-500 leading-relaxed">
                            For Android users who prefer local installations, our GitHub CI/CD pipeline builds and hosts APK files for free 
                            using GitHub Actions, bypassing the $25 Google Play fee.
                        </p>
                    </div>
                </div>
             </div>
        </div>
      </div>
      <Footer />
    </main>
  );
}
