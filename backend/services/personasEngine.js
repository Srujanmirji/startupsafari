const { GoogleGenerativeAI } = require("@google/generative-ai");

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const PERSONA_PROMPTS = {
  fox: "Evaluate the logic and problem-solution fit. Is the problem real? Does the solution solve it? Is it technically feasible?",
  owl: "Analyze market size (TAM/SAM/SOM), trends, target audience, and identify major competitors.",
  shark: "Evaluate monetization, revenue potential, pricing model, and unit economics.",
  bee: "Check for real demand signals and how to validate demand via surveys or interviews.",
  elephant: "Assess long-term scalability and future growth potential globally.",
  wolf: "Identify competitive advantage and 'moats' that prevent others from copying.",
  cheetah: "Measure speed to market and MVP feasibility. How fast can this be built?",
  peacock: "Evaluate branding strength, story clarity, and how easily the idea is communicated.",
  beaver: "Detail technical build feasibility, required resources, and stack complexity.",
  eagle: "Evaluate big-picture strategy and macro-industry disruption potential."
};

const analyzeWithPersonas = async (idea) => {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

    const prompt = `
      You are a panel of elite startup experts. Analyze the following startup idea:
      Title: ${idea.title || 'Untitled Idea'}
      Description: ${idea.description || idea.idea || ''}
      
      Tasks:
      1. For each of the following 10 experts, provide a score (0-100) and a brief 1-sentence insight.
         Experts: ${Object.keys(PERSONA_PROMPTS).join(', ')}
      2. Generate a 10-slide Pitch Deck structure.
      3. Identify 3 real-world competitors or similar companies.
      4. Generate 5 key Survey Questions to validate demand with real users.
      5. Award 1-2 "Safari Badges" based on the idea's strengths (e.g., "Disruptor", "Execution King", "Scalability Giant").
      
      Respond ONLY with a JSON object in the following format:
      {
        "scores": { "fox": 85, ... },
        "insights": { "fox": "...", ... },
        "pitch_deck": [ { "slide": "Problem", "content": "..." }, ... ],
        "competitors": [ { "name": "...", "description": "..." }, ... ],
        "survey_questions": [ "...", ... ],
        "badges": [ "...", ... ]
      }
    `;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    
    // Extract JSON from the response
    const jsonStr = text.replace(/```json/g, "").replace(/```/g, "").trim();
    const data = JSON.parse(jsonStr);

    return {
      scores: data.scores || {},
      insights: data.insights || {},
      pitch_deck: data.pitch_deck || [],
      competitors: data.competitors || [],
      survey_questions: data.survey_questions || [],
      badges: data.badges || []
    };

  } catch (error) {
    console.error("Gemini Analysis Error:", error);
    // Fallback to random scores if AI fails
    return {
      scores: {
        fox: 65,
        owl: 60,
        shark: 55,
        bee: 75,
        elephant: 50,
        wolf: 60,
        cheetah: 80,
        peacock: 70,
        beaver: 65,
        eagle: 85
      },
      insights: {
        fox: "Analysis failed, using baseline logic check.",
        owl: "Market intelligence offline.",
        shark: "Monetization review skipped."
      }
    };
  }
};

module.exports = {
  analyzeWithPersonas
};
