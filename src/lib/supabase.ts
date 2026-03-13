import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ''
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''

// Basic check to prevent crash with placeholder or empty strings
const isValidUrl = supabaseUrl.startsWith('http')

export const supabase = isValidUrl 
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null as any // Fallback to prevent crash, though auth will fail
