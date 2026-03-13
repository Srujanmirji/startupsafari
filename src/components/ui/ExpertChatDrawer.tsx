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
  ideaId 
}: { 
  isOpen: boolean; 
  onClose: () => void; 
  expert: any; 
  ideaId: string;
}) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

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
    } catch (error) {
      console.error(error);
      setMessages(prev => [...prev, { role: 'assistant', content: "Sorry, I am having trouble connecting to the Safari network." }]);
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
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[250]"
          />
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed right-0 top-0 bottom-0 w-full max-w-md bg-[#0a0a16] border-l border-white/10 z-[251] flex flex-col shadow-2xl"
          >
            {/* Header */}
            <div className="p-6 border-b border-white/10 flex items-center justify-between bg-white/[0.02]">
              <div className="flex items-center gap-4">
                <div className="text-3xl">{expert.icon}</div>
                <div>
                  <h3 className="font-bold text-lg font-heading" style={{ color: expert.color }}>Chat with {expert.name}</h3>
                  <p className="text-xs text-zinc-500 uppercase tracking-widest font-bold">Expert Intelligence</p>
                </div>
              </div>
              <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-full transition-colors"><X className="w-5 h-5" /></button>
            </div>

            {/* Messages */}
            <div ref={scrollRef} className="flex-1 overflow-y-auto p-6 space-y-6">
              {messages.length === 0 && (
                <div className="text-center py-10">
                  <div className="inline-flex p-4 rounded-full bg-white/5 mb-4"><MessageSquare className="w-8 h-8 text-zinc-600" /></div>
                  <p className="text-zinc-500 text-sm px-10">Ask {expert.name} anything about your startup's {expert.name === 'Shark' ? 'monetization' : 'potential'}.</p>
                </div>
              )}
              {messages.map((m, i) => (
                <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[85%] p-4 rounded-2xl ${
                    m.role === 'user' 
                      ? 'bg-electric-blue text-white rounded-tr-none' 
                      : 'bg-white/5 border border-white/10 text-zinc-200 rounded-tl-none'
                  }`}>
                    <p className="text-sm leading-relaxed whitespace-pre-wrap">{m.content}</p>
                  </div>
                </div>
              ))}
              {isLoading && (
                <div className="flex justify-start">
                  <div className="bg-white/5 border border-white/10 p-4 rounded-2xl rounded-tl-none flex items-center gap-2">
                    <Loader2 className="w-4 h-4 animate-spin text-electric-blue" />
                    <span className="text-sm text-zinc-500">{expert.name} is thinking...</span>
                  </div>
                </div>
              )}
            </div>

            {/* Input */}
            <form onSubmit={handleSend} className="p-6 border-t border-white/10 bg-white/[0.02]">
              <div className="relative">
                <textarea
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder={`Message ${expert.name}...`}
                  rows={2}
                  className="w-full bg-white/5 border border-white/10 rounded-2xl pl-4 pr-12 py-3 text-sm focus:outline-none focus:border-electric-blue/50 transition-all resize-none"
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
                  className="absolute right-3 bottom-3 p-2 bg-white text-black rounded-xl disabled:opacity-50 transition-all hover:scale-105"
                >
                  <Send className="w-4 h-4" />
                </button>
              </div>
              <p className="text-[10px] text-zinc-600 mt-3 text-center">AI insights may vary. Consult with real humans before making large decisions.</p>
            </form>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
