const { GoogleGenerativeAI } = require("@google/generative-ai");
const { supabaseAdmin } = require('../utils/db');

const GET_GEN_AI = () => {
  if (!process.env.GEMINI_API_KEY) {
    throw new Error("GEMINI_API_KEY is missing in environment variables");
  }
  return new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
};

const chatWithExpert = async (req, res) => {
  try {
    const { idea_id, expert_name, message, history } = req.body;
    const userId = req.user.id;

    // 1. Fetch Idea and Analysis Context
    let idea = { title: "Your Startup", description: "" };
    let analysis = null;
    
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
    if (uuidRegex.test(idea_id)) {
      // Fetch idea
      const { data: ideaData } = await supabaseAdmin
        .from('ideas')
        .select('*')
        .eq('id', idea_id)
        .eq('user_id', userId)
        .single();
      
      if (ideaData) idea = ideaData;

      // Fetch analysis results for context
      const { data: analysisData } = await supabaseAdmin
        .from('analysis_results')
        .select('*')
        .eq('idea_id', idea_id)
        .order('created_at', { ascending: false })
        .limit(1)
        .single();
      
      if (analysisData) analysis = analysisData;
    }

    // 2. Build Context-Aware System Prompt
    const expertScore = analysis ? (analysis[`${expert_name.toLowerCase()}_score`] || analysis.final_score) : 70;
    
    const systemPrompt = `
      You are the ${expert_name} expert from the StartupSafari panel.
      
      Your personality and focus:
      - Fox (Viability): Analytical, logical, skeptical. Looks for "why this might fail".
      - Owl (Market): Market-focused, numbers-driven, competitive landscape.
      - Shark (Monetization): Ruthless about pricing, margins, and profit.
      - Bee (Demand): Obsessed with user validation, pain points, and customer "pull".
      - Elephant (Scale): Infrastructure, global reach, long-term operations.
      - Wolf (Strategy): Competitive moats, defensibility, unfair advantages.
      - Cheetah (Velocity): Speed to market, lean MVP focus, rapid iteration.
      - Peacock (Branding): Storytelling, pitch clarity, visual identity.
      - Beaver (Technical): Feasibility, tech stack, architecture.
      - Eagle (Vision): Macro-disruption, industry shifts, long-term impact.

      CONTEXT FOR THIS STARTUP:
      Title: ${idea.title}
      Description: ${idea.description || idea.idea || ''}
      
      YOUR ANALYSIS OF THIS IDEA:
      Your specific Safari Score for this area is: ${expertScore}/100.
      ${analysis ? `
      Overall Strengths: ${analysis.strengths?.join(', ')}
      Overall Weaknesses: ${analysis.weaknesses?.join(', ')}
      ` : ''}

      INSTRUCTIONS:
      - Engage in a helpful, persona-driven conversation.
      - Be consistent with your ${expert_name} persona. If your score is low (<60), be more critical/concerned. If high (>85), be encouraging but push for even more.
      - Keep answers concise (max 3-4 sentences per response).
    `;

    // 3. Prepare AI model and prompt
    const genAI = GET_GEN_AI();
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });
    
    let fullPrompt = `System Strategy: ${systemPrompt}\n\n`;
    if (history && history.length > 0) {
      fullPrompt += "Previous Conversation:\n";
      history.forEach(m => {
        if (m.parts && m.parts[0]) {
          fullPrompt += `${m.role === 'user' ? 'User' : 'Expert'}: ${m.parts[0].text}\n`;
        }
      });
    }
    fullPrompt += `User: ${message}\nExpert:`;

    // 4. Call Gemini
    let text;
    for (let attempt = 0; attempt < 3; attempt++) {
      try {
        const result = await model.generateContent(fullPrompt);
        const response = await result.response;
        text = response.text();
        break;
      } catch (aiError) {
        const isRateLimit = aiError.message?.includes('429') || aiError.message?.includes('RESOURCE_EXHAUSTED') || aiError.status === 429;
        if (isRateLimit && attempt < 2) {
          const wait = (attempt + 1) * 5000;
          await new Promise(r => setTimeout(r, wait));
        } else {
          throw aiError;
        }
      }
    }

    if (!text) {
      return res.status(503).json({ error: "AI is busy. Try again." });
    }

    // 5. Save messages to DB (non-blocking)
    if (uuidRegex.test(idea_id)) {
      supabaseAdmin.from('chat_messages').insert([
        { idea_id, expert_name, role: 'user', content: message },
        { idea_id, expert_name, role: 'assistant', content: text }
      ]).then(({ error }) => {
        if (error) console.error('Error saving chat:', error);
      });
    }

    res.json({ response: text });


  } catch (error) {
    console.error("Chat Expert Error:", error.message);
    const isRateLimit = error.message?.includes('429') || error.message?.includes('RESOURCE_EXHAUSTED');
    if (isRateLimit) {
      return res.status(429).json({ error: "The AI experts are too busy right now. Please wait 30 seconds and try again." });
    }
    res.status(500).json({ error: "Failed to communicate with expert", details: error.message });
  }
};

