/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_SUPABASE_URL: string
  readonly VITE_SUPABASE_ANON_KEY: string
  readonly VITE_APP_NAME: string
  readonly VITE_APP_URL: string
  /** `development` | `production` — controls EmailService transport */
  readonly VITE_EMAIL_MODE?: string
  /** Fallback for email mode when VITE_EMAIL_MODE is unset */
  readonly VITE_APP_ENV?: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
