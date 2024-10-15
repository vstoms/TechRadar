import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables. Please check your .env file.')
}

console.log('Supabase URL:', supabaseUrl);
console.log('Supabase Anon Key:', supabaseAnonKey.substring(0, 5) + '...');

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Test the connection
export const testSupabaseConnection = async () => {
  try {
    console.log('Testing Supabase connection...');
    const { data, error } = await supabase.from('blips').select('count', { count: 'exact', head: true })
    if (error) throw error
    console.log('Successfully connected to Supabase')
    return true
  } catch (error) {
    console.error('Failed to connect to Supabase:', error.message)
    return false
  }
}