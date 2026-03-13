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
    <div className="mt-16 p-8 rounded-[2rem] bg-white/[0.02] border border-white/5 backdrop-blur-3xl">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
          <div className="p-3 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
            <RefreshCw className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-2xl font-bold font-heading">Evolution Tracker</h3>
            <p className="text-zinc-500 text-sm">Track your idea's growth across versions</p>
          </div>
        </div>
        <Link 
          href={`/submit?refine=${ideaId}`}
          className="flex items-center gap-2 bg-white/5 border border-white/10 px-5 py-2.5 rounded-xl font-bold text-sm hover:bg-white/10 transition-colors"
        >
          <RefreshCw className="w-4 h-4" />
          Re-Evaluate Idea
        </Link>
      </div>

      {/* Score Timeline */}
      <div className="flex items-end gap-4 h-40 mb-6">
        {versions.map((v, i) => {
          const barHeight = `${Math.max(v.score, 10)}%`;
          const isLatest = i === versions.length - 1;
          return (
            <motion.div
              key={i}
              initial={{ height: 0 }}
              animate={{ height: barHeight }}
              transition={{ delay: i * 0.15, duration: 0.6, ease: "easeOut" }}
              className={`relative flex-1 rounded-t-xl transition-all ${
                isLatest ? 'bg-gradient-to-t from-electric-blue to-violet-glow' : 'bg-white/10'
              }`}
            >
              <div className={`absolute -top-8 left-1/2 -translate-x-1/2 text-xs font-bold ${isLatest ? 'text-white' : 'text-zinc-500'}`}>
                {v.score}%
              </div>
              <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 text-[10px] font-bold text-zinc-600 whitespace-nowrap">
                V{v.version}
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Diff Summary */}
      <div className="mt-12 flex items-center justify-center gap-3 p-4 rounded-xl bg-white/5 border border-white/10">
        {diff > 0 ? (
          <TrendingUp className="w-5 h-5 text-emerald-400" />
        ) : diff < 0 ? (
          <TrendingDown className="w-5 h-5 text-red-400" />
        ) : (
          <Minus className="w-5 h-5 text-zinc-400" />
        )}
        <span className={`text-sm font-bold ${diff > 0 ? 'text-emerald-400' : diff < 0 ? 'text-red-400' : 'text-zinc-400'}`}>
          {diff > 0 ? `+${diff}%` : `${diff}%`} since last version
        </span>
      </div>
    </div>
  );
}
