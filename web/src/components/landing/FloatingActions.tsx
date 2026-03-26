"use client";
import React from 'react';
import { motion } from 'framer-motion';
import { MessageCircle, Phone } from 'lucide-react';

const FloatingActions = () => {
  const phoneNumber = "8921809791";

  const iconAnimation = {
    initial: { scale: 0, opacity: 0 },
    animate: { scale: 1, opacity: 1 },
    hover: { 
      scale: 1.1,
      rotate: [0, -10, 10, -10, 0],
      transition: { duration: 0.5 }
    }
  };

  return (
    <div className="fixed top-24 left-6 z-[60] flex flex-col gap-4">
      <motion.a
        href={`https://wa.me/91${phoneNumber}`}
        target="_blank"
        rel="noopener noreferrer"
        variants={iconAnimation}
        initial="initial"
        animate="animate"
        whileHover="hover"
        className="w-14 h-14 bg-[#25D366] rounded-full flex items-center justify-center shadow-[0_0_20px_rgba(37,211,102,0.4)] border border-white/10 cursor-pointer"
        title="Chat on WhatsApp"
      >
        <MessageCircle color="white" fill="white" size={30} />
      </motion.a>

      <motion.a
        href={`tel:+91${phoneNumber}`}
        variants={iconAnimation}
        initial="initial"
        animate="animate"
        whileHover="hover"
        className="w-14 h-14 bg-primary rounded-full flex items-center justify-center shadow-[0_0_20px_rgba(255,196,0,0.4)] border border-white/10 cursor-pointer"
        title="Call Us"
      >
        <Phone color="black" fill="black" size={28} />
      </motion.a>
    </div>
  );
};

export default FloatingActions;
