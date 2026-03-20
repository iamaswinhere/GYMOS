"use client";
import React from 'react';
import Navbar from '@/components/landing/Navbar';
import Hero from '@/components/landing/Hero';
import EquipmentSection from '@/components/landing/EquipmentSection';
import ContactSection from '@/components/landing/ContactSection';
import Footer from '@/components/landing/Footer';
import FloatingActions from '@/components/landing/FloatingActions';
import CustomCursor from '@/components/landing/CustomCursor';

export default function Home() {
  return (
    <main className="min-h-screen">
      <CustomCursor />
      <FloatingActions />
      <Navbar />
      <Hero />
      <div className="space-y-32">
        <section id="about" className="container mx-auto px-6 py-20">
            <h2 className="text-5xl font-black mb-12 border-l-4 border-primary pl-6 uppercase tracking-tight">WHY <br/><span className="text-primary">GYMOS?</span></h2>
            <div className="grid md:grid-cols-3 gap-8">
                <div className="glass-card p-10 group bg-gradient-to-br from-[#212121] to-black">
                    <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mb-8 text-primary group-hover:bg-primary group-hover:text-black transition-all">
                        <h3 className="text-2xl font-black">01</h3>
                    </div>
                    <h3 className="text-2xl font-bold mb-4 text-white">Elite Equipment</h3>
                    <p className="text-gray-500 leading-relaxed">Train on the same gear used by professionals. Our tech-integrated machines track your every move.</p>
                </div>
                <div className="glass-card p-10 group bg-gradient-to-br from-[#212121] to-black">
                    <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mb-8 text-primary group-hover:bg-primary group-hover:text-black transition-all">
                        <h3 className="text-2xl font-black">02</h3>
                    </div>
                    <h3 className="text-2xl font-bold mb-4 text-white">Pro Coaching</h3>
                    <p className="text-gray-500 leading-relaxed">Connect with certified trainers who build personalized plans based on your GYMOS data.</p>
                </div>
                <div className="glass-card p-10 group bg-gradient-to-br from-[#212121] to-black">
                    <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mb-8 text-primary group-hover:bg-primary group-hover:text-black transition-all">
                        <h3 className="text-2xl font-black">03</h3>
                    </div>
                    <h3 className="text-2xl font-bold mb-4 text-white">Community</h3>
                    <p className="text-gray-500 leading-relaxed">Join a tribe of high-achievers. Access exclusive events and masterclasses held monthly.</p>
                </div>
            </div>
        </section>

        <EquipmentSection />
        
        {/* Map Placeholder */}
        <section className="container mx-auto px-6 py-20">
             <div className="w-full h-[400px] glass-card overflow-hidden relative">
                <div className="absolute inset-0 bg-[#212121] flex items-center justify-center">
                    <div className="text-center">
                         <div className="w-20 h-20 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-4">
                            <span className="text-primary font-bold text-2xl">MAP</span>
                         </div>
                         <p className="text-gray-400 font-medium">Google Maps Integration Placeholder</p>
                         <p className="text-sm text-gray-600">123 Fitness St, Muscle City</p>
                    </div>
                </div>
             </div>
        </section>

        <ContactSection />
      </div>
      <Footer />
    </main>
  );
}
