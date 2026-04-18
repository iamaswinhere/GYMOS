"use client";
import React from 'react';
import Navbar from '@/components/landing/Navbar';
import Footer from '@/components/landing/Footer';

export default function ShippingDelivery() {
  return (
    <main className="min-h-screen overflow-x-hidden bg-black flex flex-col">
      <Navbar />
      
      <div className="flex-1 container mx-auto px-6 py-32 max-w-4xl">
        <h1 className="text-4xl md:text-5xl font-black mb-8 border-l-4 border-primary pl-6 uppercase tracking-tight text-white">SHIPPING & <span className="text-primary">DELIVERY</span></h1>
        
        <div className="glass-card p-10 bg-gradient-to-br from-[#1a1a1a] to-black border-white/5 space-y-8 text-gray-300 leading-relaxed">
          <p className="text-sm text-gray-500">Last Updated: {new Date().toLocaleDateString()}</p>
          
          <div className="bg-primary/10 border border-primary/20 rounded-xl p-6 mb-8 text-white font-medium text-lg">
             <p className="text-center font-bold text-primary">Services are activated immediately upon payment at the gym or via the app.</p>
          </div>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4">1. Digital Service Delivery</h2>
            <p>GYMOS is a fitness facility and service provider. We do not ship physical fitness equipment, merchandise, or goods to your physical address. Therefore, traditional shipping policies do not apply to our membership plans.</p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4">2. Immediate Activation</h2>
            <p>When you successfully purchase a membership plan (Student, Monthly, or Personal Training) through our secure Razorpay integration, your digital membership status is <strong>updated and activated instantly</strong> across our web and mobile applications.</p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4">3. App Access & Facility Entry</h2>
            <p>Your "delivery" consists of immediate access to the GYMOS Member App interface and your physical access profile. You can visit the GYMOS facility in Alathur, Kerala immediately following a successful transaction to begin your fitness journey.</p>
          </section>
        </div>
      </div>

      <Footer />
    </main>
  );
}
