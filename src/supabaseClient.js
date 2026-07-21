import { createClient } from '@supabase/supabase-js'

const rawSupabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY

const supabaseUrl = rawSupabaseUrl?.replace(/\/(rest|graphql)\/v1\/?$/, '')

if (!supabaseUrl || !supabaseKey) {
	throw new Error('Supabase environment variables are missing. Check .env.local for VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY.')
}

export const supabase = createClient(supabaseUrl, supabaseKey)