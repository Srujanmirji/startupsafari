const { analyzeWithPersonas } = require('../services/personasEngine');
const { calculateFinalScore } = require('../services/scoringEngine');
const { generateSWOT } = require('../services/swotGenerator');
const { supabaseAdmin } = require('../utils/db');

const analyzeIdea = async (req, res) => {
  try {
    const { idea_id, questionnaire_answers } = req.body;
    const userId = req.user.id;

    // 1. Verify idea exists and belongs to user
    const { data: idea, error: ideaError } = await supabaseAdmin
      .from('ideas')
      .select('*')
      .eq('id', idea_id)
      .eq('user_id', userId)
      .single();

    if (ideaError || !idea) {
      return res.status(404).json({ error: 'Idea not found or unauthorized' });
    }

    // 2. Run analysis
    const { scores, insights, pitch_deck, competitors, survey_questions, badges } = await analyzeWithPersonas(idea);
    const final_score = calculateFinalScore(scores);
    const swot = generateSWOT(scores);

    // 4. Store analysis results
    const { data: analysisResult, error: analysisError } = await supabaseAdmin
      .from('analysis_results')
      .insert([
        {
          idea_id,
          fox_score: scores.fox,
          owl_score: scores.owl,
          shark_score: scores.shark,
          bee_score: scores.bee,
          elephant_score: scores.elephant,
          wolf_score: scores.wolf,
          cheetah_score: scores.cheetah,
          peacock_score: scores.peacock,
          beaver_score: scores.beaver,
          eagle_score: scores.eagle,
          final_score,
          strengths: swot.strengths,
          weaknesses: swot.weaknesses,
          opportunities: swot.opportunities,
          threats: swot.threats,
          insights: insights,
          pitch_deck,
          competitors,
          survey_questions,
          badges
        }
      ])
      .select()
      .single();

    if (analysisError) {
      console.error('Error saving analysis:', analysisError);
      // We still return the results to the user even if saving to DB fails
    }

    // 5. Build and return response
    res.status(200).json({
      idea_id,
      persona_scores: scores,
      insights,
      pitch_deck,
      competitors,
      survey_questions,
      badges,
      final_score,
      swot
    });

  } catch (err) {
    console.error('Analysis controller error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
};

const getAnalysisResult = async (req, res) => {
  try {
    const { idea_id } = req.params;
    const userId = req.user.id;

    // Verify idea belongs to user
    const { data: idea, error: ideaError } = await supabaseAdmin
      .from('ideas')
      .select('id')
      .eq('id', idea_id)
      .eq('user_id', userId)
      .single();

    if (ideaError || !idea) {
      return res.status(404).json({ error: 'Idea not found or unauthorized' });
    }

    // Get the most recent analysis result for this idea
    const { data: result, error: resultError } = await supabaseAdmin
      .from('analysis_results')
      .select('*')
      .eq('idea_id', idea_id)
      .order('created_at', { ascending: false })
      .limit(1)
      .single();

    if (resultError) {
      if (resultError.code === 'PGRST116') {
        return res.status(404).json({ error: 'No analysis results found for this idea' });
      }
      throw resultError;
    }

    // Format response to match spec
    const response = {
      idea_id,
      persona_scores: {
        fox: result.fox_score,
        owl: result.owl_score,
        shark: result.shark_score,
        bee: result.bee_score,
        elephant: result.elephant_score,
        wolf: result.wolf_score,
        cheetah: result.cheetah_score,
        peacock: result.peacock_score,
        beaver: result.beaver_score,
        eagle: result.eagle_score
      },
      insights: result.insights || {},
      pitch_deck: result.pitch_deck || [],
      competitors: result.competitors || [],
      survey_questions: result.survey_questions || [],
      badges: result.badges || [],
      final_score: result.final_score,
      swot: {
        strengths: result.strengths || [],
        weaknesses: result.weaknesses || [],
        opportunities: result.opportunities || [],
        threats: result.threats || []
      }
    };

    res.status(200).json(response);
  } catch (err) {
    console.error('Get analysis error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
};

module.exports = {
  analyzeIdea,
  getAnalysisResult
};
