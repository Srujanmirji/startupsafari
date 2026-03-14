"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Swords, Send, ArrowLeft, Users, Zap, Shield, Sparkles, X, MessageCircle } from "lucide-react";
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
};

const EXPERTS = [
  { name: "Shark", icon: "🦈", color: "#f43f5e", role: "Finance", desc: "Monetization & Margins" },
  { name: "Wolf", icon: "🐺", color: "#94a3b8", role: "Strategy", desc: "Moats & Competition" },
  { name: "Fox", icon: "🦊", color: "#facc15", role: "Logic", desc: "Viability & Risk" },
  { name: "Owl", icon: "🦉", color: "#3b82f6", role: "Market", desc: "Market Intel" },
  { name: "Bee", icon: "🐝", color: "#f59e0b", role: "Demand", desc: "User Validation" },
  { name: "Eagle", icon: "🦅", color: "#eab308", role: "Vision", desc: "Macro Strategy" },
];

export default function WarRoomPage() {
  const { user } = useAuth();
  const [phase, setPhase] = useState<"lobby" | "room">("lobby");
  const [savedIdeas, setSavedIdeas] = useState<SavedIdea[]>([]);
  const [selectedIdea, setSelectedIdea] = useState<SavedIdea | null>(null);
  const [selectedExperts, setSelectedExperts] = useState<string[]>(["Shark", "Wolf", "Fox"]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem("safari_ideas") || "[]");
    setSavedIdeas(stored);
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const enterRoom = (idea: SavedIdea) => {
    setSelectedIdea(idea);
    setPhase("room");
    setMessages([
      {
        role: "model",
        content: `[Panel]: The War Room is in session for "${idea.title}". We've reviewed your brief. Lead the way — what is the single biggest "unfair advantage" you have that will stop us from tearing this idea apart?`,
      },
    ]);
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
      const history = newMessages.map((m) => ({
        role: m.role,
        parts: [{ text: m.content }],
      }));

      const { data } = await api.warRoomChat({
        idea_id: selectedIdea.id,
        message: userMessage,
        experts: selectedExperts,
        history,
      });

      setMessages([...newMessages, { role: "model", content: data.response }]);
    } catch (err) {
      console.error(err);
      setMessages([...newMessages, { role: "model", content: "[Moderator]: The panel is experiencing technical interference. Please re-state your position." }]);
    } finally {
      setIsLoading(false);
    }
  };

  const toggleExpert = (name: string) => {
    if (selectedExperts.includes(name)) {
      if (selectedExperts.length > 1) setSelectedExperts(selectedExperts.filter(n => n !== name));
    } else {
      if (selectedExperts.length < 3) setSelectedExperts([...selectedExperts, name]);
    }
  };

  if (phase === "lobby") {
    return (
      <div className="flex flex-col min-h-screen bg-[#05050f]">
        <Navbar />
        <main className="flex-1 pt-32 pb-20 px-6 max-w-6xl mx-auto w-full">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(139,92,246,0.1)_0%,transparent_50%)] pointer-events-none" />
          
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-violet-500/10 border border-violet-500/20 text-violet-400 text-xs font-black uppercase tracking-widest mb-6">
              <Swords className="w-4 h-4" /> Strategic Panel Debate
            </div>
            <h1 className="text-5xl md:text-7xl font-bold font-heading mb-6 tracking-tight text-white">
              The <span className="text-gradient">War Room</span>
            </h1>
            <p className="text-zinc-400 text-lg max-w-2xl mx-auto">
              Assemble a 3-expert panel to pressure-test your startup vision. Watch them debate each other while they grill you on every assumption.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
            {/* Left: Expert Selection */}
            <div className="lg:col-span-1 space-y-8">
               <div className="p-8 rounded-[2.5rem] bg-white/[0.03] border border-white/5 relative overflow-hidden">
                  <div className="absolute top-0 right-0 p-10 opacity-10"><Users className="w-32 h-32" /></div>
                  <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                    <Zap className="w-5 h-5 text-amber-400" /> Assemble Panel
                  </h3>
                  <div className="space-y-3">
                    {EXPERTS.map(exp => {
                      const isSelected = selectedExperts.includes(exp.name);
                      return (
                        <button key={exp.name} onClick={() => toggleExpert(exp.name)}
                          className={`w-full flex items-center justify-between p-4 rounded-2xl border transition-all ${
                            isSelected ? "bg-white/10 border-white/20" : "bg-transparent border-white/5 opacity-50 grayscale hover:grayscale-0 hover:opacity-80"
                          }`}>
                            <div className="flex items-center gap-4">
                              <span className="text-2xl">{exp.icon}</span>
                              <div className="text-left">
                                <div className="text-sm font-bold text-white">{exp.name}</div>
                                <div className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest">{exp.role}</div>
                              </div>
                            </div>
                            {isSelected && <div className="w-2 h-2 rounded-full bg-violet-400 shadow-[0_0_10px_rgba(167,139,250,0.5)]" />}
                        </button>
                      )
                    })}
                  </div>
                  <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest mt-6 text-center">Select 3 experts for the debate</p>
               </div>
            </div>

            {/* Right: Idea Selection */}
            <div className="lg:col-span-2 space-y-6">
              <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                <Shield className="w-5 h-5 text-emerald-400" /> Select Objective
              </h3>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {savedIdeas.length === 0 ? (
                  <div className="col-span-2 p-12 text-center rounded-[2.5rem] border border-dashed border-white/10">
                    <Sparkles className="w-12 h-12 text-zinc-700 mx-auto mb-4" />
                    <p className="text-zinc-500 font-bold">No validated ideas found. Go to the dashboard to start one!</p>
                  </div>
                ) : (
                  savedIdeas.map((idea, i) => (
                    <motion.button 
                      key={idea.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.05 }}
                      onClick={() => enterRoom(idea)}
                      className="group p-8 rounded-[2rem] bg-white/[0.02] border border-white/5 hover:border-violet-500/30 hover:bg-violet-500/[0.03] transition-all text-left"
                    >
                      <h4 className="text-white font-bold text-xl mb-3 group-hover:text-violet-300 transition-colors">{idea.title}</h4>
                      <div className="flex items-center gap-2 text-[10px] text-zinc-500 font-black uppercase tracking-widest">
                        Ready for Battle <ArrowLeft className="w-3 h-3 rotate-180" />
                      </div>
                    </motion.button>
                  ))
                )}
              </div>

              {/* Quick Entry */}
              <div className="p-8 rounded-[2rem] bg-gradient-to-br from-violet-900/10 to-transparent border border-violet-500/10 mt-12">
                <p className="text-sm text-zinc-400 mb-6">Or start a fresh session with a quick concept:</p>
                <div className="flex gap-3">
                  <input placeholder="A marketplace for carbon offsets..." className="flex-1 bg-black/40 border border-white/5 rounded-xl px-5 py-4 focus:outline-none focus:border-violet-500/50" />
                  <button className="px-6 py-4 bg-violet-600 rounded-xl font-bold">Open War Room</button>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    );
  }

  // ── ROOM VIEW ──
  return (
    <div className="flex flex-col h-screen bg-black">
      <header className="p-6 border-b border-white/5 flex justify-between items-center bg-black/50 backdrop-blur-xl shrink-0">
        <button onClick={() => setPhase("lobby")} className="flex items-center gap-2 text-zinc-400 hover:text-white transition-colors text-xs font-bold uppercase tracking-widest">
          <ArrowLeft className="w-4 h-4" /> Evacuate
        </button>
        <div className="flex items-center gap-3">
          <div className="flex -space-x-2">
            {selectedExperts.map(e => (
              <div key={e} className="w-8 h-8 rounded-full bg-zinc-800 border-2 border-black flex items-center justify-center text-sm shadow-xl" title={e}>
                {EXPERTS.find(exp => exp.name === e)?.icon}
              </div>
            ))}
          </div>
          <span className="text-xs font-bold text-zinc-400 bg-white/5 px-3 py-1.5 rounded-lg border border-white/5">
            War RoomSession: {selectedIdea?.title}
          </span>
        </div>
        <div className="px-3 py-1.5 bg-rose-500/10 border border-rose-500/20 text-rose-500 rounded-lg flex items-center gap-2 text-[10px] font-black uppercase tracking-widest animate-pulse">
           Live Debate
        </div>
      </header>

      <div className="flex-1 overflow-y-auto px-6 py-10 space-y-8 scrollbar-hide">
        <div className="max-w-4xl mx-auto space-y-8">
          <AnimatePresence>
            {messages.map((m, i) => (
              <motion.div 
                key={i} 
                initial={{ opacity: 0, scale: 0.98, y: 10 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div className={`max-w-[90%] p-6 rounded-[2rem] ${
                  m.role === 'user' 
                    ? "bg-zinc-800 border border-zinc-700 text-white rounded-br-sm shadow-2xl" 
                    : "bg-gradient-to-br from-[#0e0e2e] to-[#05050f] border border-violet-500/20 text-zinc-200 rounded-bl-sm shadow-[0_0_50px_rgba(139,92,246,0.1)] backdrop-blur-3xl"
                }`}>
                  {m.role === 'model' && (
                    <div className="flex items-center gap-2 mb-4">
                      <div className="flex -space-x-1.5 grayscale opacity-50 group-hover:grayscale-0 group-hover:opacity-100 transition-all">
                         {selectedExperts.map(e => <span key={e} className="text-xs">{EXPERTS.find(exp => exp.name === e)?.icon}</span>)}
                      </div>
                      <span className="text-[10px] text-violet-400 font-bold uppercase tracking-[0.2em]">The Panel</span>
                    </div>
                  )}
                  <p className="text-md leading-relaxed whitespace-pre-wrap">
                    {m.content}
                  </p>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>

          {isLoading && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex justify-start">
               <div className="px-6 py-4 rounded-full bg-white/5 border border-white/10 flex gap-2">
                 <div className="w-1.5 h-1.5 rounded-full bg-violet-500 animate-bounce" />
                 <div className="w-1.5 h-1.5 rounded-full bg-violet-500 animate-bounce [animation-delay:100ms]" />
                 <div className="w-1.5 h-1.5 rounded-full bg-violet-500 animate-bounce [animation-delay:200ms]" />
               </div>
            </motion.div>
          )}

          <div ref={messagesEndRef} />
        </div>
      </div>

      <div className="p-6 shrink-0 bg-gradient-to-t from-black via-black to-transparent">
        <div className="max-w-4xl mx-auto">
          <form onSubmit={handleSend} className="relative group">
            <div className="absolute -inset-1 bg-gradient-to-r from-violet-600 to-blue-600 rounded-3xl blur opacity-20 group-hover:opacity-40 transition duration-1000 group-focus-within:opacity-50" />
            <div className="relative flex items-center bg-[#0a0a1a] border border-white/10 rounded-2xl overflow-hidden shadow-2xl">
               <div className="p-4 bg-white/5 border-r border-white/5"><MessageCircle className="w-5 h-5 text-zinc-500" /></div>
               <input 
                 value={input}
                 onChange={e => setInput(e.target.value)}
                 className="flex-1 bg-transparent px-6 py-5 text-white placeholder:text-zinc-600 focus:outline-none" 
                 placeholder="Interject or answer the panel..." 
               />
               <button type="submit" disabled={!input.trim() || isLoading} className="m-2 p-4 bg-violet-600 text-white rounded-xl hover:bg-violet-700 disabled:opacity-50 transition-all shadow-lg active:scale-95">
                 <Send className="w-5 h-5" />
               </button>
            </div>
          </form>
          <div className="flex justify-center gap-6 mt-4">
             {selectedExperts.map(e => (
               <div key={e} className="flex items-center gap-1.5">
                 <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                 <span className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest">{e} Active</span>
               </div>
             ))}
          </div>
        </div>
      </div>
    </div>
  );
}
