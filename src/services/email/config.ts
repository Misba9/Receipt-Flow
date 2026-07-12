import type { EmailMode } from '@/services/email/types'

function normalizeMode(value: string | undefined): EmailMode | null {
  if (!value) return null
  const normalized = value.trim().toLowerCase()
  if (normalized === 'development' || normalized === 'dev' || normalized === 'demo') {
    return 'development'
  }
  if (normalized === 'production' || normalized === 'prod') {
    return 'production'
  }
  return null
}

/**
 * Resolves email delivery mode from env.
 * Prefer `VITE_EMAIL_MODE`, then `VITE_APP_ENV`.
 * Defaults to development in Vite DEV, production otherwise.
 */
export function getEmailMode(): EmailMode {
  const fromEmailMode = normalizeMode(import.meta.env.VITE_EMAIL_MODE)
  if (fromEmailMode) return fromEmailMode

  const fromAppEnv = normalizeMode(import.meta.env.VITE_APP_ENV)
  if (fromAppEnv) return fromAppEnv

  return import.meta.env.DEV ? 'development' : 'production'
}

export function isEmailDevelopmentMode(): boolean {
  return getEmailMode() === 'development'
}
