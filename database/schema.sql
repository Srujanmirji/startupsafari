-- database/schema.sql

-- Create Ideas Table
CREATE TABLE public.ideas (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    description TEXT,
    status TEXT CHECK (status IN ('Draft', 'Validated')) DEFAULT 'Draft',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Set up Row Level Security (RLS)
ALTER TABLE public.ideas ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own ideas." 
    ON public.ideas FOR SELECT 
    USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own ideas." 
    ON public.ideas FOR INSERT 
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own ideas." 
    ON public.ideas FOR UPDATE 
    USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own ideas." 
    ON public.ideas FOR DELETE 
    USING (auth.uid() = user_id);
