"use client";

import { motion } from "framer-motion";
import { Navbar } from "@/components/ui/Navbar";
import { Sparkles, Mail, Lock, Github, Chrome } from "lucide-react";
import Link from "next/link";

export default function Login() {
  return (
    <div className="min-h-screen bg-[#05050f] text-white overflow-hidden relative">
      <Navbar />
      
      {/* Background Decor */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-electric-blue/10 blur-[120px] rounded-full -translate-y-1/2 translate-x-1/2"></div>
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-violet-glow/10 blur-[120px] rounded-full translate-y-1/2 -translate-x-1/2"></div>

      <main className="pt-32 pb-20 px-6 flex items-center justify-center relative z-10">
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="w-full max-w-md p-10 rounded-[2.5rem] bg-white/5 border border-white/10 backdrop-blur-xl shadow-2xl"
        >
          <div className="text-center mb-10">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-electric-blue to-violet-glow flex items-center justify-center text-white shadow-lg mx-auto mb-6">
                <Sparkles className="w-8 h-8" />
            </div>
            <h1 className="text-3xl font-bold font-heading mb-2">Welcome Back</h1>
            <p className="text-zinc-500">Sign in to continue your safari.</p>
          </div>

          <div className="space-y-4 mb-8">
            <button className="w-full flex items-center justify-center gap-3 py-3 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition-colors font-semibold">
                <Chrome className="w-5 h-5" />
                Continue with Google
            </button>
            <button className="w-full flex items-center justify-center gap-3 py-3 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition-colors font-semibold">
                <Github className="w-5 h-5" />
                Continue with GitHub
            </button>
          </div>

          <div className="relative mb-8 text-center">
            <div className="absolute top-1/2 left-0 w-full h-[1px] bg-white/5 -translate-y-1/2"></div>
            <span className="relative bg-[#0b0b1a] px-4 text-xs font-bold text-zinc-600 uppercase tracking-widest">Or email</span>
          </div>

          <form className="space-y-6">
            <div className="space-y-2">
                <label className="text-xs font-bold text-zinc-500 uppercase tracking-widest ml-1">Email Address</label>
                <div className="relative">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
                    <input 
                        type="email" 
                        placeholder="name@email.com" 
                        className="w-full bg-white/5 border border-white/10 rounded-xl pl-12 pr-4 py-3 text-white focus:outline-none focus:border-electric-blue/50 transition-colors"
                    />
                </div>
            </div>
            <div className="space-y-2">
                <label className="text-xs font-bold text-zinc-500 uppercase tracking-widest ml-1">Password</label>
                <div className="relative">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
                    <input 
                        type="password" 
                        placeholder="••••••••" 
                        className="w-full bg-white/5 border border-white/10 rounded-xl pl-12 pr-4 py-3 text-white focus:outline-none focus:border-electric-blue/50 transition-colors"
                    />
                </div>
            </div>
            
            <Link 
                href="/dashboard"
                className="block w-full text-center bg-white text-black py-4 rounded-xl font-bold hover:bg-zinc-200 transition-all hover:scale-[1.02] shadow-xl shadow-white/10"
            >
                Sign In
            </Link>
          </form>

          <p className="mt-8 text-center text-sm text-zinc-500">
            Don't have an account?{" "}
            <Link href="/signup" className="text-white hover:text-electric-blue transition-colors font-bold">Sign up</Link>
          </p>
        </motion.div>
      </main>
    </div>
  );
}
