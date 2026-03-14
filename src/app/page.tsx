"use client";

import { motion, useScroll, useTransform, useSpring, useInView } from "framer-motion";
import Link from "next/link";
import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  Rocket, Search, BarChart3, ShieldCheck, Zap, Clock, CheckCircle2,
  Lightbulb, Target, ArrowRight, Users, MessageSquare, FileCode,
  Presentation, RefreshCw, Share2, ShieldAlert, Star, Play,
  Sparkles, TrendingUp, Globe, ChevronRight, Award, Handshake
} from "lucide-react";
import { HeroSection } from "@/components/ui/HeroSection";
import { Navbar } from "@/components/ui/Navbar";
import { Footer } from "@/components/ui/Footer";
import { useAuth } from "@/context/AuthContext";
import { SignupModal } from "@/components/ui/SignupModal";

// Animated counter component
function AnimatedCounter({ value, suffix = "" }: { value: string; suffix?: string }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });
  const numericMatch = value.match(/([\d,]+)/);
  const numericVal = numericMatch ? parseInt(numericMatch[1].replace(/,/g, "")) : 0;
  const prefix = value.replace(/[\d,]+.*/, "");
  const suffixPart = value.replace(/.*[\d,]/, "");
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!isInView || numericVal === 0) return;
    let start = 0;
    const duration = 2000;
    const increment = numericVal / (duration / 16);
    const timer = setInterval(() => {
      start += increment;
      if (start >= numericVal) { setCount(numericVal); clearInterval(timer); }
      else setCount(Math.floor(start));
    }, 16);
    return () => clearInterval(timer);
  }, [isInView, numericVal]);

  if (numericVal === 0) return <span ref={ref}>{value}</span>;
  return <span ref={ref}>{prefix}{count.toLocaleString()}{suffixPart}{suffix}</span>;
}

// Animation variants
const staggerContainer = {
  hidden: {},
  show: { transition: { staggerChildren: 0.12 } },
};

const slideFromLeft = {
  hidden: { opacity: 0, x: -60 },
  show: { opacity: 1, x: 0, transition: { duration: 0.7, ease: [0.25, 0.46, 0.45, 0.94] as const } },
};

const slideFromRight = {
  hidden: { opacity: 0, x: 60 },
  show: { opacity: 1, x: 0, transition: { duration: 0.7, ease: [0.25, 0.46, 0.45, 0.94] as const } },
};

const scaleIn = {
  hidden: { opacity: 0, scale: 0.85 },
  show: { opacity: 1, scale: 1, transition: { duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] as const } },
};

const blurFadeIn = {
  hidden: { opacity: 0, y: 40, filter: "blur(10px)" },
  show: { opacity: 1, y: 0, filter: "blur(0px)", transition: { duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] as const } },
};

const cardPopIn = {
  hidden: { opacity: 0, y: 50, scale: 0.9 },
  show: { opacity: 1, y: 0, scale: 1, transition: { type: "spring" as const, stiffness: 100, damping: 15 } },
};

const SAFARI_EXPERTS = [
  { name: "Fox", emoji: "🦊", color: "#facc15", role: "Business Strategist", desc: "Evaluates your core business logic and revenue potential" },
  { name: "Owl", emoji: "🦉", color: "#60a5fa", role: "Market Analyst", desc: "Deep dives into market trends, TAM, and growth trajectory" },
  { name: "Shark", emoji: "🦈", color: "#a855f7", role: "Finance Expert", desc: "Stress-tests unit economics, CAC, LTV, and cash flow" },
  { name: "Bee", emoji: "🐝", color: "#f59e0b", role: "User Researcher", desc: "Validates product-market fit through user demand signals" },
  { name: "Wolf", emoji: "🐺", color: "#9ca3af", role: "Competitive Intel", desc: "Maps your competitive landscape and identifies your moat" },
  { name: "Cheetah", emoji: "🐆", color: "#f97316", role: "Speed Advisor", desc: "Evaluates your go-to-market speed and first-mover advantage" },
];

