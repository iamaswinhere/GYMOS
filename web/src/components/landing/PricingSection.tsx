"use client";
import React from 'react';
import { Check, Star, Zap, Crown } from 'lucide-react';

const pricingPlans = [
  {
    name: "REGULAR MONTHLY",
    price: "999",
    icon: <Star className="text-primary mb-4" size={32} />,
    popular: false,
    billing: "per month",
    features: [
      "24/7 Premium facility access",
      "Monthly body composition analysis"
    ]
  },
  {
    name: "QUARTERLY PASS",
    price: "2,500",
    icon: <Star className="text-primary mb-4" size={32} />,
    popular: true,
    billing: "every 3 months",
    features: [
      "Save ₹497 instantly",
      "Advanced tracking equipment"
    ]
  },
  {
    name: "HALF-YEARLY",
    price: "5,000",
    icon: <Star className="text-primary mb-4" size={32} />,
    popular: false,
    billing: "every 6 months",
    features: [
      "Save ₹994 instantly",
      "1 free dietary consultation"
    ]
  }
];

const PricingSection = () => {
  const handleJoinClick = (planName: string) => {
    // Check if device supports haptics
    if (typeof navigator !== 'undefined' && navigator.vibrate) {
      navigator.vibrate(50);
    }
    
    // Dispatch custom event for cross-component communication
    if (typeof window !== 'undefined') {
        window.dispatchEvent(new CustomEvent('gymos-plan-selected', { detail: planName }));
    }

    // Scroll to contact form
    const contactSection = document.getElementById('contact');
    if (contactSection) {
      contactSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section id="pricing" className="container mx-auto px-6 py-20">
      <div className="text-center mb-16">
        <h2 className="text-5xl font-black mb-4 uppercase tracking-tight">MEMBERSHIP <span className="text-primary">PLANS</span></h2>
        <p className="text-gray-400 max-w-xl mx-auto">No hidden fees, no complicated contracts. Just transparent pricing designed for your fitness journey.</p>
      </div>

      <div className="grid md:grid-cols-3 gap-8 items-stretch">
        {pricingPlans.map((plan, index) => (
          <div 
            key={plan.name} 
            className={`glass-card relative p-8 md:p-10 transition-transform hover:-translate-y-2 flex flex-col ${
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
              <h3 className="text-xl font-bold text-white mb-2 tracking-wide whitespace-nowrap">{plan.name}</h3>
              <div className="flex items-start justify-center gap-1">
                <span className="text-gray-400 font-bold mt-2">INR ₹</span>
                <span className="text-5xl font-black text-primary tracking-tighter">{plan.price}</span>
              </div>
              <span className="text-sm text-gray-500 mt-1">{plan.billing}</span>
            </div>

            <ul className="space-y-4 mb-8 flex-1">
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
              onClick={() => handleJoinClick(plan.name)}
              className={`w-full py-4 rounded-xl font-black uppercase tracking-wider transition-all flex items-center justify-center gap-2 mt-auto ${
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
