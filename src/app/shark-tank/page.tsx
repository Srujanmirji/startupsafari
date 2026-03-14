"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ShieldAlert, Send, ArrowLeft, Zap, TrendingDown, Flame, Swords, Target } from "lucide-react";
import Link from "next/link";
import { Navbar } from "@/components/ui/Navbar";
import { useAuth } from "@/context/AuthContext";
import { api } from "@/services/api";

type Message = {
  role: "user" | "model";
  content: string;
};

type SavedIdea = {
  id: string;
  title: string;
  score?: number;
  persona_scores?: Record<string, number>;
};

export default function SharkTankLobby() {
  const { user } = useAuth();
  const [phase, setPhase] = useState<"lobby" | "tank">("lobby");
  const [savedIdeas, setSavedIdeas] = useState<SavedIdea[]>([]);
  const [selectedIdea, setSelectedIdea] = useState<SavedIdea | null>(null);
  const [quickIdea, setQuickIdea] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Load saved ideas from localStorage
  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem("safari_ideas") || "[]");
    setSavedIdeas(stored);
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const enterTank = (idea: SavedIdea) => {
    setSelectedIdea(idea);
    setPhase("tank");
    setMessages([
      {
        role: "model",
        content: `*leans back in chair* So, you want to pitch "${idea.title}" to me? Alright, I'll give you exactly 60 seconds of my time. Tell me — what's your revenue model, and why should I believe you can scale past $10M ARR?`,
      },
    ]);
  };

  const enterWithQuickIdea = () => {
    if (!quickIdea.trim()) return;
    const idea: SavedIdea = {
      id: `quick_${Date.now()}`,
      title: quickIdea.trim(),
    };
    enterTank(idea);
  };

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading || !selectedIdea) return;

    const userMessage = input.trim();
    setInput("");

    const newMessages: Message[] = [...messages, { role: "user", content: userMessage }];
    setMessages(newMessages);
    setIsLoading(true);

    try {
      const rawHistory = [...newMessages.slice(0, -1)];
      if (rawHistory.length > 0 && rawHistory[0].role === "model") {
        rawHistory.unshift({ role: "user", content: "I am ready to pitch my startup." });
      }

      const history = rawHistory.map((m) => ({
        role: m.role,
        parts: [{ text: m.content }],
      }));

      const { data } = await api.sharkTankChat({
        idea_id: selectedIdea.id,
        message: userMessage,
        history,
      });

      setMessages([...newMessages, { role: "model", content: data.response }]);
    } catch (err) {
      console.error(err);
      // Fallback: generate a local shark-like response
      const fallbackResponses = [
        `Your numbers don't add up. If your CAC is that high and your LTV is that low, you're basically buying customers at a loss. How do you plan to fix the unit economics?`,
        `I've seen a hundred pitches like this. What makes YOU different? Don't tell me 'the team' — everybody says that. Give me a real moat.`,
        `Let me be blunt: your market is crowded, your margins are thin, and your go-to-market is vague. But I've seen worse succeed. What's the ONE metric you're obsessed with?`,
        `Interesting. But 'interesting' doesn't make money. Show me how "${ selectedIdea.title}" generates recurring revenue in the next 90 days, or I'm out.`,
        `Okay, that's a fair point. But here's what worries me — customer retention. What happens after the first 30 days? What's your churn looking like?`,
        `I appreciate the hustle, but passion doesn't pay the bills. Walk me through your financial projections for the next 12 months. And be honest — I can smell inflated numbers from a mile away.`,
      ];
      const randomResponse = fallbackResponses[Math.floor(Math.random() * fallbackResponses.length)];
      setMessages([...newMessages, { role: "model", content: randomResponse }]);
    } finally {
      setIsLoading(false);
    }
  };

  // ── LOBBY VIEW ──
  if (phase === "lobby") {
    return (
      <div className="flex flex-col min-h-screen">
        <Navbar />
        <main className="flex-1 relative overflow-hidden">
          {/* Background */}
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(225,29,72,0.08)_0%,transparent_60%)] pointer-events-none" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_80%,rgba(168,85,247,0.06)_0%,transparent_60%)] pointer-events-none" />

          <div className="max-w-5xl mx-auto px-6 py-12 lg:py-20">
            {/* Back to Explore */}
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mb-8">
              <Link href="/explore" className="inline-flex items-center gap-2 text-zinc-500 hover:text-white transition-colors text-xs font-bold uppercase tracking-widest">
                <ArrowLeft className="w-3.5 h-3.5" /> Back to Explore
              </Link>
            </motion.div>

            {/* Hero */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7 }}
              className="text-left lg:text-center mb-16"
            >
              <div className="inline-flex items-center gap-3 px-5 py-2.5 rounded-full bg-rose-500/10 border border-rose-500/20 mb-8 mx-auto lg:mx-0">
                <ShieldAlert className="w-4 h-4 text-rose-500 animate-pulse" />
                <span className="text-xs font-black uppercase tracking-[0.2em] text-rose-400">Live Challenge Mode</span>
              </div>

              <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold font-heading text-white mb-6 tracking-tight">
                Enter The{" "}
                <span className="bg-gradient-to-r from-rose-500 via-red-500 to-orange-500 bg-clip-text text-transparent">
                  Shark Tank
                </span>
              </h1>
              <p className="text-lg text-zinc-400 max-w-2xl mx-auto leading-relaxed">
                Face the most ruthless AI investor on the panel. Defend your revenue model, unit economics, and market
                thesis in a live, unscripted debate. No safety nets.
              </p>
            </motion.div>

            {/* Stats Bar */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="grid grid-cols-3 gap-4 max-w-lg mx-auto mb-16"
            >
              {[
                { icon: Flame, label: "Brutal Honesty", value: "100%" },
                { icon: Swords, label: "Avg. Survival", value: "34%" },
                { icon: Target, label: "Key Metric", value: "LTV : CAC" },
              ].map((stat, i) => (
                <div key={i} className="text-center p-4 rounded-2xl bg-white/[0.02] border border-white/5">
                  <stat.icon className="w-5 h-5 text-rose-400 mx-auto mb-2" />
                  <div className="text-lg font-bold text-white">{stat.value}</div>
                  <div className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest">{stat.label}</div>
                </div>
              ))}
            </motion.div>

            {/* Quick Pitch */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="mb-12"
            >
              <div className="relative p-8 rounded-[2rem] bg-gradient-to-br from-rose-950/40 via-black to-zinc-900/50 border border-rose-500/15 overflow-hidden">
                <div className="absolute -top-20 -right-20 w-40 h-40 bg-rose-500/10 rounded-full blur-[80px] pointer-events-none" />
                <div className="relative z-10">
                  <div className="flex items-center gap-3 mb-4">
                    <Zap className="w-5 h-5 text-amber-400" />
                    <h3 className="text-xl font-bold text-white">Quick Pitch</h3>
                  </div>
                  <p className="text-sm text-zinc-400 mb-6">
                    Don&apos;t have an analyzed idea? Type any startup concept and face the Shark cold.
                  </p>
                  <div className="flex gap-3">
                    <input
                      type="text"
                      value={quickIdea}
                      onChange={(e) => setQuickIdea(e.target.value)}
                      placeholder="e.g. AI-powered personal finance app for Gen Z..."
                      className="flex-1 px-5 py-4 rounded-xl bg-black/60 border border-white/10 text-white placeholder:text-zinc-600 focus:outline-none focus:border-rose-500/50 transition-colors"
                      onKeyDown={(e) => {
                        if (e.key === "Enter") enterWithQuickIdea();
                      }}
                    />
                    <button
                      onClick={enterWithQuickIdea}
                      disabled={!quickIdea.trim()}
                      className="px-8 py-4 bg-rose-600 hover:bg-rose-700 disabled:opacity-40 disabled:cursor-not-allowed text-white font-bold rounded-xl transition-all shadow-[0_0_30px_rgba(225,29,72,0.3)] hover:shadow-[0_0_50px_rgba(225,29,72,0.5)] hover:scale-105"
                    >
                      Enter Tank
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Saved Ideas */}
            {savedIdeas.length > 0 && (
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}>
                <h3 className="text-lg font-bold text-white mb-6 flex items-center gap-3">
                  <TrendingDown className="w-5 h-5 text-zinc-400" />
                  Or pick a previously analyzed idea:
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {savedIdeas.map((idea, i) => (
                    <motion.button
                      key={idea.id}
                      initial={{ opacity: 0, y: 15 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.5 + i * 0.08 }}
                      onClick={() => enterTank(idea)}
                      className="text-left p-6 rounded-2xl bg-white/[0.02] border border-white/5 hover:border-rose-500/30 hover:bg-rose-500/[0.03] transition-all duration-300 group"
                    >
                      <div className="flex justify-between items-start mb-3">
                        <h4 className="text-white font-bold text-lg group-hover:text-rose-300 transition-colors pr-4 line-clamp-1">
                          {idea.title || (idea as any).idea?.substring(0, 40) || `Idea #${idea.id.slice(0, 5)}`}
                        </h4>
                        {idea.score && (
                          <span className="text-xs font-mono font-bold text-zinc-500 bg-white/5 px-2.5 py-1 rounded-lg shrink-0">
                            {idea.score}%
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-2 text-xs text-zinc-500 group-hover:text-rose-400/60 transition-colors">
                        <ShieldAlert className="w-3.5 h-3.5" />
                        <span className="font-bold uppercase tracking-widest">Challenge the Shark →</span>
                      </div>
                    </motion.button>
                  ))}
                </div>
              </motion.div>
            )}
          </div>
        </main>
      </div>
    );
  }

  // ── TANK VIEW (Chat) ──
  return (
    <div className="min-h-screen bg-black text-white flex flex-col relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(59,0,130,0.2)_0%,rgba(0,0,0,1)_70%)] pointer-events-none" />

      {/* Header */}
      <header className="relative z-10 p-6 flex justify-between items-center bg-black/50 backdrop-blur-md border-b border-white/5">
        <button
          onClick={() => {
            setPhase("lobby");
            setMessages([]);
            setSelectedIdea(null);
          }}
          className="flex items-center gap-2 text-zinc-400 hover:text-white transition-colors text-sm font-bold uppercase tracking-widest"
        >
          <ArrowLeft className="w-4 h-4" /> Exit Tank
        </button>
        <div className="flex items-center gap-3">
          <ShieldAlert className="w-5 h-5 text-rose-500 animate-pulse" />
          <span className="font-heading font-bold text-rose-500 tracking-widest uppercase text-sm">Shark Tank Mode</span>
        </div>
        <div className="w-24" />
      </header>

      <main className="flex-1 relative z-10 w-full max-w-4xl mx-auto flex flex-col">
        <div className="flex-1 flex flex-col pt-8 pb-4">
          {/* Idea Context Bar */}
          <div className="bg-white/5 border border-white/10 rounded-2xl p-4 mb-6 mx-4 flex flex-wrap gap-4 items-center justify-between">
            <div>
              <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest">Pitching</p>
              <p className="font-bold text-white text-lg">{selectedIdea?.title}</p>
            </div>
            <div className="flex gap-4">
              <div className="flex items-center gap-2">
                <span className="p-1.5 rounded-lg bg-rose-500/10 text-rose-400">
                  <Flame className="w-4 h-4" />
                </span>
                <div>
                  <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest">Difficulty</p>
                  <p className="font-bold text-white">Ruthless</p>
                </div>
              </div>
            </div>
          </div>

          {/* Chat Area */}
          <div className="flex-1 overflow-y-auto px-4 pb-32 space-y-6">
            <AnimatePresence>
              {messages.map((m, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  transition={{ type: "spring", stiffness: 200, damping: 20 }}
                  className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`max-w-[85%] rounded-[2rem] p-5 ${
                      m.role === "user"
                        ? "bg-zinc-800 border border-zinc-700 rounded-br-sm"
                        : "bg-rose-950/40 border border-rose-900/50 rounded-bl-sm backdrop-blur-md"
                    }`}
                  >
                    {m.role === "model" && (
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-lg">🦈</span>
                        <span className="text-[10px] text-rose-400 font-bold uppercase tracking-widest">The Shark</span>
                      </div>
                    )}
                    <p
                      className={`text-sm md:text-base leading-relaxed ${
                        m.role === "user" ? "text-zinc-200" : "text-rose-100 font-medium"
                      }`}
                    >
                      {m.content}
                    </p>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>

            {isLoading && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex justify-start">
                <div className="bg-rose-950/20 border border-rose-900/30 rounded-[2rem] rounded-bl-sm p-5 w-24 flex justify-between items-center">
                  <div className="w-2 h-2 rounded-full bg-rose-500 animate-bounce" />
                  <div className="w-2 h-2 rounded-full bg-rose-500 animate-bounce [animation-delay:100ms]" />
                  <div className="w-2 h-2 rounded-full bg-rose-500 animate-bounce [animation-delay:200ms]" />
                </div>
              </motion.div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Form */}
          <form
            onSubmit={handleSend}
            className="absolute bottom-5 left-1/2 -translate-x-1/2 w-[calc(100%-2rem)] max-w-3xl bg-zinc-900 p-2 rounded-2xl border border-zinc-800 shadow-2xl flex items-end gap-2"
          >
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Defend your numbers..."
              className="flex-1 bg-transparent border-none focus:ring-0 resize-none text-white py-3 px-4 max-h-32 min-h-[50px] outline-none placeholder:text-zinc-600"
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  handleSend(e);
                }
              }}
            />
            <button
              type="submit"
              disabled={!input.trim() || isLoading}
              className="p-3 bg-white text-black hover:bg-zinc-200 disabled:opacity-50 disabled:cursor-not-allowed rounded-xl transition-colors mb-1 mr-1"
            >
              <Send className="w-5 h-5" />
            </button>
          </form>
        </div>
      </main>
    </div>
  );
}
