const { query } = require('./utils/db');

async function migrate() {
  try {
    console.log("Running migration for Advanced Features...");
    
    // 1. Update analysis_results for rich data
    await query(`
      ALTER TABLE public.analysis_results 
      ADD COLUMN IF NOT EXISTS pitch_deck JSONB,
      ADD COLUMN IF NOT EXISTS competitors JSONB,
      ADD COLUMN IF NOT EXISTS survey_questions JSONB,
      ADD COLUMN IF NOT EXISTS badges TEXT[];
    `);

    // 2. Create chat_messages table
    await query(`
      CREATE TABLE IF NOT EXISTS public.chat_messages (
        id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
        idea_id UUID REFERENCES public.ideas(id) ON DELETE CASCADE,
        expert_name TEXT NOT NULL,
        role TEXT NOT NULL CHECK (role IN ('user', 'assistant')),
        content TEXT NOT NULL,
        created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
      );
    `);

    // 3. Enable RLS on chat_messages
    await query(`ALTER TABLE public.chat_messages ENABLE ROW LEVEL SECURITY;`);
    
    // 4. Add RLS policy for chat
    await query(`
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

    console.log("Advanced Features migration successful!");
    process.exit(0);
  } catch (err) {
    console.error("Migration failed:", err);
    process.exit(1);
  }
}

migrate();
