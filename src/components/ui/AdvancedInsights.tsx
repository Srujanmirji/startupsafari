"use client";

import { motion } from "framer-motion";
import { Radar, ExternalLink, Users, ClipboardCheck } from "lucide-react";

export function AdvancedInsights({ competitors, surveys, badges }: { competitors: any[], surveys: string[], badges: string[] }) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-16 pb-12">
      {/* Competitors */}
      <motion.div 
        initial={{ opacity: 0, x: -20 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true }}
        className="p-8 rounded-[2.5rem] bg-white/[0.02] border border-white/5 backdrop-blur-3xl relative overflow-hidden group hover:border-owl/20 transition-all duration-500"
      >
        <div className="absolute top-0 right-0 w-32 h-32 bg-owl/[0.03] rounded-full blur-3xl -mr-16 -mt-16 group-hover:bg-owl/[0.08] transition-all duration-500" />
        
        <div className="flex items-center gap-5 mb-10">
          <div className="p-4 rounded-2xl bg-owl/10 border border-owl/20 text-owl shadow-[0_0_20px_rgba(168,85,247,0.15)] group-hover:scale-110 group-hover:shadow-owl/30 transition-all duration-500">
            <Radar className="w-7 h-7" />
          </div>
          <div>
            <h3 className="text-2xl font-bold font-heading text-white">Competitor Radar</h3>
            <p className="text-zinc-500 text-sm">Real-world market challengers identified by AI</p>
          </div>
        </div>
        
        <div className="space-y-4 relative z-10">
          {competitors?.map((comp, i) => (
            <motion.div 
              key={i} 
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="p-5 rounded-2xl bg-white/[0.03] border border-white/10 flex justify-between items-center group/item hover:bg-white/[0.07] hover:border-white/20 transition-all duration-300"
            >
              <div>
                <h4 className="font-bold text-white mb-1.5 flex items-center gap-2">
                  {comp.name}
                  <span className="text-[9px] text-owl font-bold uppercase tracking-[0.2em] px-2.5 py-1 rounded-full bg-owl/10 border border-owl/20">Competitor</span>
                </h4>
                <p className="text-xs text-zinc-400 leading-relaxed max-w-sm">{comp.description}</p>
              </div>
              <div className="p-2.5 rounded-xl bg-white/5 group-hover/item:bg-owl/20 group-hover/item:text-owl transition-all group-hover/item:rotate-12">
                <ExternalLink className="w-4 h-4" />
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Demand Validation */}
      <motion.div 
        initial={{ opacity: 0, x: 20 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true }}
        className="p-8 rounded-[2.5rem] bg-white/[0.02] border border-white/5 backdrop-blur-3xl relative overflow-hidden group hover:border-bee/20 transition-all duration-500"
      >
        <div className="absolute top-0 right-0 w-32 h-32 bg-bee/[0.03] rounded-full blur-3xl -mr-16 -mt-16 group-hover:bg-bee/[0.08] transition-all duration-500" />

        <div className="flex items-center gap-5 mb-10">
          <div className="p-4 rounded-2xl bg-bee/10 border border-bee/20 text-bee shadow-[0_0_20px_rgba(251,191,36,0.15)] group-hover:scale-110 group-hover:shadow-bee/30 transition-all duration-500">
            <ClipboardCheck className="w-7 h-7" />
          </div>
          <div>
            <h3 className="text-2xl font-bold font-heading text-white">Bee's Demand Validator</h3>
            <p className="text-zinc-500 text-sm">Targeted survey questions to validate your idea</p>
          </div>
        </div>

        <div className="space-y-4 relative z-10">
          {surveys?.map((q, i) => (
            <motion.div 
              key={i} 
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="flex gap-5 items-start p-5 rounded-2xl bg-white/[0.03] border border-white/10 hover:bg-white/[0.07] hover:border-white/20 transition-all duration-300 group/item"
            >
              <div className="w-8 h-8 rounded-xl bg-bee/10 border border-bee/20 text-bee flex items-center justify-center text-xs font-black flex-shrink-0 mt-0.5 group-hover/item:rotate-[-10deg] transition-transform">
                {i+1}
              </div>
              <p className="text-sm text-zinc-300 leading-relaxed font-medium">{q}</p>
            </motion.div>
          ))}
          <motion.button 
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="w-full mt-6 py-5 rounded-[1.5rem] bg-gradient-to-r from-bee to-orange-500 text-black font-black text-sm uppercase tracking-widest flex items-center justify-center gap-3 hover:shadow-[0_10px_30px_rgba(251,191,36,0.3)] transition-all"
          >
            <Users className="w-5 h-5" />
            Recruit Early Adopters
          </motion.button>
        </div>
      </motion.div>
    </div>
  );
}
