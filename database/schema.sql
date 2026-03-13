-- database/schema.sql

-- 1. Create Users Table (links to Supabase Auth)
CREATE TABLE IF NOT EXISTS public.users (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT,
    created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2. Create Ideas Table
CREATE TABLE IF NOT EXISTS public.ideas (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    description TEXT,
    problem_statement TEXT,
    target_audience TEXT,
    industry TEXT,
    created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 3. Create Questionnaire Answers Table
CREATE TABLE IF NOT EXISTS public.questionnaire_answers (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    idea_id UUID REFERENCES public.ideas(id) ON DELETE CASCADE,
    question_id TEXT,
    answer TEXT,
    score INT4,
    created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 4. Create Analysis Results Table
CREATE TABLE IF NOT EXISTS public.analysis_results (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    idea_id UUID REFERENCES public.ideas(id) ON DELETE CASCADE,
    fox_score INT4,
    owl_score INT4,
    shark_score INT4,
    bee_score INT4,
    wolf_score INT4,
    cheetah_score INT4,
    peacock_score INT4,
    eagle_score INT4,
    final_score INT4,
    strengths TEXT[],
    weaknesses TEXT[],
    opportunities TEXT[],
    threats TEXT[],
    created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable RLS (Row Level Security) on all tables
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ideas ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.questionnaire_answers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.analysis_results ENABLE ROW LEVEL SECURITY;

-- Add RLS Policies for Ideas
DROP POLICY IF EXISTS "Users can view their own ideas." ON public.ideas;
CREATE POLICY "Users can view their own ideas." ON public.ideas
    FOR SELECT USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can create their own ideas." ON public.ideas;
CREATE POLICY "Users can create their own ideas." ON public.ideas
    FOR INSERT WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update their own ideas." ON public.ideas;
CREATE POLICY "Users can update their own ideas." ON public.ideas
    FOR UPDATE USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can delete their own ideas." ON public.ideas;
CREATE POLICY "Users can delete their own ideas." ON public.ideas
    FOR DELETE USING (auth.uid() = user_id);
