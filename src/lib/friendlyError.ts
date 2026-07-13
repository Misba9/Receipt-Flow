/**
 * Maps unknown API / library errors to short, user-facing copy.
 * Never surface raw Postgres / PostgREST / stack details.
 */

const TECHNICAL_RE =
  /PGRST|postgres|permission denied|JWT|row-level|violates|SQLSTATE|column .* does not exist|Failed to fetch|NetworkError|TypeError|undefined|null is not/i

export function toFriendlyError(
  error: unknown,
  fallback = 'Something went wrong. Please try again.',
): string {
  if (!error) return fallback

  if (typeof error === 'string') {
    const trimmed = error.trim()
    if (!trimmed || TECHNICAL_RE.test(trimmed)) return fallback
    return trimmed.length > 160 ? fallback : trimmed
  }

  if (typeof error === 'object' && error !== null && 'message' in error) {
    const message = String((error as { message?: unknown }).message ?? '').trim()
    if (!message || TECHNICAL_RE.test(message)) return fallback

    // Auth-friendly passthrough for known safe messages
    if (
      /invalid login|invalid credentials|email not confirmed|already registered|rate limit|too many/i.test(
        message,
      )
    ) {
      return message
    }

    if (message.length > 160) return fallback
    return message
  }

  return fallback
}
