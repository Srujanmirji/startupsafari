"use client";

import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { Navbar } from "@/components/ui/Navbar";
import { Sparkles, Mail, Chrome, ArrowRight, Loader2 } from "lucide-react";
import Link from "next/link";
import React, { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { useGoogleLogin } from '@react-oauth/google';

import { AuroraBackground } from "@/components/ui/AuroraBackground";

export default function Login() {
  const [isHovered, setIsHovered] = useState(false);
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);
  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState("");
  const { signInWithOtp, verifyOtp, setLocalUser } = useAuth();
  
  const loginWithGoogle = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      console.log("Google Login Success! Token:", tokenResponse.access_token);
      try {
          // Fetch user details from Google
          const res = await fetch("https://www.googleapis.com/oauth2/v3/userinfo", {
            headers: {
              Authorization: `Bearer ${tokenResponse.access_token}`
            }
          });
          const userInfo = await res.json();
          // Save the user in AuthContext (LocalStorage)
          setLocalUser(userInfo);
          // Redirect
          window.location.href = "/dashboard";
      } catch (err) {
          console.error("Error connecting with Google", err);
      }
    },
    onError: error => console.log('Login Failed', error)
  });

  // 3D Tilt Logic
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const mouseXSpring = useSpring(x, { stiffness: 300, damping: 30 });
  const mouseYSpring = useSpring(y, { stiffness: 300, damping: 30 });

  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ["5deg", "-5deg"]);
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ["-5deg", "5deg"]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;
    x.set(mouseX / width - 0.5);
    y.set(mouseY / height - 0.5);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  const handleOtpLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);
    try {
      const { error } = await signInWithOtp(email);
      if (error) throw error;
      setOtpSent(true);
      setMessage({ type: 'success', text: "OTP sent! Check your inbox." });
    } catch (err: any) {
      setMessage({ type: 'error', text: err.message || "Failed to send OTP." });
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);
    try {
      const { error } = await verifyOtp(email, otp);
      if (error) throw error;
      // Force reload or redirect to dashboard
      window.location.href = "/dashboard";
    } catch (err: any) {
      setMessage({ type: 'error', text: err.message || "Invalid OTP code." });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#05050f] text-white overflow-hidden relative font-sans flex flex-col">
      <Navbar />
      <AuroraBackground />

      <main className="flex-grow flex items-center justify-center relative z-10 px-4 pt-24 pb-12 w-full [perspective:2000px]">
        
        {/* Tilting Container */}
        <motion.div 
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
          style={{
            rotateY,
            rotateX,
            transformStyle: "preserve-3d",
          }}
          className="w-full max-w-[480px] relative"
        >
          {/* Glass Card */}
          <div 
            className="w-full p-8 sm:p-12 rounded-[2.5rem] bg-white/5 border border-white/10 backdrop-blur-2xl shadow-[0_0_50px_rgba(0,0,0,0.5)] relative overflow-hidden"
            style={{ transform: "translateZ(30px)", transformStyle: "preserve-3d" }}
          >
            {/* Shimmer Effect */}
            <div className="absolute top-0 left-[-100%] w-[200%] h-full bg-gradient-to-r from-transparent via-white/5 to-transparent skew-x-[-30deg] animate-shimmer pointer-events-none" />

            <div className="text-center mb-10" style={{ transform: "translateZ(50px)" }}>
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-electric-blue to-violet-glow flex items-center justify-center text-white shadow-[0_0_30px_rgba(59,130,246,0.5)] mx-auto mb-6 relative group cursor-pointer">
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
                  className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity"
                />
                <Sparkles className="w-8 h-8 relative z-10" />
              </div>
              <h1 className="text-4xl font-bold font-heading mb-3 tracking-tight">Welcome Back</h1>
              <p className="text-zinc-400 font-medium tracking-wide">Enter your email to continue your safari.</p>
            </div>

            {/* Social Logins */}
            <div className="space-y-4 mb-8" style={{ transform: "translateZ(40px)" }}>
              <button 
                type="button"
                onClick={() => loginWithGoogle()}
                className="w-full flex items-center justify-center gap-3 py-3.5 rounded-xl bg-white/[0.03] border border-white/10 hover:bg-white/[0.08] hover:border-white/20 transition-all font-semibold text-zinc-300 hover:text-white group"
              >
                  <Chrome className="w-5 h-5 group-hover:scale-110 transition-transform" />
                  Continue with Google
              </button>
            </div>

            {/* Divider */}
            <div className="relative mb-8 text-center" style={{ transform: "translateZ(30px)" }}>
              <div className="absolute top-1/2 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-y-1/2"></div>
              <span className="relative bg-[#0a0a16] px-4 text-xs font-bold text-zinc-500 uppercase tracking-widest rounded-full py-1 border border-white/5">Or Email OTP</span>
            </div>

            {/* Form */}
            {/* Form */}
            {!otpSent ? (
              <form onSubmit={handleOtpLogin} className="space-y-5" style={{ transform: "translateZ(45px)" }}>
                <div className="group">
                    <div className="relative overflow-hidden rounded-xl bg-white/[0.02] border border-white/10 focus-within:border-electric-blue/50 focus-within:bg-white/[0.04] transition-all duration-300">
                        <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500 group-focus-within:text-electric-blue transition-colors z-10" />
                        <input 
                            type="email" 
                            required
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="name@company.com" 
                            className="w-full bg-transparent pl-12 pr-4 py-4 text-white placeholder:text-zinc-600 focus:outline-none text-sm font-medium relative z-10"
                        />
                        {/* Focus background glow */}
                        <div className="absolute inset-0 bg-gradient-to-r from-electric-blue/0 to-transparent opacity-0 group-focus-within:opacity-20 transition-opacity duration-500 pointer-events-none" />
                    </div>
                </div>

                {message && (
                  <div className={`p-4 rounded-xl text-sm font-medium ${message.type === 'success' ? 'bg-green-500/10 text-green-400 border border-green-500/20' : 'bg-red-500/10 text-red-400 border border-red-500/20'}`}>
                    {message.text}
                  </div>
                )}

                <button 
                    type="submit"
                    disabled={loading}
                    onMouseEnter={() => setIsHovered(true)}
                    onMouseLeave={() => setIsHovered(false)}
                    className="mt-2 w-full flex items-center justify-center gap-2 bg-white text-black py-4 rounded-xl font-bold hover:bg-zinc-200 transition-all shadow-[0_0_20px_rgba(255,255,255,0.15)] group relative overflow-hidden disabled:opacity-70"
                >
                    <span className="relative z-10">{loading ? "Sending..." : "Send OTP"}</span>
                    {!loading && (
                      <motion.div
                        animate={{ x: isHovered ? 5 : 0 }}
                        className="relative z-10"
                      >
                        <ArrowRight className="w-4 h-4" />
                      </motion.div>
                    )}
                    {loading && <Loader2 className="w-4 h-4 animate-spin relative z-10" />}
                    {/* Button Hover effect */}
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/50 to-transparent -translate-x-full group-hover:animate-shimmer" />
                </button>
              </form>
            ) : (
              <form onSubmit={handleVerifyOtp} className="space-y-5" style={{ transform: "translateZ(45px)" }}>
                <div className="group">
                    <div className="relative overflow-hidden rounded-xl bg-white/[0.02] border border-white/10 focus-within:border-electric-blue/50 focus-within:bg-white/[0.04] transition-all duration-300">
                        <Sparkles className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500 group-focus-within:text-electric-blue transition-colors z-10" />
                        <input 
                            type="text" 
                            required
                            value={otp}
                            onChange={(e) => setOtp(e.target.value)}
                            placeholder="123456" 
                            className="w-full bg-transparent pl-12 pr-4 py-4 text-white placeholder:text-zinc-600 focus:outline-none text-sm font-medium relative z-10 tracking-widest"
                        />
                        {/* Focus background glow */}
                        <div className="absolute inset-0 bg-gradient-to-r from-electric-blue/0 to-transparent opacity-0 group-focus-within:opacity-20 transition-opacity duration-500 pointer-events-none" />
                    </div>
                </div>

                {message && (
                  <div className={`p-4 rounded-xl text-sm font-medium ${message.type === 'success' ? 'bg-green-500/10 text-green-400 border border-green-500/20' : 'bg-red-500/10 text-red-400 border border-red-500/20'}`}>
                    {message.text}
                  </div>
                )}

                <button 
                    type="submit"
                    disabled={loading}
                    onMouseEnter={() => setIsHovered(true)}
                    onMouseLeave={() => setIsHovered(false)}
                    className="mt-2 w-full flex items-center justify-center gap-2 bg-white text-black py-4 rounded-xl font-bold hover:bg-zinc-200 transition-all shadow-[0_0_20px_rgba(255,255,255,0.15)] group relative overflow-hidden disabled:opacity-70"
                >
                    <span className="relative z-10">{loading ? "Verifying..." : "Verify OTP"}</span>
                    {!loading && (
                      <motion.div
                        animate={{ x: isHovered ? 5 : 0 }}
                        className="relative z-10"
                      >
                        <ArrowRight className="w-4 h-4" />
                      </motion.div>
                    )}
                    {loading && <Loader2 className="w-4 h-4 animate-spin relative z-10" />}
                    {/* Button Hover effect */}
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/50 to-transparent -translate-x-full group-hover:animate-shimmer" />
                </button>
              </form>
            )}

            <p className="mt-8 text-center text-sm font-medium text-zinc-500" style={{ transform: "translateZ(20px)" }}>
              Don't have an account?{" "}
              <Link onClick={() => {}} href="#" className="text-white hover:text-electric-blue transition-colors font-bold border-b border-transparent hover:border-electric-blue pb-0.5">
                Join Safari
              </Link>
            </p>
          </div>
        </motion.div>
      </main>

      <style jsx global>{`
        @keyframes shimmer {
          100% {
            transform: translateX(100%);
          }
        }
        .animate-shimmer {
          animation: shimmer 2s infinite;
        }
      `}</style>
    </div>
  );
}
