import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseKey) {
    // In dev, we might not have keys yet, so we warn but don't crash immediately 
    // until we try to use it.
    console.warn("Missing Supabase Env Vars")
}

export const supabase = createClient(supabaseUrl || '', supabaseKey || '')
