"use client";

import { useState } from "react";
import Link from "next/link";
import { Sparkles, Menu, X, LogOut, User as UserIcon } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { SignupModal } from "./SignupModal";

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { user, signOut } = useAuth();

  const handleAnalyzeClick = (e: React.MouseEvent) => {
    if (!user) {
      e.preventDefault();
      setIsModalOpen(true);
    }
  };

  return (
    <>
      <nav className="fixed top-0 left-0 w-full z-50 bg-brand-deep/60 backdrop-blur-xl border-b border-white/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-20 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 group">
          <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-br from-electric-blue to-violet-glow flex items-center justify-center text-white shadow-[0_0_15px_rgba(59,130,246,0.5)] group-hover:scale-105 transition-transform">
            <Sparkles className="w-4 h-4 sm:w-5 sm:h-5" />
          </div>
          <span className="text-lg sm:text-xl font-bold font-heading text-white tracking-tight">StartupSafari</span>
        </Link>
        
        <div className="hidden md:flex items-center gap-8">
        </div>

        <div className="flex items-center gap-3 sm:gap-6">
          <Link href="/explore" className="text-sm font-bold text-zinc-400 hover:text-white transition-colors">
            Features Hub
          </Link>
          {!user ? (
            <>
              <button 
                onClick={() => setIsModalOpen(true)}
                className="hidden sm:block text-sm font-bold text-zinc-400 hover:text-white transition-colors px-2"
              >
                Analyze Idea
              </button>
              <Link 
                href="/login" 
                className="flex items-center justify-center text-xs sm:text-sm font-bold px-5 sm:px-7 py-2 sm:py-3 rounded-full bg-white text-black hover:bg-zinc-200 transition-all shadow-[0_0_20px_rgba(255,255,255,0.2)] whitespace-nowrap"
              >
                Sign In
              </Link>
            </>
          ) : (
            <div className="flex items-center gap-4">
              <Link 
                href="/submit" 
                className="text-xs sm:text-sm font-bold px-4 sm:px-5 py-2 sm:py-2.5 rounded-full bg-white text-black hover:bg-zinc-200 transition-colors"
              >
                Dashboard
              </Link>
              <button 
                onClick={() => signOut()}
                className="p-2 text-zinc-400 hover:text-white transition-colors"
                title="Logout"
              >
                <LogOut className="w-5 h-5" />
              </button>
            </div>
          )}
          <button 
            className="md:hidden p-2 text-zinc-400 hover:text-white"
            onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen ? <X /> : <Menu />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      {isOpen && (
        <div className="md:hidden absolute top-20 left-0 w-full bg-brand-deep border-b border-white/10 p-6 flex flex-col gap-6 animate-in slide-in-from-top duration-300">
          <Link href="/explore" onClick={() => setIsOpen(false)} className="text-lg font-medium text-zinc-300">Features Hub</Link>
          <Link href="/login" onClick={() => setIsOpen(false)} className="text-lg font-medium text-zinc-300">Sign In</Link>
        </div>
      )}

      </nav>

      <SignupModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </>
  );
}
