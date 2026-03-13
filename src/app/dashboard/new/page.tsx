"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, ArrowRight, CheckCircle, Save } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

const VALIDATION_QUESTIONS = [
  { id: "q1", title: "Target Audience Size", desc: "How large is your explicitly defined target audience?", options: ["Niche (<10k)", "Small (10k-100k)", "Medium (100k-1M)", "Large (1M-10M)", "Massive (>10M)"] },
  { id: "q2", title: "Problem Severity", desc: "How painful is the problem you are solving?", options: ["Minor inconvenience", "Nice to have solved", "Moderate pain point", "High priority problem", "Hair-on-fire crisis"] },
  { id: "q3", title: "Willingness to Pay", desc: "How willing are customers to pay for a solution today?", options: ["Expect it free", "Might pay a small one-time fee", "Would pay a low subscription", "Willing to pay a premium", "Already spending high amounts to solve it"] },
  { id: "q4", title: "Competition Density", desc: "How crowded is the current market?", options: ["Red ocean (Many dominant players)", "Crowded but fragmented", "A few established competitors", "Emerging space with weak competitors", "Blue ocean (No direct competitors)"] },
  { id: "q5", title: "Time to MVP", desc: "How long will it take to build the core value proposition?", options: ["> 1 Year", "6 - 12 Months", "3 - 6 Months", "1 - 3 Months", "< 1 Month"] },
  { id: "q6", title: "Technical Feasibility", desc: "Do you have the skills to build this?", options: ["Need to hire a whole team", "Need a cofounder/agency", "Can build parts, need help", "Can build most of it", "Can build it entirely myself"] },
  { id: "q7", title: "Customer Acquisition Cost", desc: "How expensive/hard is it to reach your第一 customers?", options: ["Extremely high/Enterprise sales", "High (Paid Ads only)", "Moderate (Inbound + Outbound)", "Low (Content parity/Social)", "Zero (Viral/Existing audience)"] },
  { id: "q8", title: "Lifetime Value Potential", desc: "How much is a customer worth over time?", options: ["Very Low (< $50)", "Low ($50 - $200)", "Medium ($200 - $1,000)", "High ($1,000 - $5,000)", "Very High (> $5,000)"] },
  { id: "q9", title: "Personal Passion", desc: "How much do you personally care about this space?", options: ["Just looking for cash", "Slightly interested", "Interested", "Very passionate", "Obsessed/Life's work"] },
  { id: "q10", title: "Unfair Advantage", desc: "What is your moat against copycats?", options: ["None", "First-mover advantage", "Brand / Audience", "Unique Technology / Data", "Network Effects / Monopoly"] }
];

