"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { 
  Rocket, 
  Search, 
  BarChart3, 
  ShieldCheck, 
  Zap, 
  Clock, 
  CheckCircle2,
  Lightbulb,
  Target,
  ArrowRight
} from "lucide-react";
import { HeroSection } from "@/components/ui/HeroSection";
import { Navbar } from "@/components/ui/Navbar";
import { FeatureCard } from "@/components/ui/FeatureCard";
import { PersonaCard } from "@/components/ui/PersonaCard";
import { ViabilityDisplay } from "@/components/ui/ScoreBar";
import { Footer } from "@/components/ui/Footer";

const PERSONAS = [
  { 
    name: "The Fox", 
    role: "Idea Logic Analyst", 
    description: "Evaluates the fundamental logic and feasibility of your solution. Spots structural flaws before they become expensive.", 
    icon: "🦊", 
    color: "#facc15" 
  },
  { 
    name: "The Owl", 
    role: "Market Intelligence", 
    description: "Deep dives into market size, niche opportunities, and macro trends affecting your industry.", 
    icon: "🦉", 
    color: "#60a5fa" 
  },
  { 
    name: "The Shark", 
    role: "Business Model Strength", 
    description: "Critiques your revenue streams and unit economics. Focuses on making your startup a money-making machine.", 
    icon: "🦈", 
    color: "#a855f7" 
  },
  { 
    name: "The Bee", 
    role: "Demand Validation", 
    description: "Simulates user behavior to predict actual demand and CAC vs LTV ratios.", 
    icon: "🐝", 
    color: "#f59e0b" 
  },
  { 
    name: "The Wolf", 
    role: "Competitive Strategy", 
    description: "Analyzes direct and indirect competitors to find your unfair advantage and 'moat'.", 
    icon: "🐺", 
    color: "#9ca3af" 
  },
  { 
    name: "The Cheetah", 
    role: "Speed to Market", 
    description: "Advises on the fastest path to MVP and initial traction, cutting out the fluff.", 
    icon: "🐆", 
    color: "#f97316" 
  },
  { 
    name: "The Peacock", 
    role: "Branding & Storytelling", 
    description: "Critiques your positioning and emotional hook to ensure your product resonates with humans.", 
    icon: "🦚", 
    color: "#34d399" 
  },
  { 
    name: "The Eagle", 
    role: "Long Term Vision", 
    description: "Looks at the 10-year horizon. Can this idea scale? Is it defensible in the long run?", 
    icon: "🦅", 
    color: "#fbbf24" 
  },
];

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      
      <main>
        {/* HERO SECTION */}
        <HeroSection />

        {/* HOW IT WORKS */}
        <section id="how-it-works" className="py-20 sm:py-28 lg:py-32 relative bg-[#05050f]">
          <div className="max-w-7xl mx-auto px-6">
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.8 }}
              className="text-center mb-12 sm:mb-16 lg:mb-20"
            >
              <h2 className="text-3xl sm:text-5xl lg:text-6xl font-bold text-white mb-6 font-heading">
                The Safari <span className="text-gradient">Process</span>
              </h2>
              <p className="text-zinc-400 text-base sm:text-lg max-w-2xl mx-auto leading-relaxed">
                We take your startup idea through three critical stages of evolution before it ever hits the market.
              </p>
            </motion.div>

            <motion.div 
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, margin: "-50px" }}
              variants={{
                hidden: { opacity: 0 },
                show: {
                  opacity: 1,
                  transition: { staggerChildren: 0.2 }
                }
              }}
              className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8"
            >
              {[
                { step: 1, icon: <Rocket className="w-6 h-6" />, title: "Idea Submission", desc: "Feed our experts your dream. Tell us the problem, your solution, and who you're building for." },
                { step: 2, icon: <BarChart3 className="w-6 h-6" />, title: "Expert Safari", desc: "8 animal personas stress-test every angle of your business from logic to long-term vision." },
                { step: 3, icon: <Zap className="w-6 h-6" />, title: "Viability Score", desc: "Get a crystal clear analysis and a score out of 100 to guide your next move." }
              ].map((item, i) => (
                <motion.div
                  key={i}
                  variants={{
                    hidden: { opacity: 0, y: 20 },
                    show: { opacity: 1, y: 0 }
                  }}
                >
                  <FeatureCard 
                    step={item.step}
                    icon={item.icon}
                    title={item.title}
                    description={item.desc}
                  />
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>

        {/* EXPERT PANEL */}
        <section id="experts" className="py-20 sm:py-28 lg:py-32 relative overflow-hidden bg-glass-dark">
          <div className="max-w-7xl mx-auto px-6 relative z-10">
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.8 }}
              className="text-center mb-12 sm:mb-16 lg:mb-20"
            >
              <h2 className="text-3xl sm:text-5xl lg:text-6xl font-bold text-white mb-6 font-heading">The AI <span className="text-gradient">Expert Panel</span></h2>
              <p className="text-zinc-400 text-base sm:text-lg max-w-2xl mx-auto leading-relaxed">Meet the hunters who will stress-test your idea from every possible angle.</p>
            </motion.div>
            
            <motion.div 
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, margin: "-50px" }}
              variants={{
                hidden: { opacity: 0 },
                show: {
                  opacity: 1,
                  transition: { staggerChildren: 0.05 }
                }
              }}
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
            >
              {PERSONAS.map((persona, i) => (
                <motion.div
                  key={persona.name}
                  variants={{
                    hidden: { opacity: 0, scale: 0.9 },
                    show: { opacity: 1, scale: 1 }
                  }}
                >
                  <PersonaCard {...persona} index={i} />
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>

        {/* DEMO SECTION */}
        <section id="demo" className="py-20 sm:py-28 lg:py-32 bg-[#05050f]">
          <div className="max-w-7xl mx-auto px-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 sm:gap-20 items-center">
              <motion.div
                initial={{ opacity: 0, x: -50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.8 }}
              >
                <h2 className="text-3xl sm:text-5xl lg:text-6xl font-bold text-white mb-8 font-heading leading-tight">
                  See your <span className="text-gradient">Viability</span> <br /> in real-time.
                </h2>
                <p className="text-zinc-400 text-base sm:text-lg mb-10 leading-relaxed max-w-lg">
                  No more guessing. Our experts provide numeric scores and qualitative feedback used by successful founders to pivot or persevere.
                </p>
                
                <div className="space-y-6">
                  {[
                    { title: "Risk Mitigation", desc: "Identify structural flaws before spending a dime.", icon: <ShieldCheck className="w-5 sm:w-6 h-5 sm:h-6 text-electric-blue" />, bg: "bg-electric-blue/10", border: "border-electric-blue/20" },
                    { title: "Actionable Insights", desc: "Direct advice from specialized AI personas.", icon: <Lightbulb className="w-5 sm:w-6 h-5 sm:h-6 text-violet-glow" />, bg: "bg-violet-glow/10", border: "border-violet-glow/20" }
                  ].map((item, i) => (
                    <motion.div 
                      key={i}
                      initial={{ opacity: 0, x: -20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: 0.3 + (i * 0.1) }}
                      className="flex items-center gap-4"
                    >
                      <div className={`w-10 sm:w-12 h-10 sm:h-12 rounded-xl ${item.bg} flex items-center justify-center border ${item.border}`}>
                        {item.icon}
                      </div>
                      <div>
                        <h4 className="text-white font-bold text-base sm:text-lg">{item.title}</h4>
                        <p className="text-zinc-500 text-sm">{item.desc}</p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
              
              <motion.div
                initial={{ opacity: 0, scale: 0.9, rotateY: 10 }}
                whileInView={{ opacity: 1, scale: 1, rotateY: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 1, ease: "easeOut" }}
                className="w-full flex justify-center lg:justify-end"
              >
                <ViabilityDisplay score={86} />
              </motion.div>
            </div>
          </div>
        </section>

        {/* WHY SECTION */}
        <section className="py-20 sm:py-28 lg:py-32 relative border-t border-white/5 bg-glass-dark">
          <div className="max-w-7xl mx-auto px-6">
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-12 sm:mb-16 lg:mb-20"
            >
              <h2 className="text-3xl sm:text-5xl lg:text-6xl font-bold text-white mb-6 font-heading">Why StartupSafari?</h2>
              <p className="text-zinc-500 text-base sm:text-lg max-w-xl mx-auto">The difference between a multi-million dollar exit and a failed project is validation.</p>
            </motion.div>
            
            <motion.div 
              initial="hidden"
              whileInView="show"
              viewport={{ once: true }}
              variants={{
                hidden: { opacity: 0 },
                show: {
                  opacity: 1,
                  transition: { staggerChildren: 0.1 }
                }
              }}
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8"
            >
              {[
                { title: "Avoid failed ideas", icon: <Rocket className="w-10 h-10" />, text: "Stop wasting months on ideas that don't have a market." },
                { title: "Instant Analysis", icon: <Clock className="w-10 h-10" />, text: "Get results in minutes, allowing you to iterate faster." },
                { title: "Clear Insights", icon: <BarChart3 className="w-10 h-10" />, text: "Understand exactly where your business model is weak." },
                { title: "Build with Confidence", icon: <CheckCircle2 className="w-10 h-10" />, text: "Enter development knowing there's real demand." },
              ].map((item, i) => (
                <motion.div 
                  key={i} 
                  variants={{
                    hidden: { opacity: 0, y: 20 },
                    show: { opacity: 1, y: 0 }
                  }}
                  className="p-8 rounded-3xl bg-white/5 border border-white/5 hover:bg-white/[0.07] transition-colors"
                >
                  <div className="text-violet-glow mb-6">{item.icon}</div>
                  <h4 className="text-white font-bold mb-4">{item.title}</h4>
                  <p className="text-zinc-500 text-sm leading-relaxed">{item.text}</p>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>

        {/* FINAL CTA */}
        <section className="py-20 sm:py-32 relative">
           <div className="max-w-4xl mx-auto px-6 text-center">
              <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8 }}
                className="p-10 sm:p-16 rounded-[2rem] sm:rounded-[3rem] bg-gradient-to-br from-electric-blue/20 to-violet-glow/20 border border-white/10 relative overflow-hidden"
              >
                <div className="absolute top-0 right-0 p-8 opacity-20 sm:opacity-100">
                   <Zap className="w-24 h-24 text-white/10 rotate-12" />
                </div>
                <h2 className="text-3xl sm:text-5xl lg:text-6xl font-bold text-white mb-8 font-heading">Ready to hunt for <br />your next winner?</h2>
                <Link 
                  href="/submit" 
                  className="inline-flex items-center gap-2 bg-white text-black px-8 sm:px-10 py-4 sm:py-5 rounded-full font-bold text-lg sm:text-xl hover:bg-zinc-200 transition-all hover:scale-105 shadow-[0_0_30px_rgba(255,255,255,0.4)]"
                >
                  Get Started for Free
                  <ArrowRight className="w-6 h-6" />
                </Link>
              </motion.div>
           </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
