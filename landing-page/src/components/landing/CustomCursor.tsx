"use client";
import React, { useEffect, useState } from 'react';
import { motion, useSpring } from 'framer-motion';

const CustomCursor = () => {
    const [isPointer, setIsPointer] = useState(false);
    
    const mouseX = useSpring(0, { stiffness: 500, damping: 28 });
    const mouseY = useSpring(0, { stiffness: 500, damping: 28 });

    useEffect(() => {
        const handleMouseMove = (e: MouseEvent) => {
            mouseX.set(e.clientX);
            mouseY.set(e.clientY);

            const target = e.target as HTMLElement;
            setIsPointer(window.getComputedStyle(target).cursor === 'pointer');
        };

        window.addEventListener('mousemove', handleMouseMove);
        return () => window.removeEventListener('mousemove', handleMouseMove);
    }, [mouseX, mouseY]);

    return (
        <>
            {/* Main Dot */}
            <motion.div
                className="fixed top-0 left-0 w-3 h-3 bg-primary rounded-full pointer-events-none z-[9999] mix-blend-difference"
                style={{ x: mouseX, y: mouseY, translateX: '-50%', translateY: '-50%' }}
            />
            
            {/* Outer Ring */}
            <motion.div
                className="fixed top-0 left-0 w-10 h-10 border-2 border-primary rounded-full pointer-events-none z-[9998]"
                style={{ 
                    x: mouseX, 
                    y: mouseY, 
                    translateX: '-50%', 
                    translateY: '-50%',
                }}
                animate={{
                    scale: isPointer ? 1.5 : 1,
                    backgroundColor: isPointer ? 'rgba(255, 196, 0, 0.1)' : 'transparent',
                }}
                transition={{ type: 'spring', stiffness: 250, damping: 20 }}
            />
        </>
    );
};

export default CustomCursor;
