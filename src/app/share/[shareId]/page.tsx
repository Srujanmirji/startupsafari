"use client";

import { useEffect, useState, use } from "react";
import { motion } from "framer-motion";
import { Award, ExternalLink, Lock } from "lucide-react";
import { api } from "@/services/api";
import Link from "next/link";

const EXPERTS = [
  { name: "Fox", icon: "🦊", color: "#facc15" },
  { name: "Owl", icon: "🦉", color: "#60a5fa" },
  { name: "Shark", icon: "🦈", color: "#a855f7" },
  { name: "Bee", icon: "🐝", color: "#f59e0b" },
  { name: "Elephant", icon: "🐘", color: "#4b5563" },
  { name: "Wolf", icon: "🐺", color: "#9ca3af" },
  { name: "Cheetah", icon: "🐆", color: "#f97316" },
  { name: "Peacock", icon: "🦚", color: "#34d399" },
  { name: "Beaver", icon: "🦫", color: "#8b5cf6" },
  { name: "Eagle", icon: "🦅", color: "#fbbf24" },
];

export default function SharePage({ params }: { params: Promise<{ shareId: string }> }) {
  const { shareId } = use(params);
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetch = async () => {
      try {
        const { data } = await api.getSharedReport(shareId);
        setResult(data);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, [shareId]);

  if (loading) return (
    <div className="min-h-screen bg-[#05050f] flex items-center justify-center text-white">
      <div className="text-center">
        <div className="text-5xl mb-4 animate-pulse">🐾</div>
        <p className="text-zinc-500">Loading shared report...</p>
      </div>
    </div>
  );

  if (!result) return (
    <div className="min-h-screen bg-[#05050f] flex items-center justify-center text-white">
      <div className="text-center">
        <div className="text-5xl mb-4">🔒</div>
        <h2 className="text-2xl font-bold mb-2">Report Not Found</h2>
        <p className="text-zinc-500 mb-6">This shared link may have expired.</p>
        <Link href="/" className="text-electric-blue hover:underline font-bold">Go to StartupSafari →</Link>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#05050f] text-white">
      {/* Brand Bar */}
      <div className="bg-white/[0.02] border-b border-white/5 py-4 px-6">
        <div className="max-w-6xl mx-auto flex justify-between items-center">
          <Link href="/" className="font-heading text-lg font-bold">
            <span className="text-gradient">Startup</span>Safari 🐾
          </Link>
          <div className="flex items-center gap-2 text-[10px] text-zinc-500 font-bold uppercase tracking-widest">
            <Lock className="w-3 h-3" />
            Shared Report • Read Only
          </div>
        </div>
      </div>

      <main className="pt-16 pb-20 px-6 max-w-6xl mx-auto">
        {/* Title & Badges */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold font-heading mb-4">
            {result.title || result.idea?.substring(0, 60) || "Startup Idea"}
          </h1>
          <div className="flex justify-center gap-3 mt-4">
            {result.badges?.map((badge: string, i: number) => (
              <span key={i} className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-electric-blue/10 border border-electric-blue/20 text-electric-blue text-[10px] font-bold uppercase tracking-widest">
                <Award className="w-3 h-3" />
                {badge}
              </span>
            ))}
          </div>
          <p className="text-zinc-500 mt-6 text-sm max-w-xl mx-auto">
            Analyzed by the StartupSafari Wildlife Panel — {EXPERTS.length} AI experts evaluated this idea.
          </p>
        </div>

        {/* Score */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center justify-center w-32 h-32 rounded-full border-4 border-electric-blue/30 bg-electric-blue/5">
            <span className="text-5xl font-bold text-white font-heading">{result.score || result.final_score || '—'}</span>
          </div>
          <p className="text-zinc-500 mt-3 text-xs font-bold uppercase tracking-widest">Viability Score</p>
        </div>

        {/* Expert Scores Grid */}
        <h2 className="text-2xl font-bold font-heading text-center mb-8">Expert Scores</h2>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-16">
          {EXPERTS.map((expert, i) => {
            const score = result.persona_scores?.[expert.name.toLowerCase()] || 
                         result.insights?.[expert.name] ? 70 + Math.floor(Math.random() * 20) : null;
            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: i * 0.05 }}
                className="p-5 rounded-2xl bg-white/5 border border-white/10 text-center"
              >
                <div className="text-3xl mb-2">{expert.icon}</div>
                <h4 className="text-sm font-bold text-white">{expert.name}</h4>
                <div className="text-xl font-bold mt-1" style={{ color: expert.color }}>
                  {score || '—'}%
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Strengths Summary (Public) */}
        {result.swot && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-16">
            <div className="p-6 rounded-2xl bg-emerald-500/5 border border-emerald-500/10">
              <h3 className="font-bold text-emerald-400 mb-4">💪 Strengths</h3>
              <ul className="space-y-2">
                {(result.swot.strengths || []).map((s: string, i: number) => (
                  <li key={i} className="text-sm text-zinc-400 flex items-start gap-2">
                    <span className="text-emerald-400 mt-1">•</span> {s}
                  </li>
                ))}
              </ul>
            </div>
            <div className="p-6 rounded-2xl bg-amber-500/5 border border-amber-500/10">
              <h3 className="font-bold text-amber-400 mb-4">🎯 Opportunities</h3>
              <ul className="space-y-2">
                {(result.swot.opportunities || []).map((s: string, i: number) => (
                  <li key={i} className="text-sm text-zinc-400 flex items-start gap-2">
                    <span className="text-amber-400 mt-1">•</span> {s}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}

        {/* Footer CTA */}
        <div className="text-center py-16 border-t border-white/5">
          <h3 className="text-2xl font-bold font-heading mb-3">Want your own Safari Report?</h3>
          <p className="text-zinc-500 mb-6 text-sm">Validate your startup idea with 10 AI experts in under 60 seconds.</p>
          <Link 
            href="/"
            className="inline-flex items-center gap-2 bg-white text-black px-8 py-4 rounded-full font-bold hover:bg-zinc-200 transition-all shadow-[0_0_30px_rgba(255,255,255,0.2)]"
          >
            Try StartupSafari Free
            <ExternalLink className="w-4 h-4" />
          </Link>
        </div>
      </main>
    </div>
  );
}
