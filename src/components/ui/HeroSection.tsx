"use client";

import { motion } from "framer-motion";
import { ArrowRight, Play } from "lucide-react";
import Link from "next/link";
import { HeroScene } from "../three/HeroScene";

export function HeroSection() {
  return (
    <section className="relative min-h-screen flex items-center pt-20 overflow-hidden">
      {/* Three.js Background/Right Scene */}
      <HeroScene />
      
      <div className="relative z-10 max-w-7xl mx-auto px-6 w-full grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        <motion.div
           initial={{ opacity: 0, x: -50 }}
           animate={{ opacity: 1, x: 0 }}
           transition={{ duration: 0.8, ease: "easeOut" }}
           className="max-w-2xl"
        >
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-electric-blue/10 border border-electric-blue/20 text-electric-blue text-sm font-medium mb-8"
          >
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-electric-blue opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-electric-blue"></span>
            </span>
            <span>Now powered by Animal AI 2.0</span>
          </motion.div>
          
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="text-6xl md:text-8xl font-bold tracking-tight mb-8 font-heading"
          >
            Explore your <br />
            <span className="text-gradient">startup idea</span> <br />
            before you build it.
          </motion.h1>
          
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="text-lg md:text-xl text-zinc-400 mb-10 max-w-xl leading-relaxed"
          >
            StartupSafari sends your idea through a panel of AI startup experts that analyze market opportunity, demand, competition, business model, and scalability.
          </motion.p>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.5 }}
            className="flex flex-col sm:flex-row items-center gap-6"
          >
            <Link
              href="/submit"
              className="w-full sm:w-auto flex items-center justify-center gap-2 bg-white text-black px-8 py-4 rounded-full font-bold text-lg hover:bg-zinc-200 transition-all hover:scale-105 shadow-[0_0_30px_rgba(255,255,255,0.3)]"
            >
              Start Idea Analysis
              <ArrowRight className="w-5 h-5" />
            </Link>
            
            <button className="flex items-center gap-2 text-white font-semibold hover:text-electric-blue transition-colors group">
              <div className="w-12 h-12 rounded-full border border-white/20 flex items-center justify-center group-hover:border-electric-blue/50 group-hover:bg-electric-blue/10 transition-all">
                <Play className="w-5 h-5 fill-current" />
              </div>
              Watch Demo
            </button>
          </motion.div>
        </motion.div>
        
        {/* The 3D scene visual is positioned absolutely in the background but it centers nicely on large screens */}
        <div className="hidden lg:block h-[600px]"></div>
      </div>
      
      {/* Decorative gradient blur */}
      <div className="absolute bottom-0 left-0 w-full h-64 bg-gradient-to-t from-brand-deep to-transparent z-0 pointer-events-none"></div>
    </section>
  );
}
