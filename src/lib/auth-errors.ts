/**
 * Maps raw Supabase Auth errors to user-facing copy.
 * Technical details stay in the console only.
 */

export type AuthErrorKind =
  | 'rate_limit'
  | 'email_exists'
  | 'in_progress'
  | 'generic'

export type ClassifiedAuthError = {
  kind: AuthErrorKind
  /** Safe message for the UI (never the raw Supabase string). */
  message: string
  title?: string
}

const RATE_LIMIT_RE =
  /rate limit|too many requests|429|email rate limit exceeded/i
const EMAIL_EXISTS_RE =
  /already registered|already been registered|user already|email.*exists|already exists/i

export function classifyAuthError(
  error: unknown,
  fallbackMessage = 'Something went wrong. Please try again.',
): ClassifiedAuthError {
  const raw =
    error && typeof error === 'object' && 'message' in error
      ? String((error as { message?: string }).message ?? '')
      : typeof error === 'string'
        ? error
        : ''

  const status =
    error && typeof error === 'object' && 'status' in error
      ? Number((error as { status?: number }).status)
      : undefined

  if (status === 429 || RATE_LIMIT_RE.test(raw)) {
    return {
      kind: 'rate_limit',
      title: 'Too many verification emails',
      message:
        "You've requested too many verification emails. Please wait a few minutes before trying again.",
    }
  }

  if (EMAIL_EXISTS_RE.test(raw)) {
    return {
      kind: 'email_exists',
      message: 'This email is already registered.',
    }
  }

  return {
    kind: 'generic',
    message: fallbackMessage,
  }
}

export function logAuthError(context: string, error: unknown) {
  console.error(`[auth] ${context}`, error)
}
