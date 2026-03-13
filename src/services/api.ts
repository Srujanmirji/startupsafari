"use client";

import axios from "axios";

// Helper to simulate network delay
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

const MOCK_IDEAS = [
  { id: "1", title: "AI Coffee Roaster", status: "Validated", score: 82, date: "2024-03-10" },
  { id: "2", title: "Sustainable Packaging DAO", status: "Draft", score: null, date: "2024-03-12" },
];

const EXPERT_INSIGHTS = {
  Fox: "Your core logic is sound, but consider the edge case of supply chain volatility.",
  Owl: "Market trends suggest a 15% CAGR in this sector over the next 5 years.",
  Shark: "Unit economics are tight. You need a higher LTV to offset rising CAC.",
  Bee: "Initial user surveys show high willingness to pay for the premium tier.",
  Wolf: "There are three major players already. Your USP needs to be sharper.",
  Cheetah: "Launching a lean MVP within 4 weeks is critical for first-mover advantage.",
  Peacock: "The brand story needs to lean into the 'eco-friendly' angle more heavily.",
  Eagle: "Long term scalability looks promising if you can transition to a SaaS model."
};

export const api = {
  submitIdea: async (data: any) => {
    await delay(1000);
    const newIdea = { 
      id: Math.random().toString(36).substr(2, 9), 
      ...data, 
      status: "Analyzing",
      date: new Date().toISOString().split('T')[0]
    };
    // Mocking storage
    const stored = JSON.parse(localStorage.getItem('safari_ideas') || '[]');
    localStorage.setItem('safari_ideas', JSON.stringify([newIdea, ...stored]));
    return { data: newIdea };
  },

  startAnalysis: async (ideaId: string) => {
    await delay(3000); // Analysis takes longer
    const stored = JSON.parse(localStorage.getItem('safari_ideas') || '[]');
    const idea = stored.find((i: any) => i.id === ideaId);
    if (idea) {
      idea.status = "Validated";
      idea.score = Math.floor(65 + Math.random() * 30);
      idea.insights = EXPERT_INSIGHTS;
      localStorage.setItem('safari_ideas', JSON.stringify(stored));
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
    return { data: stored.length ? stored : MOCK_IDEAS };
  }
};
