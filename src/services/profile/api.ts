import { supabase } from '@/lib/supabase'
import { getEmailVerifiedRedirectUrl } from '@/lib/auth-redirect'

export type ProfileVerification = {
  emailVerifiedAt: string | null
  bannerDismissedAt: string | null
  isVerified: boolean
  showBanner: boolean
}

export async function fetchProfileVerification(): Promise<ProfileVerification> {
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser()
  if (userError) throw userError
  if (!user) {
    return {
      emailVerifiedAt: null,
      bannerDismissedAt: null,
      isVerified: false,
      showBanner: false,
    }
  }

  const { data, error } = await supabase
    .from('profiles')
    .select('email_verified_at, email_verify_banner_dismissed_at')
    .eq('id', user.id)
    .maybeSingle()

  if (error) throw error

  const emailVerifiedAt = (data?.email_verified_at as string | null) ?? null
  const bannerDismissedAt =
    (data?.email_verify_banner_dismissed_at as string | null) ?? null
  const isVerified = Boolean(emailVerifiedAt)

  return {
    emailVerifiedAt,
    bannerDismissedAt,
    isVerified,
    showBanner: !isVerified && !bannerDismissedAt,
  }
}

export async function markEmailVerified(): Promise<void> {
  const { error } = await supabase.rpc('mark_email_verified')
  if (error) throw error
}

export async function dismissEmailVerifyBanner(): Promise<void> {
  const { error } = await supabase.rpc('dismiss_email_verify_banner')
  if (error) throw error
}

/**
 * Sends a magic-link email. Opening the link proves inbox ownership and
 * marks the profile verified via /auth/callback?next=email-verified.
 */
export async function sendEmailVerificationLink(
  email: string,
): Promise<{ error: string | null }> {
  const trimmed = email.trim().toLowerCase()
  if (!trimmed) {
    return { error: 'No email address available.' }
  }

  const { error } = await supabase.auth.signInWithOtp({
    email: trimmed,
    options: {
      shouldCreateUser: false,
      emailRedirectTo: getEmailVerifiedRedirectUrl(),
    },
  })

  if (error) {
    return { error: error.message || 'Unable to send verification email.' }
  }

  return { error: null }
}
