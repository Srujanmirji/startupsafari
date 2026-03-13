"use client";

import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import React from "react";

interface PersonaCardProps {
  name: string;
  role: string;
  description: string;
  icon: string;
  color: string;
  delay?: number;
  index?: number;
}

export function PersonaCard({ name, role, description, icon, color, delay = 0, index = 0 }: PersonaCardProps) {
  const finalDelay = delay || index * 0.1;

  // 3D Tilt Logic
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const mouseXSpring = useSpring(x, { stiffness: 300, damping: 30 });
  const mouseYSpring = useSpring(y, { stiffness: 300, damping: 30 });

  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ["15deg", "-15deg"]);
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ["-15deg", "15deg"]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    
    const width = rect.width;
    const height = rect.height;
    
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;
    
    // Calculate percentage from center of card (-0.5 to 0.5)
    clearTimeout(leaveTimeout);
    x.set(mouseX / width - 0.5);
    y.set(mouseY / height - 0.5);
  };

  let leaveTimeout: NodeJS.Timeout;
  const handleMouseLeave = () => {
    leaveTimeout = setTimeout(() => {
      x.set(0);
      y.set(0);
    }, 100);
  };

  return (
    <div className="[perspective:1000px] w-full h-full">
      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 30 }}
        whileInView={{ opacity: 1, scale: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5, delay: finalDelay }}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        style={{
          rotateY,
          rotateX,
          transformStyle: "preserve-3d",
        }}
        className="relative p-6 rounded-3xl bg-white/5 border border-white/10 backdrop-blur-md group hover:bg-white/[0.08] transition-colors duration-300 flex flex-col h-full"
      >
        <div
          style={{
            transform: "translateZ(50px)",
            transformStyle: "preserve-3d",
          }}
          className="flex-grow flex flex-col"
        >
          {/* Background Glow */}
          <div 
            className="absolute -top-12 -right-12 w-32 h-32 rounded-full blur-[60px] opacity-0 group-hover:opacity-40 transition-opacity duration-500 pointer-events-none"
            style={{ backgroundColor: color, transform: "translateZ(-30px)" }}
          />
          
          <div className="relative z-10 pointer-events-none flex-grow">
            <div 
              className="text-5xl mb-6 filter drop-shadow-[0_0_10px_rgba(255,255,255,0.3)] inline-block transition-transform duration-300"
              style={{ transform: "translateZ(40px)" }}
            >
              <div className="group-hover:scale-110 transition-transform duration-300">
                {icon}
              </div>
            </div>
            <div className="flex items-center gap-2 mb-2" style={{ transform: "translateZ(30px)" }}>
              <h3 className="text-xl font-bold text-white font-heading">{name}</h3>
              <div 
                className="w-2 h-2 rounded-full shadow-[0_0_8px_currentColor]" 
                style={{ color, backgroundColor: color }}
              />
            </div>
            <p 
              className="text-sm font-semibold uppercase tracking-wider mb-4" 
              style={{ color, transform: "translateZ(20px)" }}
            >
              {role}
            </p>
            <p className="text-zinc-400 text-sm leading-relaxed" style={{ transform: "translateZ(10px)" }}>
              {description}
            </p>
          </div>
        </div>
        
        {/* Bottom accent line */}
        <div 
          className="absolute bottom-0 left-0 w-full h-1 scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left rounded-b-3xl"
          style={{ backgroundColor: color, transform: "translateZ(1px)" }}
        />
      </motion.div>
    </div>
  );
}
