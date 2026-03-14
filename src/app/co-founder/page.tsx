"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Navbar } from "@/components/ui/Navbar";
import { Footer } from "@/components/ui/Footer";
import { useAuth } from "@/context/AuthContext";
import { SignupModal } from "@/components/ui/SignupModal";
import {
  Users, Search, MapPin, Briefcase, Code, Palette, TrendingUp, Megaphone,
  Shield, Lightbulb, Globe, Linkedin, Twitter, Link2, ChevronDown, X,
  Sparkles, UserPlus, Edit3, Eye, Filter, ArrowRight, CheckCircle2, Clock,
  Rocket, Handshake, ExternalLink, Plus, Star
} from "lucide-react";

const API_URL = "http://localhost:5000/api";

const SKILL_OPTIONS = [
  "React", "Node.js", "Python", "AI/ML", "Design", "Marketing", "Sales",
  "Finance", "Product Management", "Data Science", "Mobile Dev", "DevOps",
  "Blockchain", "Growth Hacking", "Content", "SEO", "Legal", "Operations",
  "Community Building", "Fundraising", "UX Research", "Analytics"
];

const INDUSTRY_OPTIONS = [
  "SaaS", "FinTech", "HealthTech", "EdTech", "E-commerce", "AI/ML",
  "CleanTech", "FoodTech", "Gaming", "Social Media", "Cybersecurity",
  "Real Estate", "Logistics", "Media", "B2B", "D2C", "AgriTech", "IoT"
];

const ROLE_OPTIONS = [
  "Technical Co-Founder (CTO)", "Business Co-Founder (CEO)", "Marketing Lead",
  "Product Lead", "Design Lead", "Growth Lead", "Sales Lead", "Operations Lead"
];

const IDEA_STAGES = [
  { value: "have_idea", label: "I have an idea", icon: "💡" },
  { value: "looking_for_idea", label: "Looking for an idea", icon: "🔍" },
  { value: "open_to_both", label: "Open to both", icon: "🤝" }
];

const COMMITMENT_OPTIONS = [
  { value: "full_time", label: "Full-time", icon: "🚀" },
  { value: "part_time", label: "Part-time", icon: "⏰" },
  { value: "flexible", label: "Flexible", icon: "🌊" }
];

