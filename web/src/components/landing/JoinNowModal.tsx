"use client";
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Check, ArrowRight, User, Phone, CreditCard, Sparkles } from 'lucide-react';

interface JoinNowModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const JoinNowModal = ({ isOpen, onClose }: JoinNowModalProps) => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    name: '',
    mobile: '',
    plan: 'Monthly GYM',
    hasPT: false
  });

  const plans = [
    { id: 'Monthly GYM', name: 'Regular Protocol', price: '₹1,000', features: ['Full Gym Access', 'Strength Training'] },
    { id: 'Student', name: 'Student Protocol', price: '₹899', features: ['Valid Student ID Required', 'Full Gym Access'] }
  ];

  const handleNext = () => setStep(step + 1);
  const handleBack = () => setStep(step - 1);

  const handleSubmit = async () => {
    try {
      const BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001/api';
      const response = await fetch(`${BASE_URL}/leads/add`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.name,
          phone: formData.mobile,
          plan: formData.plan,
          hasPT: formData.hasPT
        })
      });

      if (response.ok) {
        // WhatsApp Notification to Admin
        const adminNumber = '919567950284';
        const message = encodeURIComponent(
          `🚀 *GYMOS NEW LEAD ALERT!*\n\n` +
          `👤 *Name:* ${formData.name}\n` +
          `📱 *Phone:* ${formData.mobile}\n` +
          `🏋️ *Plan:* ${formData.plan}\n` +
          `⚡ *PT:* ${formData.hasPT ? 'Yes (+₹2000)' : 'No'}\n\n` +
          `_Customer waiting for enrollment confirmation._`
        );
        window.open(`https://wa.me/${adminNumber}?text=${message}`, '_blank');
        handleNext();
      }
    } catch (error) {
       console.error("Lead submission failed", error);
       alert("Submission failed. Please try again.");
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="absolute inset-0 bg-black/80 backdrop-blur-xl"
      />
      
      <motion.div 
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.9, y: 20 }}
        className="w-full max-w-2xl bg-[#0D0D0D] border border-white/5 rounded-[32px] md:rounded-[40px] p-4 md:p-10 shadow-2xl relative overflow-hidden"
      >
        <button 
          onClick={onClose}
          className="absolute top-6 right-6 text-gray-500 hover:text-white transition-colors z-20"
        >
          <X size={24} />
        </button>

        <div className="p-4 md:p-8">
          <AnimatePresence mode="wait">
            {step === 1 && (
              <motion.div 
                key="step1"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-6 md:space-y-8"
              >
                <div>
                  <div className="w-12 h-12 bg-primary/20 rounded-2xl flex items-center justify-center mb-6">
                    <User className="text-primary" size={24} />
                  </div>
                  <h2 className="text-3xl md:text-4xl font-black text-white tracking-tighter uppercase italic">Info <span className="text-primary italic">Protocol</span></h2>
                  <p className="text-gray-500 font-medium text-sm">Start your journey to elite fitness today.</p>
                </div>

                <div className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-2">Full Name</label>
                    <input 
                      type="text" 
                      placeholder="John Doe"
                      value={formData.name}
                      onChange={(e) => setFormData({...formData, name: e.target.value})}
                      className="w-full bg-white/5 border border-white/10 rounded-2xl h-16 px-6 text-white font-bold focus:border-primary/50 outline-none transition-all"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-2">Mobile Number</label>
                    <div className="flex gap-4">
                       <span className="bg-white/5 border border-white/10 rounded-2xl h-16 px-6 flex items-center text-primary font-black">+91</span>
                       <input 
                        type="tel" 
                        placeholder="99999 99999"
                        value={formData.mobile}
                        onChange={(e) => setFormData({...formData, mobile: e.target.value.replace(/\D/g, '').slice(0, 10)})}
                        className="flex-1 bg-white/5 border border-white/10 rounded-2xl h-16 px-6 text-white font-bold focus:border-primary/50 outline-none transition-all"
                      />
                    </div>
                  </div>
                </div>

                <button 
                  disabled={!formData.name || formData.mobile.length < 10}
                  onClick={handleNext}
                  className="w-full h-16 bg-primary text-black font-black uppercase tracking-widest rounded-2xl flex items-center justify-center gap-3 hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50"
                >
                  Choose Plan <ArrowRight size={20} strokeWidth={3} />
                </button>
              </motion.div>
            )}

            {step === 2 && (
              <motion.div 
                key="step2"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-6 md:space-y-8"
              >
                <div>
                  <h2 className="text-3xl font-black text-white tracking-tighter uppercase">Select Your Tier</h2>
                  <p className="text-gray-500 font-medium text-sm">Choose the protocol that fits your life.</p>
                </div>

                <div className="space-y-3">
                  {plans.map((plan) => (
                    <div 
                      key={plan.id}
                      onClick={() => setFormData({...formData, plan: plan.id})}
                      className={`p-5 rounded-3xl border transition-all cursor-pointer flex justify-between items-center ${formData.plan === plan.id ? 'bg-primary/20 border-primary/50' : 'bg-white/5 border-white/10 hover:border-white/20'}`}
                    >
                      <div className="flex-1">
                        <h4 className="text-white font-black uppercase tracking-tight text-sm md:text-base">{plan.name}</h4>
                        <p className="text-primary font-bold text-xs">{plan.price}</p>
                      </div>
                      <div className={`w-5 h-5 md:w-6 md:h-6 rounded-full border-2 flex items-center justify-center ${formData.plan === plan.id ? 'border-primary bg-primary' : 'border-white/20'}`}>
                        {formData.plan === plan.id && <Check size={14} className="text-black stroke-[4]" />}
                      </div>
                    </div>
                  ))}
                </div>

                {/* PT Support Toggle */}
                <div 
                  onClick={() => setFormData({...formData, hasPT: !formData.hasPT})}
                  className={`p-6 rounded-[32px] border transition-all cursor-pointer flex justify-between items-center ${formData.hasPT ? 'bg-primary/10 border-primary/30' : 'bg-white/5 border-white/5 hover:border-white/10'}`}
                >
                    <div className="flex items-center gap-4">
                        <div className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-colors ${formData.hasPT ? 'bg-primary text-black' : 'bg-white/5 text-gray-500'}`}>
                            <Sparkles size={20} />
                        </div>
                        <div>
                            <h4 className="text-white font-black uppercase tracking-tight text-sm">Personal Trainer</h4>
                            <p className="text-gray-500 font-bold text-[10px] uppercase tracking-wider">+ ₹2,000 / Month</p>
                        </div>
                    </div>
                    <div className={`w-12 h-6 rounded-full relative transition-colors ${formData.hasPT ? 'bg-primary' : 'bg-white/10'}`}>
                        <div className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-all ${formData.hasPT ? 'left-7' : 'left-1'}`}></div>
                    </div>
                </div>

                <div className="flex gap-4">
                  <button onClick={handleBack} className="flex-1 h-16 border border-white/10 text-white font-bold uppercase tracking-widest rounded-2xl hover:bg-white/5 transition-all text-sm">Back</button>
                  <button onClick={handleSubmit} className="flex-[2] h-16 bg-primary text-black font-black uppercase tracking-widest rounded-2xl hover:scale-[1.02] transition-all shadow-[0_0_30px_rgba(255,196,0,0.2)] text-sm">Commit Protocol</button>
                </div>
              </motion.div>
            )}

            {step === 3 && (
              <motion.div 
                key="step3"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center space-y-10 py-6"
              >
                <div className="w-24 h-24 bg-primary/20 rounded-[2.5rem] flex items-center justify-center mx-auto relative">
                  <Check className="text-primary" size={48} strokeWidth={4} />
                  <div className="absolute inset-0 bg-primary blur-[40px] opacity-20 animate-pulse"></div>
                </div>

                <div className="space-y-4">
                  <h2 className="text-4xl font-black text-white tracking-tighter uppercase leading-none">Protocol <span className="text-primary italic">Saved</span></h2>
                  <p className="text-gray-400 font-medium px-4 text-sm md:text-base leading-relaxed">Admin notified, <span className="text-white font-black italic">{formData.name}</span>. Check your WhatsApp for the final confirmation link.</p>
                </div>

                <div className="bg-white/5 border border-white/10 rounded-[40px] p-8 text-left space-y-4 relative overflow-hidden group">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full -mr-16 -mt-16 blur-2xl group-hover:bg-primary/10 transition-colors"></div>
                  <div className="flex justify-between items-center pb-4 border-b border-white/5">
                    <span className="text-gray-500 font-bold uppercase text-[10px] tracking-widest">Selected Protocol</span>
                    <span className="text-primary font-black uppercase tracking-tighter">{plans.find(p => p.id === formData.plan)?.name}{formData.hasPT ? ' + PT' : ''}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-500 font-bold uppercase text-[10px] tracking-widest">Lead Hash</span>
                    <span className="text-white font-black tracking-tighter font-mono">#{Math.random().toString(36).substr(2, 6).toUpperCase()}</span>
                  </div>
                </div>

                <button 
                  onClick={onClose}
                  className="w-full h-16 bg-white text-black font-black uppercase tracking-widest rounded-3xl hover:scale-[1.02] transition-all shadow-xl"
                >
                  Return to Matrix
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </div>
  );
};

export default JoinNowModal;
