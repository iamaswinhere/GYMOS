"use client";
import React from 'react';
import Navbar from '@/components/landing/Navbar';
import Footer from '@/components/landing/Footer';

export default function PrivacyPolicy() {
  return (
    <main className="min-h-screen overflow-x-hidden bg-black flex flex-col">
      <Navbar />
      
      <div className="flex-1 container mx-auto px-6 py-32 max-w-4xl">
        <h1 className="text-4xl md:text-5xl font-black mb-8 border-l-4 border-primary pl-6 uppercase tracking-tight text-white">PRIVACY <span className="text-primary">POLICY</span></h1>
        
        <div className="glass-card p-10 bg-gradient-to-br from-[#1a1a1a] to-black border-white/5 space-y-8 text-gray-300 leading-relaxed">
          <p className="text-sm text-gray-500">Last Updated: {new Date().toLocaleDateString()}</p>
          
          <section>
            <h2 className="text-2xl font-bold text-white mb-4">1. Information We Collect</h2>
            <p>At GYMOS, we collect personal information you provide to us when registering, such as your name, phone number, email address, and biometric data (if opting for quick access). We also gather transaction data for membership payments securely via Razorpay.</p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4">2. How We Use Your Data</h2>
            <p>We use the collected information to manage your gym membership, process authorized payments, track attendance and progress, and send you important updates regarding our facility or your status. We do NOT sell your personal data to third parties.</p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4">3. Data Security</h2>
            <p>Your data is protected using industry-standard security measures. Payment data is encrypted and handled exclusively by Razorpay, our secure and compliant payment gateway parter. GYMOS does not store your credit card or UPI details on our servers.</p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4">4. Your Rights</h2>
            <p>You have the right to request access to your personal information stored in GYMOS systems, or request its deletion subject to any legal or contractual preservation requirements.</p>
          </section>
        </div>
      </div>

      <Footer />
    </main>
  );
}
