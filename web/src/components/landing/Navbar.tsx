"use client";
import React from 'react';
import { Dumbbell } from 'lucide-react';
import JoinNowModal from './JoinNowModal';

const Navbar = () => {
  const [isModalOpen, setIsModalOpen] = React.useState(false);

  return (
    <>
      <nav className="fixed w-full z-50 px-6 py-4 flex justify-between items-center glass border-b border-white/5 top-0">
        <div className="flex items-center gap-2">
          <Dumbbell className="text-primary w-8 h-8" />
          <span className="text-2xl font-black tracking-tighter text-white">GYM<span className="text-primary">OS</span></span>
        </div>
        <div className="hidden md:flex gap-8 items-center font-medium">
          <a href="#hero" className="hover:text-primary transition-colors">Home</a>
          <a href="#about" className="hover:text-primary transition-colors">About</a>
          <a href="#equipments" className="hover:text-primary transition-colors">Equipments</a>
          <a href="#contact" className="hover:text-primary transition-colors">Contact</a>
          <a href="/member/login" className="hover:text-primary transition-colors font-bold text-gray-400">Member Login</a>
          <button onClick={() => setIsModalOpen(true)} className="btn-primary py-2 px-6">Join Now</button>
        </div>
      </nav>
      <JoinNowModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </>
  );
};

export default Navbar;
