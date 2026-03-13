"use client";

import axios from "axios";

const API_URL = "http://localhost:5000/api";

// Helper to simulate network delay (for local-only operations)
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// Helper to get auth headers
const getAuthHeaders = () => {
  if (typeof window === 'undefined') return {};
  
  const sbTokenKey = 'sb-xslnjsnqvvwqllahoqjt-auth-token';
  const sbToken = localStorage.getItem(sbTokenKey);
  const gUser = localStorage.getItem('google_user');
  
  if (sbToken) {
    const parsed = JSON.parse(sbToken);
    return { Authorization: `Bearer ${parsed.access_token}` };
  } else if (gUser) {
    return { 'X-Guest-User': gUser };
  }
  return {};
};

const EXPERT_INSIGHTS = {
  Fox: "Your core logic is sound, but consider the edge case of supply chain volatility.",
  Owl: "Market trends suggest a 15% CAGR in this sector over the next 5 years.",
  Shark: "Unit economics are tight. You need a higher LTV to offset rising CAC.",
  Bee: "Initial user surveys show high willingness to pay for the premium tier.",
  Elephant: "The infrastructure must support exponential user growth; consider edge computing early on.",
  Wolf: "There are three major players already. Your USP needs to be sharper.",
  Cheetah: "Launching a lean MVP within 4 weeks is critical for first-mover advantage.",
  Peacock: "The brand story needs to lean into the 'eco-friendly' angle more heavily.",
  Beaver: "The core technology stack might face latency issues if you rely on a single monolithic database.",
  Eagle: "Long term scalability looks promising if you can transition to a SaaS model."
};

