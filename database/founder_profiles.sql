-- database/founder_profiles.sql
-- Co-Founder Matching Platform Schema

CREATE TABLE IF NOT EXISTS public.founder_profiles (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id TEXT NOT NULL,
    name TEXT NOT NULL,
    email TEXT,
    avatar_url TEXT,
    headline TEXT,
    bio TEXT,
    
    -- Role & Skills
    role TEXT,
    skills TEXT[] DEFAULT '{}',
    looking_for_skills TEXT[] DEFAULT '{}',
    looking_for_role TEXT,
    
    -- Idea & Stage
    idea_stage TEXT CHECK (idea_stage IN ('have_idea', 'looking_for_idea', 'open_to_both')),
    idea_description TEXT,
    industries TEXT[] DEFAULT '{}',
    
    -- Commitment & Location
    commitment TEXT CHECK (commitment IN ('full_time', 'part_time', 'flexible')),
    location TEXT,
    remote_ok BOOLEAN DEFAULT true,
    
    -- Social Links
    linkedin_url TEXT,
    twitter_url TEXT,
    portfolio_url TEXT,
    
    -- Visibility
    is_visible BOOLEAN DEFAULT true,
    
    -- Timestamps
    created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Create index for faster searches
CREATE INDEX IF NOT EXISTS idx_founder_profiles_user_id ON public.founder_profiles(user_id);
CREATE INDEX IF NOT EXISTS idx_founder_profiles_skills ON public.founder_profiles USING GIN(skills);
CREATE INDEX IF NOT EXISTS idx_founder_profiles_industries ON public.founder_profiles USING GIN(industries);
CREATE INDEX IF NOT EXISTS idx_founder_profiles_idea_stage ON public.founder_profiles(idea_stage);
CREATE INDEX IF NOT EXISTS idx_founder_profiles_commitment ON public.founder_profiles(commitment);

-- Allow public read access for browsing, but only owners can write
ALTER TABLE public.founder_profiles ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Anyone can view visible profiles" ON public.founder_profiles;
CREATE POLICY "Anyone can view visible profiles" ON public.founder_profiles
    FOR SELECT USING (is_visible = true);

DROP POLICY IF EXISTS "Users can manage their own profiles" ON public.founder_profiles;
CREATE POLICY "Users can manage their own profiles" ON public.founder_profiles
    FOR ALL USING (true);
