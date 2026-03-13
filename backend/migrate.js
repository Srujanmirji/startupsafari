const { query } = require('./utils/db');

async function migrate() {
  try {
    console.log("Running migration...");
    await query(`
      ALTER TABLE public.analysis_results 
      ADD COLUMN IF NOT EXISTS elephant_score INT4, 
      ADD COLUMN IF NOT EXISTS beaver_score INT4, 
      ADD COLUMN IF NOT EXISTS insights JSONB;
    `);
    console.log("Migration successful!");
    process.exit(0);
  } catch (err) {
    console.error("Migration failed:", err);
    process.exit(1);
  }
}

migrate();
