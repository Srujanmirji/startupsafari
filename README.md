# 🐾 StartupSafari

**StartupSafari** is an AI-powered venture analysis platform that turns raw startup ideas into validated business visions. Using a panel of 10 specialized AI experts, it provides deep-dive analysis, market validation, and actionable roadmaps for founders.

![StartupSafari Banner](https://images.unsplash.com/photo-1557683316-973673baf926?q=80&w=2029&auto=format&fit=crop)

## 🚀 Key Features

- **Brain-to-Vision Pipeline:** Submit a raw idea and go through a structured market validation questionnaire.
- **AI Expert Panel:** 10 specialized personas (Fox, Shark, Owl, Bee, etc.) provide analysis on everything from monetization to unit economics.
- **Context-Aware Expert Chat:** Persistent, real-time chat with individual experts who know your startup's specific scores and SWOT.
- **Professional PDF Reports:** Download a comprehensive, print-optimized analysis report of your startup vision.
- **Shark Tank CTA:** Engage in a high-pressure rapid-fire simulation with "The Shark" to test your pitch.
- **Hacker's Toolkit:** Automatically generate a README and a 4-week sprint roadmap for your MVP.
- **Evolution Tracker:** Track how your scores evolve across different iterations of your idea.

## 🛠️ Tech Stack

### Frontend
- **Framework:** [Next.js 16](https://nextjs.org/) (App Router)
- **Styling:** [Tailwind CSS v4](https://tailwindcss.com/)
- **Animations:** [Framer Motion](https://www.framer.com/motion/) & [React Three Fiber](https://r3f.docs.pmnd.rs/getting-started/introduction)
- **Icons:** [Lucide React](https://lucide.dev/)
- **Auth:** [Supabase Auth](https://supabase.com/auth) & Google OAuth

### Backend
- **Server:** [Express.js](https://expressjs.com/)
- **AI Model:** [Google Gemini 2.0 Flash](https://deepmind.google/technologies/gemini/)
- **Database:** [Supabase PostgreSQL](https://supabase.com/database)

## 📁 Project Structure

```text
├── backend/           # Express server, controllers, and AI engine
├── database/          # SQL schemas and migration scripts
├── public/            # Static assets and fonts
└── src/
    ├── app/           # Next.js pages and layouts
    ├── components/    # Reusable UI components
    ├── context/       # Auth and Global state
    └── services/      # API communication layer
```

## ⚙️ Getting Started

### Prerequisites
- Node.js v18+ 
- Supabase Account
- Google Gemini API Key

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/Srujanmirji/startupsafari.git
   cd startupsafari
   ```

2. **Frontend Setup:**
   ```bash
   npm install
   cp .env.example .env.local
   # Fill in your Supabase credentials
   npm run dev
   ```

3. **Backend Setup:**
   ```bash
   cd backend
   npm install
   cp .env.example .env
   # Fill in GEMINI_API_KEY and SUPABASE credentials
   node server.js
   ```

## 📄 License
This project is licensed under the ISC License.

---
🐾 *Built with ❤️ for founders on the Safari.*
