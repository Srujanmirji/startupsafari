"use client";

import { motion } from "framer-motion";
import { Layout, ChevronRight, Presentation } from "lucide-react";

export function PitchDeckSection({ deck }: { deck: any[] }) {
  if (!deck || deck.length === 0) return null;

  return (
    <div className="mt-16 p-8 rounded-[2rem] bg-white/[0.02] border border-white/5 backdrop-blur-3xl">
      <div className="flex items-center gap-4 mb-10">
        <div className="p-3 rounded-2xl bg-peacock/10 border border-peacock/20 text-peacock">
          <Presentation className="w-6 h-6" />
        </div>
        <div>
          <h2 className="text-3xl font-bold font-heading">Pitch Deck Architect</h2>
          <p className="text-zinc-500 text-sm">Generated strategy slides for your startup vision</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
        {deck.map((slide, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.05 }}
            className="group relative p-6 rounded-2xl bg-white/5 border border-white/10 hover:border-peacock/30 transition-all cursor-default"
          >
            <div className="absolute top-4 right-4 text-[10px] font-bold text-zinc-600">SLIDE {i + 1}</div>
            <h4 className="text-peacock font-bold mb-3 flex items-center gap-2">
              <ChevronRight className="w-3 h-3" />
              {slide.slide}
            </h4>
            <p className="text-xs text-zinc-400 leading-relaxed font-medium line-clamp-4 group-hover:line-clamp-none transition-all">
              {slide.content}
            </p>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
