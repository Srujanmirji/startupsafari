# 🗓️ 4-Week MVP Roadmap: StartupSafari
**Objective:** From Concept to First 10 Paid Beta Users.

---

## 🏗️ Week 1: Foundation & Core Logic
**Goal:** Build the "Brain-to-Vision" internal engine.

- **Frontend:**
    - Basic UI for Idea Submission (Clean, minimalist input).
    - "Thinking..." animations (using Framer Motion) to mask AI latency.
- **Backend:**
    - Integrate Gemini 2.0 Flash with system prompts for the 10 Expert Personas.
    - Implement the basic "Survival Scoring" algorithm logic.
- **Milestone:** A raw text input produces a 500-word analysis from 3 experts.

---

## 🎨 Week 2: User Experience & Artifact Generation
**Goal:** Make the analysis feel "Premium."

- **Features:**
    - **SWOT UI:** Interactive cards with glassmorphism effects.
    - **PDF Engine:** Implement `jspdf` or a server-side equivalent to generate the professional report.
    - **Idea Orbit:** Initial 3D visualization using Three.js to represent the "Health" of the idea.
- **Backend:**
    - Database schema for storing "Ideas" and "Expert Chats."
    - User Authentication (Supabase Auth).
- **Milestone:** User can log in, submit an idea, and download a branded PDF report.

---

## 💬 Week 3: Persistence & Expert Interaction
**Goal:** Enable "habitual" use through expert chat.

- **Features:**
    - **Expert Chat Drawer:** Persistent chat logic where experts remember the Safari Score.
    - **Context Injection:** Feeding the scores/SWOT into every chat message automatically.
    - **Shark Tank mode:** A simple timer-based chat simulation with "The Shark."
- **Growth:**
    - Integration of basic analytics (PostHog or Mixpanel) to track funnel drop-off.
- **Milestone:** User can ask follow-up questions to the "Bee" or "Owl" personas about their specific score.

---

## 🚀 Week 4: Distribution & Paid Beta
**Goal:** Prove the Revenue Model.

- **Features:**
    - **Pricing Layer:** Stripe/Cashfree integration for the "Professional Report" unlock.
    - **Hacker's Toolkit:** Basic script to generate a `README.md` and basic file structure.
- **Distribution:**
    - Prepare and schedule the Product Hunt "Coming Soon" page.
    - Direct outreach to 10 founders in personal network for the Beta.
- **Milestone:** First $1 processed through the platform and 10 active Beta users.

---

### **VC Advice for the Sprint:**
"Don't build everything. Build the **Expert Panel** perfectly. The 3D animations are 'nice-to-have,' but the quality of the 'Ruthless Analysis' is what will make a founder pay. Ship fast, and let the first users tell you which expert they actually trust."
