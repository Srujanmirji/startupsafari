"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { ArrowRight, Play } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { HeroScene } from "../three/HeroScene";
import { useAuth } from "@/context/AuthContext";
import { SignupModal } from "./SignupModal";
import { useRouter } from "next/navigation";

export function HeroSection() {
  const { scrollY } = useScroll();
  const yText = useTransform(scrollY, [0, 1000], [0, 200]);
  const opacityText = useTransform(scrollY, [0, 500], [1, 0]);
  
  const { user } = useAuth();
  const router = useRouter();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleStartAnalysis = () => {
    if (user) {
      router.push("/submit");
    } else {
      setIsModalOpen(true);
    }
  };
  return (
    <section className="relative min-h-screen flex items-center pt-24 lg:pt-20 overflow-hidden">
      {/* Three.js Background/Right Scene - Absolute on mobile, but moved for better spacing */}
      <HeroScene />
      
      <div className="relative z-10 max-w-7xl mx-auto px-6 w-full grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
        <motion.div
           style={{ y: yText, opacity: opacityText }}
           initial={{ opacity: 0, x: -50 }}
           animate={{ opacity: 1, x: 0 }}
           transition={{ duration: 0.8, ease: "easeOut" }}
           className="max-w-2xl text-center lg:text-left mx-auto lg:mx-0"
        >

          
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="text-4xl sm:text-6xl lg:text-8xl font-bold tracking-tight mb-8 font-heading leading-[1.1]"
          >
            Explore your <br />
            <span className="text-gradient">startup idea</span> <br />
            before you build it.
          </motion.h1>
          
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="text-base sm:text-lg lg:text-xl text-zinc-400 mb-10 max-w-xl mx-auto lg:mx-0 leading-relaxed"
          >
            StartupSafari sends your idea through a panel of AI startup experts that analyze market opportunity, demand, competition, business model, and scalability.
          </motion.p>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.5 }}
            className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 sm:gap-6"
          >
            <button
              onClick={handleStartAnalysis}
              className="w-full sm:w-auto flex items-center justify-center gap-2 bg-white text-black px-6 sm:px-8 py-3.5 sm:py-4 rounded-full font-bold text-base sm:text-lg hover:bg-zinc-200 transition-all hover:scale-105 shadow-[0_0_30px_rgba(255,255,255,0.3)]"
            >
              Analyze Idea
              <ArrowRight className="w-5 h-5" />
            </button>
            
            <button className="flex items-center gap-2 text-white font-semibold hover:text-electric-blue transition-colors group py-2">
              <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full border border-white/20 flex items-center justify-center group-hover:border-electric-blue/50 group-hover:bg-electric-blue/10 transition-all">
                <Play className="w-4 h-4 sm:w-5 sm:h-5 fill-current" />
              </div>
              Watch Demo
            </button>
          </motion.div>
        </motion.div>
        
        {/* Placeholder for spacing on large screens where 3D scene sits */}
        <div className="h-[300px] sm:h-[450px] lg:h-[600px] pointer-events-none"></div>
      </div>
      
      {/* Scroll Down Indicator */}
      <motion.div
        animate={{ y: [0, 10, 0] }}
        transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
        className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 z-20"
      >
        <span className="text-zinc-500 text-xs tracking-[0.2em] uppercase font-semibold">Scroll</span>
        <div className="w-[30px] h-[50px] rounded-full border-2 border-white/20 flex justify-center p-2 relative overflow-hidden backdrop-blur-sm">
          <motion.div
            animate={{ 
              y: [0, 16, 0],
              opacity: [0.5, 1, 0.5] 
            }}
            transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut" }}
            className="w-1 h-3 bg-violet-glow rounded-full"
          />
        </div>
      </motion.div>

      {/* Decorative gradient blur */}
      <div className="absolute bottom-0 left-0 w-full h-64 bg-gradient-to-t from-brand-deep to-transparent z-0 pointer-events-none"></div>
      
      <SignupModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </section>
  );
}
