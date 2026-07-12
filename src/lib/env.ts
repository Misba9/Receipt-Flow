/**
 * Validated public env for the Vite client.
 * Never put service-role keys or Resend secrets in VITE_* variables.
 */

function required(name: keyof ImportMetaEnv, value: string | undefined): string {
  const trimmed = value?.trim()
  if (!trimmed) {
    throw new Error(
      `Missing ${name}. Copy .env.example to .env (or set Vercel env vars) and restart the app.`,
    )
  }
  return trimmed
}

const supabaseUrl = required(
  'VITE_SUPABASE_URL',
  import.meta.env.VITE_SUPABASE_URL,
)
const supabaseAnonKey = required(
  'VITE_SUPABASE_ANON_KEY',
  import.meta.env.VITE_SUPABASE_ANON_KEY,
)

export const env = {
  supabaseUrl,
  supabaseAnonKey,
  appName: import.meta.env.VITE_APP_NAME?.trim() || 'ReceiptFlow',
  appUrl: (
    import.meta.env.VITE_APP_URL?.trim() ||
    (typeof window !== 'undefined' ? window.location.origin : '')
  ).replace(/\/$/, ''),
  isProd: import.meta.env.PROD,
  isDev: import.meta.env.DEV,
} as const

/** True when credentials look like real project values (not .env.example placeholders). */
export const isSupabaseConfigured =
  !supabaseUrl.includes('your-project') &&
  !supabaseAnonKey.includes('your-anon') &&
  !supabaseAnonKey.includes('your-publishable')
