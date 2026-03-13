"use client";

import { useEffect, useState, Suspense } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Navbar } from "@/components/ui/Navbar";
import { useRouter, useSearchParams } from "next/navigation";
import { api } from "@/services/api";
import { Sparkles, Loader2, CheckCircle2 } from "lucide-react";

const EXPERTS = [
  { name: "Fox", icon: "🦊", color: "#facc15" },
  { name: "Owl", icon: "🦉", color: "#60a5fa" },
  { name: "Shark", icon: "🦈", color: "#a855f7" },
  { name: "Bee", icon: "🐝", color: "#f59e0b" },
  { name: "Wolf", icon: "🐺", color: "#9ca3af" },
  { name: "Cheetah", icon: "🐆", color: "#f97316" },
  { name: "Peacock", icon: "🦚", color: "#34d399" },
  { name: "Eagle", icon: "🦅", color: "#fbbf24" },
];

function AnalysisContent() {
  const searchParams = useSearchParams();
  const ideaId = searchParams.get("id");
  const [currentExpertIndex, setCurrentExpertIndex] = useState(0);
  const [status, setStatus] = useState("Gathering Intelligence...");
  const router = useRouter();

  useEffect(() => {
    if (!ideaId) return;

    const runAnalysis = async () => {
      // Step through each expert visually
      for (let i = 0; i < EXPERTS.length; i++) {
        setCurrentExpertIndex(i);
        setStatus(`${EXPERTS[i].name} is analyzing...`);
        await new Promise(r => setTimeout(r, 1500));
      }
      
      setStatus("Finalizing report...");
      await api.startAnalysis(ideaId);
      router.push(`/results?id=${ideaId}`);
    };

    runAnalysis();
  }, [ideaId, router]);

  return (
    <div className="min-h-screen bg-[#05050f] text-white flex flex-col items-center justify-center p-6 bg-glass">
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-electric-blue/10 blur-[100px] rounded-full animate-pulse"></div>
      </div>

      <div className="relative z-10 max-w-xl w-full text-center">
        <div className="w-24 h-24 rounded-[2rem] bg-gradient-to-br from-electric-blue to-violet-glow flex items-center justify-center text-white shadow-2xl mx-auto mb-10 animate-bounce">
          <Sparkles className="w-12 h-12" />
        </div>

        <h2 className="text-4xl font-bold mb-4 font-heading tracking-tight">Your Safari is Live</h2>
        <p className="text-zinc-500 mb-12 text-lg">Our panel of experts are stress-testing your startup idea.</p>

        <div className="p-8 rounded-3xl bg-white/5 border border-white/10 backdrop-blur-xl mb-12">
            <AnimatePresence mode="wait">
                <motion.div
                    key={currentExpertIndex}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 1.2 }}
                    className="flex flex-col items-center"
                >
                    <div className="text-7xl mb-6 filter drop-shadow-[0_0_20px_rgba(255,255,255,0.4)]">
                        {EXPERTS[currentExpertIndex].icon}
                    </div>
                    <div className="text-2xl font-bold text-white mb-1">{EXPERTS[currentExpertIndex].name}</div>
                    <div 
                        className="text-sm font-bold uppercase tracking-widest"
                        style={{ color: EXPERTS[currentExpertIndex].color }}
                    >
                        Active Evaluator
                    </div>
                </motion.div>
            </AnimatePresence>
        </div>

        <div className="flex flex-col items-center gap-4">
            <div className="flex items-center gap-3 text-zinc-400 font-medium">
                <Loader2 className="w-5 h-5 animate-spin text-electric-blue" />
                <span>{status}</span>
            </div>
            
            <div className="w-full h-2 bg-white/5 rounded-full overflow-hidden border border-white/10">
                <motion.div 
                    className="h-full bg-electric-blue shadow-[0_0_10px_rgba(59,130,246,0.5)]"
                    animate={{ width: `${((currentExpertIndex + 1) / EXPERTS.length) * 100}%` }}
                    transition={{ duration: 1 }}
                />
            </div>
        </div>

        <div className="mt-12 grid grid-cols-4 gap-4 opacity-40">
            {EXPERTS.map((expert, i) => (
                <div key={i} className={`text-2xl grayscale transition-all duration-500 ${i < currentExpertIndex ? "grayscale-0 opacity-100 scale-110" : ""}`}>
                    {expert.icon}
                </div>
            ))}
        </div>
      </div>
    </div>
  );
}

export default function AnalysisPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#05050f] flex items-center justify-center text-white">Loading...</div>}>
        <AnalysisContent />
    </Suspense>
  );
}
