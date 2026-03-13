"use client";

import { use, useEffect, useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, Send, ShieldAlert, TrendingDown, Users } from "lucide-react";
import Link from "next/link";
import { api } from "@/services/api";

type Message = {
  role: "user" | "model";
  content: string;
};

export default function SharkTankPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const [idea, setIdea] = useState<any>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [sessionActive, setSessionActive] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchIdea = async () => {
      const { data } = await api.getResults(id);
      setIdea(data);
    };
    fetchIdea();
  }, [id]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const startPitch = () => {
    setSessionActive(true);
    setMessages([
      { role: "model", content: "I'm looking at your numbers and I'm not impressed. Tell me in one sentence why this is a billion-dollar business, and don't waste my time." }
    ]);
  };

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage = input.trim();
    setInput("");
    
    const newMessages: Message[] = [...messages, { role: "user", content: userMessage }];
    setMessages(newMessages);
    setIsLoading(true);

    try {
      const rawHistory = [...newMessages.slice(0, -1)];
      // Gemini requires history to start with a 'user' message
      if (rawHistory.length > 0 && rawHistory[0].role === 'model') {
        rawHistory.unshift({ role: 'user', content: 'I am ready to pitch my startup.' });
      }

      const history = rawHistory.map(m => ({
        role: m.role,
        parts: [{ text: m.content }]
      }));

      const { data } = await api.sharkTankChat({
        idea_id: id,
        message: userMessage,
        history
      });

      setMessages([...newMessages, { role: "model", content: data.response }]);
    } catch (err) {
      console.error(err);
      setMessages([...newMessages, { role: "model", content: "I don't have time for technical glitches. Get your systems in order." }]);
    } finally {
      setIsLoading(false);
    }
  };

  if (!idea) return <div className="min-h-screen bg-black text-white flex items-center justify-center">Loading the Tank...</div>;

  return (
    <div className="min-h-screen bg-black text-white flex flex-col relative overflow-hidden">
      {/* Background Ambience */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(59,0,130,0.2)_0%,rgba(0,0,0,1)_70%)] pointer-events-none" />
      <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/dark-matter.png')] opacity-20 pointer-events-none" />

      {/* Header */}
      <header className="relative z-10 p-6 flex justify-between items-center bg-black/50 backdrop-blur-md border-b border-white/5">
        <Link 
          href={`/results?id=${id}`} 
          className="flex items-center gap-2 text-zinc-400 hover:text-white transition-colors text-sm font-bold uppercase tracking-widest"
        >
          <ArrowLeft className="w-4 h-4" /> Exit Tank
        </Link>
        <div className="flex items-center gap-3">
          <ShieldAlert className="w-5 h-5 text-rose-500 animate-pulse" />
          <span className="font-heading font-bold text-rose-500 tracking-widest uppercase text-sm">Shark Tank Mode</span>
        </div>
        <div className="w-24"></div> {/* Spacer for centering */}
      </header>

      <main className="flex-1 relative z-10 w-full max-w-4xl mx-auto flex flex-col">
        {!sessionActive ? (
          <div className="flex-1 flex flex-col items-center justify-center text-center p-6">
            <div className="text-8xl mb-8 grayscale opacity-50">🦈</div>
            <h1 className="text-4xl md:text-6xl font-bold font-heading mb-6 tracking-tight">Enter The Tank</h1>
            <p className="text-zinc-400 text-lg max-w-xl mb-12">
              You are about to pitch <span className="text-white font-bold">{idea.title}</span> to the most ruthless investor on the panel. Be ready to defend your CAC, LTV, margins, and market size.
            </p>
            <button 
              onClick={startPitch}
              className="bg-rose-600 hover:bg-rose-700 text-white px-10 py-4 rounded-xl font-bold text-lg transition-all shadow-[0_0_40px_rgba(225,29,72,0.4)] hover:scale-105"
            >
              Start The Pitch
            </button>
          </div>
        ) : (
          <div className="flex-1 flex flex-col pt-8 pb-4">
            {/* Idea Context Bar */}
            <div className="bg-white/5 border border-white/10 rounded-2xl p-4 mb-6 mx-4 flex flex-wrap gap-4 items-center justify-between">
              <div>
                <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest">Pitching</p>
                <p className="font-bold text-white text-lg">{idea.title}</p>
              </div>
              <div className="flex gap-4">
                <div className="flex items-center gap-2">
                  <span className="p-1.5 rounded-lg bg-emerald-500/10 text-emerald-400"><TrendingDown className="w-4 h-4" /></span>
                  <div>
                    <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest">Shark Score</p>
                    <p className="font-bold text-white">{idea.persona_scores?.shark || idea.score || 0}%</p>
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
                    className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div className={`max-w-[85%] rounded-[2rem] p-5 ${
                      m.role === 'user' 
                        ? 'bg-zinc-800 border border-zinc-700 rounded-br-sm' 
                        : 'bg-rose-950/40 border border-rose-900/50 rounded-bl-sm backdrop-blur-md'
                    }`}>
                      {m.role === 'model' && (
                        <div className="flex items-center gap-2 mb-2">
                          <span className="text-lg">🦈</span>
                          <span className="text-[10px] text-rose-400 font-bold uppercase tracking-widest">The Shark</span>
                        </div>
                      )}
                      <p className={`text-sm md:text-base leading-relaxed ${m.role === 'user' ? 'text-zinc-200' : 'text-rose-100 font-medium'}`}>
                        {m.content}
                      </p>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
              
              {isLoading && (
                <motion.div 
                   initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                   className="flex justify-start"
                >
                  <div className="bg-rose-950/20 border border-rose-900/30 rounded-[2rem] rounded-bl-sm p-5 w-24 flex justify-between items-center">
                    <div className="w-2 h-2 rounded-full bg-rose-500 animate-bounce" />
                    <div className="w-2 h-2 rounded-full bg-rose-500 animate-bounce delay-100" />
                    <div className="w-2 h-2 rounded-full bg-rose-500 animate-bounce delay-200" />
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
                  if (e.key === 'Enter' && !e.shiftKey) {
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
        )}
      </main>
    </div>
  );
}
