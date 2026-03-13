"use client";

import axios from "axios";

// Helper to simulate network delay
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));



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
    const API_URL = "http://localhost:5000/api";
    return await axios.post(`${API_URL}/payment/create-order`, customerDetails);
  },

  submitIdea: async (data: any) => {
    await delay(1000);
    
    // Handle version tracking
    const stored = JSON.parse(localStorage.getItem('safari_ideas') || '[]');
    let version = 1;
    if (data.refineId) {
      const existing = stored.find((i: any) => i.id === data.refineId);
      if (existing) {
        version = (existing.version || 1) + 1;
      }
    }
    
    const newIdea = { 
      id: data.refineId || Math.random().toString(36).substr(2, 9), 
      ...data, 
      version,
      status: "Analyzing",
      date: new Date().toISOString().split('T')[0],
      title: data.idea?.substring(0, 60) || "Untitled Idea"
    };

    // Store version history
    const versions = JSON.parse(localStorage.getItem(`safari_versions_${newIdea.id}`) || '[]');
    versions.push({ version, date: newIdea.date, score: 0 });
    localStorage.setItem(`safari_versions_${newIdea.id}`, JSON.stringify(versions));

    // Replace existing or add new
    const filtered = stored.filter((i: any) => i.id !== newIdea.id);
    localStorage.setItem('safari_ideas', JSON.stringify([newIdea, ...filtered]));
    return { data: newIdea };
  },

  startAnalysis: async (ideaId: string) => {
    await delay(3000);
    const stored = JSON.parse(localStorage.getItem('safari_ideas') || '[]');
    const idea = stored.find((i: any) => i.id === ideaId);
    if (idea) {
      idea.status = "Validated";
      idea.score = Math.floor(65 + Math.random() * 30);
      
      let filteredInsights: any = { ...EXPERT_INSIGHTS };
      if (idea.experts && idea.experts.length > 0) {
        filteredInsights = {};
        idea.experts.forEach((exp: string) => {
          filteredInsights[exp] = (EXPERT_INSIGHTS as any)[exp];
        });
      }
      
      idea.insights = filteredInsights;
      localStorage.setItem('safari_ideas', JSON.stringify(stored));

      // Update version score
      const versions = JSON.parse(localStorage.getItem(`safari_versions_${ideaId}`) || '[]');
      if (versions.length > 0) {
        versions[versions.length - 1].score = idea.score;
        localStorage.setItem(`safari_versions_${ideaId}`, JSON.stringify(versions));
      }
    }
    return { data: idea };
  },

  getResults: async (ideaId: string) => {
    await delay(500);
    const stored = JSON.parse(localStorage.getItem('safari_ideas') || '[]');
    const idea = stored.find((i: any) => i.id === ideaId);
    return { data: idea };
  },

  getDashboard: async () => {
    await delay(800);
    const stored = JSON.parse(localStorage.getItem('safari_ideas') || '[]');
    return { data: stored };
  },

  chatWithExpert: async (data: { idea_id: string, expert_name: string, message: string, history?: any[] }) => {
    const API_URL = "http://localhost:5000/api";
    return await axios.post(`${API_URL}/chat/expert`, data);
  },

  sharkTankChat: async (data: { idea_id: string, message: string, history?: any[] }) => {
    const API_URL = "http://localhost:5000/api";
    return await axios.post(`${API_URL}/chat/shark-tank`, data);
  },

  getIdeaVersions: async (ideaId: string) => {
    const versions = JSON.parse(localStorage.getItem(`safari_versions_${ideaId}`) || '[]');
    return { data: versions };
  },

  generateShareLink: async (ideaId: string) => {
    // Generate a unique share ID
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
