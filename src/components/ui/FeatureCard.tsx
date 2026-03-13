"use client";

import { motion } from "framer-motion";
import { LucideIcon } from "lucide-react";

interface FeatureCardProps {
  step: number;
  title: string;
  description: string;
  icon: LucideIcon;
  delay?: number;
}

export function FeatureCard({ step, title, description, icon: Icon, delay = 0 }: FeatureCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay }}
      whileHover={{ y: -5 }}
      className="relative p-8 rounded-3xl bg-white/5 border border-white/10 backdrop-blur-md group"
    >
      <div className="absolute -top-4 -left-4 w-12 h-12 rounded-2xl bg-gradient-to-br from-electric-blue to-violet-glow flex items-center justify-center text-white font-bold text-xl shadow-lg shadow-electric-blue/20">
        {step}
      </div>
      <div className="mb-6 w-14 h-14 rounded-2xl bg-white/5 flex items-center justify-center text-electric-blue group-hover:scale-110 transition-transform duration-300">
        <Icon className="w-7 h-7" />
      </div>
      <h3 className="text-2xl font-bold mb-4 text-white font-heading tracking-tight">{title}</h3>
      <p className="text-zinc-400 leading-relaxed">{description}</p>
      <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-electric-blue to-violet-glow scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left rounded-b-3xl"></div>
    </motion.div>
  );
}
