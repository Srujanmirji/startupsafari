"use client";

import { motion } from "framer-motion";
import { Users, Briefcase, Palette, Code, TrendingUp, Shield, Megaphone, Lightbulb } from "lucide-react";

const CO_FOUNDER_TYPES = [
  { type: "Technical CTO", icon: Code, color: "#8b5cf6", weakness: ["beaver", "Beaver"], desc: "You need a strong technical partner who can architect and build the product infrastructure." },
  { type: "Marketing Lead", icon: Megaphone, color: "#f59e0b", weakness: ["peacock", "Peacock"], desc: "Your branding score is low. A marketing-focused co-founder can craft a compelling brand story." },
  { type: "Sales Shark", icon: TrendingUp, color: "#a855f7", weakness: ["shark", "Shark"], desc: "Monetization needs work. Find someone who lives and breathes revenue models and pricing strategy." },
  { type: "Growth Hacker", icon: Lightbulb, color: "#34d399", weakness: ["cheetah", "Cheetah"], desc: "Speed to market is critical. A growth hacker can help you launch fast and iterate quickly." },
  { type: "Strategy Advisor", icon: Shield, color: "#60a5fa", weakness: ["wolf", "Wolf"], desc: "Your competitive moat is thin. A strategist can help you build defensibility against rivals." },
  { type: "Creative Director", icon: Palette, color: "#f97316", weakness: ["peacock", "Peacock"], desc: "The product needs a visual identity that stands out. A creative director can lead that charge." },
  { type: "Operations Lead", icon: Briefcase, color: "#4b5563", weakness: ["elephant", "Elephant"], desc: "Scaling will be tough without someone managing operations, logistics, and long-term planning." },
  { type: "Customer Champion", icon: Users, color: "#facc15", weakness: ["bee", "Bee"], desc: "You need someone obsessively close to your users — running interviews, gathering feedback, and validating demand." }
];

export function CoFounderMatcher({ scores }: { scores: any }) {
  if (!scores) return null;

  // Find the 2 weakest scores
  const scoreEntries = Object.entries(scores || {})
    .filter(([_, v]) => typeof v === 'number')
    .sort(([, a]: any, [, b]: any) => a - b);

  const weakest = scoreEntries.slice(0, 3).map(([key]) => key.toLowerCase());

  const matches = CO_FOUNDER_TYPES.filter(cf => 
    cf.weakness.some(w => weakest.includes(w.toLowerCase()))
  ).slice(0, 3);

  if (matches.length === 0) return null;

  return (
    <motion.div 
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="mt-16 p-10 rounded-[3rem] bg-white/[0.02] border border-white/5 backdrop-blur-3xl relative overflow-hidden group hover:border-electric-blue/20 transition-all duration-700"
    >
      {/* Background Accent */}
      <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-electric-blue/[0.04] rounded-full blur-[100px] -mr-48 -mt-48 group-hover:bg-electric-blue/[0.06] transition-all duration-700" />

      <div className="flex items-center gap-6 mb-12 relative z-10">
        <div className="p-4 rounded-[1.25rem] bg-electric-blue/10 border border-electric-blue/20 text-electric-blue shadow-[0_0_20px_rgba(59,130,246,0.15)] group-hover:scale-110 group-hover:shadow-electric-blue/30 transition-all duration-500">
          <Users className="w-8 h-8" />
        </div>
        <div>
          <h2 className="text-3xl font-bold font-heading text-white bg-gradient-to-r from-white to-zinc-500 bg-clip-text text-transparent">Co-Founder Matcher</h2>
          <p className="text-zinc-500 text-sm font-medium">Based on your weaknesses, here's who you should recruit</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 relative z-10">
        {matches.map((match, i) => {
          const Icon = match.icon;
          return (
            <motion.div
              key={i}
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 + i * 0.1, type: "spring", stiffness: 100 }}
              className="p-8 rounded-3xl bg-white/[0.03] border border-white/10 hover:bg-white/[0.06] hover:border-white/20 hover:shadow-[0_20px_40px_rgba(0,0,0,0.3)] transition-all duration-500 group/card relative overflow-hidden"
            >
              <div 
                className="absolute -top-10 -right-10 w-24 h-24 blur-3xl opacity-0 group-hover/card:opacity-20 transition-opacity duration-500"
                style={{ backgroundColor: match.color }}
              />
              
              <div className="flex items-center gap-5 mb-6">
                <div 
                  className="p-4 rounded-2xl border transition-all duration-500 group-hover/card:scale-110"
                  style={{ backgroundColor: `${match.color}15`, borderColor: `${match.color}30` }}
                >
                  <Icon className="w-7 h-7" style={{ color: match.color }} />
                </div>
                <div>
                  <h4 className="font-black text-white text-lg tracking-tight leading-tight">{match.type}</h4>
                  <span className="text-[9px] font-black text-zinc-500 uppercase tracking-[0.2em] group-hover/card:text-white/40 transition-colors">Recommended</span>
                </div>
              </div>
              
              <p className="text-sm text-zinc-400 leading-relaxed font-medium mb-8 min-h-[4.5rem] group-hover/card:text-zinc-200 transition-colors">{match.desc}</p>
              
              <div className="pt-6 border-t border-white/5 mt-auto">
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 rounded-full animate-pulse shadow-[0_0_8px_rgba(245,158,11,0.5)]" style={{ backgroundColor: match.color }} />
                  <span className="text-[10px] font-black uppercase tracking-[0.2em]" style={{ color: match.color }}>
                    Safari Gap: {match.weakness[0]}
                  </span>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </motion.div>
  );
}

