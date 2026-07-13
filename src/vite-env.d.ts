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
  /** Google Search Console HTML tag verification token */
  readonly VITE_GOOGLE_SITE_VERIFICATION?: string
  /** Bing Webmaster Tools msvalidate.01 token */
  readonly VITE_BING_SITE_VERIFICATION?: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
