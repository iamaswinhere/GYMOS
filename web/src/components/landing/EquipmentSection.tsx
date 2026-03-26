"use client";
import React from 'react';
import { motion } from 'framer-motion';

const EquipmentSection = () => {
    const equipments = [
        { name: "Pro Bench Press", category: "Strength", img: "/assets/bench_press.png" },
        { name: "Commercial Treadmill", category: "Cardio", img: "/assets/treadmill.png" },
        { name: "Olympic Squat Rack", category: "Power", img: "/assets/squat_rack.png" },
        { name: "Cable Crossover", category: "Utility", img: "/assets/cable_machine.png" }
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
                        <div className="aspect-square bg-[#1a1a1a] relative overflow-hidden">
                             <img 
                                src={eq.img} 
                                alt={eq.name} 
                                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" 
                             />
                             <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-0 group-hover:opacity-60 transition-opacity"></div>
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
