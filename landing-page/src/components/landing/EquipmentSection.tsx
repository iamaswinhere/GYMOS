"use client";
import React from 'react';
import { motion } from 'framer-motion';

const EquipmentSection = () => {
    const equipments = [
        { name: "Pro Bench Press", category: "Strength", img: "bench" },
        { name: "Commercial Treadmill", category: "Cardio", img: "treadmill" },
        { name: "Olympic Squat Rack", category: "Power", img: "squat" },
        { name: "Cable Crossover", category: "Utility", img: "cable" }
    ];

    return (
        <section id="equipments" className="container mx-auto px-6 py-20">
            <div className="flex flex-col items-center mb-16">
                <span className="text-primary font-bold tracking-widest uppercase mb-2">The Arsenal</span>
                <h2 className="text-5xl font-black text-white">ELITE EQUIPMENT</h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {equipments.map((eq, idx) => (
                    <motion.div 
                        key={idx}
                        whileHover={{ y: -10 }}
                        className="glass-card group overflow-hidden"
                    >
                        <div className="aspect-square bg-[#1a1a1a] relative flex items-center justify-center p-8">
                             {/* Placeholder Icon */}
                             <div className="w-full h-full border-2 border-dashed border-white/5 rounded-2xl flex items-center justify-center group-hover:border-primary/20 transition-colors">
                                <span className="text-white/10 font-bold text-4xl group-hover:text-primary/20 transition-colors uppercase -rotate-12">{eq.category}</span>
                             </div>
                        </div>
                        <div className="p-6">
                            <h3 className="text-xl font-bold text-white mb-1">{eq.name}</h3>
                            <p className="text-primary text-sm font-medium">{eq.category} Excellence</p>
                        </div>
                    </motion.div>
                ))}
            </div>
        </section>
    );
};

export default EquipmentSection;
