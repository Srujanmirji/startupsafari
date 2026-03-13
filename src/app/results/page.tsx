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
    <div className="min-h-screen bg-[#05050f] text-white">
      <Navbar />
      
      <main className="pt-32 pb-20 px-6 max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12 gap-6">
          <div>
            <Link href="/dashboard" className="flex items-center gap-2 text-zinc-500 hover:text-white transition-colors mb-4 text-sm font-bold uppercase tracking-widest">
              <ArrowLeft className="w-4 h-4" />
              Back to Dashboard
            </Link>
            <div className="flex flex-wrap items-center gap-4">
              <h1 className="text-4xl md:text-5xl font-bold font-heading">{result.title || "Your Startup Idea"}</h1>
              {result.badges?.map((badge: string, i: number) => (
                <div key={i} className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-electric-blue/10 border border-electric-blue/20 text-electric-blue text-[10px] font-bold uppercase tracking-widest shadow-[0_0_15px_rgba(59,130,246,0.1)]">
                  <Award className="w-3 h-3" />
                  {badge}
                </div>
              ))}
            </div>
          </div>
          <div className="flex gap-4 print:hidden">
            <button 
              onClick={() => window.print()}
              className="flex items-center gap-2 bg-white/5 border border-white/10 px-5 py-2.5 rounded-xl font-bold hover:bg-white/10 transition-colors"
            >
              <Download className="w-5 h-5" />
              Export PDF
            </button>
            <button 
              onClick={async () => {
                const { data } = await api.generateShareLink(ideaId!);
                setShareUrl(data.url);
                navigator.clipboard.writeText(data.url);
                setShareCopied(true);
                setTimeout(() => setShareCopied(false), 3000);
              }}
              className="flex items-center gap-2 bg-electric-blue text-white px-5 py-2.5 rounded-xl font-bold hover:opacity-90 transition-colors shadow-lg shadow-electric-blue/20"
            >
              {shareCopied ? <Check className="w-5 h-5" /> : <Share2 className="w-5 h-5" />}
              {shareCopied ? 'Link Copied!' : 'Share Report'}
            </button>
          </div>
        </div>

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

        {/* Enter the Shark Tank CTA */}
        <div className="mb-12 relative overflow-hidden rounded-3xl bg-gradient-to-br from-rose-950/40 to-black border border-rose-900/30 p-8 flex flex-col md:flex-row items-center justify-between gap-6 group">
          <div className="absolute top-0 right-0 p-8 opacity-5 text-9xl -mt-10 -mr-10 group-hover:scale-110 transition-transform duration-500 pointer-events-none">🦈</div>
          <div className="relative z-10">
            <h3 className="text-2xl font-bold font-heading text-rose-500 mb-2">Think you're ready for funding?</h3>
            <p className="text-zinc-400 max-w-xl text-sm leading-relaxed">
              Step into the Shark Tank and defend your numbers. The Shark will grill you on CAC, LTV, and market size in a rapid-fire live chat.
            </p>
          </div>
          <Link 
            href={`/shark-tank/${ideaId}`}
            className="shrink-0 relative z-10 bg-rose-600 hover:bg-rose-500 text-white px-8 py-4 rounded-xl font-bold transition-all shadow-[0_0_20px_rgba(225,29,72,0.3)] hover:scale-105"
          >
            Enter The Tank
          </Link>
        </div>

        {/* Expert Deep Dives */}
        <h2 className="text-3xl font-bold mb-8 font-heading">The Wildlife Panel</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {EXPERTS.filter(e => result.persona_scores?.[e.name.toLowerCase()] || result.insights?.[e.name]).map((expert, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className="p-6 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/[0.08] transition-all group relative overflow-hidden"
            >
              <div 
                className="absolute top-0 right-0 w-24 h-24 opacity-[0.03] group-hover:opacity-[0.05] transition-opacity -mr-8 -mt-8 text-8xl grayscale pointer-events-none"
              >
                {expert.icon}
              </div>

              <div className="flex justify-between items-start mb-4">
                <div className="text-4xl group-hover:scale-110 transition-transform">{expert.icon}</div>
                <div className="text-xl font-bold font-heading" style={{ color: expert.color }}>
                  {result.persona_scores?.[expert.name.toLowerCase()] || 70}%
                </div>
              </div>
              <h4 className="text-lg font-bold text-white mb-1">{expert.name}</h4>
              <p className="text-[10px] font-bold uppercase tracking-widest text-zinc-500 mb-4">
                Expert Analysis
              </p>
              <p className="text-zinc-400 text-xs leading-relaxed mb-6">
                {result.insights?.[expert.name.toLowerCase()] || result.insights?.[expert.name] || "Analyzing deeper market factors..."}
              </p>
              
              <button 
                onClick={() => setActiveChatExpert(expert)}
                className="w-full py-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-[10px] font-bold uppercase tracking-wider flex items-center justify-center gap-2 transition-all group-hover:border-white/20"
              >
                <MessageSquare className="w-3 h-3" />
                Chat with {expert.name}
              </button>
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

        {/* Evolution Tracker */}
        <EvolutionTracker ideaId={ideaId!} versions={versions} />

        {/* Hacker's Toolkit */}
        <HackersToolkit 
          idea={result.title || result.idea} 
          insights={result.insights} 
          scores={result.persona_scores} 
        />

        {/* Co-Founder Matcher */}
        <CoFounderMatcher scores={result.persona_scores} />
        
        {/* Chat Drawer */}
        {activeChatExpert && (
          <ExpertChatDrawer 
            isOpen={!!activeChatExpert} 
            onClose={() => setActiveChatExpert(null)} 
            expert={activeChatExpert} 
            ideaId={ideaId!} 
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
