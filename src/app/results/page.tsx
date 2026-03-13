"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Navbar } from "@/components/ui/Navbar";
import { ViabilityDisplay } from "@/components/ui/ScoreBar";
import { api } from "@/services/api";
import { ArrowLeft, Download, Share2, Lightbulb, AlertTriangle, CheckCircle2, MessageSquare, Award, Link2, Check } from "lucide-react";
import Link from "next/link";
import { ExpertChatDrawer } from "@/components/ui/ExpertChatDrawer";
import { PitchDeckSection } from "@/components/ui/PitchDeckSection";
import { AdvancedInsights } from "@/components/ui/AdvancedInsights";
import { EvolutionTracker } from "@/components/ui/EvolutionTracker";
import { HackersToolkit } from "@/components/ui/HackersToolkit";
import { CoFounderMatcher } from "@/components/ui/CoFounderMatcher";

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

function ResultsContent() {
  const searchParams = useSearchParams();
  const ideaId = searchParams.get("id");
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [activeChatExpert, setActiveChatExpert] = useState<any>(null);
  const [versions, setVersions] = useState<any[]>([]);
  const [shareUrl, setShareUrl] = useState<string | null>(null);
  const [shareCopied, setShareCopied] = useState(false);
  const router = useRouter();

  useEffect(() => {
    if (!ideaId) return;
    const fetchResults = async () => {
      try {
        const { data } = await api.getResults(ideaId);
        setResult(data);
        const { data: vData } = await api.getIdeaVersions(ideaId);
        setVersions(vData);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchResults();
  }, [ideaId]);

  if (loading) return <div className="min-h-screen bg-[#05050f] flex items-center justify-center text-white">Generating Report...</div>;
  if (!result) return <div className="min-h-screen bg-[#05050f] flex items-center justify-center text-white">Idea not found.</div>;

  return (
    <div className="min-h-screen bg-[#05050f] text-white relative overflow-hidden">
      {/* Animated Background Orbs */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-electric-blue/[0.07] rounded-full blur-[120px] animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] bg-violet-glow/[0.06] rounded-full blur-[100px] animate-pulse" style={{ animationDelay: '2s' }} />
        <div className="absolute top-1/2 left-1/2 w-[300px] h-[300px] bg-neon-cyan/[0.04] rounded-full blur-[80px] animate-pulse" style={{ animationDelay: '4s' }} />
      </div>

      <Navbar />
      
      <main className="pt-32 pb-20 px-6 max-w-7xl mx-auto relative z-10">
        {/* Header */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12 gap-6"
        >
          <div>
            <Link href="/dashboard" className="flex items-center gap-2 text-zinc-500 hover:text-electric-blue transition-colors mb-4 text-sm font-bold uppercase tracking-widest group">
              <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
              Back to Dashboard
            </Link>
            <div className="flex flex-wrap items-center gap-4">
              <h1 className="text-4xl md:text-5xl font-bold font-heading bg-gradient-to-r from-white via-zinc-200 to-zinc-400 bg-clip-text text-transparent">{result.title || "Your Startup Idea"}</h1>
              {result.badges?.map((badge: string, i: number) => (
                <motion.div 
                  key={i} 
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.5 + i * 0.15, type: "spring" }}
                  className="flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-gradient-to-r from-electric-blue/20 to-violet-glow/20 border border-electric-blue/30 text-electric-blue text-[10px] font-bold uppercase tracking-widest shadow-[0_0_20px_rgba(59,130,246,0.15)]"
                >
                  <Award className="w-3 h-3" />
                  {badge}
                </motion.div>
              ))}
            </div>
          </div>
          <div className="flex gap-3" data-print-hide>
            <motion.button 
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => window.print()}
              className="flex items-center gap-2 bg-white/5 border border-white/10 px-5 py-2.5 rounded-xl font-bold hover:bg-white/10 hover:border-white/20 transition-all backdrop-blur-sm"
            >
              <Download className="w-5 h-5" />
              Export PDF
            </motion.button>
            <motion.button 
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={async () => {
                const { data } = await api.generateShareLink(ideaId!);
                setShareUrl(data.url);
                navigator.clipboard.writeText(data.url);
                setShareCopied(true);
                setTimeout(() => setShareCopied(false), 3000);
              }}
              className="flex items-center gap-2 bg-gradient-to-r from-electric-blue to-violet-glow text-white px-5 py-2.5 rounded-xl font-bold hover:opacity-90 transition-all shadow-[0_0_25px_rgba(59,130,246,0.3)]"
            >
              {shareCopied ? <Check className="w-5 h-5" /> : <Share2 className="w-5 h-5" />}
              {shareCopied ? 'Link Copied!' : 'Share Report'}
            </motion.button>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
          {/* Main Score Display */}
          <div className="lg:col-span-2">
            <ViabilityDisplay score={result.final_score || result.score} />
          </div>

          {/* Quick Summary Card */}
          <div className="space-y-6">
            <div className="p-8 rounded-3xl bg-white/5 border border-white/10 backdrop-blur-xl h-full">
                <h3 className="text-xl font-bold mb-6 font-heading flex items-center gap-2">
                    <Lightbulb className="w-5 h-5 text-yellow-400" />
                    Safari Summary
                </h3>
                <div className="space-y-6">
                    <div className="flex gap-4">
                        <CheckCircle2 className="w-5 h-5 text-emerald-400 flex-shrink-0" />
                        <div>
                            <p className="text-sm font-bold text-white mb-1">Strengths</p>
                            <p className="text-xs text-zinc-500 line-clamp-2">{result.swot?.strengths?.[0] || "Identifying core market advantages..."}</p>
                        </div>
                    </div>
                    <div className="flex gap-4">
                        <AlertTriangle className="w-5 h-5 text-amber-400 flex-shrink-0" />
                        <div>
                            <p className="text-sm font-bold text-white mb-1">Risks</p>
                            <p className="text-xs text-zinc-500 line-clamp-2">{result.swot?.weaknesses?.[0] || "Analyzing potential scaling barriers..."}</p>
                        </div>
                    </div>
                    <div className="pt-6 border-t border-white/5">
                        <p className="text-xs text-zinc-400 leading-relaxed italic">
                          {result.insights?.Fox || "The Wildlife Panel is currently concluding their final deliberation on your startup's trajectory."}
                        </p>
                    </div>
                </div>
            </div>
          </div>
        </div>

        {/* SWOT Summary Output */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mb-12"
        >
          <h2 className="text-3xl font-bold mb-8 font-heading flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-gradient-to-br from-amber-500/20 to-orange-500/10 border border-amber-500/20 shadow-[0_0_15px_rgba(245,158,11,0.1)]">
              <AlertTriangle className="w-6 h-6 text-amber-400" />
            </div>
            SWOT Analysis
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {/* Strengths */}
            <motion.div 
              initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.4 }}
              className="p-6 rounded-2xl bg-gradient-to-br from-emerald-500/[0.08] to-emerald-900/[0.03] border border-emerald-500/15 relative overflow-hidden group hover:border-emerald-500/30 hover:shadow-[0_0_30px_rgba(16,185,129,0.08)] transition-all duration-500"
            >
              <div className="absolute -top-4 -right-4 text-[80px] opacity-[0.06] group-hover:opacity-[0.1] transition-opacity duration-500 pointer-events-none">💪</div>
              <h4 className="text-sm font-bold uppercase tracking-widest text-emerald-400 mb-4 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4" /> Strengths
              </h4>
              <ul className="space-y-3">
                {(result.swot?.strengths || ["Strong problem-solution fit", "Clear target audience"]).map((s: string, i: number) => (
                  <li key={i} className="text-sm text-zinc-300 flex items-start gap-3 group/item">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 mt-2 flex-shrink-0 group-hover/item:shadow-[0_0_6px_rgba(16,185,129,0.6)]" /> {s}
                  </li>
                ))}
              </ul>
            </motion.div>

            {/* Weaknesses */}
            <motion.div 
              initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.5 }}
              className="p-6 rounded-2xl bg-gradient-to-br from-rose-500/[0.08] to-rose-900/[0.03] border border-rose-500/15 relative overflow-hidden group hover:border-rose-500/30 hover:shadow-[0_0_30px_rgba(225,29,72,0.08)] transition-all duration-500"
            >
              <div className="absolute -top-4 -right-4 text-[80px] opacity-[0.06] group-hover:opacity-[0.1] transition-opacity duration-500 pointer-events-none">⚠️</div>
              <h4 className="text-sm font-bold uppercase tracking-widest text-rose-400 mb-4 flex items-center gap-2">
                <AlertTriangle className="w-4 h-4" /> Weaknesses
              </h4>
              <ul className="space-y-3">
                {(result.swot?.weaknesses || ["Unproven revenue model", "Small initial team"]).map((w: string, i: number) => (
                  <li key={i} className="text-sm text-zinc-300 flex items-start gap-3 group/item">
                    <span className="w-1.5 h-1.5 rounded-full bg-rose-400 mt-2 flex-shrink-0 group-hover/item:shadow-[0_0_6px_rgba(225,29,72,0.6)]" /> {w}
                  </li>
                ))}
              </ul>
            </motion.div>

            {/* Opportunities */}
            <motion.div 
              initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.6 }}
              className="p-6 rounded-2xl bg-gradient-to-br from-blue-500/[0.08] to-blue-900/[0.03] border border-blue-500/15 relative overflow-hidden group hover:border-blue-500/30 hover:shadow-[0_0_30px_rgba(59,130,246,0.08)] transition-all duration-500"
            >
              <div className="absolute -top-4 -right-4 text-[80px] opacity-[0.06] group-hover:opacity-[0.1] transition-opacity duration-500 pointer-events-none">🚀</div>
              <h4 className="text-sm font-bold uppercase tracking-widest text-blue-400 mb-4 flex items-center gap-2">
                <Lightbulb className="w-4 h-4" /> Opportunities
              </h4>
              <ul className="space-y-3">
                {(result.swot?.opportunities || ["Growing market demand", "Low competition in niche"]).map((o: string, i: number) => (
                  <li key={i} className="text-sm text-zinc-300 flex items-start gap-3 group/item">
                    <span className="w-1.5 h-1.5 rounded-full bg-blue-400 mt-2 flex-shrink-0 group-hover/item:shadow-[0_0_6px_rgba(59,130,246,0.6)]" /> {o}
                  </li>
                ))}
              </ul>
            </motion.div>

            {/* Threats */}
            <motion.div 
              initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.7 }}
              className="p-6 rounded-2xl bg-gradient-to-br from-amber-500/[0.08] to-amber-900/[0.03] border border-amber-500/15 relative overflow-hidden group hover:border-amber-500/30 hover:shadow-[0_0_30px_rgba(245,158,11,0.08)] transition-all duration-500"
            >
              <div className="absolute -top-4 -right-4 text-[80px] opacity-[0.06] group-hover:opacity-[0.1] transition-opacity duration-500 pointer-events-none">🛡️</div>
              <h4 className="text-sm font-bold uppercase tracking-widest text-amber-400 mb-4 flex items-center gap-2">
                <AlertTriangle className="w-4 h-4" /> Threats
              </h4>
              <ul className="space-y-3">
                {(result.swot?.threats || ["Established players could pivot", "Regulatory changes"]).map((t: string, i: number) => (
                  <li key={i} className="text-sm text-zinc-300 flex items-start gap-3 group/item">
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-400 mt-2 flex-shrink-0 group-hover/item:shadow-[0_0_6px_rgba(245,158,11,0.6)]" /> {t}
                  </li>
                ))}
              </ul>
            </motion.div>
          </div>
        </motion.div>

        {/* Enter the Shark Tank CTA */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="mb-12 relative overflow-hidden rounded-3xl bg-[#090915] border border-rose-500/20 p-10 flex flex-col md:flex-row items-center justify-between gap-8 group" 
          data-print-hide
        >
          {/* Animated Glow Border */}
          <div className="absolute inset-x-0 top-0 h-[1px] bg-gradient-to-r from-transparent via-rose-500/50 to-transparent group-hover:h-[2px] transition-all duration-500" />
          <div className="absolute bottom-0 right-0 p-10 opacity-[0.08] text-[180px] -mb-16 -mr-16 group-hover:scale-110 group-hover:rotate-12 transition-transform duration-700 pointer-events-none grayscale">🦈</div>
          
          <div className="relative z-10">
            <h3 className="text-3xl font-bold font-heading text-rose-500 mb-3 drop-shadow-[0_0_10px_rgba(225,29,72,0.3)]">Think you're ready for funding?</h3>
            <p className="text-zinc-400 max-w-xl text-md leading-relaxed">
              Step into the Shark Tank and defend your numbers. The Shark will grill you on <span className="text-white font-bold">CAC</span>, <span className="text-white font-bold">LTV</span>, and <span className="text-white font-bold">Market Share</span> in a rapid-fire live chat.
            </p>
          </div>
          
          <Link 
            href={`/shark-tank/${ideaId}`}
            className="shrink-0 relative z-10 bg-gradient-to-br from-rose-600 to-rose-800 hover:from-rose-500 hover:to-rose-700 text-white px-10 py-5 rounded-2xl font-black text-sm uppercase tracking-widest transition-all shadow-[0_0_30px_rgba(225,29,72,0.4)] hover:shadow-[0_0_50px_rgba(225,29,72,0.6)] hover:scale-105 active:scale-95"
          >
            Enter The Tank
          </Link>
        </motion.div>

        {/* Expert Deep Dives */}
        <motion.h2 
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          className="text-3xl font-bold mb-10 font-heading bg-gradient-to-r from-white to-zinc-500 bg-clip-text text-transparent"
        >
          The Wildlife Panel
        </motion.h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {EXPERTS.filter(e => result.persona_scores?.[e.name.toLowerCase()] || result.insights?.[e.name]).map((expert, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1, duration: 0.5 }}
              className="p-8 rounded-[2.5rem] bg-white/[0.02] border border-white/5 hover:bg-white/[0.04] hover:border-white/10 transition-all duration-500 group relative overflow-hidden flex flex-col h-full"
            >
              {/* Expert Glow */}
              <div 
                className="absolute -top-12 -right-12 w-32 h-32 blur-[60px] opacity-10 group-hover:opacity-20 transition-opacity duration-500 pointer-events-none"
                style={{ backgroundColor: expert.color }}
              />

              <div className="flex justify-between items-start mb-8">
                <div className="text-5xl group-hover:scale-110 group-hover:rotate-6 transition-transform duration-500 drop-shadow-[0_10px_20px_rgba(0,0,0,0.5)]">
                  {expert.icon}
                </div>
                <div className="relative">
                  <svg className="w-14 h-14 rotate-[-90deg]">
                    <circle cx="28" cy="28" r="24" stroke="currentColor" strokeWidth="4" fill="transparent" className="text-white/5" />
                    <motion.circle 
                      cx="28" cy="28" r="24" stroke="currentColor" strokeWidth="4" fill="transparent" 
                      strokeDasharray={2 * Math.PI * 24}
                      initial={{ strokeDashoffset: 2 * Math.PI * 24 }}
                      whileInView={{ strokeDashoffset: 2 * Math.PI * 24 * (1 - (result.persona_scores?.[expert.name.toLowerCase()] || 70) / 100) }}
                      viewport={{ once: true }}
                      transition={{ duration: 1.5, delay: 0.5 + i * 0.1, ease: "easeOut" }}
                      style={{ color: expert.color }}
                      strokeLinecap="round"
                    />
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center text-sm font-black font-heading" style={{ color: expert.color }}>
                    {result.persona_scores?.[expert.name.toLowerCase()] || 70}
                  </div>
                </div>
              </div>

              <div className="flex-1">
                <h4 className="text-xl font-bold text-white mb-1">{expert.name}</h4>
                <p className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500 mb-5 flex items-center gap-1.5">
                  <span className="w-1 h-1 rounded-full animate-pulse" style={{ backgroundColor: expert.color }} />
                  Expert Analysis
                </p>
                <p className="text-zinc-400 text-xs leading-relaxed mb-10 line-clamp-4 group-hover:line-clamp-none transition-all duration-500">
                  {result.insights?.[expert.name.toLowerCase()] || result.insights?.[expert.name] || "Analyzing deeper market factors..."}
                </p>
              </div>
              
              <motion.button 
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setActiveChatExpert(expert)}
                className="w-full py-4 rounded-2xl bg-white/[0.03] hover:bg-white/[0.08] border border-white/10 text-[10px] font-black uppercase tracking-[0.2em] flex items-center justify-center gap-3 transition-all group-hover:border-white/20 group-hover:shadow-[0_0_20px_rgba(255,255,255,0.05)]"
                data-print-hide
              >
                <MessageSquare className="w-4 h-4 opacity-50" />
                Chat with {expert.name}
              </motion.button>
            </motion.div>
          ))}
        </div>

        {/* Pitch Deck Section */}
        <PitchDeckSection deck={result.pitch_deck} />

        {/* Advanced Insights (Competitors & Surveys) */}
        <AdvancedInsights 
          competitors={result.competitors} 
          surveys={result.survey_questions} 
          badges={result.badges} 
        />

        {/* Evolution Tracker - hidden in PDF */}
        <div data-print-hide>
          <EvolutionTracker ideaId={ideaId!} versions={versions} />
        </div>

        {/* Hacker's Toolkit - hidden in PDF */}
        <div data-print-hide>
          <HackersToolkit 
            idea={result.title || result.idea} 
            insights={result.insights} 
            scores={result.persona_scores} 
          />
        </div>

        {/* Co-Founder Matcher - hidden in PDF */}
        <div data-print-hide>
          <CoFounderMatcher scores={result.persona_scores} />
        </div>
        
        {/* Chat Drawer */}
        {activeChatExpert && (
          <ExpertChatDrawer 
            isOpen={!!activeChatExpert} 
            onClose={() => setActiveChatExpert(null)} 
            expert={activeChatExpert} 
            ideaId={ideaId!} 
            analysis={result}
          />
        )}

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