const sharkTankSession = async (req, res) => {
  try {
    const { idea_id, message, history } = req.body;
    const userId = req.user?.id;
    
    const systemPrompt = `
      You are 'The Shark' from the StartupSafari panel. You act exactly like a ruthless, numbers-obsessed venture capitalist from the show Shark Tank.
      You are highly critical, aggressive, and demand hard numbers (CAC, LTV, Margins, Market Size).
      You tear apart weak ideas and demand defensibility.
      If the user gives a good answer with numbers and logic, you show grudging respect.
      Keep your responses extremely concise (2-3 sentences max) to simulate a real rapid-fire pitch environment.
      Always end with a tough question or a demand for clarification.
    `;

    // 2. Prepare AI model
    const genAI = GET_GEN_AI();
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

    let fullPrompt = `System Instructions: ${systemPrompt}\n\n`;
    if (history && history.length > 0) {
      fullPrompt += "Conversation History:\n";
      history.forEach(m => {
        if (m.parts && m.parts[0]) {
          fullPrompt += `${m.role.toUpperCase()}: ${m.parts[0].text}\n`;
        }
      });
    }
    fullPrompt += `USER: ${message}\nSHARK:`;

    const result = await model.generateContent(fullPrompt);
    const response = await result.response;
    const text = response.text();

    // Save to DB if possible
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
    if (idea_id && uuidRegex.test(idea_id)) {
      supabaseAdmin.from('chat_messages').insert([
        { idea_id, expert_name: 'SharkTank', role: 'user', content: message },
        { idea_id, expert_name: 'SharkTank', role: 'assistant', content: text }
      ]).then(({ error }) => { if (error) console.error('Error saving shark chat:', error); });
    }

    res.json({ response: text });

  } catch (error) {
    console.error("Shark Tank Error:", error);
    res.status(500).json({ error: "The Shark left the tank.", details: error.message });
  }
};

const getChatHistory = async (req, res) => {
  try {
    const { idea_id, expert_name } = req.params;
    const userId = req.user.id;

    // Verify ownership of idea
    const { data: idea, error: ideaErr } = await supabaseAdmin
      .from('ideas')
      .select('id')
      .eq('id', idea_id)
      .eq('user_id', userId)
      .single();

    if (ideaErr || !idea) {
      return res.status(403).json({ error: "Unauthorized access to this chat history" });
    }

    const { data, error } = await supabaseAdmin
      .from('chat_messages')
      .select('role, content, created_at')
      .eq('idea_id', idea_id)
      .eq('expert_name', expert_name)
      .order('created_at', { ascending: true });

    if (error) throw error;

    res.json(data);
  } catch (error) {
    console.error("Get Chat History Error:", error);
    res.status(500).json({ error: "Failed to fetch chat history" });
  }
};

const warRoomSession = async (req, res) => {
  try {
    const { idea_id, message, experts, history } = req.body;
    const userId = req.user?.id;

    if (!experts || !Array.isArray(experts) || experts.length === 0) {
      return res.status(400).json({ error: "Missing experts for War Room" });
    }

    const expertNames = experts.join(", ");
    
    const systemPrompt = `
      You are the moderator and the collective voice of a StartupSafari 'War Room' panel containing: ${expertNames}.
      
      Your role is to simulate a intense, high-stakes board meeting where these experts discuss the user's idea.
      - Each expert retains their unique personality (Shark is ruthless, Owl is data-driven, Wolf is defensive, etc.).
      - Experts can agree, disagree, or build on each other's points.
      - Use expert names in the response like "[Shark]: ..." or "[Owl]: ...".
      - Keep the total response length to 3-4 segments max.
      - The goal is to CHALLENGE the founder (the user) and identify the biggest risk in their idea.
      - Always include at least 2 different experts in the response.
    `;

    // 2. Prepare AI model
    const genAI = GET_GEN_AI();
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

    let fullPrompt = `System Strategy: ${systemPrompt}\n\n`;
    if (history && history.length > 0) {
      fullPrompt += "War Room History:\n";
      history.forEach(m => {
        if (m.parts && m.parts[0]) {
          fullPrompt += `${m.role.toUpperCase()}: ${m.parts[0].text}\n`;
        }
      });
    }
    fullPrompt += `USER (Founder): ${message}\nWAR_ROOM_PANEL:`;

    const result = await model.generateContent(fullPrompt);
    const response = await result.response;
    const text = response.text();

    res.json({ response: text });

  } catch (error) {
    console.error("War Room Error:", error);
    res.status(500).json({ error: "The War Room session collapsed.", details: error.message });
  }
};

module.exports = {
  chatWithExpert,
  sharkTankSession,
  warRoomSession,
  getChatHistory
};


