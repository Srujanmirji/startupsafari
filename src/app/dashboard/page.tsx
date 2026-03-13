"use client";

import { useEffect, useState } from "react";
import { Navbar } from "@/components/ui/Navbar";
import { api } from "@/services/api";
import { Plus, ArrowRight, BarChart3, Clock, LayoutGrid, List } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";

export default function Dashboard() {
  const [ideas, setIdeas] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchIdeas = async () => {
      const { data } = await api.getDashboard();
      setIdeas(data);
      setLoading(false);
    };
    fetchIdeas();
  }, []);

  return (
    <div className="min-h-screen bg-[#05050f] text-white">
      <Navbar />
      
      <main className="pt-32 pb-20 px-6 max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12 gap-6">
          <div>
            <h1 className="text-4xl font-bold font-heading mb-2">Safari Dashboard</h1>
            <p className="text-zinc-500">Track and manage your startup validations.</p>
          </div>
          <Link 
            href="/submit" 
            className="flex items-center gap-2 bg-electric-blue text-white px-6 py-3 rounded-xl font-bold hover:opacity-90 transition-colors shadow-lg shadow-electric-blue/20"
          >
            <Plus className="w-5 h-5" />
            New Validation
          </Link>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            {[
                { label: "Total Validations", value: ideas.length, icon: BarChart3, color: "text-blue-400" },
                { label: "High Potential", value: ideas.filter(i => i.score && i.score > 80).length, icon: ArrowRight, color: "text-emerald-400" },
                { label: "Pending Analysis", value: ideas.filter(i => i.status === "Analyzing").length, icon: Clock, color: "text-amber-400" }
            ].map((stat, i) => (
                <div key={i} className="p-6 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md">
                    <div className="flex justify-between items-start mb-4">
                        <div className={`p-3 rounded-xl bg-white/5 ${stat.color}`}>
                            <stat.icon className="w-6 h-6" />
                        </div>
                        <span className="text-3xl font-bold text-white">{stat.value}</span>
                    </div>
                    <p className="text-sm font-bold text-zinc-500 uppercase tracking-widest">{stat.label}</p>
                </div>
            ))}
        </div>

        {/* Idea List */}
        <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-bold font-heading">Your Recent Hunts</h3>
            <div className="flex items-center gap-2 bg-white/5 p-1 rounded-lg border border-white/10">
                <button className="p-1.5 rounded-md bg-white/10 text-white"><LayoutGrid className="w-4 h-4" /></button>
                <button className="p-1.5 rounded-md text-zinc-500 hover:text-white"><List className="w-4 h-4" /></button>
            </div>
        </div>

        {loading ? (
            <div className="py-20 text-center text-zinc-500">Loading your ideas...</div>
        ) : ideas.length === 0 ? (
            <div className="py-24 flex flex-col items-center justify-center text-center border border-dashed border-white/10 rounded-3xl bg-white/[0.02]">
                <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center mb-6 border border-white/10">
                    <Plus className="w-8 h-8 text-zinc-500" />
                </div>
                <h3 className="text-xl font-bold font-heading text-white mb-2">No Hunts Yet</h3>
                <p className="text-zinc-500 max-w-sm mb-8 font-medium">You haven't analyzed any startup ideas yet. Start your first validation journey.</p>
                <Link 
                    href="/submit" 
                    className="flex items-center gap-2 bg-white text-black px-6 py-3 rounded-xl font-bold hover:bg-zinc-200 transition-colors shadow-xl"
                >
                    <Plus className="w-5 h-5 -ml-1" />
                    New Validation
                </Link>
            </div>
        ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {ideas.map((idea, i) => (
                    <motion.div
                        key={idea.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.05 }}
                        className="group relative p-6 rounded-3xl bg-white/5 border border-white/10 hover:border-electric-blue/30 transition-all hover:bg-white/[0.07]"
                    >
                        <div className="flex justify-between items-start mb-6">
                            <div className="space-y-1">
                                <h4 className="text-lg font-bold text-white group-hover:text-electric-blue transition-colors">{idea.title || "Untitled Hunt"}</h4>
                                <p className="text-xs text-zinc-500">{idea.date}</p>
                            </div>
                            {idea.score && (
                                <div className="bg-electric-blue/10 text-electric-blue px-3 py-1 rounded-full text-xs font-bold border border-electric-blue/20">
                                    {idea.score}% Match
                                </div>
                            )}
                        </div>

                        <div className="flex items-center gap-4 mb-8">
                             <div className="flex -space-x-2">
                                {["🦊", "🦉", "🦈"].map((emoji, idx) => (
                                    <div key={idx} className="w-8 h-8 rounded-full bg-zinc-900 border-2 border-[#05050f] flex items-center justify-center text-sm shadow-xl">
                                        {emoji}
                                    </div>
                                ))}
                             </div>
                             <span className="text-xs text-zinc-500 font-medium">Experts Analyzed</span>
                        </div>

                        <Link 
                            href={idea.status === "Validated" ? `/results?id=${idea.id}` : `/analysis?id=${idea.id}`}
                            className="flex items-center justify-between w-full p-4 rounded-xl bg-white/5 border border-white/10 group-hover:bg-electric-blue group-hover:text-white transition-all font-bold text-sm"
                        >
                            {idea.status === "Validated" ? "View Full Report" : "Continue Analysis"}
                            <ArrowRight className="w-4 h-4" />
                        </Link>
                    </motion.div>
                ))}
            </div>
        )}
        {/* Industry Heatmap */}
        <div className="mt-16 p-8 rounded-[2.5rem] bg-white/[0.02] border border-white/5 backdrop-blur-3xl relative overflow-hidden">
             <div className="absolute top-0 right-0 p-8 opacity-10">
                <BarChart3 className="w-32 h-32" />
             </div>
             <div className="relative z-10">
                <div className="flex items-center gap-4 mb-8">
                    <div className="p-3 rounded-2xl bg-violet-600/10 border border-violet-600/20 text-violet-500">
                        <LayoutGrid className="w-6 h-6" />
                    </div>
                    <div>
                        <h3 className="text-2xl font-bold font-heading">Safari Global Insights</h3>
                        <p className="text-zinc-500 text-sm">Real-time startup viability trends across the ecosystem</p>
                    </div>
                </div>

                <div className="grid grid-cols-2 shadow-2xl md:grid-cols-4 gap-6">
                    {[
                        { industry: "AI & ML", trend: "+12%", score: 88, color: "text-emerald-400" },
                        { industry: "SaaS", trend: "+5%", score: 74, color: "text-blue-400" },
                        { industry: "FinTech", trend: "-2%", score: 62, color: "text-amber-400" },
                        { industry: "E-commerce", trend: "+8%", score: 79, color: "text-purple-400" }
                    ].map((item, idx) => (
                        <div key={idx} className="p-5 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 transition-all cursor-default">
                            <div className="flex justify-between items-center mb-2">
                                <span className="text-xs font-bold text-zinc-500 uppercase tracking-widest">{item.industry}</span>
                                <span className={`text-[10px] font-bold ${item.color}`}>{item.trend}</span>
                            </div>
                            <div className="text-2xl font-bold text-white mb-2">{item.score} <span className="text-[10px] text-zinc-600">AVG</span></div>
                            <div className="w-full h-1 bg-white/5 rounded-full overflow-hidden">
                                <div className="h-full bg-electric-blue transition-all" style={{ width: `${item.score}%` }}></div>
                            </div>
                        </div>
                    ))}
                </div>
             </div>
        </div>
      </main>
    </div>
  );
}
