/**
 * Runtime auth redirect URLs.
 * Always derived from the current browser origin so the same build works on
 * localhost and Vercel without baking a host into the bundle.
 */

export function getAuthCallbackUrl(next?: string): string {
  const url = new URL('/auth/callback', window.location.origin)
  if (next) url.searchParams.set('next', next)
  return url.toString()
}

export function getPasswordResetRedirectUrl(): string {
  return getAuthCallbackUrl('reset-password')
}

export function getEmailVerifiedRedirectUrl(): string {
  return getAuthCallbackUrl('email-verified')
}

export function getOriginUrl(path = ''): string {
  const normalized = path.startsWith('/') ? path : path ? `/${path}` : ''
  return `${window.location.origin}${normalized}`
}
