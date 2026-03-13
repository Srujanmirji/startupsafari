const jwt = require('jsonwebtoken');
const { supabase } = require('../utils/db');

/**
 * Middleware to verify Supabase JWT token and attach user to request
 */
const verifyToken = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      console.log('No token provided, using guest user (Safari Mode)');
      req.user = { id: '00000000-0000-0000-0000-000000000000', email: 'guest@startupsafari.ai' };
      return next();
    }

    const token = authHeader.split(' ')[1];

    // Supabase provides an API to get the user based on the JWT token
    const { data, error } = await supabase.auth.getUser(token);

    if (error || !data.user) {
      console.log('Invalid token provided, falling back to guest user (Safari Mode)');
      req.user = { id: '00000000-0000-0000-0000-000000000000', email: 'guest@startupsafari.ai' };
      return next();
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
    // Even on crash, allow guest access for the demo
    req.user = { id: '00000000-0000-0000-0000-000000000000', email: 'guest@startupsafari.ai' };
    next();
  }
};

module.exports = {
  verifyToken
};
