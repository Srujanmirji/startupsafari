const { supabase, supabaseAdmin } = require('../utils/db');

// Creates a new idea for the authenticated user
const createIdea = async (req, res) => {
  try {
    const { title, description, problem_statement, target_audience, industry } = req.body;
    const userId = req.user.id;
    const userEmail = req.user.email;

    // 1. Ensure user exists in our local database before linking idea
    // This handles the "first request check" logic
    await ensureUserExists(userId, userEmail);

    // 2. Insert the idea
    const { data: idea, error } = await supabaseAdmin
      .from('ideas')
      .insert([
        {
          user_id: userId,
          title,
          description,
          problem_statement,
          target_audience,
          industry
        }
      ])
      .select('id')
      .single();

    if (error) {
      console.error('Error inserting idea:', error);
      return res.status(500).json({ error: 'Failed to create idea' });
    }

    res.status(201).json({ idea_id: idea.id });
  } catch (err) {
    console.error('Create idea controller error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Helper function to sync auth user to public.users table
const ensureUserExists = async (userId, email) => {
  const { data, error } = await supabaseAdmin
    .from('users')
    .select('id')
    .eq('id', userId)
    .single();

  if (error && error.code === 'PGRST116') {
    // User not found, create new
    await supabaseAdmin
      .from('users')
      .insert([{ id: userId, email: email }]);
  } else if (error) {
    console.error('Error checking user existence:', error);
  }
};

module.exports = {
  createIdea
};
