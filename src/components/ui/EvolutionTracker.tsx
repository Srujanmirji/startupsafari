"use client";

import { motion } from "framer-motion";
import { RefreshCw, TrendingUp, TrendingDown, Minus } from "lucide-react";
import Link from "next/link";

interface Version {
  version: number;
  score: number;
  date: string;
}

export function EvolutionTracker({ ideaId, versions }: { ideaId: string; versions: Version[] }) {
  if (!versions || versions.length <= 1) return null;

  const latest = versions[versions.length - 1];
  const previous = versions[versions.length - 2];
  const diff = latest.score - previous.score;

  return (
    <motion.div 
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="mt-16 p-10 rounded-[3rem] bg-white/[0.02] border border-white/5 backdrop-blur-3xl relative overflow-hidden group hover:border-emerald-500/20 transition-all duration-700"
    >
      {/* Background Accent */}
      <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-emerald-500/[0.02] rounded-full blur-[100px] -mr-48 -mt-48 group-hover:bg-emerald-500/[0.05] transition-all duration-700" />

      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-12 gap-6 relative z-10">
        <div className="flex items-center gap-5">
          <div className="p-4 rounded-[1.25rem] bg-gradient-to-br from-emerald-500/20 to-teal-500/10 border border-emerald-500/20 text-emerald-400 shadow-[0_0_20px_rgba(16,185,129,0.1)] group-hover:scale-110 group-hover:shadow-emerald-500/30 transition-all duration-500">
            <RefreshCw className="w-8 h-8" />
          </div>
          <div>
            <h3 className="text-2xl font-bold font-heading text-white bg-gradient-to-r from-white to-zinc-500 bg-clip-text text-transparent">Evolution Tracker</h3>
            <p className="text-zinc-500 text-sm font-medium">Track your idea's growth across versions</p>
          </div>
        </div>
        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
          <Link 
            href={`/submit?refine=${ideaId}`}
            className="flex items-center gap-2.5 bg-white/5 border border-white/10 px-6 py-3.5 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-white/10 hover:border-white/20 transition-all backdrop-blur-sm"
          >
            <RefreshCw className="w-4 h-4 text-emerald-400" />
            Re-Evaluate Idea
          </Link>
        </motion.div>
      </div>

      {/* Score Timeline */}
      <div className="flex items-end gap-5 h-56 mb-12 px-2 relative z-10">
        {versions.map((v, i) => {
          const barHeight = `${Math.max(v.score, 15)}%`;
          const isLatest = i === versions.length - 1;
          return (
            <div key={i} className="relative flex-1 group/bar lg:max-w-[120px]">
              <motion.div
                initial={{ height: 0 }}
                animate={{ height: barHeight }}
                transition={{ delay: i * 0.15, duration: 0.8, ease: [0.33, 1, 0.68, 1] }}
                className={`relative w-full rounded-t-2xl transition-all duration-500 shadow-lg ${
                  isLatest 
                    ? 'bg-gradient-to-t from-electric-blue to-violet-glow shadow-electric-blue/20 ring-1 ring-white/20' 
                    : 'bg-white/[0.05] border border-white/5 group-hover/bar:bg-white/10'
                }`}
              >
                {/* Score Bubble */}
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.8 + i * 0.1 }}
                  className={`absolute -top-10 left-1/2 -translate-x-1/2 text-sm font-black tracking-wider ${isLatest ? 'text-white drop-shadow-[0_0_8px_rgba(59,130,246,0.5)]' : 'text-zinc-500'}`}
                >
                  {v.score}%
                </motion.div>

                {/* Glow for latest */}
                {isLatest && (
                  <div className="absolute inset-0 bg-white/10 opacity-0 group-hover/bar:opacity-100 transition-opacity rounded-t-2xl pointer-events-none" />
                )}
              </motion.div>
              
              {/* Version Label */}
              <div className="absolute -bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1">
                <span className={`text-[10px] font-black uppercase tracking-[0.2em] ${isLatest ? 'text-electric-blue' : 'text-zinc-600'}`}>
                  V{v.version}
                </span>
                <span className="text-[8px] font-bold text-zinc-700 whitespace-nowrap hidden sm:block">
                  {new Date(v.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Diff Summary */}
      <motion.div 
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ delay: 1 }}
        className="mt-14 flex items-center justify-center gap-4 py-6 rounded-[1.5rem] bg-white/[0.03] border border-white/5 relative z-10"
      >
        <div className={`p-2 rounded-lg ${diff > 0 ? 'bg-emerald-500/10' : 'bg-red-500/10'}`}>
          {diff > 0 ? (
            <TrendingUp className="w-5 h-5 text-emerald-400" />
          ) : diff < 0 ? (
            <TrendingDown className="w-5 h-5 text-red-400" />
          ) : (
            <Minus className="w-5 h-5 text-zinc-400" />
          )}
        </div>
        <span className={`text-base font-bold tracking-tight ${diff > 0 ? 'text-emerald-400' : diff < 0 ? 'text-red-400' : 'text-zinc-400'}`}>
          {diff > 0 ? `+${diff}` : diff}% growth <span className="text-zinc-500 font-medium tracking-normal text-sm">since your last Safari</span>
        </span>
      </motion.div>
    </motion.div>
  );
}