function TagInput({ tags, setTags, options, placeholder, color = "#8b5cf6" }: any) {
  const [input, setInput] = useState("");
  const [showSuggestions, setShowSuggestions] = useState(false);
  const filtered = options.filter((o: string) =>
    o.toLowerCase().includes(input.toLowerCase()) && !tags.includes(o)
  );
  return (
    <div className="relative">
      <div className="flex flex-wrap gap-2 mb-2">
        {tags.map((tag: string) => (
          <span key={tag} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold border"
            style={{ backgroundColor: `${color}15`, borderColor: `${color}30`, color }}>
            {tag}
            <button onClick={() => setTags(tags.filter((t: string) => t !== tag))}
              className="hover:opacity-70"><X className="w-3 h-3" /></button>
          </span>
        ))}
      </div>
      <input value={input}
        onChange={e => { setInput(e.target.value); setShowSuggestions(true); }}
        onFocus={() => setShowSuggestions(true)}
        onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
        placeholder={placeholder}
        className="w-full p-3 rounded-xl bg-white/[0.04] border border-white/10 text-white text-sm focus:border-violet-500/50 focus:outline-none transition-colors placeholder:text-zinc-600"
      />
      {showSuggestions && filtered.length > 0 && (
        <div className="absolute z-50 mt-1 w-full bg-[#0a0a1a] border border-white/10 rounded-xl overflow-hidden shadow-2xl max-h-48 overflow-y-auto">
          {filtered.slice(0, 8).map((opt: string) => (
            <button key={opt} onClick={() => { setTags([...tags, opt]); setInput(""); }}
              className="w-full text-left px-4 py-2.5 text-sm text-zinc-300 hover:bg-white/[0.05] transition-colors">
              {opt}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

function ProfileForm({ profile, setProfile, onSave, saving }: any) {
  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
      className="space-y-8">
      {/* Basic Info */}
      <div className="p-8 rounded-[2rem] bg-white/[0.02] border border-white/5">
        <h3 className="text-lg font-bold mb-6 flex items-center gap-2">
          <UserPlus className="w-5 h-5 text-violet-400" /> Basic Info
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div>
            <label className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500 mb-2 block">Full Name *</label>
            <input value={profile.name || ""} onChange={e => setProfile({ ...profile, name: e.target.value })}
              placeholder="John Doe"
              className="w-full p-3.5 rounded-xl bg-white/[0.04] border border-white/10 text-white text-sm focus:border-violet-500/50 focus:outline-none transition-colors placeholder:text-zinc-600" />
          </div>
          <div>
            <label className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500 mb-2 block">Role / Title *</label>
            <select value={profile.role || ""} onChange={e => setProfile({ ...profile, role: e.target.value })}
              className="w-full p-3.5 rounded-xl bg-white/[0.04] border border-white/10 text-white text-sm focus:border-violet-500/50 focus:outline-none transition-colors appearance-none">
              <option value="" className="bg-[#0a0a1a]">Select your role...</option>
              {ROLE_OPTIONS.map(r => <option key={r} value={r} className="bg-[#0a0a1a]">{r}</option>)}
            </select>
          </div>
          <div className="md:col-span-2">
            <label className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500 mb-2 block">Headline</label>
            <input value={profile.headline || ""} onChange={e => setProfile({ ...profile, headline: e.target.value })}
              placeholder="Ex-Google engineer looking to build the next big thing in AI"
              className="w-full p-3.5 rounded-xl bg-white/[0.04] border border-white/10 text-white text-sm focus:border-violet-500/50 focus:outline-none transition-colors placeholder:text-zinc-600" />
          </div>
          <div className="md:col-span-2">
            <label className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500 mb-2 block">Bio</label>
            <textarea value={profile.bio || ""} onChange={e => setProfile({ ...profile, bio: e.target.value })}
              placeholder="Tell potential co-founders about yourself, your experience, and what drives you..."
              rows={4}
              className="w-full p-3.5 rounded-xl bg-white/[0.04] border border-white/10 text-white text-sm focus:border-violet-500/50 focus:outline-none transition-colors placeholder:text-zinc-600 resize-none" />
          </div>
          <div>
            <label className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500 mb-2 block">Location</label>
            <input value={profile.location || ""} onChange={e => setProfile({ ...profile, location: e.target.value })}
              placeholder="San Francisco, CA"
              className="w-full p-3.5 rounded-xl bg-white/[0.04] border border-white/10 text-white text-sm focus:border-violet-500/50 focus:outline-none transition-colors placeholder:text-zinc-600" />
          </div>
          <div className="flex items-end">
            <label className="flex items-center gap-3 cursor-pointer group">
              <input type="checkbox" checked={profile.remote_ok !== false}
                onChange={e => setProfile({ ...profile, remote_ok: e.target.checked })}
                className="w-5 h-5 rounded bg-white/[0.04] border border-white/10 accent-violet-500" />
              <span className="text-sm text-zinc-400 group-hover:text-white transition-colors">Open to remote</span>
            </label>
          </div>
        </div>
      </div>

      {/* Skills & Matching */}
      <div className="p-8 rounded-[2rem] bg-white/[0.02] border border-white/5">
        <h3 className="text-lg font-bold mb-6 flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-amber-400" /> Skills & Matching
        </h3>
        <div className="space-y-6">
          <div>
            <label className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500 mb-3 block">Your Skills</label>
            <TagInput tags={profile.skills || []} setTags={(s: string[]) => setProfile({ ...profile, skills: s })}
              options={SKILL_OPTIONS} placeholder="Add your skills..." color="#8b5cf6" />
          </div>
          <div>
            <label className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500 mb-3 block">Skills You&apos;re Looking For</label>
            <TagInput tags={profile.looking_for_skills || []} setTags={(s: string[]) => setProfile({ ...profile, looking_for_skills: s })}
              options={SKILL_OPTIONS} placeholder="What skills do you need?" color="#f59e0b" />
          </div>
          <div>
            <label className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500 mb-3 block">Industries</label>
            <TagInput tags={profile.industries || []} setTags={(s: string[]) => setProfile({ ...profile, industries: s })}
              options={INDUSTRY_OPTIONS} placeholder="Your interested industries..." color="#34d399" />
          </div>
          <div>
            <label className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500 mb-3 block">Looking for Role</label>
            <select value={profile.looking_for_role || ""} onChange={e => setProfile({ ...profile, looking_for_role: e.target.value })}
              className="w-full p-3.5 rounded-xl bg-white/[0.04] border border-white/10 text-white text-sm focus:border-violet-500/50 focus:outline-none transition-colors appearance-none">
              <option value="" className="bg-[#0a0a1a]">Any role...</option>
              {ROLE_OPTIONS.map(r => <option key={r} value={r} className="bg-[#0a0a1a]">{r}</option>)}
            </select>
          </div>
        </div>
      </div>

      {/* Idea & Commitment */}
      <div className="p-8 rounded-[2rem] bg-white/[0.02] border border-white/5">
        <h3 className="text-lg font-bold mb-6 flex items-center gap-2">
          <Rocket className="w-5 h-5 text-blue-400" /> Idea & Commitment
        </h3>
        <div className="space-y-6">
          <div>
            <label className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500 mb-3 block">Idea Stage</label>
            <div className="grid grid-cols-3 gap-3">
              {IDEA_STAGES.map(s => (
                <button key={s.value} onClick={() => setProfile({ ...profile, idea_stage: s.value })}
                  className={`p-4 rounded-xl border text-center transition-all ${profile.idea_stage === s.value
                    ? "bg-violet-500/10 border-violet-500/30 text-white" : "bg-white/[0.02] border-white/5 text-zinc-500 hover:border-white/20"}`}>
                  <div className="text-2xl mb-2">{s.icon}</div>
                  <div className="text-xs font-bold">{s.label}</div>
                </button>
              ))}
            </div>
          </div>
          {(profile.idea_stage === "have_idea" || profile.idea_stage === "open_to_both") && (
            <div>
              <label className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500 mb-2 block">Idea Description</label>
              <textarea value={profile.idea_description || ""} onChange={e => setProfile({ ...profile, idea_description: e.target.value })}
                placeholder="Briefly describe your startup idea..."
                rows={3}
                className="w-full p-3.5 rounded-xl bg-white/[0.04] border border-white/10 text-white text-sm focus:border-violet-500/50 focus:outline-none transition-colors placeholder:text-zinc-600 resize-none" />
            </div>
          )}
          <div>
            <label className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500 mb-3 block">Commitment Level</label>
            <div className="grid grid-cols-3 gap-3">
              {COMMITMENT_OPTIONS.map(c => (
                <button key={c.value} onClick={() => setProfile({ ...profile, commitment: c.value })}
                  className={`p-4 rounded-xl border text-center transition-all ${profile.commitment === c.value
                    ? "bg-blue-500/10 border-blue-500/30 text-white" : "bg-white/[0.02] border-white/5 text-zinc-500 hover:border-white/20"}`}>
                  <div className="text-2xl mb-2">{c.icon}</div>
                  <div className="text-xs font-bold">{c.label}</div>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Social Links */}
      <div className="p-8 rounded-[2rem] bg-white/[0.02] border border-white/5">
        <h3 className="text-lg font-bold mb-6 flex items-center gap-2">
          <Globe className="w-5 h-5 text-cyan-400" /> Social Links
        </h3>
        <div className="space-y-4">
          {[
            { key: "linkedin_url", icon: Linkedin, label: "LinkedIn", placeholder: "https://linkedin.com/in/..." },
            { key: "twitter_url", icon: Twitter, label: "Twitter / X", placeholder: "https://x.com/..." },
            { key: "portfolio_url", icon: Link2, label: "Portfolio / Website", placeholder: "https://..." }
          ].map(link => (
            <div key={link.key} className="flex items-center gap-3">
              <div className="p-2.5 rounded-lg bg-white/[0.04] border border-white/5">
                <link.icon className="w-4 h-4 text-zinc-500" />
              </div>
              <input value={(profile as any)[link.key] || ""} onChange={e => setProfile({ ...profile, [link.key]: e.target.value })}
                placeholder={link.placeholder}
                className="flex-1 p-3 rounded-xl bg-white/[0.04] border border-white/10 text-white text-sm focus:border-violet-500/50 focus:outline-none transition-colors placeholder:text-zinc-600" />
            </div>
          ))}
        </div>
      </div>

      {/* Save Button */}
      <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
        onClick={onSave} disabled={saving || !profile.name}
        className="w-full py-5 rounded-2xl bg-gradient-to-r from-violet-600 to-blue-600 text-white font-bold text-lg shadow-[0_0_40px_rgba(139,92,246,0.3)] hover:shadow-[0_0_60px_rgba(139,92,246,0.4)] transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3">
        {saving ? <><div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Saving...</>
          : <><CheckCircle2 className="w-5 h-5" /> Publish My Profile</>}
      </motion.button>
    </motion.div>
  );
}

function FounderCard({ profile: p, onClick }: { profile: any; onClick: () => void }) {
  const stageLabel = IDEA_STAGES.find(s => s.value === p.idea_stage);
  const commitLabel = COMMITMENT_OPTIONS.find(c => c.value === p.commitment);
  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -4 }} onClick={onClick}
      className="p-6 rounded-[2rem] bg-white/[0.03] border border-white/5 hover:border-violet-500/20 hover:bg-white/[0.05] transition-all duration-500 cursor-pointer group relative overflow-hidden">
      <div className="absolute -top-16 -right-16 w-32 h-32 bg-violet-600/[0.05] rounded-full blur-[60px] group-hover:bg-violet-600/[0.1] transition-all" />
      <div className="relative z-10">
        <div className="flex items-start gap-4 mb-4">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-violet-600/30 to-blue-600/20 border border-violet-500/20 flex items-center justify-center text-2xl font-bold text-white flex-shrink-0">
            {p.name?.[0]?.toUpperCase() || "?"}
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="text-lg font-bold text-white truncate group-hover:text-violet-300 transition-colors">{p.name}</h3>
            <p className="text-xs text-violet-400 font-bold truncate">{p.role || "Founder"}</p>
          </div>
        </div>
        {p.headline && <p className="text-sm text-zinc-400 mb-4 line-clamp-2 leading-relaxed">{p.headline}</p>}
        <div className="flex flex-wrap gap-1.5 mb-4">
          {(p.skills || []).slice(0, 4).map((s: string) => (
            <span key={s} className="px-2.5 py-1 rounded-md bg-violet-500/10 border border-violet-500/20 text-[10px] font-bold text-violet-300">{s}</span>
          ))}
          {(p.skills || []).length > 4 && <span className="px-2.5 py-1 rounded-md bg-white/5 text-[10px] font-bold text-zinc-500">+{p.skills.length - 4}</span>}
        </div>
        <div className="flex items-center gap-4 text-[10px] text-zinc-500 font-bold uppercase tracking-wider">
          {p.location && <span className="flex items-center gap-1"><MapPin className="w-3 h-3" />{p.location}</span>}
          {stageLabel && <span>{stageLabel.icon} {stageLabel.label}</span>}
          {commitLabel && <span>{commitLabel.icon} {commitLabel.label}</span>}
        </div>
      </div>
    </motion.div>
  );
}

function ProfileModal({ profile: p, onClose }: { profile: any; onClose: () => void }) {
  const stageLabel = IDEA_STAGES.find(s => s.value === p.idea_stage);
  const commitLabel = COMMITMENT_OPTIONS.find(c => c.value === p.commitment);
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      onClick={onClose}>
      <motion.div initial={{ scale: 0.95, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.95, y: 20 }}
        onClick={e => e.stopPropagation()}
        className="bg-[#0a0a1a] border border-white/10 rounded-[2rem] max-w-2xl w-full max-h-[85vh] overflow-y-auto p-8 relative">
        <button onClick={onClose} className="absolute top-6 right-6 p-2 rounded-xl bg-white/5 hover:bg-white/10 transition-colors">
          <X className="w-5 h-5 text-zinc-400" />
        </button>
        <div className="flex items-start gap-5 mb-6">
          <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-violet-600/30 to-blue-600/20 border border-violet-500/20 flex items-center justify-center text-4xl font-bold text-white flex-shrink-0">
            {p.name?.[0]?.toUpperCase() || "?"}
          </div>
          <div>
            <h2 className="text-2xl font-bold text-white">{p.name}</h2>
            <p className="text-violet-400 font-bold">{p.role || "Founder"}</p>
            {p.location && <p className="text-sm text-zinc-500 flex items-center gap-1 mt-1"><MapPin className="w-3.5 h-3.5" />{p.location} {p.remote_ok && "• Remote OK"}</p>}
          </div>
        </div>
        {p.headline && <p className="text-zinc-300 mb-6 leading-relaxed italic border-l-2 border-violet-500/30 pl-4">&ldquo;{p.headline}&rdquo;</p>}
        {p.bio && <div className="mb-6"><h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500 mb-2">About</h4><p className="text-sm text-zinc-400 leading-relaxed">{p.bio}</p></div>}
        <div className="grid grid-cols-2 gap-4 mb-6">
          {stageLabel && <div className="p-4 rounded-xl bg-white/[0.03] border border-white/5"><p className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500 mb-1">Stage</p><p className="text-sm text-white font-bold">{stageLabel.icon} {stageLabel.label}</p></div>}
          {commitLabel && <div className="p-4 rounded-xl bg-white/[0.03] border border-white/5"><p className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500 mb-1">Commitment</p><p className="text-sm text-white font-bold">{commitLabel.icon} {commitLabel.label}</p></div>}
        </div>
        {p.idea_description && <div className="mb-6 p-4 rounded-xl bg-amber-500/[0.05] border border-amber-500/10"><h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-amber-400 mb-2">💡 Idea</h4><p className="text-sm text-zinc-300">{p.idea_description}</p></div>}
        {p.skills?.length > 0 && <div className="mb-4"><h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500 mb-3">Skills</h4><div className="flex flex-wrap gap-2">{p.skills.map((s: string) => <span key={s} className="px-3 py-1.5 rounded-lg bg-violet-500/10 border border-violet-500/20 text-xs font-bold text-violet-300">{s}</span>)}</div></div>}
        {p.looking_for_skills?.length > 0 && <div className="mb-4"><h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500 mb-3">Looking For</h4><div className="flex flex-wrap gap-2">{p.looking_for_skills.map((s: string) => <span key={s} className="px-3 py-1.5 rounded-lg bg-amber-500/10 border border-amber-500/20 text-xs font-bold text-amber-300">{s}</span>)}</div></div>}
        {p.industries?.length > 0 && <div className="mb-6"><h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500 mb-3">Industries</h4><div className="flex flex-wrap gap-2">{p.industries.map((s: string) => <span key={s} className="px-3 py-1.5 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-xs font-bold text-emerald-300">{s}</span>)}</div></div>}
        <div className="flex gap-3 pt-4 border-t border-white/5">
          {p.linkedin_url && <a href={p.linkedin_url} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-blue-600/10 border border-blue-600/20 text-blue-400 text-sm font-bold hover:bg-blue-600/20 transition-colors"><Linkedin className="w-4 h-4" />LinkedIn</a>}
          {p.twitter_url && <a href={p.twitter_url} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-sm font-bold hover:bg-white/10 transition-colors"><Twitter className="w-4 h-4" />Twitter</a>}
          {p.portfolio_url && <a href={p.portfolio_url} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-sm font-bold hover:bg-white/10 transition-colors"><ExternalLink className="w-4 h-4" />Portfolio</a>}
        </div>
      </motion.div>
    </motion.div>
  );
}

export default function CoFounderPage() {
  const { user } = useAuth();
  const [tab, setTab] = useState<"browse" | "profile">("browse");
  const [profiles, setProfiles] = useState<any[]>([]);
  const [profile, setProfile] = useState<any>({ skills: [], looking_for_skills: [], industries: [], idea_stage: "open_to_both", commitment: "flexible", remote_ok: true });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [search, setSearch] = useState("");
  const [filterSkill, setFilterSkill] = useState("");
  const [filterIndustry, setFilterIndustry] = useState("");
  const [filterStage, setFilterStage] = useState("");
  const [filterCommitment, setFilterCommitment] = useState("");
  const [selectedProfile, setSelectedProfile] = useState<any>(null);
  const [hasProfile, setHasProfile] = useState(false);
  const [showSignup, setShowSignup] = useState(false);
  const [showFilters, setShowFilters] = useState(false);

  const getUserId = () => {
    if (!user) return null;
    return user.id || user.sub || user.email || null;
  };

  useEffect(() => { fetchProfiles(); loadMyProfile(); }, [user]);

  const loadMyProfile = async () => {
    const uid = getUserId();
    if (!uid) return;
    try {
      const res = await fetch(`${API_URL}/co-founder/profile/${uid}`);
      if (res.ok) {
        const data = await res.json();
        setProfile(data);
        setHasProfile(true);
      }
    } catch {}
  };

  const fetchProfiles = async () => {
    try {
      const params = new URLSearchParams();
      if (search) params.set("search", search);
      if (filterSkill) params.set("skills", filterSkill);
      if (filterIndustry) params.set("industries", filterIndustry);
      if (filterStage) params.set("idea_stage", filterStage);
      if (filterCommitment) params.set("commitment", filterCommitment);
      const res = await fetch(`${API_URL}/co-founder/profiles?${params.toString()}`);
      if (res.ok) {
        const data = await res.json();
        setProfiles(data.profiles || []);
      }
    } catch {} finally { setLoading(false); }
  };

  useEffect(() => { const t = setTimeout(fetchProfiles, 300); return () => clearTimeout(t); }, [search, filterSkill, filterIndustry, filterStage, filterCommitment]);

  const saveProfile = async () => {
    if (!user) { setShowSignup(true); return; }
    setSaving(true);
    try {
      const uid = getUserId();
      const body = { ...profile, user_id: uid, email: user.email, name: profile.name || user.name || user.email?.split("@")[0] };
      if (!body.avatar_url && user.picture) body.avatar_url = user.picture;
      const res = await fetch(`${API_URL}/co-founder/profile`, {
        method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body)
      });
      if (res.ok) { setHasProfile(true); setTab("browse"); fetchProfiles(); }
    } catch (err) { console.error(err); } finally { setSaving(false); }
  };

  return (
    <div className="min-h-screen bg-[#05050f] text-white relative overflow-hidden">
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-violet-600/[0.06] rounded-full blur-[120px] animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] bg-blue-600/[0.05] rounded-full blur-[100px] animate-pulse" style={{ animationDelay: "2s" }} />
      </div>
      <Navbar />
      <main className="pt-32 pb-20 px-6 max-w-7xl mx-auto relative z-10">
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-10">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
            <div className="flex items-center gap-6">
              <div className="p-5 rounded-[1.5rem] bg-gradient-to-br from-violet-600/20 to-blue-600/10 border border-violet-500/20 shadow-[0_0_30px_rgba(139,92,246,0.15)]">
                <Handshake className="w-10 h-10 text-violet-400" />
              </div>
              <div>
                <h1 className="text-4xl md:text-5xl font-bold font-heading bg-gradient-to-r from-white via-zinc-200 to-zinc-400 bg-clip-text text-transparent">Co-Founder Matching</h1>
                <p className="text-zinc-500 mt-2 text-lg">Find your perfect co-founder. Build something great together.</p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Tabs */}
        <div className="flex gap-2 mb-10 p-1.5 bg-white/[0.03] border border-white/5 rounded-2xl w-fit">
          {[
            { key: "browse", label: "Browse Founders", icon: Search },
            { key: "profile", label: hasProfile ? "Edit Profile" : "Create Profile", icon: hasProfile ? Edit3 : UserPlus }
          ].map(t => (
            <button key={t.key} onClick={() => { if (t.key === "profile" && !user) { setShowSignup(true); return; } setTab(t.key as any); }}
              className={`flex items-center gap-2 px-6 py-3 rounded-xl font-bold text-sm transition-all ${tab === t.key ? "bg-violet-600 text-white shadow-lg shadow-violet-600/30" : "text-zinc-500 hover:text-white"}`}>
              <t.icon className="w-4 h-4" />{t.label}
            </button>
          ))}
        </div>

        {tab === "browse" ? (
          <div>
            {/* Search Bar */}
            <div className="flex flex-col md:flex-row gap-4 mb-6">
              <div className="flex-1 relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-500" />
                <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search founders by name, role, skills..."
                  className="w-full pl-12 pr-4 py-4 rounded-2xl bg-white/[0.04] border border-white/10 text-white text-sm focus:border-violet-500/50 focus:outline-none transition-colors placeholder:text-zinc-600" />
              </div>
              <button onClick={() => setShowFilters(!showFilters)}
                className={`flex items-center gap-2 px-6 py-4 rounded-2xl border font-bold text-sm transition-all ${showFilters ? "bg-violet-500/10 border-violet-500/30 text-violet-400" : "bg-white/[0.04] border-white/10 text-zinc-400 hover:border-white/20"}`}>
                <Filter className="w-4 h-4" />Filters
                {(filterSkill || filterIndustry || filterStage || filterCommitment) && <span className="w-2 h-2 rounded-full bg-violet-400" />}
              </button>
            </div>

            {/* Filters */}
            <AnimatePresence>
              {showFilters && (
                <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }}
                  className="overflow-hidden mb-8">
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4 p-6 rounded-2xl bg-white/[0.02] border border-white/5">
                    <div>
                      <label className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500 mb-2 block">Skill</label>
                      <select value={filterSkill} onChange={e => setFilterSkill(e.target.value)}
                        className="w-full p-3 rounded-xl bg-white/[0.04] border border-white/10 text-white text-sm focus:outline-none appearance-none">
                        <option value="" className="bg-[#0a0a1a]">All Skills</option>
                        {SKILL_OPTIONS.map(s => <option key={s} value={s} className="bg-[#0a0a1a]">{s}</option>)}
                      </select>
                    </div>
                    <div>
                      <label className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500 mb-2 block">Industry</label>
                      <select value={filterIndustry} onChange={e => setFilterIndustry(e.target.value)}
                        className="w-full p-3 rounded-xl bg-white/[0.04] border border-white/10 text-white text-sm focus:outline-none appearance-none">
                        <option value="" className="bg-[#0a0a1a]">All Industries</option>
                        {INDUSTRY_OPTIONS.map(s => <option key={s} value={s} className="bg-[#0a0a1a]">{s}</option>)}
                      </select>
                    </div>
                    <div>
                      <label className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500 mb-2 block">Idea Stage</label>
                      <select value={filterStage} onChange={e => setFilterStage(e.target.value)}
                        className="w-full p-3 rounded-xl bg-white/[0.04] border border-white/10 text-white text-sm focus:outline-none appearance-none">
                        <option value="" className="bg-[#0a0a1a]">Any Stage</option>
                        {IDEA_STAGES.map(s => <option key={s.value} value={s.value} className="bg-[#0a0a1a]">{s.label}</option>)}
                      </select>
                    </div>
                    <div>
                      <label className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500 mb-2 block">Commitment</label>
                      <select value={filterCommitment} onChange={e => setFilterCommitment(e.target.value)}
                        className="w-full p-3 rounded-xl bg-white/[0.04] border border-white/10 text-white text-sm focus:outline-none appearance-none">
                        <option value="" className="bg-[#0a0a1a]">Any Level</option>
                        {COMMITMENT_OPTIONS.map(c => <option key={c.value} value={c.value} className="bg-[#0a0a1a]">{c.label}</option>)}
                      </select>
                    </div>
                    {(filterSkill || filterIndustry || filterStage || filterCommitment) && (
                      <button onClick={() => { setFilterSkill(""); setFilterIndustry(""); setFilterStage(""); setFilterCommitment(""); }}
                        className="text-xs text-zinc-500 hover:text-white transition-colors mt-2">Clear all filters</button>
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Results */}
            {loading ? (
              <div className="flex items-center justify-center py-32">
                <div className="w-10 h-10 border-2 border-violet-500/30 border-t-violet-500 rounded-full animate-spin" />
              </div>
            ) : profiles.length === 0 ? (
              <div className="py-24 flex flex-col items-center justify-center text-center border border-dashed border-white/10 rounded-[2rem] bg-white/[0.02]">
                <Users className="w-16 h-16 text-zinc-700 mb-6" />
                <h3 className="text-2xl font-bold mb-3">No Founders Yet</h3>
                <p className="text-zinc-500 max-w-md mb-8">Be the first to create a profile and start building the community!</p>
                <button onClick={() => { if (!user) { setShowSignup(true); return; } setTab("profile"); }}
                  className="flex items-center gap-2 bg-gradient-to-r from-violet-600 to-blue-600 text-white px-8 py-4 rounded-xl font-bold shadow-lg">
                  <Plus className="w-5 h-5" />Create Your Profile
                </button>
              </div>
            ) : (
              <>
                <p className="text-sm text-zinc-500 mb-6">{profiles.length} founder{profiles.length !== 1 ? "s" : ""} found</p>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {profiles.map(p => <FounderCard key={p.id} profile={p} onClick={() => setSelectedProfile(p)} />)}
                </div>
              </>
            )}
          </div>
        ) : (
          <ProfileForm profile={profile} setProfile={setProfile} onSave={saveProfile} saving={saving} />
        )}
      </main>
      <Footer />
      <AnimatePresence>{selectedProfile && <ProfileModal profile={selectedProfile} onClose={() => setSelectedProfile(null)} />}</AnimatePresence>
      <SignupModal isOpen={showSignup} onClose={() => setShowSignup(false)} />
    </div>
  );
}
