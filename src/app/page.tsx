"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { 
  Rocket, 
  Search, 
  BarChart3, 
  ShieldCheck, 
  Zap, 
  Clock, 
  CheckCircle2,
  Lightbulb,
  Target,
  ArrowRight
} from "lucide-react";
import { HeroSection } from "@/components/ui/HeroSection";
import { Navbar } from "@/components/ui/Navbar";
import { FeatureCard } from "@/components/ui/FeatureCard";
import { PersonaCard } from "@/components/ui/PersonaCard";
import { ViabilityDisplay } from "@/components/ui/ScoreBar";
import { Footer } from "@/components/ui/Footer";
import { useAuth } from "@/context/AuthContext";
import { SignupModal } from "@/components/ui/SignupModal";

const PERSONAS = [
// ... (omitted for brevity, will be kept intact)
];

export default function Home() {
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
    <div className="flex flex-col min-h-screen">
      <Navbar />
      
      <main>
        {/* HERO SECTION */}
        <HeroSection />

        {/* ... (rest of sections) */}

        {/* FINAL CTA */}
        <section className="py-20 sm:py-32 relative">
           <div className="max-w-4xl mx-auto px-6 text-center">
              <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8 }}
                className="p-10 sm:p-16 rounded-[2rem] sm:rounded-[3rem] bg-gradient-to-br from-electric-blue/20 to-violet-glow/20 border border-white/10 relative overflow-hidden"
              >
                <div className="absolute top-0 right-0 p-8 opacity-20 sm:opacity-100">
                   <Zap className="w-24 h-24 text-white/10 rotate-12" />
                </div>
                <h2 className="text-3xl sm:text-5xl lg:text-6xl font-bold text-white mb-8 font-heading">Ready to hunt for <br />your next winner?</h2>
                <button 
                  onClick={handleStartAnalysis}
                  className="inline-flex items-center gap-2 bg-white text-black px-8 sm:px-10 py-4 sm:py-5 rounded-full font-bold text-lg sm:text-xl hover:bg-zinc-200 transition-all hover:scale-105 shadow-[0_0_30px_rgba(255,255,255,0.4)]"
                >
                  Get Started for Free
                  <ArrowRight className="w-6 h-6" />
                </button>
              </motion.div>
           </div>
        </section>
      </main>

      <Footer />
      <SignupModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </div>
  );
}