const FEATURES = [
  { title: "AI Deep Dive Interview", desc: "6-step guided interview refines your idea before the panel evaluates it.", icon: Search, color: "text-blue-400", bg: "from-blue-500/10 to-blue-900/5", link: "/submit" },
  { title: "10 Expert AI Personas", desc: "Each animal expert scores your idea from their unique perspective.", icon: Users, color: "text-violet-400", bg: "from-violet-500/10 to-violet-900/5", link: "/dashboard" },
  { title: "Live Expert Chat", desc: "Chat 1-on-1 with any expert persona for follow-up questions.", icon: MessageSquare, color: "text-purple-400", bg: "from-purple-500/10 to-purple-900/5", link: "/dashboard" },
  { title: "Pitch Deck Generator", desc: "Auto-generates a 10-slide investor-ready pitch deck structure.", icon: Presentation, color: "text-amber-400", bg: "from-amber-500/10 to-amber-900/5", link: "/dashboard" },
  { title: "Hacker's Toolkit", desc: "Generates README.md and an 8-week sprint MVP roadmap.", icon: FileCode, color: "text-rose-400", bg: "from-rose-500/10 to-rose-900/5", link: "/dashboard" },
  { title: "Co-Founder Matching", desc: "Find the perfect co-founder based on skills and startup gaps.", icon: Handshake, color: "text-cyan-400", bg: "from-cyan-500/10 to-cyan-900/5", link: "/co-founder" },
  { title: "Evolution Tracker", desc: "Re-evaluate and track your score improvements across versions.", icon: RefreshCw, color: "text-emerald-400", bg: "from-emerald-500/10 to-emerald-900/5", link: "/dashboard" },
  { title: "The Shark Tank", desc: "Defend your numbers in a live chat against the ruthless Shark.", icon: ShieldAlert, color: "text-rose-500", bg: "from-rose-500/10 to-rose-900/5", link: "/shark-tank" },
];

const STEPS = [
  { step: "01", title: "Describe Your Idea", desc: "Enter your startup concept in a single sentence. Our AI takes it from there.", icon: Lightbulb, color: "#f59e0b" },
  { step: "02", title: "Deep Dive Interview", desc: "Answer 6 AI-guided questions to refine your problem, audience, and model.", icon: Search, color: "#60a5fa" },
  { step: "03", title: "Safari Panel Review", desc: "10 AI expert personas analyze and score your idea from every angle.", icon: Users, color: "#8b5cf6" },
  { step: "04", title: "Get Your Report", desc: "Receive a full viability report with SWOT, pitch deck, and action plan.", icon: BarChart3, color: "#34d399" },
];

const STATS = [
  { value: "10,000+", label: "Ideas Analyzed", icon: Rocket },
  { value: "10", label: "AI Expert Personas", icon: Users },
  { value: "85%", label: "User Satisfaction", icon: Star },
  { value: "<60s", label: "Analysis Time", icon: Clock },
];

