"use client";

import { motion } from "framer-motion";

interface PersonaCardProps {
  name: string;
  role: string;
  description: string;
  icon: string;
  color: string;
  delay?: number;
}

export function PersonaCard({ name, role, description, icon, color, delay = 0 }: PersonaCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay }}
      whileHover={{ y: -10 }}
      className="relative p-6 rounded-3xl bg-white/5 border border-white/10 backdrop-blur-md overflow-hidden group"
    >
      {/* Background Glow */}
      <div 
        className="absolute -top-24 -right-24 w-48 h-48 rounded-full blur-[80px] opacity-0 group-hover:opacity-40 transition-opacity duration-500"
        style={{ backgroundColor: color }}
      ></div>
      
      <div className="relative z-10">
        <div className="text-5xl mb-6 filter drop-shadow-[0_0_10px_rgba(255,255,255,0.3)] group-hover:scale-110 transition-transform duration-300">
          {icon}
        </div>
        <div className="flex items-center gap-2 mb-2">
          <h3 className="text-xl font-bold text-white font-heading">{name}</h3>
          <div 
            className="w-2 h-2 rounded-full shadow-[0_0_8px_currentColor]" 
            style={{ color, backgroundColor: color }}
          ></div>
        </div>
        <p className="text-sm font-semibold text-electric-blue uppercase tracking-wider mb-4">{role}</p>
        <p className="text-zinc-400 text-sm leading-relaxed">{description}</p>
      </div>
      
      {/* Bottom accent line */}
      <div 
        className="absolute bottom-0 left-0 w-full h-1 scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left"
        style={{ backgroundColor: color }}
      ></div>
    </motion.div>
  );
}
