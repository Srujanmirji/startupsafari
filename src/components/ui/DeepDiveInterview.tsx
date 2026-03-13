"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, ArrowRight, Loader2, CheckCircle2 } from "lucide-react";

const INTERVIEW_QUESTIONS = [
  { id: "problem", label: "What specific problem does your idea solve?", placeholder: "e.g. Freelancers struggle to find reliable project management tools..." },
  { id: "audience", label: "Who is your ideal first customer?", placeholder: "e.g. Small business owners, college students, remote workers..." },
  { id: "solution", label: "How does your solution work in one sentence?", placeholder: "e.g. An AI-powered app that auto-schedules tasks based on deadlines..." },
  { id: "revenue", label: "How will you make money?", placeholder: "e.g. Monthly subscription of ₹499, Freemium model, Commission-based..." },
  { id: "competition", label: "Who are your biggest competitors? What makes you different?", placeholder: "e.g. Trello and Asana exist, but we focus on AI-driven automation..." },
  { id: "traction", label: "Any traction, users, or validation so far?", placeholder: "e.g. 50 beta signups, 3 paying customers, or just an idea stage..." }
];

interface DeepDiveInterviewProps {
  onComplete: (answers: Record<string, string>) => void;
  onSkip: () => void;
}

export function DeepDiveInterview({ onComplete, onSkip }: DeepDiveInterviewProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [currentAnswer, setCurrentAnswer] = useState("");

  const question = INTERVIEW_QUESTIONS[currentStep];
  const progress = ((currentStep) / INTERVIEW_QUESTIONS.length) * 100;

  const handleNext = () => {
    if (!currentAnswer.trim()) return;
    
    const updated = { ...answers, [question.id]: currentAnswer.trim() };
    setAnswers(updated);
    setCurrentAnswer("");

    if (currentStep < INTERVIEW_QUESTIONS.length - 1) {
      setCurrentStep(prev => prev + 1);
    } else {
      onComplete(updated);
    }
  };

  return (
    <div className="p-8 sm:p-10 rounded-[2rem] bg-white/5 border border-white/10 backdrop-blur-xl relative overflow-hidden">
      {/* Progress Bar */}
      <div className="mb-8">
        <div className="flex justify-between items-center mb-3">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-electric-blue" />
            <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Deep Dive Interview</span>
          </div>
          <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">
            {currentStep + 1} / {INTERVIEW_QUESTIONS.length}
          </span>
        </div>
        <div className="w-full h-1 bg-white/5 rounded-full overflow-hidden">
          <motion.div
            className="h-full bg-gradient-to-r from-electric-blue to-violet-glow rounded-full"
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.5, ease: "easeOut" }}
          />
        </div>
      </div>

      {/* Completed Answers */}
      <div className="space-y-3 mb-8">
        {Object.entries(answers).map(([key, val]) => {
          const q = INTERVIEW_QUESTIONS.find(q => q.id === key);
          return (
            <div key={key} className="flex items-start gap-3 p-3 rounded-xl bg-emerald-500/5 border border-emerald-500/10">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 mt-0.5 flex-shrink-0" />
              <div>
                <p className="text-[10px] text-emerald-400 font-bold uppercase tracking-widest">{q?.label.split("?")[0]}</p>
                <p className="text-xs text-zinc-400 mt-1 line-clamp-1">{val}</p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Current Question */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentStep}
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -30 }}
          transition={{ duration: 0.3 }}
          className="space-y-4"
        >
          <label className="text-lg font-bold text-white font-heading">{question.label}</label>
          <textarea
            autoFocus
            value={currentAnswer}
            onChange={(e) => setCurrentAnswer(e.target.value)}
            placeholder={question.placeholder}
            rows={3}
            className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-white text-sm focus:outline-none focus:border-electric-blue/50 transition-all resize-none placeholder:text-zinc-600"
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleNext();
              }
            }}
          />
        </motion.div>
      </AnimatePresence>

      {/* Actions */}
      <div className="flex justify-between items-center mt-6">
        <button
          type="button"
          onClick={onSkip}
          className="text-xs text-zinc-500 hover:text-white transition-colors font-bold uppercase tracking-widest"
        >
          Skip Deep Dive
        </button>
        <button
          type="button"
          onClick={handleNext}
          disabled={!currentAnswer.trim()}
          className="flex items-center gap-2 bg-electric-blue text-white px-6 py-3 rounded-xl font-bold hover:opacity-90 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {currentStep === INTERVIEW_QUESTIONS.length - 1 ? "Finish & Analyze" : "Next Question"}
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
