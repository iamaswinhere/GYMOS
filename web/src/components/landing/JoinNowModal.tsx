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
    plan: 'monthly'
  });

  const plans = [
    { id: 'monthly', name: 'Elite Monthly', price: '₹2,999', features: ['Full Gym Access', '1 Trainer Session'] },
    { id: 'quarterly', name: 'Pro Quarterly', price: '₹7,999', features: ['Full Gym Access', '5 Trainer Sessions', 'Diet Plan'] },
    { id: 'yearly', name: 'Titan Yearly', price: '₹24,999', features: ['24/7 VIP Access', 'Personal Trainer', 'Nutritionist', 'Spa Access'] }
  ];

  const handleNext = () => setStep(step + 1);
  const handleBack = () => setStep(step - 1);

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
        className="w-full max-w-2xl bg-[#0D0D0D] border border-white/5 rounded-[32px] md:rounded-[40px] p-6 md:p-12 shadow-2xl relative overflow-hidden"
      >
        <button 
          onClick={onClose}
          className="absolute top-6 right-6 text-gray-500 hover:text-white transition-colors z-20"
        >
          <X size={24} />
        </button>

        <div className="p-6 md:p-12">
          <AnimatePresence mode="wait">
            {step === 1 && (
              <motion.div 
                key="step1"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-8"
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
                className="space-y-8"
              >
                <div>
                  <h2 className="text-3xl font-black text-white tracking-tighter uppercase">Select Your Tier</h2>
                  <p className="text-gray-500 font-medium">Choose the protocol that fits your goals.</p>
                </div>

                <div className="space-y-3">
                  {plans.map((plan) => (
                    <div 
                      key={plan.id}
                      onClick={() => setFormData({...formData, plan: plan.id})}
                      className={`p-6 rounded-3xl border transition-all cursor-pointer flex justify-between items-center ${formData.plan === plan.id ? 'bg-primary/20 border-primary/50' : 'bg-white/5 border-white/10 hover:border-white/20'}`}
                    >
                      <div>
                        <h4 className="text-white font-black uppercase tracking-tight">{plan.name}</h4>
                        <p className="text-primary font-bold text-sm">{plan.price}</p>
                      </div>
                      <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${formData.plan === plan.id ? 'border-primary bg-primary' : 'border-white/20'}`}>
                        {formData.plan === plan.id && <Check size={14} className="text-black stroke-[4]" />}
                      </div>
                    </div>
                  ))}
                </div>

                <div className="flex gap-4">
                  <button onClick={handleBack} className="flex-1 h-14 border border-white/10 text-white font-bold uppercase tracking-widest rounded-2xl hover:bg-white/5 transition-all">Back</button>
                  <button onClick={handleNext} className="flex-[2] h-14 bg-primary text-black font-black uppercase tracking-widest rounded-2xl hover:scale-[1.02] transition-all">Review Protocol</button>
                </div>
              </motion.div>
            )}

            {step === 3 && (
              <motion.div 
                key="step3"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center space-y-10"
              >
                <div className="w-24 h-24 bg-primary/20 rounded-[2.5rem] flex items-center justify-center mx-auto relative">
                  <Sparkles className="text-primary" size={48} />
                  <div className="absolute inset-0 bg-primary blur-[40px] opacity-20 animate-pulse"></div>
                </div>

                <div className="space-y-4">
                  <h2 className="text-4xl font-black text-white tracking-tighter uppercase">Protocol Ready</h2>
                  <p className="text-gray-400 font-medium px-8">We've reserved your spot, <span className="text-white font-black">{formData.name}</span>. Visit our front desk to complete the biometric enrollment.</p>
                </div>

                <div className="bg-white/5 border border-white/10 rounded-[32px] p-8 text-left space-y-4">
                  <div className="flex justify-between items-center pb-4 border-b border-white/5">
                    <span className="text-gray-500 font-bold uppercase text-xs tracking-widest">Selected Tier</span>
                    <span className="text-primary font-black uppercase tracking-tighter">{plans.find(p => p.id === formData.plan)?.name}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-500 font-bold uppercase text-xs tracking-widest">Reference ID</span>
                    <span className="text-white font-black tracking-tighter font-mono">#{Math.random().toString(36).substr(2, 8).toUpperCase()}</span>
                  </div>
                </div>

                <button 
                  onClick={onClose}
                  className="w-full h-16 bg-white text-black font-black uppercase tracking-widest rounded-2xl hover:scale-[1.02] transition-all"
                >
                  Acknowledge & Close
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
