const jwt = require('jsonwebtoken');
const { supabase } = require('../utils/db');

/**
 * Middleware to verify Supabase JWT token and attach user to request
 */
const verifyToken = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'Missing or invalid authorization header' });
    }

    const token = authHeader.split(' ')[1];

    // Supabase provides an API to get the user based on the JWT token
    const { data, error } = await supabase.auth.getUser(token);

    if (error || !data.user) {
      console.error('Supabase Auth Error:', error);
      return res.status(401).json({ error: 'Unauthorized: Invalid token' });
    }

    // Attach user information to the request object
    req.user = {
      id: data.user.id,
      email: data.user.email,
      aud: data.user.aud,
      role: data.user.role
    };

    next();
  } catch (err) {
    console.error('Authentication middleware error:', err);
    res.status(500).json({ error: 'Internal server error during authentication' });
  }
};

module.exports = {
  verifyToken
};
