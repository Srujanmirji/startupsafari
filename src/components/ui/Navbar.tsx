"use client";

import Link from "next/link";
import { Sparkles } from "lucide-react";

export function Navbar() {
  return (
    <nav className="fixed top-0 left-0 w-full z-50 bg-brand-deep/60 backdrop-blur-xl border-b border-white/5">
      <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 group">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-electric-blue to-violet-glow flex items-center justify-center text-white shadow-[0_0_15px_rgba(59,130,246,0.5)] group-hover:scale-105 transition-transform">
            <Sparkles className="w-5 h-5" />
          </div>
          <span className="text-xl font-bold font-heading text-white tracking-tight">StartupSafari</span>
        </Link>
        <div className="hidden md:flex items-center gap-8">
          <Link href="#how-it-works" className="text-sm font-medium text-zinc-300 hover:text-white transition-colors">How it Works</Link>
          <Link href="#experts" className="text-sm font-medium text-zinc-300 hover:text-white transition-colors">AI Experts</Link>
          <Link href="#demo" className="text-sm font-medium text-zinc-300 hover:text-white transition-colors">Live Demo</Link>
        </div>
        <div className="flex items-center gap-4">
          <Link href="/login" className="text-sm font-medium text-zinc-300 hover:text-white transition-colors">Log in</Link>
          <Link href="/submit" className="text-sm font-medium px-5 py-2.5 rounded-full bg-white text-black hover:bg-zinc-200 transition-colors shadow-[0_0_20px_rgba(255,255,255,0.2)]">
            Analyze Idea
          </Link>
        </div>
      </div>
    </nav>
  );
}
