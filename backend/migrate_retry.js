const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false },
  connectionTimeoutMillis: 10000,
});

async function run() {
  let retries = 5;
  while (retries > 0) {
    try {
      console.log(`Connecting to database... (${retries} retries left)`);
      const client = await pool.connect();
      console.log("Connected! Running migration...");
      
      await client.query(`
        ALTER TABLE public.analysis_results 
        ADD COLUMN IF NOT EXISTS pitch_deck JSONB,
        ADD COLUMN IF NOT EXISTS competitors JSONB,
        ADD COLUMN IF NOT EXISTS survey_questions JSONB,
        ADD COLUMN IF NOT EXISTS badges TEXT[],
        ADD COLUMN IF NOT EXISTS elephant_score INT4, 
        ADD COLUMN IF NOT EXISTS beaver_score INT4, 
        ADD COLUMN IF NOT EXISTS insights JSONB;
      `);

      await client.query(`
        CREATE TABLE IF NOT EXISTS public.chat_messages (
          id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
          idea_id UUID REFERENCES public.ideas(id) ON DELETE CASCADE,
          expert_name TEXT NOT NULL,
          role TEXT NOT NULL CHECK (role IN ('user', 'assistant')),
          content TEXT NOT NULL,
          created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
        );
      `);

      await client.query(`ALTER TABLE public.chat_messages ENABLE ROW LEVEL SECURITY;`);
      
      await client.query(`
        DROP POLICY IF EXISTS "Users can view their own chats" ON public.chat_messages;
        CREATE POLICY "Users can view their own chats" ON public.chat_messages
        FOR SELECT USING (
          EXISTS (
            SELECT 1 FROM public.ideas 
            WHERE ideas.id = chat_messages.idea_id 
            AND ideas.user_id = auth.uid()
          )
        );
      `);

      console.log("Migration complete!");
      client.release();
      process.exit(0);
    } catch (err) {
      console.error("Attempt failed:", err.message);
      retries--;
      await new Promise(r => setTimeout(r, 3000));
    }
  }
  process.exit(1);
}

run();
