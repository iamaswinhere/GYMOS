"use client";
import React, { useState } from 'react';
import { Dumbbell, Menu, X } from 'lucide-react';
import JoinNowModal from './JoinNowModal';
import { AnimatePresence, motion } from 'framer-motion';

const Navbar = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const navLinks = [
    { name: 'Home', href: '#hero' },
    { name: 'About', href: '#about' },
    { name: 'Equipments', href: '#equipments' },
    { name: 'Contact', href: '#contact' },
  ];

  return (
    <>
      <nav className="fixed w-full z-50 px-6 py-4 flex justify-between items-center bg-black/50 backdrop-blur-xl border-b border-white/5 top-0">
        <div className="flex items-center gap-2">
          <Dumbbell className="text-primary w-8 h-8" />
          <span className="text-xl md:text-2xl font-black tracking-tighter text-white uppercase italic">GYM<span className="text-primary">OS</span></span>
        </div>

        {/* Desktop Links */}
        <div className="hidden md:flex gap-8 items-center font-bold">
          {navLinks.map((link) => (
            <a key={link.name} href={link.href} className="text-gray-400 hover:text-primary transition-all text-sm uppercase tracking-widest">{link.name}</a>
          ))}
          <a href="/member/login" className="px-4 py-2 text-gray-400 hover:text-white transition-all text-sm uppercase tracking-widest border border-white/10 rounded-xl">Member Login</a>
          <button onClick={() => setIsModalOpen(true)} className="btn-primary py-3 px-8 rounded-xl shadow-[0_0_20px_rgba(255,196,0,0.3)] hover:scale-105 transition-all text-xs uppercase tracking-widest">Join Now</button>
        </div>

        {/* Mobile Toggle */}
        <button 
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          className="md:hidden text-white p-2"
        >
          {isMenuOpen ? <X size={28} /> : <Menu size={28} />}
        </button>
      </nav>

      {/* Mobile Menu Overlay */}
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
                href="/member/login" 
                className="text-xl text-primary"
              >
                Member Login
              </a>
              <button 
                onClick={() => {
                  setIsMenuOpen(false);
                  setIsModalOpen(true);
                }}
                className="btn-primary py-5 rounded-2xl text-lg shadow-[0_0_30px_rgba(255,196,0,0.4)] mt-4"
              >
                Join GYMOS Elite
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <JoinNowModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </>
  );
};

export default Navbar;
