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
    <div className="mt-16 p-8 rounded-[2rem] bg-white/[0.02] border border-white/5 backdrop-blur-3xl">
      <div className="flex items-center gap-4 mb-10">
        <div className="p-3 rounded-2xl bg-electric-blue/10 border border-electric-blue/20 text-electric-blue">
          <Users className="w-6 h-6" />
        </div>
        <div>
          <h2 className="text-3xl font-bold font-heading">Co-Founder Matcher</h2>
          <p className="text-zinc-500 text-sm">Based on your weaknesses, here's who you should recruit</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {matches.map((match, i) => {
          const Icon = match.icon;
          return (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="p-6 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/[0.08] transition-all group"
            >
              <div className="flex items-center gap-4 mb-4">
                <div 
                  className="p-3 rounded-xl border transition-all group-hover:scale-110"
                  style={{ backgroundColor: `${match.color}15`, borderColor: `${match.color}30` }}
                >
                  <Icon className="w-6 h-6" style={{ color: match.color }} />
                </div>
                <div>
                  <h4 className="font-bold text-white text-lg">{match.type}</h4>
                  <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Recommended</span>
                </div>
              </div>
              <p className="text-xs text-zinc-400 leading-relaxed">{match.desc}</p>
              
              <div className="mt-6 pt-4 border-t border-white/5">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
                  <span className="text-[10px] text-amber-400 font-bold uppercase tracking-widest">
                    Weakness: {match.weakness[0]}
                  </span>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
