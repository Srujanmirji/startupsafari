const { Pool } = require('pg');
const { createClient } = require('@supabase/supabase-js');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../.env') });

async function verifyConnection() {
  console.log("Testing PostgreSQL Database Connection...");
  const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false }
  });

  try {
    const res = await pool.query('SELECT NOW() as current_time;');
    console.log("✅ Database Connected Successfully! Server time:", res.rows[0].current_time);
  } catch (err) {
    console.error("❌ Database Connection Failed:", err.message);
  } finally {
    pool.end();
  }

  console.log("\nTesting Supabase Auth Client Connection...");
  const supabaseUrl = process.env.SUPABASE_URL;
  const supabaseKey = process.env.SUPABASE_ANON_KEY;
  
  if (!supabaseUrl || !supabaseKey || supabaseUrl.includes('your-project-ref')) {
    console.warn("⚠️  Supabase URL or Key not properly configured in .env");
    return;
  }
  
  const supabase = createClient(supabaseUrl, supabaseKey);
  try {
    // Just a simple request to check if the instance is reachable
    const { data, error } = await supabase.auth.getSession();
    if (error) {
       console.error("❌ Supabase Auth check returned an error:", error.message);
    } else {
       console.log("✅ Supabase Client Connected Successfully!");
    }
  } catch (err) {
    console.error("❌ Supabase Client Connection Failed:", err.message);
  }
}

verifyConnection();
