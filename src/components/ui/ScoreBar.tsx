"use client";

import { motion } from "framer-motion";

interface ScoreBarProps {
  score: number;
  label: string;
}

export function ScoreBar({ score, label }: ScoreBarProps) {
  return (
    <div className="w-full space-y-4">
      <div className="flex justify-between items-end">
        <h4 className="text-white font-semibold text-lg">{label}</h4>
        <div className="text-4xl font-bold text-gradient">{score}%</div>
      </div>
      <div className="h-4 w-full bg-white/5 rounded-full overflow-hidden border border-white/10">
        <motion.div
          initial={{ width: 0 }}
          whileInView={{ width: `${score}%` }}
          viewport={{ once: true }}
          transition={{ duration: 1.5, ease: "easeOut", delay: 0.2 }}
          className="h-full bg-gradient-to-r from-electric-blue via-violet-glow to-neon-cyan shadow-[0_0_15px_rgba(59,130,246,0.5)]"
        />
      </div>
    </div>
  );
}

export function ViabilityDisplay({ score }: { score: number }) {
  return (
    <div className="p-8 rounded-3xl bg-brand-purple/20 border border-white/10 backdrop-blur-xl neon-border">
      <h3 className="text-3xl font-bold text-white mb-8 text-center font-heading">Startup Viability Score</h3>
      
      <div className="flex justify-center mb-10">
        <div className="relative w-48 h-48 flex items-center justify-center">
            {/* SVG Circle for progress */}
            <svg className="w-full h-full transform -rotate-90">
                <circle
                    cx="96"
                    cy="96"
                    r="88"
                    stroke="currentColor"
                    strokeWidth="8"
                    fill="transparent"
                    className="text-white/5"
                />
                <motion.circle
                    cx="96"
                    cy="96"
                    r="88"
                    stroke="currentColor"
                    strokeWidth="12"
                    fill="transparent"
                    strokeDasharray={552.92}
                    initial={{ strokeDashoffset: 552.92 }}
                    whileInView={{ strokeDashoffset: 552.92 * (1 - score / 100) }}
                    viewport={{ once: true }}
                    transition={{ duration: 1.5, ease: "easeOut" }}
                    className="text-violet-glow drop-shadow-[0_0_10px_rgba(139,92,246,0.5)]"
                    strokeLinecap="round"
                />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-6xl font-bold text-white">{score}</span>
                <span className="text-zinc-500 text-sm font-semibold uppercase tracking-widest">Score</span>
            </div>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: "Market size", score: 85, color: "text-blue-400" },
          { label: "Competitors", score: 62, color: "text-purple-400" },
          { label: "Monetization", score: 78, color: "text-cyan-400" },
          { label: "Viral Potential", score: 91, color: "text-emerald-400" },
        ].map((item, i) => (
          <div key={i} className="text-center p-4 rounded-2xl bg-white/5 border border-white/5">
            <div className={`text-xl font-bold ${item.color} mb-1`}>{item.score}%</div>
            <div className="text-[10px] text-zinc-500 font-bold uppercase tracking-wider">{item.label}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
