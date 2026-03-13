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
        <section id="how-it-works" className="py-32 relative bg-[#05050f]">
          <div className="max-w-7xl mx-auto px-6">
            <div className="text-center mb-20">
              <motion.h2 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="text-4xl md:text-6xl font-bold text-white mb-6 font-heading"
              >
                How <span className="text-gradient">StartupSafari</span> Works
              </motion.h2>
              <motion.p 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.1 }}
                className="text-zinc-400 text-lg max-w-2xl mx-auto"
              >
                Our AI-driven process is designed to give you a definitive answer on your startup idea within minutes, not months.
              </motion.p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
              <FeatureCard 
                step={1}
                icon={Lightbulb}
                title="Submit your startup idea"
                description="Simply describe your problem, solution, and target audience. Our AI handles the initial information gathering."
                delay={0.1}
              />
              <FeatureCard 
                step={2}
                icon={Search}
                title="AI experts analyze your idea"
                description="8 specialized animal personas simulate different market conditions and stress-test your business model."
                delay={0.2}
              />
              <FeatureCard 
                step={3}
                icon={BarChart3}
                title="Receive viability score"
                description="Get a comprehensive report with numerical scores, risks, and actionable insights to pivot or proceed."
                delay={0.3}
              />
            </div>
          </div>
        </section>

        {/* AI EXPERT PANEL */}
        <section id="experts" className="py-32 relative overflow-hidden">
          {/* Background Ambient Glow */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-violet-glow/10 blur-[120px] rounded-full pointer-events-none"></div>
          
          <div className="max-w-7xl mx-auto px-6 relative z-10">
            <div className="flex flex-col md:flex-row md:items-end justify-between mb-20 gap-8">
              <div className="max-w-2xl">
                <motion.h2 
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  className="text-4xl md:text-6xl font-bold text-white mb-6 font-heading"
                >
                  Meet your <br /><span className="text-gradient">AI Expert Panel</span>
                </motion.h2>
                <motion.p 
                   initial={{ opacity: 0, x: -20 }}
                   whileInView={{ opacity: 1, x: 0 }}
                   viewport={{ once: true }}
                   transition={{ delay: 0.1 }}
                   className="text-zinc-400 text-lg"
                >
                  Eight distinct AI personas, each programmed with the knowledge of thousands of successful and failed startups.
                </motion.p>
              </div>
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
              >
                <Link href="/signup" className="group flex items-center gap-2 text-white font-bold bg-white/5 border border-white/10 px-6 py-3 rounded-2xl hover:bg-white/10 transition-all">
                  View Full Personas
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Link>
              </motion.div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {PERSONAS.map((persona, i) => (
                <PersonaCard key={i} {...persona} delay={i * 0.05} />
              ))}
            </div>
          </div>
        </section>

        {/* SCORE DEMO */}
        <section id="demo" className="py-32 bg-[#05050f]">
          <div className="max-w-7xl mx-auto px-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
              <div>
                <motion.h2 
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  className="text-4xl md:text-5xl font-bold text-white mb-8 font-heading"
                >
                  Get deep, <br /><span className="text-gradient">data-backed</span> results.
                </motion.h2>
                <div className="space-y-10">
                  {[
                    { title: "Numerical Viability Score", desc: "A combined score out of 100 based on all 8 expert reviews.", icon: Target },
                    { title: "Persona-Specific Feedback", desc: "Read exactly what the Fox or the Shark thinks of your idea.", icon: Zap },
                    { title: "Risk Identification", desc: "Identify hidden bottlenecks and competition risks early.", icon: ShieldCheck },
                  ].map((item, i) => (
                    <motion.div 
                      key={i} 
                      className="flex gap-6"
                      initial={{ opacity: 0, x: -20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: i * 0.1 }}
                    >
                      <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-electric-blue">
                        <item.icon className="w-6 h-6" />
                      </div>
                      <div>
                        <h4 className="text-white font-bold text-lg mb-2">{item.title}</h4>
                        <p className="text-zinc-500 text-sm leading-relaxed">{item.desc}</p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
              
              <motion.div
                initial={{ opacity: 0, rotateY: 20, rotateX: 10, scale: 0.95 }}
                whileInView={{ opacity: 1, rotateY: 0, rotateX: 0, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 1.2, ease: "circOut" }}
                className="perspective-1000"
              >
                <ViabilityDisplay score={78} />
              </motion.div>
            </div>
          </div>
        </section>

        {/* WHY STARTUPSAFARI */}
        <section className="py-32 relative border-t border-white/5 overflow-hidden">
          <div className="max-w-7xl mx-auto px-6">
            <div className="text-center mb-20">
              <h2 className="text-4xl md:text-5xl font-bold text-white mb-6 font-heading">Why StartupSafari?</h2>
              <p className="text-zinc-500 max-w-xl mx-auto">The difference between a multi-million dollar exit and a failed project is validation.</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
              {[
                { title: "Avoid failed ideas", icon: Rocket, text: "Stop wasting months on ideas that don't have a market." },
                { title: "Instant Analysis", icon: Clock, text: "Get results in minutes, allowing you to iterate faster." },
                { title: "Clear Insights", icon: BarChart3, text: "Understand exactly where your business model is weak." },
                { title: "Build with Confidence", icon: CheckCircle2, text: "Enter development knowing there's real demand." },
              ].map((item, i) => (
                <motion.div 
                  key={i} 
                  className="p-8 rounded-3xl bg-white/5 border border-white/5 hover:bg-white/[0.07] transition-colors"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                >
                  <item.icon className="w-10 h-10 text-violet-glow mb-6" />
                  <h4 className="text-white font-bold mb-4">{item.title}</h4>
                  <p className="text-zinc-500 text-sm">{item.text}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* FINAL CTA */}
        <section className="py-32 relative">
           <div className="max-w-4xl mx-auto px-6 text-center">
              <div className="p-16 rounded-[3rem] bg-gradient-to-br from-electric-blue/20 to-violet-glow/20 border border-white/10 relative overflow-hidden">
                <div className="absolute top-0 right-0 p-8">
                   <Zap className="w-24 h-24 text-white/5 rotate-12" />
                </div>
                <h2 className="text-4xl md:text-6xl font-bold text-white mb-8 font-heading">Ready to hunt for <br />your next winner?</h2>
                <Link 
                  href="/submit" 
                  className="inline-flex items-center gap-2 bg-white text-black px-10 py-5 rounded-full font-bold text-xl hover:bg-zinc-200 transition-all hover:scale-105 shadow-[0_0_30px_rgba(255,255,255,0.4)]"
                >
                  Get Started for Free
                  <ArrowRight className="w-6 h-6" />
                </Link>
              </div>
           </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
