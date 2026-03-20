"use client";
import React, { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';

const Hero = () => {
  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"]
  });

  const yText = useTransform(scrollYProgress, [0, 1], [0, 200]);
  const yImage = useTransform(scrollYProgress, [0, 1], [0, -150]);
  const opacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);
  const scale = useTransform(scrollYProgress, [0, 1], [1, 0.8]);

  return (
    <section id="hero" ref={containerRef} className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20">
      {/* Parallax Background Decor */}
      <motion.div 
        style={{ y: yText, opacity }}
        className="absolute top-1/4 -left-20 w-80 h-80 bg-primary/20 rounded-full blur-[120px] animate-pulse"
      ></motion.div>
      <motion.div 
        style={{ y: yImage, opacity }}
        className="absolute bottom-1/4 -right-20 w-96 h-96 bg-primary/10 rounded-full blur-[150px]"
      ></motion.div>
      
      <div className="container mx-auto px-6 grid md:grid-cols-2 gap-12 items-center relative z-10">
        <motion.div 
          style={{ y: yText, opacity, scale }}
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
        >
          <h1 className="text-6xl md:text-8xl font-black mb-6 leading-none tracking-tighter">
            UNLEASH YOUR <br />
            <span className="text-primary text-glow italic">INNER BEAST</span>
          </h1>
          <p className="text-xl text-gray-400 mb-8 max-w-lg leading-relaxed">
            Experience the next generation of fitness. GYMOS provides the ultimate environment, premium machines, and professional guidance to transform your life.
          </p>
          <div className="flex gap-4">
            <button 
              onClick={() => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })}
              className="btn-primary"
            >
              Get Started
            </button>
            <button 
              onClick={() => document.getElementById('equipments')?.scrollIntoView({ behavior: 'smooth' })}
              className="px-8 py-3 rounded-full border border-white/20 hover:bg-white/5 transition-all text-white font-bold"
            >
              Explore Gym
            </button>
          </div>
        </motion.div>

        <motion.div 
          style={{ y: yImage, scale }}
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="relative"
        >
          <div className="relative z-10 rounded-3xl overflow-hidden glass-card p-4">
             <div className="aspect-[4/5] bg-[#212121] rounded-2xl flex items-center justify-center border border-white/5">
                <span className="text-white/20 text-8xl font-black uppercase rotate-90">STRENGTH</span>
             </div>
          </div>
          <div className="absolute -inset-4 border border-primary/20 rounded-[40px] -z-10 animate-spin-slow"></div>
        </motion.div>
      </div>
    </section>
  );
};

export default Hero;
