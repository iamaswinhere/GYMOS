"use client";
import React from 'react';
import { Check, Star, Zap, Crown } from 'lucide-react';

const pricingPlans = [
  {
    name: "STUDENT PASS",
    price: "800",
    icon: <Zap className="text-primary mb-4" size={32} />,
    popular: false,
    features: [
      "Access to all standard equipment",
      "Free group classes",
      "Locker access",
      "Valid Student ID required"
    ]
  },
  {
    name: "MONTHLY GYM",
    price: "1,000",
    icon: <Star className="text-primary mb-4" size={32} />,
    popular: true,
    features: [
      "24/7 Premium facility access",
      "Advanced tracking equipment",
      "Monthly body composition analysis",
      "Exclusive community events"
    ]
  },
  {
    name: "PERSONAL TRAINING",
    price: "2,000",
    icon: <Crown className="text-primary mb-4" size={32} />,
    popular: false,
    features: [
      "1-on-1 Dedicated Coach",
      "Customized hyper-targeted workout plan",
      "Personalized nutrition & diet guide",
      "Full premium facility access"
    ]
  }
];

const PricingSection = () => {
  return (
    <section id="pricing" className="container mx-auto px-6 py-20">
      <div className="text-center mb-16">
        <h2 className="text-5xl font-black mb-4 uppercase tracking-tight">MEMBERSHIP <span className="text-primary">PLANS</span></h2>
        <p className="text-gray-400 max-w-xl mx-auto">No hidden fees, no complicated contracts. Just transparent pricing designed for your fitness journey.</p>
      </div>

      <div className="grid md:grid-cols-3 gap-8 items-center">
        {pricingPlans.map((plan, index) => (
          <div 
            key={plan.name} 
            className={`glass-card relative p-8 md:p-10 transition-transform hover:-translate-y-2 ${
              plan.popular 
                ? 'bg-gradient-to-br from-[#2a2a2a] to-black border-primary scale-105 z-10 shadow-[0_0_30px_rgba(255,196,0,0.15)]' 
                : 'bg-gradient-to-br from-[#1a1a1a] to-black border-white/5'
            }`}
          >
            {plan.popular && (
              <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-primary text-black font-black text-xs px-4 py-1.5 rounded-full tracking-wider">
                MOST POPULAR
              </div>
            )}
            
            <div className="flex flex-col items-center text-center border-b border-white/10 pb-8 mb-8">
              {plan.icon}
              <h3 className="text-xl font-bold text-white mb-2 tracking-wide">{plan.name}</h3>
              <div className="flex items-start justify-center gap-1">
                <span className="text-gray-400 font-bold mt-2">INR ₹</span>
                <span className="text-5xl font-black text-primary tracking-tighter">{plan.price}</span>
              </div>
              <span className="text-sm text-gray-500 mt-1">per month</span>
            </div>

            <ul className="space-y-4 mb-8">
              {plan.features.map((feature, i) => (
                <li key={i} className="flex items-center gap-3 text-gray-300">
                  <div className="w-5 h-5 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0">
                    <Check size={12} className="text-primary" />
                  </div>
                  <span className="text-sm">{feature}</span>
                </li>
              ))}
            </ul>

            <button 
              className={`w-full py-4 rounded-xl font-black uppercase tracking-wider transition-all flex items-center justify-center gap-2 ${
                plan.popular 
                  ? 'bg-primary text-black hover:bg-primary/90' 
                  : 'bg-[#212121] text-white hover:text-primary border border-white/10 hover:border-primary/50'
              }`}
            >
              Join Now
            </button>
          </div>
        ))}
      </div>
    </section>
  );
};

export default PricingSection;