export default function Home() {
  const [mounted, setMounted] = useState(false);
  const { user } = useAuth();
  const router = useRouter();
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Scroll progress bar
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 100, damping: 30, restDelta: 0.001 });

  // Parallax refs
  const parallaxRef1 = useRef(null);
  const parallaxRef2 = useRef(null);
  const { scrollYProgress: p1 } = useScroll({ target: parallaxRef1, offset: ["start end", "end start"] });
  const { scrollYProgress: p2 } = useScroll({ target: parallaxRef2, offset: ["start end", "end start"] });
  const parallaxY1 = useTransform(p1, [0, 1], [80, -80]);
  const parallaxY2 = useTransform(p2, [0, 1], [100, -100]);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleStartAnalysis = () => {
    if (user) {
      router.push("/submit");
    } else {
      setIsModalOpen(true);
    }
  };

  if (!mounted) {
    return <div className="min-h-screen bg-[#05050f]" />;
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />

      <main>
        {/* HERO SECTION - KEPT AS IS */}
        <HeroSection />

        {/* SOCIAL PROOF / STATS BANNER */}
        <section className="py-16 relative border-y border-white/5 overflow-hidden">
          <div className="max-w-7xl mx-auto px-6">
            <motion.div
              variants={staggerContainer}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, margin: "-100px" }}
              className="grid grid-cols-2 md:grid-cols-4 gap-8"
            >
              {STATS.map((stat, i) => (
                <motion.div
                  key={i}
                  variants={scaleIn}
                  className="text-center group"
                >
                  <div className="inline-flex p-3 rounded-2xl bg-white/[0.03] border border-white/5 mb-4 group-hover:border-violet-500/20 group-hover:bg-violet-500/[0.05] transition-all duration-500">
                    <stat.icon className="w-6 h-6 text-violet-400" />
                  </div>
                  <div className="text-3xl md:text-4xl font-black text-white font-heading mb-1">
                    <AnimatedCounter value={stat.value} />
                  </div>
                  <div className="text-xs font-bold text-zinc-500 uppercase tracking-[0.2em]">{stat.label}</div>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>

        {/* HOW IT WORKS */}
        <section className="py-24 sm:py-32 relative overflow-hidden" ref={parallaxRef1}>
          <motion.div className="absolute top-0 left-1/3 w-[500px] h-[500px] bg-blue-600/[0.04] rounded-full blur-[120px] pointer-events-none" style={{ y: parallaxY1 }} />
          <div className="max-w-7xl mx-auto px-6 relative z-10">
            <motion.div
              variants={blurFadeIn}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, margin: "-80px" }}
              className="text-center mb-20"
            >
              <span className="text-[10px] font-black uppercase tracking-[0.3em] text-electric-blue mb-4 inline-block">How It Works</span>
              <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white font-heading mb-6">
                From idea to <span className="text-gradient">validation</span> in minutes
              </h2>
              <p className="text-lg text-zinc-500 max-w-2xl mx-auto">Four simple steps to get a complete viability analysis from our AI expert panel.</p>
            </motion.div>

            <motion.div
              variants={staggerContainer}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, margin: "-50px" }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
            >
              {STEPS.map((step, i) => (
                <motion.div
                  key={i}
                  variants={cardPopIn}
                  whileHover={{ y: -8, transition: { type: "spring", stiffness: 300, damping: 20 } }}
                  className="relative p-8 rounded-[2rem] bg-white/[0.02] border border-white/5 hover:border-white/10 hover:bg-white/[0.04] transition-colors duration-500 group"
                >
                  <div className="absolute -top-4 -left-2 text-[80px] font-black text-white/[0.03] font-heading leading-none pointer-events-none group-hover:text-white/[0.06] transition-colors duration-500">{step.step}</div>
                  <div className="relative z-10">
                    <div className="w-14 h-14 rounded-2xl flex items-center justify-center mb-6 border transition-all duration-500 group-hover:scale-110"
                      style={{ backgroundColor: `${step.color}15`, borderColor: `${step.color}25` }}>
                      <step.icon className="w-7 h-7" style={{ color: step.color }} />
                    </div>
                    <h3 className="text-xl font-bold text-white mb-3 font-heading">{step.title}</h3>
                    <p className="text-sm text-zinc-500 leading-relaxed">{step.desc}</p>
                  </div>
                  {i < STEPS.length - 1 && (
                    <motion.div
                      className="hidden lg:block absolute top-1/2 -right-3 z-20"
                      initial={{ opacity: 0, x: -5 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: 0.6 + i * 0.15 }}
                    >
                      <ChevronRight className="w-6 h-6 text-zinc-700" />
                    </motion.div>
                  )}
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>

        {/* MEET THE SAFARI PANEL */}
        <section className="py-24 sm:py-32 relative overflow-hidden" ref={parallaxRef2}>
          <motion.div className="absolute bottom-0 right-1/4 w-[400px] h-[400px] bg-violet-600/[0.05] rounded-full blur-[100px] pointer-events-none" style={{ y: parallaxY2 }} />
          <div className="max-w-7xl mx-auto px-6 relative z-10">
            <motion.div
              variants={blurFadeIn}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, margin: "-80px" }}
              className="text-center mb-20"
            >
              <span className="text-[10px] font-black uppercase tracking-[0.3em] text-amber-400 mb-4 inline-block">The Expert Panel</span>
              <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white font-heading mb-6">
                Meet your <span className="text-gradient">Safari Panel</span>
              </h2>
              <p className="text-lg text-zinc-500 max-w-2xl mx-auto">Each AI persona evaluates your idea from a unique expert perspective. Together, they give you the full picture.</p>
            </motion.div>

            <motion.div
              variants={staggerContainer}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, margin: "-50px" }}
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
            >
              {SAFARI_EXPERTS.map((expert, i) => (
                <motion.div
                  key={i}
                  variants={i % 2 === 0 ? slideFromLeft : slideFromRight}
                  whileHover={{ y: -6, scale: 1.02, transition: { type: "spring", stiffness: 300, damping: 20 } }}
                  className="p-6 rounded-[2rem] bg-white/[0.02] border border-white/5 hover:bg-white/[0.04] hover:border-white/10 transition-colors duration-500 group relative overflow-hidden"
                >
                  <div className="absolute -top-10 -right-10 w-24 h-24 blur-[50px] opacity-10 group-hover:opacity-25 transition-opacity duration-500" style={{ backgroundColor: expert.color }} />
                  <div className="flex items-center gap-5 mb-4 relative z-10">
                    <div className="text-5xl group-hover:scale-110 group-hover:rotate-6 transition-transform duration-500 drop-shadow-[0_5px_15px_rgba(0,0,0,0.5)]">
                      {expert.emoji}
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-white">{expert.name}</h3>
                      <p className="text-[10px] font-black uppercase tracking-[0.2em]" style={{ color: expert.color }}>{expert.role}</p>
                    </div>
                  </div>
                  <p className="text-sm text-zinc-500 leading-relaxed relative z-10">{expert.desc}</p>
                </motion.div>
              ))}
            </motion.div>

            <motion.div
              variants={blurFadeIn}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true }}
              className="text-center mt-10"
            >
              <p className="text-zinc-600 text-sm">+ 4 more experts including Eagle 🦅, Elephant 🐘, Peacock 🦚, and Beaver 🦫</p>
            </motion.div>
          </div>
        </section>

        {/* FEATURES GRID */}
        <section className="py-24 sm:py-32 relative">
          <div className="absolute top-1/2 left-0 w-[300px] h-[300px] bg-cyan-500/[0.04] rounded-full blur-[80px] pointer-events-none" />
          <div className="max-w-7xl mx-auto px-6 relative z-10">
            <motion.div
              variants={blurFadeIn}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, margin: "-80px" }}
              className="text-center mb-20"
            >
              <span className="text-[10px] font-black uppercase tracking-[0.3em] text-emerald-400 mb-4 inline-block">Platform Features</span>
              <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white font-heading mb-6">
                Everything you need to <span className="text-gradient">validate & launch</span>
              </h2>
              <p className="text-lg text-zinc-500 max-w-2xl mx-auto">From AI analysis to co-founder matching — a complete toolkit for serious founders.</p>
            </motion.div>

            <motion.div
              variants={staggerContainer}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, margin: "-30px" }}
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5"
            >
              {FEATURES.map((feature, i) => (
                <Link key={i} href={feature.link}>
                  <motion.div
                    variants={cardPopIn}
                    whileHover={{ y: -8, scale: 1.03, transition: { type: "spring" as const, stiffness: 300, damping: 20 } }}
                    className={`h-full p-6 rounded-[1.5rem] bg-gradient-to-br ${feature.bg} border border-white/5 hover:border-white/15 transition-colors duration-500 group cursor-pointer`}
                  >
                    <div className={`w-12 h-12 rounded-xl bg-white/[0.06] flex items-center justify-center mb-5 ${feature.color} group-hover:scale-110 group-hover:rotate-3 transition-transform duration-300`}>
                      <feature.icon className="w-6 h-6" />
                    </div>
                    <h3 className="text-lg font-bold text-white mb-2 font-heading">{feature.title}</h3>
                    <p className="text-sm text-zinc-500 leading-relaxed">{feature.desc}</p>
                  </motion.div>
                </Link>
              ))}
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.5 }}
              className="text-center mt-12"
            >
              <Link href="/explore" className="inline-flex items-center gap-2 text-electric-blue font-bold text-sm hover:underline underline-offset-4 group">
                Explore all features <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            </motion.div>
          </div>
        </section>

        {/* CO-FOUNDER MATCHING PROMO */}
        <section className="py-24 sm:py-32 relative">
          <div className="max-w-7xl mx-auto px-6">
            <motion.div
              initial={{ opacity: 0, scale: 0.97 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              className="relative overflow-hidden rounded-[3rem] bg-gradient-to-br from-violet-600/[0.08] to-blue-600/[0.05] border border-violet-500/15 p-10 sm:p-16"
            >
              <div className="absolute -top-20 -right-20 w-[300px] h-[300px] bg-violet-600/[0.1] rounded-full blur-[100px]" />
              <div className="absolute bottom-0 left-0 w-[200px] h-[200px] bg-blue-600/[0.08] rounded-full blur-[80px]" />

              <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                <div>
                  <div className="inline-flex p-3 rounded-2xl bg-violet-500/10 border border-violet-500/20 mb-6">
                    <Handshake className="w-8 h-8 text-violet-400" />
                  </div>
                  <h2 className="text-3xl sm:text-5xl font-bold text-white font-heading mb-6 leading-tight">
                    Find your perfect<br /><span className="text-gradient">co-founder</span>
                  </h2>
                  <p className="text-lg text-zinc-400 mb-8 leading-relaxed max-w-lg">
                    Create your founder profile, showcase your skills, and discover the ideal partner to build your startup with. Like YC Co-Founder Matching, but built into Safari.
                  </p>
                  <Link href="/co-founder" className="inline-flex items-center gap-2 bg-white text-black px-8 py-4 rounded-full font-bold text-lg hover:bg-zinc-200 transition-all hover:scale-105 shadow-[0_0_30px_rgba(255,255,255,0.2)]">
                    Browse Co-Founders <ArrowRight className="w-5 h-5" />
                  </Link>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  {[
                    { icon: "👨‍💻", title: "Technical CTO", skills: ["React", "AI/ML", "DevOps"] },
                    { icon: "📈", title: "Growth Lead", skills: ["Marketing", "SEO", "Analytics"] },
                    { icon: "🎨", title: "Design Lead", skills: ["UI/UX", "Brand", "Motion"] },
                    { icon: "💼", title: "Biz Co-Founder", skills: ["Sales", "Finance", "Ops"] },
                  ].map((card, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: 0.2 + i * 0.1 }}
                      className="p-5 rounded-2xl bg-white/[0.04] border border-white/10 hover:border-violet-500/20 transition-all duration-300"
                    >
                      <div className="text-3xl mb-3">{card.icon}</div>
                      <h4 className="text-sm font-bold text-white mb-2">{card.title}</h4>
                      <div className="flex flex-wrap gap-1">
                        {card.skills.map(s => (
                          <span key={s} className="px-2 py-0.5 rounded text-[9px] font-bold bg-violet-500/10 text-violet-300 border border-violet-500/20">{s}</span>
                        ))}
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </motion.div>
          </div>
        </section>

        {/* TESTIMONIALS / TRUST */}
        <section className="py-24 sm:py-32 relative">
          <div className="max-w-7xl mx-auto px-6">
            <motion.div
              variants={blurFadeIn}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, margin: "-80px" }}
              className="text-center mb-16"
            >
              <span className="text-[10px] font-black uppercase tracking-[0.3em] text-rose-400 mb-4 inline-block">What Founders Say</span>
              <h2 className="text-4xl sm:text-5xl font-bold text-white font-heading">
                Trusted by <span className="text-gradient">ambitious founders</span>
              </h2>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[
                { name: "Arjun M.", role: "Founder, NexaAI", quote: "StartupSafari gave me more actionable insight in 60 seconds than weeks of market research.", stars: 5 },
                { name: "Priya S.", role: "CEO, GreenLeaf", quote: "The Shark Tank feature made me rethink my entire pricing model. Brutal but necessary.", stars: 5 },
                { name: "Rahul K.", role: "CTO, DataVault", quote: "The co-founder matching connected me with my current business partner. Couldn't have built this alone.", stars: 5 },
              ].map((t, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className="p-8 rounded-[2rem] bg-white/[0.02] border border-white/5 hover:border-white/10 transition-all duration-300"
                >
                  <div className="flex gap-1 mb-5">
                    {Array.from({ length: t.stars }).map((_, j) => (
                      <Star key={j} className="w-4 h-4 text-amber-400 fill-amber-400" />
                    ))}
                  </div>
                  <p className="text-zinc-300 leading-relaxed mb-6 text-sm italic">&ldquo;{t.quote}&rdquo;</p>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-violet-600/30 to-blue-600/20 border border-violet-500/20 flex items-center justify-center text-sm font-bold text-white">
                      {t.name[0]}
                    </div>
                    <div>
                      <p className="text-sm font-bold text-white">{t.name}</p>
                      <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-wider">{t.role}</p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* FINAL CTA */}
        <section className="py-24 sm:py-40 relative overflow-hidden">
          {/* Animated gradient mesh */}
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] rounded-full bg-gradient-to-br from-violet-600/[0.12] via-electric-blue/[0.08] to-cyan-500/[0.06] blur-[120px] animate-pulse" />
            <div className="absolute top-0 right-0 w-[400px] h-[400px] rounded-full bg-rose-500/[0.04] blur-[100px] animate-pulse" style={{ animationDelay: "3s" }} />
            <div className="absolute bottom-0 left-0 w-[300px] h-[300px] rounded-full bg-amber-500/[0.04] blur-[80px] animate-pulse" style={{ animationDelay: "5s" }} />
          </div>

          <div className="max-w-5xl mx-auto px-6 text-center relative z-10">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              {/* Tagline pill */}
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.2 }}
                className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-white/[0.05] border border-white/10 mb-10"
              >
                <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse shadow-[0_0_8px_rgba(52,211,153,0.6)]" />
                <span className="text-[11px] font-bold text-zinc-400 uppercase tracking-[0.2em]">Free forever • No credit card</span>
              </motion.div>

              <h2 className="text-4xl sm:text-6xl lg:text-7xl font-bold text-white font-heading leading-[1.1] mb-8">
                Don&apos;t just dream it.<br />
                <span className="text-gradient">Validate it.</span>
              </h2>

              <p className="text-lg sm:text-xl text-zinc-400 max-w-2xl mx-auto mb-12 leading-relaxed">
                Your next big idea deserves more than a gut feeling. Let 10 AI experts tear it apart, build it up, and tell you exactly what it takes to win.
              </p>

              {/* Feature badges */}
              <div className="flex flex-wrap items-center justify-center gap-4 mb-14">
                {[
                  { icon: Zap, text: "60-Second Results", color: "text-amber-400" },
                  { icon: ShieldCheck, text: "Bank-Grade Privacy", color: "text-emerald-400" },
                  { icon: Sparkles, text: "AI-Powered Analysis", color: "text-violet-400" },
                ].map((badge, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 10 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.4 + i * 0.1 }}
                    className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white/[0.03] border border-white/5"
                  >
                    <badge.icon className={`w-4 h-4 ${badge.color}`} />
                    <span className="text-sm font-bold text-zinc-300">{badge.text}</span>
                  </motion.div>
                ))}
              </div>

              {/* CTA Button */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.6 }}
              >
                <button
                  onClick={handleStartAnalysis}
                  className="group relative inline-flex items-center gap-3 bg-white text-black px-10 sm:px-14 py-5 sm:py-6 rounded-full font-bold text-lg sm:text-xl hover:bg-zinc-100 transition-all hover:scale-105"
                >
                  {/* Glow ring */}
                  <div className="absolute inset-0 rounded-full shadow-[0_0_40px_rgba(255,255,255,0.3),0_0_80px_rgba(139,92,246,0.15)] group-hover:shadow-[0_0_60px_rgba(255,255,255,0.4),0_0_120px_rgba(139,92,246,0.25)] transition-all duration-500" />
                  <span className="relative z-10">Start Your Safari</span>
                  <ArrowRight className="w-6 h-6 relative z-10 group-hover:translate-x-1 transition-transform" />
                </button>
              </motion.div>

              <motion.p
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.8 }}
                className="text-zinc-600 text-sm mt-8"
              >
                Trusted by 10,000+ founders worldwide 🌍
              </motion.p>
            </motion.div>
          </div>
        </section>
      </main>

      <Footer />
      <SignupModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </div>
  );
}
