import { createClient, type SupabaseClient } from '@supabase/supabase-js'
import { env, isSupabaseConfigured } from '@/lib/env'

export { isSupabaseConfigured }

/**
 * Browser Supabase client with session persistence (localStorage),
 * auto token refresh, and OAuth/magic-link URL detection.
 * Uses the anon key only — RLS enforces tenant isolation.
 */
export const supabase: SupabaseClient = createClient(
  env.supabaseUrl,
  env.supabaseAnonKey,
  {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
      detectSessionInUrl: true,
      storage: localStorage,
      storageKey: 'receiptflow-auth',
    },
  },
)
