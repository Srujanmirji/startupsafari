"use client";

import { useAuth } from "@/context/AuthContext";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Navbar } from "@/components/ui/Navbar";
import { Footer } from "@/components/ui/Footer";
import { 
  Rocket, 
  Target, 
  BarChart, 
  Award, 
  Settings, 
  Mail, 
  User as UserIcon,
  ChevronRight,
  ShieldCheck,
  Search,
  Zap
} from "lucide-react";
import { api } from "@/services/api";
import Link from "next/link";

export default function ProfilePage() {
  const { user, updateUserMetadata } = useAuth();
  const [stats, setStats] = useState({
    totalIdeas: 0,
    avgScore: 0,
    topScore: 0,
    activeHunts: 0
  });
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [editName, setEditName] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (user) {
      setEditName(user.name || user.user_metadata?.full_name || "");
    }
  }, [user]);

  const handleSaveProfile = async () => {
    setIsSaving(true);
    try {
      const { error } = await updateUserMetadata({ 
        full_name: editName,
        name: editName // Update both possible fields
      });
      if (!error) {
        setIsEditing(false);
      } else {
        alert(error.message);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsSaving(false);
    }
  };

  useEffect(() => {
    async function fetchStats() {
      try {
        const { data: ideas } = await api.getDashboard();
        if (ideas && ideas.length > 0) {
          const total = ideas.length;
          const scores = ideas.filter((i: any) => i.score).map((i: any) => i.score);
          const top = scores.length > 0 ? Math.max(...scores) : 0;
          const avg = scores.length > 0 ? Math.round(scores.reduce((a: number, b: number) => a + b, 0) / scores.length) : 0;
          const active = ideas.filter((i: any) => i.status === "Analyzing").length;
          
          setStats({
            totalIdeas: total,
            avgScore: avg,
            topScore: top,
            activeHunts: active
          });
        }
      } catch (e) {
        console.error("Failed to fetch profile stats", e);
      } finally {
        setLoading(false);
      }
    }
    fetchStats();
  }, []);

  if (!user && !loading) {
    return (
      <div className="min-h-screen bg-black flex flex-col items-center justify-center text-white">
        <Navbar />
        <h1 className="text-2xl font-bold mb-4">You must be logged in to view your profile.</h1>
        <Link href="/login" className="px-8 py-3 bg-white text-black rounded-full font-bold">Sign In</Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#05050f] text-white">
      <Navbar />
      
      <main className="pt-32 pb-20 px-6 max-w-5xl mx-auto">
        {/* Profile Header */}
        <section className="mb-12">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col md:flex-row items-center gap-8 p-10 rounded-[3rem] bg-gradient-to-br from-white/[0.05] to-white/[0.01] border border-white/10 backdrop-blur-3xl relative overflow-hidden"
          >
            {/* Background Ambience */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-electric-blue/10 blur-[100px] pointer-events-none" />
            
            <div className="relative">
              <div className="w-32 h-32 md:w-40 md:h-40 rounded-full bg-zinc-800 border-4 border-white/5 flex items-center justify-center overflow-hidden shadow-[0_0_50px_rgba(59,130,246,0.2)]">
                {(user?.picture || user?.user_metadata?.avatar_url || user?.avatar_url || user?.image) ? (
                  <img 
                    src={user?.picture || user?.user_metadata?.avatar_url || user?.avatar_url || user?.image} 
                    alt="" 
                    className="w-full h-full object-cover" 
                  />
                ) : (
                  <UserIcon className="w-16 h-16 text-zinc-500" />
                )}
              </div>
              <div className="absolute -bottom-2 -right-2 bg-electric-blue p-2 rounded-xl border-4 border-[#05050f]">
                <ShieldCheck className="w-5 h-5 text-white" />
              </div>
            </div>

            <div className="text-center md:text-left flex-1">
              {isEditing ? (
                <input 
                  type="text"
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  className="bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-2xl md:text-4xl font-bold font-heading mb-4 w-full focus:outline-none focus:border-electric-blue"
                  autoFocus
                />
              ) : (
                <h1 className="text-3xl md:text-5xl font-bold font-heading mb-2">
                  {user?.name || user?.user_metadata?.full_name || "Safari Founder"}
                </h1>
              )}
              
              <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 text-zinc-400 mb-6">
                <span className="flex items-center gap-2">
                  <Mail className="w-4 h-4" /> {user?.email}
                </span>
                <span className="w-1.5 h-1.5 rounded-full bg-zinc-700 hidden md:block" />
                <span className="flex items-center gap-2">
                  <Target className="w-4 h-4 text-emerald-400" /> Founder Tier
                </span>
              </div>
              
              <div className="flex flex-wrap gap-3">
                <Link href="/dashboard" className="px-6 py-2.5 bg-white text-black rounded-xl font-bold text-sm hover:bg-zinc-200 transition-colors">
                  My Dashboard
                </Link>
                {isEditing ? (
                   <button 
                    onClick={handleSaveProfile}
                    disabled={isSaving}
                    className="px-6 py-2.5 bg-electric-blue text-white rounded-xl font-bold text-sm hover:bg-electric-light transition-colors flex items-center gap-2 shadow-[0_0_20px_rgba(59,130,246,0.5)]"
                  >
                    {isSaving ? "Saving..." : "Save Changes"}
                  </button>
                ) : (
                  <button 
                    onClick={() => setIsEditing(true)}
                    className="px-6 py-2.5 bg-white/5 border border-white/10 rounded-xl font-bold text-sm hover:bg-white/10 transition-colors flex items-center gap-2"
                  >
                    <Settings className="w-4 h-4" /> Edit Profile
                  </button>
                )}
              </div>
            </div>
          </motion.div>
        </section>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-12">
          {[
            { label: "Total Ideas", value: stats.totalIdeas, icon: Rocket, color: "text-blue-400" },
            { label: "Active Hunts", value: stats.activeHunts, icon: Search, color: "text-amber-400" },
            { label: "Avg Viability", value: `${stats.avgScore}%`, icon: BarChart, color: "text-emerald-400" },
            { label: "Peak Score", value: `${stats.topScore}%`, icon: Award, color: "text-purple-400" }
          ].map((stat, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.1 }}
              className="p-6 rounded-3xl bg-white/5 border border-white/5 text-center group hover:bg-white/[0.08] transition-all"
            >
              <stat.icon className={`w-6 h-6 mx-auto mb-3 ${stat.color} group-hover:scale-110 transition-transform`} />
              <p className="text-2xl font-bold text-white mb-1">{stat.value}</p>
              <p className="text-xs text-zinc-500 font-bold uppercase tracking-widest">{stat.label}</p>
            </motion.div>
          ))}
        </div>

        {/* Achievement Sections */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="p-8 rounded-[2.5rem] bg-white/5 border border-white/10"
          >
            <h3 className="text-xl font-bold font-heading mb-6 flex items-center gap-2">
              <Award className="w-5 h-5 text-amber-500" /> Recent Accomplishments
            </h3>
            <div className="space-y-4">
              {[
                { title: "First Hunt", desc: "Successfully analyzed your first startup idea.", date: "Unlocked", icon: Zap },
                { title: "Shark Bait", desc: "Survived your first 1-on-1 pitch in the Tank.", date: "Unlocked", icon: ShieldCheck },
                { title: "Data Defender", desc: "Defended 3 different CAC/LTV numbers.", date: "In Progress", icon: Target, locked: true }
              ].map((item, i) => (
                <div key={i} className={`flex items-center gap-4 p-4 rounded-2xl ${item.locked ? 'bg-black/20 border-dashed border-zinc-800' : 'bg-white/5 border border-white/5'}`}>
                   <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${item.locked ? 'bg-zinc-900 border border-zinc-800 text-zinc-700' : 'bg-amber-500/10 text-amber-500'}`}>
                      <item.icon className="w-6 h-6" />
                   </div>
                   <div className="flex-1">
                     <p className={`font-bold ${item.locked ? 'text-zinc-600' : 'text-white'}`}>{item.title}</p>
                     <p className="text-xs text-zinc-500">{item.desc}</p>
                   </div>
                   <div className={`text-[10px] font-bold uppercase tracking-widest ${item.locked ? 'text-zinc-700' : 'text-emerald-500'}`}>
                     {item.date}
                   </div>
                </div>
              ))}
            </div>
          </motion.div>

          <motion.div
             initial={{ opacity: 0, x: 20 }}
             animate={{ opacity: 1, x: 0 }}
             className="p-8 rounded-[2.5rem] bg-white/5 border border-white/10"
          >
            <h3 className="text-xl font-bold font-heading mb-6 flex items-center gap-2">
              <Settings className="w-5 h-5 text-zinc-400" /> Account Preferences
            </h3>
            <div className="space-y-4">
               {[
                 { label: "Privacy Level", current: "High (Private Reports)" },
                 { label: "Notification Defaults", current: "Email Summaries Only" },
                 { label: "Persona Preferences", current: "Ruthless (Shark Focus)" }
               ].map((pref, i) => (
                 <div key={i} className="flex items-center justify-between p-4 rounded-2xl bg-white/5 border border-white/5 group hover:border-white/20 transition-all cursor-pointer">
                    <div>
                      <p className="text-xs text-zinc-500 font-bold uppercase tracking-widest">{pref.label}</p>
                      <p className="font-bold text-white group-hover:text-electric-blue transition-colors">{pref.current}</p>
                    </div>
                    <ChevronRight className="w-5 h-5 text-zinc-700 group-hover:text-white transition-colors" />
                 </div>
               ))}
               <button className="w-full py-4 mt-4 bg-rose-500/10 border border-rose-500/20 text-rose-500 rounded-2xl font-bold text-sm hover:bg-rose-500/20 transition-colors">
                 Delete My Data
               </button>
            </div>
          </motion.div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
