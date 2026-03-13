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

    // 1. Verify idea belongs to user
    const { data: idea, error: ideaError } = await supabaseAdmin
      .from('ideas')
      .select('*')
      .eq('id', idea_id)
      .eq('user_id', userId)
      .single();

    if (ideaError || !idea) {
      return res.status(404).json({ error: 'Idea not found or unauthorized' });
    }

    const systemPrompt = `
      You are the ${expert_name} expert from the StartupSafari panel.
      Your personality and focus:
      - Fox: Analytical, logical, skeptical.
      - Owl: Market-focused, numbers-driven, competitive landscape.
      - Shark: Monetization, pricing, profit-obsessed.
      - Bee: Customer demand, validation, user-centric.
      - Elephant: Long-term vision, scalability, global reach.
      - Wolf: Strategy, competitive moat, defensibility.
      - Cheetah: Speed, execution, MVP focus.
      - Peacock: Branding, storytelling, pitch clarity.
      - Beaver: Technical build, architecture,feasibility.
      - Eagle: Macro-strategy, industry disruption.

      The user's startup idea is:
      Title: ${idea.title}
      Description: ${idea.description || idea.idea || ''}

      Engage in a helpful, professional, and persona-driven conversation. Keep answers concise but insightful.
    `;

    // 2. Prepare AI model and prompt
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

    // 3. Call Gemini
    const result = await model.generateContent(fullPrompt);
    const response = await result.response;
    const text = response.text();

    // 4. Save messages to DB
    supabaseAdmin.from('chat_messages').insert([
      { idea_id, expert_name, role: 'user', content: message },
      { idea_id, expert_name, role: 'assistant', content: text }
    ]).then(({ error }) => {
      if (error) console.error('Error saving chat:', error);
    });

    res.json({ response: text });

  } catch (error) {
    console.error("Chat Expert Error:", error);
    res.status(500).json({ error: "Failed to communicate with expert", details: error.message });
  }
};

const sharkTankSession = async (req, res) => {
  try {
    const { idea_id, message, history } = req.body;
    
    const systemPrompt = `
      You are 'The Shark' from the StartupSafari panel. You act exactly like a ruthless, numbers-obsessed venture capitalist from the show Shark Tank.
      You are highly critical, aggressive, and demand hard numbers (CAC, LTV, Margins, Market Size).
      You tear apart weak ideas and demand defensibility.
      If the user gives a good answer with numbers and logic, you showing grudging respect.
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

    res.json({ response: text });

  } catch (error) {
    console.error("Shark Tank Error:", error);
    res.status(500).json({ error: "The Shark left the tank.", details: error.message });
  }
};

module.exports = {
  chatWithExpert,
  sharkTankSession
};
