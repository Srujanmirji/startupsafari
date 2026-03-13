"use client";

import { motion } from "framer-motion";
import { Navbar } from "@/components/ui/Navbar";
import { Footer } from "@/components/ui/Footer";
import Link from "next/link";
import { 
  Rocket, 
  BarChart3, 
  Users, 
  MessageSquare, 
  FileCode, 
  Presentation, 
  Target, 
  Share2,
  RefreshCw,
  Search,
  ShieldAlert,
  Zap,
  Swords, 
  LineChart, 
  Globe2
} from "lucide-react";

export default function ExploreFeatures() {
  const CURRENT_FEATURES = [
    {
      title: "AI Deep Dive Analysis",
      description: "6-step AI interview to refine your startup idea before the Safari panel evaluates it.",
      icon: Search,
      color: "text-blue-400",
      bg: "bg-blue-400/10",
      link: "/submit"
    },
    {
      title: "Safari Dashboard",
      description: "Track all your hunts, view global insights, and manage your startup ideas.",
      icon: BarChart3,
      color: "text-emerald-400",
      bg: "bg-emerald-400/10",
      link: "/dashboard"
    },
    {
      title: "Expert Live Chat",
      description: "Chat in real-time with any of the 10 AI expert personas to ask follow-up questions.",
      icon: MessageSquare,
      color: "text-purple-400",
      bg: "bg-purple-400/10",
      link: "/dashboard"
    },
    {
      title: "Pitch Deck Generator",
      description: "Automatically creates a 10-slide investor-ready pitch deck structure.",
      icon: Presentation,
      color: "text-amber-400",
      bg: "bg-amber-400/10",
      link: "/dashboard"
    },
    {
      title: "Hacker's Toolkit",
      description: "Generates a complete README.md and an 8-week Sprint MVP Roadmap.",
      icon: FileCode,
      color: "text-rose-400",
      bg: "bg-rose-400/10",
      link: "/dashboard"
    },
    {
      title: "Co-Founder Matcher",
      description: "Recommends the perfect co-founder based on your idea's weakest scores.",
      icon: Users,
      color: "text-cyan-400",
      bg: "bg-cyan-400/10",
      link: "/dashboard"
    },
    {
      title: "Evolution Tracker",
      description: "Re-evaluate ideas and track your score improvements across multiple versions.",
      icon: RefreshCw,
      color: "text-violet-400",
      bg: "bg-violet-400/10",
      link: "/dashboard"
    },
    {
      title: "Public Shareable Reports",
      description: "Generate read-only links to securely share your viability scores with investors.",
      icon: Share2,
      color: "text-fuchsia-400",
      bg: "bg-fuchsia-400/10",
      link: "/dashboard"
    },
    {
      title: "The Shark Tank",
      description: "Enter a live chat room and defend your startup against the ruthless Shark persona.",
      icon: ShieldAlert,
      color: "text-rose-500",
      bg: "bg-rose-500/10",
      link: "/dashboard"
    }
  ];

  const UPCOMING_FEATURES = [
    {
      title: "Financial Projections",
      description: "Generate automated 3-year P&L tables, CAC, LTV, and break-even analysis.",
      icon: LineChart,
    },
    {
      title: "Competitor Battlecards",
      description: "Side-by-side matrix comparing your unique features against the top 3 market competitors.",
      icon: Swords,
    },
    {
      title: "The Safari Park Feed",
      description: "A public community feed where founders can upvote ideas and offer to co-found.",
      icon: Globe2,
    }
  ];

  return (
    <div className="min-h-screen bg-[#05050f] text-white">
      <Navbar />
      
      <main className="pt-32 pb-20 px-6 max-w-7xl mx-auto">
        <div className="text-center mb-20">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="inline-flex p-3 rounded-2xl bg-electric-blue/10 border border-electric-blue/20 text-electric-blue mb-6"
          >
            <Rocket className="w-8 h-8" />
          </motion.div>
          <h1 className="text-4xl md:text-6xl font-bold font-heading mb-6">
            The <span className="text-gradient">Safari</span> Hub
          </h1>
          <p className="text-xl text-zinc-400 max-w-2xl mx-auto">
            Explore the complete suite of tools designed to validate, build, and scale your startup idea from day one.
          </p>
        </div>

        {/* Current Features Grid */}
        <h2 className="text-2xl font-bold font-heading mb-8 flex items-center gap-3">
          <Zap className="w-6 h-6 text-electric-light" />
          Live Features
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-24">
          {CURRENT_FEATURES.map((feature, i) => (
            <Link href={feature.link} key={i}>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                className="p-6 rounded-3xl bg-white/5 border border-white/10 hover:border-electric-blue/40 hover:bg-white/[0.08] transition-all h-full group"
              >
                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center mb-6 ${feature.bg} ${feature.color} group-hover:scale-110 transition-transform`}>
                  <feature.icon className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold text-white mb-3 font-heading group-hover:text-electric-blue transition-colors">{feature.title}</h3>
                <p className="text-sm text-zinc-400 leading-relaxed">{feature.description}</p>
              </motion.div>
            </Link>
          ))}
        </div>

        {/* Level 3 / Upcoming Grid */}
        <div className="relative p-10 sm:p-14 rounded-[3rem] bg-gradient-to-br from-white/[0.03] to-white/[0.01] border border-white/10 overflow-hidden">
          <div className="absolute top-0 right-0 p-12 opacity-5 pointer-events-none">
            <Target className="w-64 h-64" />
          </div>
          
          <div className="relative z-10">
            <h2 className="text-3xl font-bold font-heading mb-3">Coming Soon: Level 3</h2>
            <p className="text-zinc-500 mb-10 text-lg max-w-xl">
              We are building the next generation of unicorn tools. Here is what's dropping next on StartupSafari.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {UPCOMING_FEATURES.map((feature, i) => (
                <div key={i} className="flex gap-4 p-6 rounded-2xl bg-black/40 border border-white/5 opacity-80 backdrop-blur-md">
                  <div className="w-12 h-12 rounded-full border border-white/10 flex items-center justify-center flex-shrink-0 bg-white/5">
                    <feature.icon className="w-5 h-5 text-zinc-500" />
                  </div>
                  <div>
                    <h4 className="text-lg font-bold text-white mb-2">{feature.title}</h4>
                    <p className="text-sm text-zinc-500 leading-relaxed">{feature.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
