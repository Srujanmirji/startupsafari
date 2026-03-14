const { supabaseAdmin } = require('../utils/db');

// Create or Update a founder profile
const upsertProfile = async (req, res) => {
  try {
    const userId = req.body.user_id || req.user?.id;
    const profileData = {
      user_id: userId,
      name: req.body.name,
      email: req.body.email,
      avatar_url: req.body.avatar_url || null,
      headline: req.body.headline || null,
      bio: req.body.bio || null,
      role: req.body.role || null,
      skills: req.body.skills || [],
      looking_for_skills: req.body.looking_for_skills || [],
      looking_for_role: req.body.looking_for_role || null,
      idea_stage: req.body.idea_stage || 'open_to_both',
      idea_description: req.body.idea_description || null,
      industries: req.body.industries || [],
      commitment: req.body.commitment || 'flexible',
      location: req.body.location || null,
      remote_ok: req.body.remote_ok !== undefined ? req.body.remote_ok : true,
      linkedin_url: req.body.linkedin_url || null,
      twitter_url: req.body.twitter_url || null,
      portfolio_url: req.body.portfolio_url || null,
      is_visible: req.body.is_visible !== undefined ? req.body.is_visible : true,
      updated_at: new Date().toISOString()
    };

    // Check if profile exists
    const { data: existing } = await supabaseAdmin
      .from('founder_profiles')
      .select('id')
      .eq('user_id', userId)
      .single();

    let result;
    if (existing) {
      // Update
      const { data, error } = await supabaseAdmin
        .from('founder_profiles')
        .update(profileData)
        .eq('user_id', userId)
        .select()
        .single();
      if (error) throw error;
      result = data;
    } else {
      // Insert
      const { data, error } = await supabaseAdmin
        .from('founder_profiles')
        .insert([profileData])
        .select()
        .single();
      if (error) throw error;
      result = data;
    }

    res.status(200).json(result);
  } catch (err) {
    console.error('Upsert profile error:', err);
    res.status(500).json({ error: 'Failed to save profile', details: err.message });
  }
};

// Get own profile
const getMyProfile = async (req, res) => {
  try {
    const userId = req.params.userId || req.user?.id;
    
    const { data, error } = await supabaseAdmin
      .from('founder_profiles')
      .select('*')
      .eq('user_id', userId)
      .single();

    if (error && error.code === 'PGRST116') {
      return res.status(404).json({ error: 'Profile not found' });
    }
    if (error) throw error;
    
    res.status(200).json(data);
  } catch (err) {
    console.error('Get profile error:', err);
    res.status(500).json({ error: 'Failed to get profile', details: err.message });
  }
};

// Browse all visible profiles with filtering & search
const browseProfiles = async (req, res) => {
  try {
    const { 
      search, 
      skills, 
      industries, 
      idea_stage, 
      commitment, 
      role,
      page = 1, 
      limit = 20 
    } = req.query;

    let query = supabaseAdmin
      .from('founder_profiles')
      .select('*', { count: 'exact' })
      .eq('is_visible', true)
      .order('created_at', { ascending: false });

    // Text search across name, headline, bio
    if (search) {
      query = query.or(`name.ilike.%${search}%,headline.ilike.%${search}%,bio.ilike.%${search}%,role.ilike.%${search}%`);
    }

    // Filter by skills (overlap)
    if (skills) {
      const skillArr = skills.split(',').map(s => s.trim());
      query = query.overlaps('skills', skillArr);
    }

    // Filter by industries (overlap)
    if (industries) {
      const indArr = industries.split(',').map(s => s.trim());
      query = query.overlaps('industries', indArr);
    }

    // Filter by idea stage
    if (idea_stage) {
      query = query.eq('idea_stage', idea_stage);
    }

    // Filter by commitment
    if (commitment) {
      query = query.eq('commitment', commitment);
    }

    // Filter by role
    if (role) {
      query = query.ilike('role', `%${role}%`);
    }

    // Pagination
    const offset = (parseInt(page) - 1) * parseInt(limit);
    query = query.range(offset, offset + parseInt(limit) - 1);

    const { data, error, count } = await query;

    if (error) throw error;

    res.status(200).json({ 
      profiles: data, 
      total: count,
      page: parseInt(page),
      totalPages: Math.ceil(count / parseInt(limit))
    });
  } catch (err) {
    console.error('Browse profiles error:', err);
    res.status(500).json({ error: 'Failed to browse profiles', details: err.message });
  }
};

// Get a single profile by id
const getProfile = async (req, res) => {
  try {
    const { id } = req.params;
    
    const { data, error } = await supabaseAdmin
      .from('founder_profiles')
      .select('*')
      .eq('id', id)
      .eq('is_visible', true)
      .single();

    if (error && error.code === 'PGRST116') {
      return res.status(404).json({ error: 'Profile not found' });
    }
    if (error) throw error;
    
    res.status(200).json(data);
  } catch (err) {
    console.error('Get profile error:', err);
    res.status(500).json({ error: 'Failed to get profile', details: err.message });
  }
};

// Delete own profile
const deleteProfile = async (req, res) => {
  try {
    const userId = req.params.userId || req.user?.id;
    
    const { error } = await supabaseAdmin
      .from('founder_profiles')
      .delete()
      .eq('user_id', userId);

    if (error) throw error;
    
    res.status(200).json({ message: 'Profile deleted successfully' });
  } catch (err) {
    console.error('Delete profile error:', err);
    res.status(500).json({ error: 'Failed to delete profile', details: err.message });
  }
};

module.exports = {
  upsertProfile,
  getMyProfile,
  browseProfiles,
  getProfile,
  deleteProfile
};
