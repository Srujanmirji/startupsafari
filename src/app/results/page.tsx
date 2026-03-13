"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Navbar } from "@/components/ui/Navbar";
import { ViabilityDisplay } from "@/components/ui/ScoreBar";
import { api } from "@/services/api";
import { ArrowLeft, Download, Share2, Lightbulb, AlertTriangle, CheckCircle2 } from "lucide-react";
import Link from "next/link";

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

function ResultsContent() {
  const searchParams = useSearchParams();
  const ideaId = searchParams.get("id");
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    if (!ideaId) return;
    const fetchResults = async () => {
      const { data } = await api.getResults(ideaId);
      setResult(data);
      setLoading(false);
    };
    fetchResults();
  }, [ideaId]);

  if (loading) return <div className="min-h-screen bg-[#05050f] flex items-center justify-center text-white">Generating Report...</div>;
  if (!result) return <div className="min-h-screen bg-[#05050f] flex items-center justify-center text-white">Idea not found.</div>;

  return (
    <div className="min-h-screen bg-[#05050f] text-white">
      <Navbar />
      
      <main className="pt-32 pb-20 px-6 max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12 gap-6">
          <div>
            <Link href="/dashboard" className="flex items-center gap-2 text-zinc-500 hover:text-white transition-colors mb-4 text-sm font-bold uppercase tracking-widest">
              <ArrowLeft className="w-4 h-4" />
              Back to Dashboard
            </Link>
            <h1 className="text-4xl md:text-5xl font-bold font-heading">{result.title || "Your Startup Idea"}</h1>
          </div>
          <div className="flex gap-4">
            <button className="flex items-center gap-2 bg-white/5 border border-white/10 px-5 py-2.5 rounded-xl font-bold hover:bg-white/10 transition-colors">
              <Download className="w-5 h-5" />
              Export PDF
            </button>
            <button className="flex items-center gap-2 bg-electric-blue text-white px-5 py-2.5 rounded-xl font-bold hover:opacity-90 transition-colors shadow-lg shadow-electric-blue/20">
              <Share2 className="w-5 h-5" />
              Share Report
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
          {/* Main Score Display */}
          <div className="lg:col-span-2">
            <ViabilityDisplay score={result.score} />
          </div>

          {/* Quick Summary Card */}
          <div className="space-y-6">
            <div className="p-8 rounded-3xl bg-white/5 border border-white/10 backdrop-blur-xl h-full">
                <h3 className="text-xl font-bold mb-6 font-heading flex items-center gap-2">
                    <Lightbulb className="w-5 h-5 text-yellow-400" />
                    Quick Summary
                </h3>
                <div className="space-y-6">
                    <div className="flex gap-4">
                        <CheckCircle2 className="w-5 h-5 text-emerald-400 flex-shrink-0" />
                        <div>
                            <p className="text-sm font-bold text-white mb-1">Key Strength</p>
                            <p className="text-xs text-zinc-500">Strong market demand with low direct competition in the niche tier.</p>
                        </div>
                    </div>
                    <div className="flex gap-4">
                        <AlertTriangle className="w-5 h-5 text-amber-400 flex-shrink-0" />
                        <div>
                            <p className="text-sm font-bold text-white mb-1">Critical Risk</p>
                            <p className="text-xs text-zinc-500">High operational complexity could lead to scaling bottlenecks early on.</p>
                        </div>
                    </div>
                    <div className="pt-6 border-t border-white/5">
                        <p className="text-xs text-zinc-400 leading-relaxed italic">
                            "This idea has high potential if you focus on automation from day one. Expect the Cheetah's timeline to be tight."
                        </p>
                    </div>
                </div>
            </div>
          </div>
        </div>

        {/* Expert Deep Dives */}
        <h2 className="text-3xl font-bold mb-8 font-heading">Expert Deep Dives</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {EXPERTS.map((expert, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className="p-6 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/[0.08] transition-colors group"
            >
              <div className="text-4xl mb-4 group-hover:scale-110 transition-transform">{expert.icon}</div>
              <h4 className="text-lg font-bold text-white mb-1">{expert.name}</h4>
              <p className="text-[10px] font-bold uppercase tracking-widest text-[#60a5fa] mb-4" style={{ color: expert.color }}>
                {expert.name === 'Fox' ? 'Logic Analysis' : expert.name === 'Owl' ? 'Intelligence' : 'Evaluation'}
              </p>
              <p className="text-zinc-500 text-sm leading-relaxed">
                {result.insights?.[expert.name] || "Analyzing deeper market factors..."}
              </p>
            </motion.div>
          ))}
        </div>
      </main>
    </div>
  );
}

export default function ResultsPage() {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <ResultsContent />
        </Suspense>
    );
}
