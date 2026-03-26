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
    <section id="hero" ref={containerRef} className="relative min-h-screen flex items-center justify-center overflow-hidden pt-32 pb-20">
      {/* Parallax Background Decor */}
      <motion.div 
        style={{ y: yText, opacity }}
        className="absolute top-1/4 -left-20 w-40 md:w-80 h-40 md:h-80 bg-primary/20 rounded-full blur-[80px] md:blur-[120px] animate-pulse"
      ></motion.div>
      <motion.div 
        style={{ y: yImage, opacity }}
        className="absolute bottom-1/4 -right-20 w-60 md:w-96 h-60 md:h-96 bg-primary/10 rounded-full blur-[100px] md:blur-[150px]"
      ></motion.div>
      
      <div className="container mx-auto px-6 grid lg:grid-cols-2 gap-12 lg:gap-20 items-center relative z-10">
        <motion.div 
          style={{ y: yText, opacity, scale }}
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center lg:text-left"
        >
          <h1 className="text-[12vw] md:text-7xl lg:text-8xl font-black mb-6 leading-none tracking-tighter uppercase italic">
            UNLEASH <br className="hidden md:block" />
            YOUR <br />
            <span className="text-primary text-glow">INNER BEAST</span>
          </h1>
          <p className="text-lg md:text-xl text-gray-400 mb-8 max-w-lg mx-auto lg:mx-0 leading-relaxed font-medium">
            Experience the next generation of fitness. GYMOS provides the ultimate environment, premium machines, and professional guidance to transform your life.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
            <button 
              onClick={() => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })}
              className="btn-primary py-4 px-10 rounded-2xl text-xs uppercase tracking-[0.2em] shadow-[0_10px_40px_rgba(255,196,0,0.3)]"
            >
              Get Started
            </button>
            <button 
              onClick={() => document.getElementById('equipments')?.scrollIntoView({ behavior: 'smooth' })}
              className="px-10 py-4 rounded-2xl border border-white/10 hover:bg-white/5 transition-all text-white font-bold text-xs uppercase tracking-[0.2em]"
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
          className="relative mt-12 lg:mt-0"
        >
          <div className="relative z-10 rounded-[40px] md:rounded-[60px] overflow-hidden glass-card p-2 md:p-3 shadow-2xl border-white/10 max-w-md mx-auto">
             <div className="aspect-[4/5] rounded-[32px] md:rounded-[50px] overflow-hidden border border-white/5 relative">
                <img 
                  src="/assets/hero_athlete.png" 
                  alt="Elite Training" 
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-60"></div>
                <div className="absolute bottom-6 md:bottom-10 left-6 md:left-10">
                   <p className="text-primary font-black text-[10px] tracking-[0.4em] uppercase mb-2">Elite Protocol</p>
                   <h3 className="text-white text-2xl md:text-4xl font-black tracking-tighter uppercase">Titan <span className="text-primary italic">Mode</span></h3>
                </div>
             </div>
          </div>
          <div className="absolute -inset-4 border border-primary/20 rounded-[40px] md:rounded-[60px] -z-10 animate-spin-slow opacity-30"></div>
        </motion.div>
      </div>
    </section>
  );
};

export default Hero;