export default function NewValidationPage() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [mounted, setMounted] = useState(false);
  const [ideaTitle, setIdeaTitle] = useState("");

  // Load state from localStorage
  useEffect(() => {
    setMounted(true);
    const saved = localStorage.getItem("validationProgress");
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (parsed.answers) setAnswers(parsed.answers);
        if (parsed.currentStep) setCurrentStep(parsed.currentStep);
        if (parsed.ideaTitle) setIdeaTitle(parsed.ideaTitle);
      } catch (e) {}
    }
  }, []);

  // Save state tracking to localStorage
  useEffect(() => {
    if (mounted) {
      localStorage.setItem("validationProgress", JSON.stringify({ answers, currentStep, ideaTitle }));
    }
  }, [answers, currentStep, ideaTitle, mounted]);

  const handleSelect = (questionId: string, score: number) => {
    setAnswers(prev => ({ ...prev, [questionId]: score }));
  };

  const nextStep = () => {
    if (currentStep < VALIDATION_QUESTIONS.length) {
      setCurrentStep(curr => curr + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(curr => curr - 1);
    }
  };

  const finishValidation = () => {
    // Generate a final score sum. Max is 50.
    const totalScore = Object.values(answers).reduce((a, b) => a + b, 0);
    alert(`Validation Complete! Your idea "${ideaTitle}" scored ${totalScore} out of 50.\n\n(Supabase insert logic goes here)`);
    localStorage.removeItem("validationProgress");
    router.push("/dashboard");
  };

  if (!mounted) return null;

  const progress = (currentStep / VALIDATION_QUESTIONS.length) * 100;

  return (
    <div className="min-h-screen bg-black text-white selection:bg-indigo-500/30">
      {/* Header */}
      <header className="h-20 border-b border-white/10 flex items-center px-8 relative z-10">
        <Link href="/dashboard" className="flex items-center gap-2 text-zinc-400 hover:text-white transition-colors text-sm font-medium">
          <ArrowLeft className="w-4 h-4" />
          Back to Dashboard
        </Link>
        <div className="ml-auto w-1/3 bg-zinc-900 rounded-full h-2 overflow-hidden shadow-inner">
          <div 
            className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 transition-all duration-300 ease-out"
            style={{ width: `${progress}%` }}
          />
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-3xl mx-auto pt-20 px-6 pb-20 relative">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-indigo-500/10 blur-[120px] rounded-full pointer-events-none -z-10" />

        <AnimatePresence mode="wait">
          {currentStep === 0 ? (
            <motion.div
              key="intro"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="bg-zinc-900/40 border border-white/10 rounded-2xl p-10 max-w-xl mx-auto text-center"
            >
              <h1 className="text-3xl font-bold font-heading mb-4">Validate New Idea</h1>
              <p className="text-zinc-400 mb-8">Answer 10 critical UX-designed questions to evaluate the market viability of your startup idea. Your progress is saved automatically.</p>
              
              <div className="mb-8 text-left">
                <label className="text-sm font-medium text-zinc-300 block mb-2">Idea Name</label>
                <input
                  type="text"
                  value={ideaTitle}
                  onChange={(e) => setIdeaTitle(e.target.value)}
                  placeholder="e.g. AI Recipe Generator"
                  className="w-full bg-black/50 border border-white/10 rounded-xl py-3 px-4 text-white placeholder:text-zinc-600 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <button
                onClick={nextStep}
                disabled={!ideaTitle.trim()}
                className="w-full bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl py-3 px-4 font-medium transition-all flex items-center justify-center gap-2 disabled:opacity-50"
              >
                Begin Questionnaire
                <ArrowRight className="w-4 h-4" />
              </button>
            </motion.div>
          ) : currentStep <= VALIDATION_QUESTIONS.length ? (
            <motion.div
              key={`q${currentStep}`}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
            >
              <div className="mb-2 text-indigo-400 font-medium text-sm">Question {currentStep} of {VALIDATION_QUESTIONS.length}</div>
              <h2 className="text-3xl font-bold font-heading mb-3">{VALIDATION_QUESTIONS[currentStep - 1].title}</h2>
              <p className="text-zinc-400 text-lg mb-8">{VALIDATION_QUESTIONS[currentStep - 1].desc}</p>

              <div className="space-y-3">
                {VALIDATION_QUESTIONS[currentStep - 1].options.map((opt, i) => {
                  const score = i + 1;
                  const isSelected = answers[VALIDATION_QUESTIONS[currentStep - 1].id] === score;
                  return (
                    <button
                      key={score}
                      onClick={() => handleSelect(VALIDATION_QUESTIONS[currentStep - 1].id, score)}
                      className={`w-full text-left p-5 rounded-xl border transition-all flex items-center justify-between ${
                        isSelected 
                          ? "bg-indigo-500/10 border-indigo-500 text-white" 
                          : "bg-zinc-900/40 border-white/5 text-zinc-300 hover:bg-zinc-800/40 hover:border-white/10"
                      }`}
                    >
                      <span>{opt}</span>
                      {isSelected && <CheckCircle className="w-5 h-5 text-indigo-500" />}
                    </button>
                  );
                })}
              </div>

              <div className="mt-12 flex items-center justify-between">
                <button
                  onClick={prevStep}
                  className="px-6 py-3 rounded-xl border border-white/10 text-white hover:bg-white/5 font-medium transition-all"
                >
                  Previous
                </button>

                <button
                  onClick={currentStep === VALIDATION_QUESTIONS.length ? finishValidation : nextStep}
                  disabled={!answers[VALIDATION_QUESTIONS[currentStep - 1].id]}
                  className="px-8 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-medium transition-all flex items-center gap-2 disabled:opacity-50"
                >
                  {currentStep === VALIDATION_QUESTIONS.length ? "Finish & Calculate Score" : "Next Question"}
                  {currentStep !== VALIDATION_QUESTIONS.length && <ArrowRight className="w-4 h-4" />}
                </button>
              </div>
            </motion.div>
          ) : null}
        </AnimatePresence>
      </main>
    </div>
  );
}
