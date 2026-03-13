const { supabaseAdmin } = require('../utils/db');

const getDashboardIdeas = async (req, res) => {
  try {
    const userId = req.user.id;

    // Fetch all ideas for current user
    const { data: ideas, error: ideasError } = await supabaseAdmin
      .from('ideas')
      .select(`
        id, 
        title, 
        description, 
        industry, 
        created_at,
        analysis_results (
          final_score,
          created_at
        )
      `)
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (ideasError) {
      console.error('Error fetching dashboard ideas:', ideasError);
      return res.status(500).json({ error: 'Failed to fetch dashboard data' });
    }

    // Format results to just include the latest score if available
    const formattedIdeas = ideas.map(idea => {
      // Sort analysis results descending by date to get latest
      const results = idea.analysis_results || [];
      results.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
      
      const latestScore = results.length > 0 ? results[0].final_score : null;

      return {
        id: idea.id,
        title: idea.title,
        description: idea.description,
        industry: idea.industry,
        created_at: idea.created_at,
        latest_score: latestScore
      };
    });

    res.status(200).json(formattedIdeas);
  } catch (err) {
    console.error('Dashboard controller error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
};

module.exports = {
  getDashboardIdeas
};
