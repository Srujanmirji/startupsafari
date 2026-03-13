"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Navbar } from "@/components/ui/Navbar";
import { Send, Sparkles, Info, X, ArrowRight } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { api } from "@/services/api";
import { load } from "@cashfreepayments/cashfree-js";
import { useAuth } from "@/context/AuthContext";
import { DeepDiveInterview } from "@/components/ui/DeepDiveInterview";

export default function SubmitIdea() {
  const [idea, setIdea] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedExperts, setSelectedExperts] = useState<string[]>([]);
  const [infoExpert, setInfoExpert] = useState<string | null>(null);
  const [step, setStep] = useState<'idea' | 'deepdive'>('idea');
  const [deepDiveAnswers, setDeepDiveAnswers] = useState<Record<string, string> | null>(null);
  const [refineId, setRefineId] = useState<string | null>(null);
  const { user } = useAuth();
  const router = useRouter();

  const PREMIUM_EXPERTS = ["Owl", "Shark", "Wolf", "Eagle"];
  const ADMIN_EMAILS = [
    "sachitsarangmath44@gmail.com", 
    "sachitsarangamath44@gmail.com", 
    "srujanmirji10@gmail.com"
  ];
  const isAdmin = user?.email && ADMIN_EMAILS.includes(user.email.toLowerCase().trim());
  
  useEffect(() => {
    if (user) {
      console.log("Current User:", user.email, "Is Admin:", isAdmin);
    }
  }, [user, isAdmin]);

  const EXPERTS = [
    { name: "Fox", icon: "🦊", color: "#facc15", desc: "Logic", title: "Analytical Thinking", details: ["Evaluates logic of the startup idea", "Checks problem-solution fit", "Questions assumptions"], examples: ["Is the problem real?", "Does the solution actually solve it?", "Is the idea technically feasible?"] },
    { name: "Owl", icon: "🦉", color: "#60a5fa", desc: "Market", title: "Market Intelligence", details: ["Analyzes market size", "Finds competitors", "Identifies target audience"], examples: ["TAM / SAM / SOM", "Market trends", "Customer segments"] },
    { name: "Shark", icon: "🦈", color: "#a855f7", desc: "Business", title: "Business Model Strength", details: ["Evaluates monetization", "Revenue potential", "Profitability"], examples: ["Revenue streams", "Pricing model", "Unit economics"] },
    { name: "Bee", icon: "🐝", color: "#f59e0b", desc: "Demand", title: "Demand Validator", details: ["Checks real demand signals", "Surveys potential users"], examples: ["Customer interviews", "Problem frequency", "Early adopter interest"] },
    { name: "Elephant", icon: "🐘", color: "#4b5563", desc: "Long Term", title: "Long Term Vision", details: ["Tests scalability", "Future growth potential"], examples: ["Can it grow globally?", "Is the infrastructure scalable?", "Future industry relevance"] },
    { name: "Wolf", icon: "🐺", color: "#9ca3af", desc: "Strategy", title: "Competitive Strategy", details: ["Analyzes competition", "Finds unique advantage"], examples: ["What is your moat?", "What stops competitors?", "Switching costs"] },
    { name: "Cheetah", icon: "🐆", color: "#f97316", desc: "Speed", title: "Speed to Market", details: ["Measures execution speed", "MVP feasibility"], examples: ["Can MVP be built quickly?", "Time to launch", "Development complexity"] },
    { name: "Peacock", icon: "🦚", color: "#34d399", desc: "Brand", title: "Branding & Story", details: ["Evaluates branding strength", "Pitch clarity"], examples: ["Is the idea easy to explain?", "Brand uniqueness", "Storytelling power"] },
    { name: "Beaver", icon: "🦫", color: "#8b5cf6", desc: "Build", title: "Build Feasibility", details: ["Checks technical implementation"], examples: ["Technology stack", "Development difficulty", "Required resources"] },
    { name: "Eagle", icon: "🦅", color: "#fbbf24", desc: "Vision", title: "Big Picture Strategy", details: ["Evaluates macro opportunity"], examples: ["Industry disruption potential", "Long term industry shifts", "Strategic advantage"] },
  ];

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    
    // Check for expert pre-selection
    const exp = params.get('expert');
    if (exp) {
      setSelectedExperts([exp.charAt(0).toUpperCase() + exp.slice(1)]);
    }

    // Check for refine mode
    const refine = params.get('refine');
    if (refine) {
      setRefineId(refine);
      const storedIdeas = JSON.parse(localStorage.getItem('safari_ideas') || '[]');
      const existingIdea = storedIdeas.find((i: any) => i.id === refine);
      if (existingIdea) {
        setIdea(existingIdea.idea || '');
        if (existingIdea.experts) setSelectedExperts(existingIdea.experts);
      }
    }

    // Check for successful payment return
    const orderId = params.get('order_id');
    if (orderId) {
      const pending = localStorage.getItem('pending_safari_idea');
      if (pending) {
        const { idea: pendingIdea, experts: pendingExperts } = JSON.parse(pending);
        const finalizeSubmission = async () => {
          setIsSubmitting(true);
          try {
            const { data } = await api.submitIdea({ idea: pendingIdea, experts: pendingExperts, paid: true });
            localStorage.removeItem('pending_safari_idea');
            router.push(`/analysis?id=${data.id}`);
          } catch (e) {
            console.error("Failed to finalize after payment", e);
            setIsSubmitting(false);
          }
        };
        finalizeSubmission();
      }
    }
  }, [router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!idea.trim()) return;
    
    // Go to deep dive step before final submit
    setStep('deepdive');
  };

  const performSubmission = async (answers?: Record<string, string>) => {
    setIsSubmitting(true);
    if (answers) setDeepDiveAnswers(answers);
    
    try {
      const hasPremium = selectedExperts.some(exp => PREMIUM_EXPERTS.includes(exp));

      if (hasPremium && !isAdmin) {
        localStorage.setItem('pending_safari_idea', JSON.stringify({ 
          idea, experts: selectedExperts, deepDiveAnswers: answers || deepDiveAnswers, refineId 
        }));

        const { data: order } = await api.createPaymentOrder({
          email: user?.email || "guest@example.com",
          name: user?.name || "Safari Explorer",
          customerId: user?.id || `guest_${Date.now()}`
        });

        const cashfree = await load({ mode: "production" });
        
        await cashfree.checkout({
          paymentSessionId: order.payment_session_id,
          returnUrl: `${window.location.origin}/submit`
        });
        return;
      }

      const { data } = await api.submitIdea({ 
        idea, 
        experts: selectedExperts, 
        deepDiveAnswers: answers || deepDiveAnswers,
        refineId 
      });
      router.push(`/analysis?id=${data.id}`);
    } catch (error: any) {
      console.error(error);
      alert(error.response?.data?.details?.message || "Submission Error. Please retry.");
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
          <h1 className="text-4xl sm:text-5xl font-bold mb-4 font-heading">
            {step === 'deepdive' ? (
              <>AI <span className="text-gradient">Deep Dive</span></>
            ) : refineId ? (
              <><span className="text-gradient">Refine</span> Your Idea</>
            ) : (
              <>Describe your <span className="text-gradient">Startup Idea</span></>
            )}
          </h1>
          {step === 'deepdive' ? (
            <p className="text-zinc-500 text-lg">Answer a few quick questions for a sharper, more accurate analysis.</p>
          ) : selectedExperts.length > 0 ? (
            <p className="text-zinc-500 text-lg">The <span className="text-electric-blue font-bold">{selectedExperts.join(", ")}</span> {selectedExperts.length === 1 ? 'is' : 'are'} waiting to hunt for the truth behind your vision.</p>
          ) : (
            <p className="text-zinc-500 text-lg">Our AI experts are waiting to hunt for the truth behind your vision.</p>
          )}
        </div>

        {step === 'deepdive' ? (
          <DeepDiveInterview 
            onComplete={(answers) => performSubmission(answers)}
            onSkip={() => performSubmission()}
          />
        ) : (
        <div className="p-8 sm:p-10 rounded-[2rem] bg-white/5 border border-white/10 backdrop-blur-xl relative overflow-hidden">
          <form onSubmit={handleSubmit} className="space-y-8">
            <div className="space-y-4">
              <label className="text-sm font-bold text-zinc-400 uppercase tracking-widest">The Core Vision</label>
              <textarea
                autoFocus
                value={idea}
                onChange={(e) => setIdea(e.target.value)}
                placeholder="e.g. A coffee delivery app for office buildings..."
                rows={6}
                className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-white text-lg focus:outline-none focus:border-electric-blue/50 transition-all resize-none placeholder:text-zinc-600"
                required
              />
            </div>

            <div className="space-y-4">
              <label className="text-sm font-bold text-zinc-400 uppercase tracking-widest flex items-center justify-between">
                <span>Select Target Expert <span className="text-zinc-600 text-xs ml-2">(Optional)</span></span>
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 sm:gap-4 relative">
                {EXPERTS.map((exp) => {
                    const isSelected = selectedExperts.includes(exp.name);
                    return (
                    <div
                        key={exp.name}
                        onClick={() => setSelectedExperts(prev => isSelected ? prev.filter(e => e !== exp.name) : [...prev, exp.name])}
                        className={`relative flex flex-col items-center justify-center p-3 sm:p-4 rounded-xl border transition-all duration-300 cursor-pointer ${
                            isSelected 
                                ? 'bg-white/10 border-electric-blue shadow-[0_0_15px_rgba(59,130,246,0.3)] scale-105 z-10' 
                                : 'bg-black/40 border-white/5 hover:border-white/20 hover:bg-white/5 grayscale-[0.5] hover:grayscale-0 z-0'
                        }`}
                        style={{ borderBottomColor: isSelected ? exp.color : undefined, borderBottomWidth: isSelected ? '3px' : '1px' }}
                    >
                        <button
                          type="button"
                          className="absolute top-2 right-2 p-0.5 text-zinc-500 hover:text-white transition-colors z-20 rounded-full hover:bg-white/10"
                          onClick={(e) => { e.stopPropagation(); setInfoExpert(infoExpert === exp.name ? null : exp.name); }}
                        >
                          <Info className="w-4 h-4" />
                        </button>

                        <div className="text-2xl sm:text-3xl mb-1 sm:mb-2 drop-shadow-lg">{exp.icon}</div>
                        <div className="text-white font-bold text-xs sm:text-sm flex items-center gap-1">
                          {exp.name}
                          {PREMIUM_EXPERTS.includes(exp.name) && (
                            <span className={`text-[8px] px-1 rounded uppercase tracking-tighter border ${
                              isAdmin 
                                ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30' 
                                : 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30'
                            }`}>
                              {isAdmin ? 'Admin Access' : 'Premium'}
                            </span>
                          )}
                        </div>
                        <div className="hidden sm:block text-[10px] text-zinc-500 font-medium uppercase tracking-wider mt-1">{exp.desc}</div>
                    </div>
                )})}
              </div>
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
        )}
      </main>

      <AnimatePresence>
        {infoExpert && (
          <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
              onClick={() => setInfoExpert(null)}
            />
            {(() => {
              const exp = EXPERTS.find(e => e.name === infoExpert);
              if (!exp) return null;
              return (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95, y: 10 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95, y: 10 }}
                  className="relative w-full max-w-sm bg-[#0a0a16] border border-white/10 p-6 rounded-3xl shadow-[0_0_50px_rgba(0,0,0,0.8)] z-[201] text-left cursor-default pointer-events-auto overflow-y-auto max-h-[85vh]"
                  onClick={(e) => e.stopPropagation()}
                >
                  <button type="button" onClick={() => setInfoExpert(null)} className="absolute top-4 right-4 text-zinc-500 hover:text-white transition-colors bg-white/5 hover:bg-white/10 p-1.5 rounded-full"><X className="w-4 h-4" /></button>
                  <div className="flex items-center gap-4 mb-5 pr-6 pb-4 border-b border-white/5">
                      <div className="text-4xl drop-shadow-xl">{exp.icon}</div>
                      <div>
                        <div className="text-xl font-bold font-heading" style={{ color: exp.color }}>{exp.name}</div>
                        <div className="text-sm text-zinc-400 font-medium">{exp.title}</div>
                      </div>
                  </div>
                  
                  <div className="text-sm text-zinc-300 mb-6 leading-relaxed">
                    <ul className="list-disc pl-5 space-y-2.5">
                      {exp.details.map((d, i) => <li key={i}>{d}</li>)}
                    </ul>
                  </div>

                  <div className="p-4 rounded-xl bg-white/[0.03] border border-white/[0.05]">
                    <div className="text-[10px] uppercase font-bold text-zinc-500 mb-3 tracking-widest flex items-center gap-2">
                      <Sparkles className="w-3 h-3 text-electric-blue" />
                      Example Checks
                    </div>
                    <div className="text-sm text-zinc-400">
                      <ul className="list-disc pl-5 space-y-2">
                        {exp.examples.map((ex, i) => <li key={i}>{ex}</li>)}
                      </ul>
                    </div>
                  </div>
                  
                  <button 
                    type="button" 
                    onClick={() => setInfoExpert(null)}
                    className="w-full mt-6 py-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-white font-bold transition-all"
                  >
                    Close
                  </button>
                </motion.div>
              );
            })()}
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
