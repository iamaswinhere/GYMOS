"use client";
import React from 'react';
import Navbar from '@/components/landing/Navbar';
import Footer from '@/components/landing/Footer';

export default function TermsConditions() {
  return (
    <main className="min-h-screen overflow-x-hidden bg-black flex flex-col">
      <Navbar />
      
      <div className="flex-1 container mx-auto px-6 py-32 max-w-4xl">
        <h1 className="text-4xl md:text-5xl font-black mb-8 border-l-4 border-primary pl-6 uppercase tracking-tight text-white">TERMS & <span className="text-primary">CONDITIONS</span></h1>
        
        <div className="glass-card p-10 bg-gradient-to-br from-[#1a1a1a] to-black border-white/5 space-y-8 text-gray-300 leading-relaxed">
          <p className="text-sm text-gray-500">Last Updated: {new Date().toLocaleDateString()}</p>
          
          <section>
            <h2 className="text-2xl font-bold text-white mb-4">1. Acceptance of Terms</h2>
            <p>By accessing or using GYMOS services, facilities, or the mobile application, you agree to be bound by these Terms and Conditions. If you do not agree with any part of these terms, you may not use our services.</p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4">2. Membership Rules</h2>
            <p>Memberships are exclusively personal, non-transferable, and non-refundable. You must present your digital or physical GYMOS ID to enter the facility. Members are expected to adhere to all gym etiquette and safety protocols.</p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4">3. Code of Conduct</h2>
            <p>GYMOS maintains a zero-tolerance policy for harassment, discrimination, or unsafe behavior. We reserve the right to terminate the membership of any individual violating these rules without prior notice or refund.</p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4">4. Liability Waiver</h2>
            <p>By signing up for a GYMOS membership, you acknowledge that participation in physical exercise involves inherent risks. GYMOS, its trainers, and staff are not liable for any injuries or damages sustained on the premises.</p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4">5. Contact Information</h2>
            <p>If you have any questions regarding these terms, please contact us at:</p>
            <ul className="mt-2 list-disc pl-5">
              <li><strong>Email:</strong> support@gymos.in</li>
              <li><strong>Phone:</strong> +91 8921809791</li>
              <li><strong>Address:</strong> Alathur, Kerala, India</li>
            </ul>
          </section>
        </div>
      </div>

      <Footer />
    </main>
  );
}
