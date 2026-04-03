"use client";
import React, { useState } from 'react';
import { Menu, X } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const navLinks = [
    { name: 'Home', href: '#hero' },
    { name: 'About', href: '#about' },
    { name: 'Equipments', href: '#equipments' },
  ];

  const triggerHaptic = () => {
    if (typeof navigator !== 'undefined' && navigator.vibrate) {
      navigator.vibrate(50); // Light haptic tap
    }
  };

  return (
    <>
      <nav className="fixed w-full z-50 px-6 py-4 flex justify-between items-center bg-black/50 backdrop-blur-xl border-b border-white/5 top-0 transition-all">
        <div className="flex items-center gap-3">
          <img 
            src="/logo.png" 
            alt="GYMOS Logo" 
            className="w-10 h-10 object-contain rounded-lg shadow-[0_0_15px_rgba(255,196,0,0.2)]" 
          />
          <span className="text-xl md:text-2xl font-black tracking-tighter text-white uppercase italic">GYM<span className="text-primary">OS</span></span>
        </div>

        {/* Desktop Links */}
        <div className="hidden md:flex gap-8 items-center font-bold">
          {navLinks.map((link) => (
            <a key={link.name} href={link.href} className="text-gray-400 hover:text-primary transition-all text-sm uppercase tracking-widest hover:scale-105 active:scale-95 inline-block">{link.name}</a>
          ))}
          <a onClick={triggerHaptic} href="#contact" className="btn-primary py-3 px-8 rounded-xl shadow-[0_0_20px_rgba(255,196,0,0.3)] hover:scale-105 active:scale-95 transition-all text-xs uppercase tracking-widest text-center">Contact</a>
        </div>

        {/* Mobile Toggle */}
        <button 
          onClick={() => {
            triggerHaptic();
            setIsMenuOpen(!isMenuOpen);
          }}
          className="md:hidden text-white p-2 hover:scale-110 active:scale-90 transition-transform"
        >
          {isMenuOpen ? <X size={28} /> : <Menu size={28} />}
        </button>
      </nav>

      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed inset-0 z-40 bg-black pt-24 px-6 md:hidden"
          >
            <div className="flex flex-col gap-6 font-black uppercase tracking-widest">
              {navLinks.map((link) => (
                <a 
                  key={link.name} 
                  href={link.href} 
                  onClick={() => setIsMenuOpen(false)}
                  className="text-3xl text-white hover:text-primary transition-colors"
                >
                  {link.name}
                </a>
              ))}
              <div className="h-px bg-white/10 my-4" />
              <a 
                href="#contact" 
                onClick={() => setIsMenuOpen(false)}
                className="btn-primary py-5 rounded-2xl text-lg shadow-[0_0_30px_rgba(255,196,0,0.4)] mt-4 text-center"
              >
                Reach GYMOS
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Navbar;
