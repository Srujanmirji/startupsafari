const { Pool } = require('pg');
const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

// Initialize standard PostgreSQL connection pool
// Useful for complex queries or when the ORM/SDK is not sufficient
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

// Initialize Supabase client
// Useful for auth, storage, and standard CRUD when using Supabase
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_ANON_KEY;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_KEY; // For admin bypass if needed

// Standard client for most operations
const supabase = createClient(supabaseUrl, supabaseKey);

// Service role client (use with caution, bypasses RLS)
const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey);

module.exports = {
  pool,
  supabase,
  supabaseAdmin,
  query: (text, params) => pool.query(text, params)
};
