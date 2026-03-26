"use client";
import React from 'react';
import { Facebook, Instagram, Twitter, MessageSquare, Phone, Dumbbell } from 'lucide-react';

const Footer = () => {
    return (
        <footer className="bg-black border-t border-white/5 pt-20 pb-10">
            <div className="container mx-auto px-6 grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
                <div className="md:col-span-2">
                    <div className="flex items-center gap-2 mb-6">
                        <Dumbbell className="text-primary w-8 h-8" />
                        <span className="text-2xl font-black tracking-tighter text-white">GYM<span className="text-primary">OS</span></span>
                    </div>
                    <p className="text-gray-500 max-w-sm leading-relaxed mb-8">
                        The ultimate fitness destination. We merge technology with hardcore training to deliver results that speak for themselves. Join the community today.
                    </p>
                    <div className="flex gap-4">
                        <a href="#" className="w-10 h-10 glass rounded-full flex items-center justify-center hover:bg-primary hover:text-black transition-all"><Facebook size={20} /></a>
                        <a href="#" className="w-10 h-10 glass rounded-full flex items-center justify-center hover:bg-primary hover:text-black transition-all"><Instagram size={20} /></a>
                        <a href="#" className="w-10 h-10 glass rounded-full flex items-center justify-center hover:bg-primary hover:text-black transition-all"><Twitter size={20} /></a>
                    </div>
                </div>

                <div>
                    <h4 className="text-white font-bold mb-6">Quick Links</h4>
                    <ul className="space-y-4 text-gray-500">
                        <li><a href="#hero" className="hover:text-primary transition-colors">Home</a></li>
                        <li><a href="#about" className="hover:text-primary transition-colors">About Us</a></li>
                        <li><a href="#equipments" className="hover:text-primary transition-colors">Equipments</a></li>
                        <li><a href="#contact" className="hover:text-primary transition-colors">Contact</a></li>
                    </ul>
                </div>

                <div>
                    <h4 className="text-white font-bold mb-6">Contact Us</h4>
                    <ul className="space-y-4">
                        <li className="flex gap-3 text-gray-500">
                             <Phone className="text-primary" size={18} />
                             <span>+1 (234) 567-890</span>
                        </li>
                        <li className="flex gap-3 text-gray-500">
                             <MessageSquare className="text-primary" size={18} />
                             <a href="https://wa.me/1234567890" target="_blank" className="hover:text-primary underline">WhatsApp Support</a>
                        </li>
                    </ul>
                    <div className="mt-8">
                         <button className="bg-[#212121] text-white py-3 px-6 rounded-xl border border-white/5 hover:border-primary/50 transition-all flex items-center gap-2">
                            <Phone size={18} /> Call Specialist
                         </button>
                    </div>
                </div>
            </div>
            
            <div className="container mx-auto px-6 border-t border-white/5 pt-10 text-center text-gray-600 text-sm">
                <p>&copy; {new Date().getFullYear()} GYMOS. All rights reserved. Designed for elite athletes.</p>
            </div>
        </footer>
    );
};

export default Footer;
