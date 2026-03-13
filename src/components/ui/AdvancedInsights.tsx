"use client";

import { motion } from "framer-motion";
import { Radar, ExternalLink, Users, ClipboardCheck } from "lucide-react";

export function AdvancedInsights({ competitors, surveys, badges }: { competitors: any[], surveys: string[], badges: string[] }) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-16">
      {/* Competitors */}
      <div className="p-8 rounded-[2rem] bg-white/[0.02] border border-white/5 backdrop-blur-3xl">
        <div className="flex items-center gap-4 mb-8">
          <div className="p-3 rounded-2xl bg-owl/10 border border-owl/20 text-owl">
            <Radar className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-2xl font-bold font-heading">Competitor Radar</h3>
            <p className="text-zinc-500 text-sm">Real-world market challengers Identified by AI</p>
          </div>
        </div>
        
        <div className="space-y-4">
          {competitors?.map((comp, i) => (
            <div key={i} className="p-5 rounded-2xl bg-white/5 border border-white/10 flex justify-between items-center group hover:bg-white/[0.08] transition-all">
              <div>
                <h4 className="font-bold text-white mb-1 flex items-center gap-2">
                  {comp.name}
                  <span className="text-[10px] text-zinc-500 font-normal uppercase tracking-widest px-2 py-0.5 rounded-full bg-white/5">Competitor</span>
                </h4>
                <p className="text-xs text-zinc-500 leading-relaxed max-w-sm">{comp.description}</p>
              </div>
              <div className="p-2 rounded-lg bg-white/5 group-hover:bg-owl/20 group-hover:text-owl transition-all">
                <ExternalLink className="w-4 h-4" />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Demand Validation */}
      <div className="p-8 rounded-[2rem] bg-white/[0.02] border border-white/5 backdrop-blur-3xl">
        <div className="flex items-center gap-4 mb-8">
          <div className="p-3 rounded-2xl bg-bee/10 border border-bee/20 text-bee">
            <ClipboardCheck className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-2xl font-bold font-heading">Bee's Demand Validator</h3>
            <p className="text-zinc-500 text-sm">Targeted survey questions to validate your idea</p>
          </div>
        </div>

        <div className="space-y-4">
          {surveys?.map((q, i) => (
            <div key={i} className="flex gap-4 items-start p-4 rounded-xl bg-white/5 border border-white/10">
              <div className="w-6 h-6 rounded-full bg-bee/20 text-bee flex items-center justify-center text-[10px] font-bold flex-shrink-0 mt-0.5">{i+1}</div>
              <p className="text-sm text-zinc-300 leading-relaxed font-medium">{q}</p>
            </div>
          ))}
          <button className="w-full mt-4 py-4 rounded-2xl bg-bee text-black font-bold flex items-center justify-center gap-2 hover:opacity-90 transition-all shadow-lg shadow-bee/20">
            <Users className="w-5 h-5" />
            Recruit Early Adopters
          </button>
        </div>
      </div>
    </div>
  );
}