export const api = {
  createPaymentOrder: async (customerDetails: any) => {
    return await axios.post(`${API_URL}/payment/create-order`, customerDetails);
  },

  submitIdea: async (data: any) => {
    const headers = getAuthHeaders();
    
    try {
      // Try real backend first
      const response = await axios.post(`${API_URL}/ideas`, {
        title: data.idea?.substring(0, 60) || "Untitled Idea",
        description: data.idea,
        problem_statement: data.deepDiveAnswers?.problem || "",
        target_audience: data.deepDiveAnswers?.audience || "",
        industry: data.industry || "General"
      }, { headers });

      const backendIdea = {
        id: response.data.idea_id,
        ...data,
        status: "Analyzing",
        date: new Date().toISOString().split('T')[0],
        title: data.idea?.substring(0, 60) || "Untitled Idea",
        source: "backend"
      };

      // Also cache in localStorage for fast access
      const stored = JSON.parse(localStorage.getItem('safari_ideas') || '[]');
      localStorage.setItem('safari_ideas', JSON.stringify([backendIdea, ...stored]));

      return { data: backendIdea };
    } catch (err) {
      console.warn("Backend submit failed, using local mode:", err);
      // Fallback to local-only mode
      const stored = JSON.parse(localStorage.getItem('safari_ideas') || '[]');
      let version = 1;
      if (data.refineId) {
        const existing = stored.find((i: any) => i.id === data.refineId);
        if (existing) version = (existing.version || 1) + 1;
      }
      
      const newIdea = { 
        id: data.refineId || Math.random().toString(36).substr(2, 9), 
        ...data, 
        version,
        status: "Analyzing",
        date: new Date().toISOString().split('T')[0],
        title: data.idea?.substring(0, 60) || "Untitled Idea",
        source: "local"
      };

      const filtered = stored.filter((i: any) => i.id !== newIdea.id);
      localStorage.setItem('safari_ideas', JSON.stringify([newIdea, ...filtered]));
      return { data: newIdea };
    }
  },

  startAnalysis: async (ideaId: string, deepDiveAnswers?: Record<string, string>) => {
    const headers = getAuthHeaders();
    
    try {
      // Try real AI-powered backend analysis
      const response = await axios.post(`${API_URL}/analyze`, {
        idea_id: ideaId,
        questionnaire_answers: deepDiveAnswers || {}
      }, { headers, timeout: 60000 }); // 60s timeout for AI processing

      const aiResult = response.data;

      // Update the cached idea with real AI scores
      const stored = JSON.parse(localStorage.getItem('safari_ideas') || '[]');
      const idea = stored.find((i: any) => i.id === ideaId);
      if (idea) {
        idea.status = "Validated";
        idea.score = aiResult.final_score;
        idea.persona_scores = aiResult.persona_scores;
        idea.insights = aiResult.insights;
        idea.pitch_deck = aiResult.pitch_deck;
        idea.competitors = aiResult.competitors;
        idea.survey_questions = aiResult.survey_questions;
        idea.badges = aiResult.badges;
        idea.swot = aiResult.swot;
        idea.final_score = aiResult.final_score;
        localStorage.setItem('safari_ideas', JSON.stringify(stored));
      }

      return { data: idea || aiResult };
    } catch (err) {
      console.warn("Backend analysis failed, using local mock:", err);
      // Fallback to mock scores
      const stored = JSON.parse(localStorage.getItem('safari_ideas') || '[]');
      const idea = stored.find((i: any) => i.id === ideaId);
      if (idea) {
        idea.status = "Validated";
        idea.score = Math.floor(65 + Math.random() * 30);
        idea.final_score = idea.score;
        
        let filteredInsights: any = { ...EXPERT_INSIGHTS };
        if (idea.experts && idea.experts.length > 0) {
          filteredInsights = {};
          idea.experts.forEach((exp: string) => {
            filteredInsights[exp] = (EXPERT_INSIGHTS as any)[exp];
          });
        }
        
        idea.insights = filteredInsights;
        idea.persona_scores = {
          fox: Math.floor(60 + Math.random() * 30),
          owl: Math.floor(55 + Math.random() * 35),
          shark: Math.floor(50 + Math.random() * 40),
          bee: Math.floor(65 + Math.random() * 25),
          elephant: Math.floor(55 + Math.random() * 30),
          wolf: Math.floor(50 + Math.random() * 35),
          cheetah: Math.floor(60 + Math.random() * 30),
          peacock: Math.floor(55 + Math.random() * 35),
          beaver: Math.floor(60 + Math.random() * 30),
          eagle: Math.floor(55 + Math.random() * 35)
        };
        idea.competitors = [
          { name: "Competitor A", description: "A leading player in this space with strong market presence." },
          { name: "Competitor B", description: "An emerging startup tackling a similar problem with a different approach." },
          { name: "Competitor C", description: "An established company pivoting into this market segment." }
        ];
        idea.survey_questions = [
          "How often do you face the problem this product aims to solve?",
          "What is your current workaround for this problem?",
          "How much would you be willing to pay for a solution?",
          "What features would be most important to you?",
          "Would you recommend this solution to others facing the same problem?"
        ];
        idea.badges = ["Early Mover", "Lean Thinker"];
        idea.swot = {
          strengths: ["Strong problem-solution fit", "Clear target audience"],
          weaknesses: ["Unproven revenue model", "Small initial team"],
          opportunities: ["Growing market demand", "Low competition in niche"],
          threats: ["Established players could pivot", "Regulatory changes"]
        };
        idea.pitch_deck = [
          { slide: "Problem", content: "The core pain point your idea addresses" },
          { slide: "Solution", content: "How your product solves the problem" },
          { slide: "Market Size", content: "TAM/SAM/SOM analysis" },
          { slide: "Business Model", content: "How you plan to make money" },
          { slide: "Traction", content: "Early signals and validation" },
          { slide: "Competition", content: "Competitive landscape and your advantage" },
          { slide: "Team", content: "Core team and their strengths" },
          { slide: "Go-to-Market", content: "Launch and growth strategy" },
          { slide: "Financials", content: "Revenue projections and funding needs" },
          { slide: "Ask", content: "What you're looking for from investors" }
        ];
        localStorage.setItem('safari_ideas', JSON.stringify(stored));
      }
      return { data: idea };
    }
  },

  getResults: async (ideaId: string) => {
    const headers = getAuthHeaders();

    // Ensure all required fields exist on any idea data
    const enrichData = (data: any) => {
      if (!data) return data;
      if (!data.persona_scores) {
        data.persona_scores = {
          fox: Math.floor(60 + Math.random() * 30), owl: Math.floor(55 + Math.random() * 35),
          shark: Math.floor(50 + Math.random() * 40), bee: Math.floor(65 + Math.random() * 25),
          elephant: Math.floor(55 + Math.random() * 30), wolf: Math.floor(50 + Math.random() * 35),
          cheetah: Math.floor(60 + Math.random() * 30), peacock: Math.floor(55 + Math.random() * 35),
          beaver: Math.floor(60 + Math.random() * 30), eagle: Math.floor(55 + Math.random() * 35)
        };
      }
      if (!data.competitors || data.competitors.length === 0) {
        data.competitors = [
          { name: "Competitor A", description: "A leading player in this space with strong market presence." },
          { name: "Competitor B", description: "An emerging startup tackling a similar problem with a different approach." },
          { name: "Competitor C", description: "An established company pivoting into this market segment." }
        ];
      }
      if (!data.survey_questions || data.survey_questions.length === 0) {
        data.survey_questions = [
          "How often do you face the problem this product aims to solve?",
          "What is your current workaround for this problem?",
          "How much would you be willing to pay for a solution?",
          "What features would be most important to you?",
          "Would you recommend this solution to others facing the same problem?"
        ];
      }
      if (!data.badges || data.badges.length === 0) data.badges = ["Early Mover", "Lean Thinker"];
      if (!data.swot) {
        data.swot = {
          strengths: ["Strong problem-solution fit", "Clear target audience"],
          weaknesses: ["Unproven revenue model", "Small initial team"],
          opportunities: ["Growing market demand", "Low competition in niche"],
          threats: ["Established players could pivot", "Regulatory changes"]
        };
      }
      if (!data.pitch_deck || data.pitch_deck.length === 0) {
        data.pitch_deck = [
          { slide: "Problem", content: "The core pain point your idea addresses" },
          { slide: "Solution", content: "How your product solves the problem" },
          { slide: "Market Size", content: "TAM/SAM/SOM analysis" },
          { slide: "Business Model", content: "How you plan to make money" },
          { slide: "Traction", content: "Early signals and validation" },
          { slide: "Competition", content: "Competitive landscape and your advantage" },
          { slide: "Team", content: "Core team and their strengths" },
          { slide: "Go-to-Market", content: "Launch and growth strategy" },
          { slide: "Financials", content: "Revenue projections and funding needs" },
          { slide: "Ask", content: "What you're looking for from investors" }
        ];
      }
      if (!data.insights) data.insights = { ...EXPERT_INSIGHTS };
      if (!data.final_score && !data.score) data.final_score = Math.floor(65 + Math.random() * 30);
      // Persist enriched data
      const stored = JSON.parse(localStorage.getItem('safari_ideas') || '[]');
      const idx = stored.findIndex((i: any) => i.id === data.id);
      if (idx >= 0) { stored[idx] = { ...stored[idx], ...data }; localStorage.setItem('safari_ideas', JSON.stringify(stored)); }
      return data;
    };
    
    try {
      // Try backend first
      const response = await axios.get(`${API_URL}/results/${ideaId}`, { headers });
      const backendResult = response.data;

      // Merge with local data
      const stored = JSON.parse(localStorage.getItem('safari_ideas') || '[]');
      const localIdea = stored.find((i: any) => i.id === ideaId);

      const merged = {
        ...localIdea,
        ...backendResult,
        title: localIdea?.title || backendResult?.title || "Your Startup Idea",
        idea: localIdea?.idea || backendResult?.description || ""
      };

      return { data: enrichData(merged) };
    } catch (err) {
      // Fallback to localStorage
      const stored = JSON.parse(localStorage.getItem('safari_ideas') || '[]');
      const idea = stored.find((i: any) => i.id === ideaId);
      return { data: enrichData(idea) };
    }
  },

  getDashboard: async () => {
    // Always return localStorage ideas for now (fast, reliable)
    const stored = JSON.parse(localStorage.getItem('safari_ideas') || '[]');
    return { data: stored };
  },

  chatWithExpert: async (data: { idea_id: string, expert_name: string, message: string, history?: any[] }) => {
    const headers = getAuthHeaders();
    return await axios.post(`${API_URL}/chat/expert`, data, { headers });
  },

  getChatHistory: async (ideaId: string, expertName: string) => {
    const headers = getAuthHeaders();
    return await axios.get(`${API_URL}/chat/history/${ideaId}/${expertName}`, { headers });
  },

  sharkTankChat: async (data: { idea_id: string, message: string, history?: any[] }) => {
    const headers = getAuthHeaders();
    return await axios.post(`${API_URL}/chat/shark-tank`, data, { headers });
  },


  getIdeaVersions: async (ideaId: string) => {
    const versions = JSON.parse(localStorage.getItem(`safari_versions_${ideaId}`) || '[]');
    return { data: versions };
  },

  generateShareLink: async (ideaId: string) => {
    const shareId = btoa(ideaId).replace(/=/g, '');
    const stored = JSON.parse(localStorage.getItem('safari_ideas') || '[]');
    const idea = stored.find((i: any) => i.id === ideaId);
    if (idea) {
      idea.shareId = shareId;
      localStorage.setItem('safari_ideas', JSON.stringify(stored));
      localStorage.setItem(`safari_share_${shareId}`, JSON.stringify(idea));
    }
    return { data: { shareId, url: `${window.location.origin}/share/${shareId}` } };
  },

  getSharedReport: async (shareId: string) => {
    const data = localStorage.getItem(`safari_share_${shareId}`);
    return { data: data ? JSON.parse(data) : null };
  }
};
