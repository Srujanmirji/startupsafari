"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Send, MessageSquare, Loader2 } from "lucide-react";
import { api } from "@/services/api";

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

export function ExpertChatDrawer({ 
  isOpen, 
  onClose, 
  expert, 
  ideaId,
  analysis
}: { 
  isOpen: boolean; 
  onClose: () => void; 
  expert: any; 
  ideaId: string;
  analysis?: any;
}) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isHistoryLoading, setIsHistoryLoading] = useState(true);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Load History on Mount
  useEffect(() => {
    if (!isOpen || !ideaId || !expert) return;
    
    const loadHistory = async () => {
      setIsHistoryLoading(true);
      try {
        const { data } = await api.getChatHistory(ideaId, expert.name);
        if (data && data.length > 0) {
          setMessages(data.map((m: any) => ({ role: m.role, content: m.content })));
        } else {
          // No history? Generate initial greeting based on persona + analysis
          const score = analysis?.persona_scores?.[expert.name.toLowerCase()] || 70;
          let greeting = `Hello! I'm your ${expert.name} advisor. I've looked at your vision for "${analysis?.title || 'this startup'}". `;
          
          if (score < 60) {
            greeting += `To be honest, I'm quite concerned about your ${expert.name === 'Shark' ? 'monetization' : 'strategy'}. We have a lot to fix here. What's your plan for the biggest bottleneck you're facing?`;
          } else if (score > 85) {
            greeting += `Impressive! Your ${expert.name === 'Bee' ? 'demand validation' : 'foundation'} is rock solid. I'm excited to help you scale this. Where do you want to focus our deep dive?`;
          } else {
            greeting += `You've got a decent start, but there's room for optimization. Let's dig into the details. What part of the Safari analysis surprised you most?`;
          }
          setMessages([{ role: 'assistant', content: greeting }]);
        }
      } catch (err) {
        console.error("Failed to load history:", err);
      } finally {
        setIsHistoryLoading(false);
      }
    };

    loadHistory();
  }, [isOpen, ideaId, expert, analysis]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isLoading]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage = input.trim();
    setInput("");
    setMessages(prev => [...prev, { role: 'user', content: userMessage }]);
    setIsLoading(true);

    try {
      const { data } = await api.chatWithExpert({
        idea_id: ideaId,
        expert_name: expert.name,
        message: userMessage,
        history: messages.map(m => ({ 
          role: m.role === 'assistant' ? 'model' : 'user', 
          parts: [{ text: m.content }] 
        }))
      });

      setMessages(prev => [...prev, { role: 'assistant', content: data.response }]);
    } catch (error: any) {
      console.error(error);
      const errorMsg = error.response?.data?.error || "Sorry, I am having trouble connecting to the Safari network.";
      setMessages(prev => [...prev, { role: 'assistant', content: errorMsg }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/80 backdrop-blur-md z-[250]"
          />
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 30, stiffness: 300 }}
            className="fixed right-0 top-0 bottom-0 w-full max-w-lg bg-[#050510] border-l border-white/10 z-[251] flex flex-col shadow-[0_0_100px_rgba(0,0,0,0.8)]"
          >
            {/* Header */}
            <div className="p-8 border-b border-white/10 flex items-center justify-between bg-gradient-to-b from-white/[0.03] to-transparent">
              <div className="flex items-center gap-5">
                <div className="text-5xl group-hover:scale-110 transition-transform duration-500 drop-shadow-[0_0_15px_rgba(255,255,255,0.2)]">
                  {expert.icon}
                </div>
                <div>
                  <h3 className="font-black text-2xl font-heading tracking-tight" style={{ color: expert.color }}>Chat with {expert.name}</h3>
                  <p className="text-[10px] text-zinc-500 uppercase tracking-[0.3em] font-black flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                    Expert Intelligence System
                  </p>
                </div>
              </div>
              <button 
                onClick={onClose} 
                className="p-3 bg-white/5 hover:bg-white/10 rounded-2xl border border-white/10 transition-all hover:rotate-90 active:scale-90"
              >
                <X className="w-5 h-5 text-white" />
              </button>
            </div>

            {/* Messages */}
            <div ref={scrollRef} className="flex-1 overflow-y-auto p-8 space-y-8 custom-scrollbar">
              {isHistoryLoading ? (
                <div className="flex flex-col items-center justify-center h-full gap-4 text-zinc-500">
                  <Loader2 className="w-8 h-8 animate-spin" />
                  <p className="text-xs uppercase tracking-widest font-bold">Synchronizing history...</p>
                </div>
              ) : (
                <>
                  {messages.map((m, i) => (
                    <motion.div 
                      key={i} 
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}
                    >
                      <div className={`max-w-[90%] p-5 rounded-3xl shadow-xl leading-relaxed ${
                        m.role === 'user' 
                          ? 'bg-gradient-to-br from-electric-blue to-violet-700 text-white rounded-tr-none font-medium' 
                          : 'bg-white/[0.03] border border-white/10 text-zinc-200 rounded-tl-none font-medium backdrop-blur-xl'
                      }`}>
                        <p className="text-sm whitespace-pre-wrap">{m.content}</p>
                      </div>
                    </motion.div>
                  ))}
                  {isLoading && (
                    <motion.div 
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      className="flex justify-start"
                    >
                      <div className="bg-white/[0.03] border border-white/10 p-5 rounded-3xl rounded-tl-none flex items-center gap-3 backdrop-blur-xl">
                        <div className="flex gap-1">
                          <motion.span animate={{ opacity: [0.3, 1, 0.3] }} transition={{ repeat: Infinity, duration: 1 }} className="w-1.5 h-1.5 rounded-full bg-electric-blue" />
                          <motion.span animate={{ opacity: [0.3, 1, 0.3] }} transition={{ repeat: Infinity, duration: 1, delay: 0.2 }} className="w-1.5 h-1.5 rounded-full bg-electric-blue" />
                          <motion.span animate={{ opacity: [0.3, 1, 0.3] }} transition={{ repeat: Infinity, duration: 1, delay: 0.4 }} className="w-1.5 h-1.5 rounded-full bg-electric-blue" />
                        </div>
                        <span className="text-xs text-zinc-500 font-bold uppercase tracking-widest">{expert.name} is formulating insight...</span>
                      </div>
                    </motion.div>
                  )}
                </>
              )}
            </div>

            {/* Input */}
            <div className="p-8 border-t border-white/10 bg-gradient-to-t from-white/[0.02] to-transparent">
              <form onSubmit={handleSend} className="relative group">
                <textarea
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder={`Consult ${expert.name}...`}
                  rows={2}
                  className="w-full bg-[#101020] border border-white/10 rounded-[1.5rem] pl-6 pr-16 py-5 text-sm focus:outline-none focus:border-electric-blue/50 focus:ring-4 focus:ring-electric-blue/5 transition-all resize-none shadow-2xl placeholder:text-zinc-600"
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault();
                      handleSend(e as any);
                    }
                  }}
                />
                <button 
                  type="submit" 
                  disabled={!input.trim() || isLoading}
                  className="absolute right-4 bottom-4 p-4 bg-white text-black rounded-2xl disabled:opacity-30 transition-all hover:scale-110 active:scale-90 shadow-xl disabled:hover:scale-100"
                >
                  <Send className="w-4 h-4" />
                </button>
              </form>
              <div className="flex items-center justify-between mt-5 px-2">
                <p className="text-[9px] text-zinc-600 font-bold uppercase tracking-[0.2em]">Encrypted Data Transmission</p>
                <p className="text-[9px] text-zinc-600 font-bold uppercase tracking-[0.2em]">Safari Protocol v2.4</p>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

