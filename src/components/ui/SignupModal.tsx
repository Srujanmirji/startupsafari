"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Mail, Loader2, ArrowRight, Chrome } from "lucide-react";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { useGoogleLogin } from '@react-oauth/google';
import { Sparkles } from "lucide-react";

interface SignupModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function SignupModal({ isOpen, onClose }: SignupModalProps) {
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);
  const { signInWithOtp, verifyOtp, setLocalUser } = useAuth();
  
  const loginWithGoogle = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      console.log("Google Login Success! Token:", tokenResponse.access_token);
      try {
          const res = await fetch("https://www.googleapis.com/oauth2/v3/userinfo", {
            headers: { Authorization: `Bearer ${tokenResponse.access_token}` }
          });
          const userInfo = await res.json();
          setLocalUser(userInfo);
          window.location.href = "/dashboard";
      } catch (err) {
          console.error("Error connecting with Google", err);
      }
    },
    onError: error => console.log('Login Failed', error)
  });

  const handleOtpLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);
    
    try {
      const { error } = await signInWithOtp(email);
      if (error) throw error;
      setOtpSent(true);
      setMessage({ type: 'success', text: "Check your email for the OTP!" });
    } catch (err: any) {
      setMessage({ type: 'error', text: err.message || "Failed to send link." });
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
      window.location.href = "/dashboard";
    } catch (err: any) {
      setMessage({ type: 'error', text: err.message || "Invalid OTP code." });
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 text-white">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-black/80 backdrop-blur-md"
        />

        {/* Modal Content */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          className="relative w-full max-w-md bg-zinc-900/90 border border-white/10 rounded-[2.5rem] p-8 sm:p-10 shadow-2xl overflow-hidden"
        >
          {/* Subtle decoration inside modal */}
          <div className="absolute top-0 right-0 w-32 h-32 bg-purple-500/20 blur-[60px] rounded-full pointer-events-none" />
          
          <button
            onClick={onClose}
            className="absolute top-6 right-6 p-2 text-zinc-500 hover:text-white transition-colors"
          >
            <X className="w-6 h-6" />
          </button>

          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold font-heading text-white mb-2">Join the Safari</h2>
            <p className="text-zinc-400 text-sm italic">"Validate before you build."</p>
          </div>

          <div className="space-y-4">
            {process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID && (
              <button
                type="button"
                onClick={() => loginWithGoogle()}
                className="w-full flex items-center justify-center gap-3 py-3.5 rounded-xl bg-white/[0.03] border border-white/10 hover:bg-white/[0.08] transition-all font-semibold text-zinc-300 hover:text-white group"
              >
                <Chrome className="w-5 h-5 group-hover:scale-110 transition-transform" />
                Continue with Google
              </button>
            )}

            <div className="relative py-2 text-center">
              <div className="absolute top-1/2 left-0 w-full h-[1px] bg-white/10 -translate-y-1/2"></div>
              <span className="relative bg-[#18181b] px-4 text-[10px] font-bold text-zinc-500 uppercase tracking-[0.2em]">Or use email OTP</span>
            </div>

            {!otpSent ? (
              <form onSubmit={handleOtpLogin} className="space-y-4">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-zinc-500 uppercase tracking-widest ml-1">Email Address</label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full bg-black/40 border border-white/10 rounded-xl py-4 pl-10 pr-4 text-white placeholder:text-zinc-600 focus:outline-none focus:border-purple-500/50 transition-all text-sm font-medium"
                      placeholder="you@example.com"
                    />
                  </div>
                </div>

                {message && (
                  <div className={`p-3 rounded-lg text-xs font-medium ${message.type === 'success' ? 'bg-green-500/10 text-green-400 border border-green-500/20' : 'bg-red-500/10 text-red-400 border border-red-500/20'}`}>
                    {message.text}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-white text-black rounded-xl py-4 font-bold transition-all flex items-center justify-center gap-2 group disabled:opacity-70 shadow-[0_0_20px_rgba(255,255,255,0.1)] hover:scale-[1.02]"
                >
                  {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : "Send OTP"}
                  {!loading && <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />}
                </button>
              </form>
            ) : (
              <form onSubmit={handleVerifyOtp} className="space-y-4">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-zinc-500 uppercase tracking-widest ml-1">6-Digit OTP</label>
                  <div className="relative">
                    <Sparkles className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
                    <input
                      type="text"
                      required
                      value={otp}
                      onChange={(e) => setOtp(e.target.value)}
                      className="w-full bg-black/40 border border-white/10 rounded-xl py-4 pl-10 pr-4 text-white placeholder:text-zinc-600 focus:outline-none focus:border-purple-500/50 transition-all text-sm font-medium tracking-widest"
                      placeholder="123456"
                    />
                  </div>
                </div>

                {message && (
                  <div className={`p-3 rounded-lg text-xs font-medium ${message.type === 'success' ? 'bg-green-500/10 text-green-400 border border-green-500/20' : 'bg-red-500/10 text-red-400 border border-red-500/20'}`}>
                    {message.text}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-white text-black rounded-xl py-4 font-bold transition-all flex items-center justify-center gap-2 group disabled:opacity-70 shadow-[0_0_20px_rgba(255,255,255,0.1)] hover:scale-[1.02]"
                >
                  {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : "Verify Code"}
                  {!loading && <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />}
                </button>
              </form>
            )}
          </div>

          <p className="text-center text-sm text-zinc-500 mt-8">
            Prefer passwords?{" "}
            <Link href="/login" onClick={onClose} className="text-white hover:text-purple-400 transition-colors font-bold">
              Password Login
            </Link>
          </p>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
