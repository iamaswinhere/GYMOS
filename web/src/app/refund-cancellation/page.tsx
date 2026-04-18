"use client";
import React from 'react';
import Navbar from '@/components/landing/Navbar';
import Footer from '@/components/landing/Footer';

export default function RefundCancellation() {
  return (
    <main className="min-h-screen overflow-x-hidden bg-black flex flex-col">
      <Navbar />
      
      <div className="flex-1 container mx-auto px-6 py-32 max-w-4xl">
        <h1 className="text-4xl md:text-5xl font-black mb-8 border-l-4 border-primary pl-6 uppercase tracking-tight text-white">REFUND & <span className="text-primary">CANCELLATION</span></h1>
        
        <div className="glass-card p-10 bg-gradient-to-br from-[#1a1a1a] to-black border-white/5 space-y-8 text-gray-300 leading-relaxed">
          <p className="text-sm text-gray-500">Last Updated: {new Date().toLocaleDateString()}</p>
          
          <div className="bg-primary/10 border border-primary/20 rounded-xl p-6 mb-8 text-white font-medium">
             <p>As per the standard operating policy of GYMOS, please review our strict refund and cancellation terms carefully before purchasing any membership or training package.</p>
          </div>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4">1. Non-Refundable Policy</h2>
            <p>All subscription payments, membership fees, and personal training packages purchased at GYMOS or via our online app are <strong>strictly non-refundable</strong>. Once a payment is made and the service is activated, we do not issue refunds under any circumstances, including non-usage of the facility.</p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4">2. Non-Transferable Memberships</h2>
            <p>Your GYMOS membership is assigned to you exclusively. It cannot be transferred, sold, or shared with another individual. Any breach of this rule will result in immediate termination of the membership with no refund.</p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4">3. Cancellations</h2>
            <p>You may cancel your auto-renewal or choose not to renew your membership at the end of your billing cycle. However, GYMOS does not offer prorated refunds for mid-cycle cancellations or paused memberships due to travel, sickness, or relocation.</p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4">4. Payment Failures</h2>
            <p>If a membership payment fails during an active mandate, the membership will be immediately frozen until the dues are cleared via our secure Razorpay gateway link.</p>
          </section>
        </div>
      </div>

      <Footer />
    </main>
  );
}
