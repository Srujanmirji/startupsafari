"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Navbar } from "@/components/ui/Navbar";
import { Send, Sparkles } from "lucide-react";
import { useRouter } from "next/navigation";
import { api } from "@/services/api";

export default function SubmitIdea() {
  const [idea, setIdea] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!idea.trim()) return;

    setIsSubmitting(true);
    try {
      const { data } = await api.submitIdea({ idea });
      router.push(`/analysis?id=${data.id}`);
    } catch (error) {
      console.error(error);
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#05050f] text-white">
      <Navbar />
      
      <main className="pt-32 pb-20 px-6 max-w-3xl mx-auto">
        <div className="text-center mb-12">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="inline-flex p-3 rounded-2xl bg-electric-blue/10 border border-electric-blue/20 text-electric-blue mb-6"
          >
            <Sparkles className="w-6 h-6" />
          </motion.div>
          <h1 className="text-4xl sm:text-5xl font-bold mb-4 font-heading">Describe your <span className="text-gradient">Startup Idea</span></h1>
          <p className="text-zinc-500 text-lg">Our AI experts are waiting to hunt for the truth behind your vision.</p>
        </div>

        <div className="p-8 sm:p-10 rounded-[2rem] bg-white/5 border border-white/10 backdrop-blur-xl relative overflow-hidden">
          <form onSubmit={handleSubmit} className="space-y-8">
            <div className="space-y-4">
              <label className="text-sm font-bold text-zinc-400 uppercase tracking-widest">The Core Vision</label>
              <textarea
                autoFocus
                value={idea}
                onChange={(e) => setIdea(e.target.value)}
                placeholder="e.g. A coffee delivery app for office buildings..."
                rows={8}
                className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-white text-lg focus:outline-none focus:border-electric-blue/50 transition-all resize-none placeholder:text-zinc-600"
                required
              />
            </div>

            <div className="flex justify-center">
              <button
                type="submit"
                disabled={isSubmitting || !idea.trim()}
                className="group flex items-center gap-3 bg-white text-black px-12 py-5 rounded-full font-bold text-xl hover:bg-zinc-200 transition-all shadow-[0_0_30px_rgba(255,255,255,0.3)] disabled:opacity-50 disabled:cursor-not-allowed hover:scale-105"
              >
                {isSubmitting ? "Dispatching Experts..." : "Start Analysis"}
                {!isSubmitting && <Send className="w-5 h-5 group-hover:translate-x-1 transition-transform" />}
              </button>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
}
