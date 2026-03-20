"use client";
import React from 'react';
import { Dumbbell } from 'lucide-react';

const Navbar = () => {
  return (
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
        <button className="btn-primary py-2 px-6">Join Now</button>
      </div>
    </nav>
  );
};

export default Navbar;
