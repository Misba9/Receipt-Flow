import { useCallback, useEffect, useMemo, useRef, useState, type ReactNode } from 'react'
import type { Session, User } from '@supabase/supabase-js'
import {
  AuthContext,
  type AuthContextValue,
  type ResendSignupResult,
  type SignUpResult,
} from '@/contexts/auth-context'
import { classifyAuthError, logAuthError } from '@/lib/auth-errors'
import {
  getAuthCallbackUrl,
  getPasswordResetRedirectUrl,
} from '@/lib/auth-redirect'
import { supabase } from '@/lib/supabase'

function getErrorMessage(error: unknown, fallback: string) {
  if (error && typeof error === 'object' && 'message' in error) {
    const message = (error as { message?: string }).message
    if (message) return message
  }
  return fallback
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [session, setSession] = useState<Session | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const signUpInFlight = useRef(false)
  const resendInFlight = useRef(false)

  useEffect(() => {
    let mounted = true

    supabase.auth.getSession().then(({ data, error }) => {
      if (!mounted) return
      if (error) {
        console.error('Failed to restore session:', error.message)
      }
      setSession(data.session)
      setUser(data.session?.user ?? null)
      setIsLoading(false)
    })

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, nextSession) => {
      setSession(nextSession)
      setUser(nextSession?.user ?? null)
      setIsLoading(false)
    })

    return () => {
      mounted = false
      subscription.unsubscribe()
    }
  }, [])

  const signIn = useCallback(async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) {
      logAuthError('signIn', error)
      return { error: getErrorMessage(error, 'Unable to sign in.') }
    }
    return { error: null }
  }, [])

  const signUp = useCallback(
    async (
      email: string,
      password: string,
      options?: { fullName?: string; companyName?: string },
    ): Promise<SignUpResult> => {
      if (signUpInFlight.current) {
        return {
          error: null,
          errorKind: 'in_progress',
          needsEmailConfirmation: false,
        }
      }

      signUpInFlight.current = true
      try {
        const metadata: Record<string, string> = {}
        if (options?.fullName?.trim()) metadata.full_name = options.fullName.trim()
        if (options?.companyName?.trim()) {
          metadata.company_name = options.companyName.trim()
        }

        // No emailRedirectTo — signup must not trigger a confirmation email.
        // Optional verify is opt-in from Settings / dashboard banner only.
        const { data, error } = await supabase.auth.signUp({
          email: email.trim(),
          password,
          options: {
            data: Object.keys(metadata).length > 0 ? metadata : undefined,
          },
        })

        if (error) {
          logAuthError('signUp', error)
          const classified = classifyAuthError(error, 'Unable to create account.')
          return {
            error: classified.message,
            errorKind: classified.kind,
            errorTitle: classified.title,
            needsEmailConfirmation: false,
          }
        }

        // Empty identities = email already registered (Supabase anti-enumeration).
        const identities = data.user?.identities
        if (data.user && Array.isArray(identities) && identities.length === 0) {
          logAuthError('signUp', 'Duplicate signup (empty identities)')
          const classified = classifyAuthError(
            'User already registered',
            'This email is already registered.',
          )
          return {
            error: classified.message,
            errorKind: 'email_exists',
            needsEmailConfirmation: false,
          }
        }

        // Prefer an immediate session so onboarding can finish without email confirm.
        // If Confirm email is still enabled in the project, session may be null —
        // the wizard will sign in with the password after branding.
        const needsEmailConfirmation = !data.session
        return {
          error: null,
          errorKind: null,
          needsEmailConfirmation,
        }
      } finally {
        signUpInFlight.current = false
      }
    },
    [],
  )

  const resendSignupEmail = useCallback(
    async (email: string): Promise<ResendSignupResult> => {
      if (resendInFlight.current) {
        return { error: null, errorKind: 'in_progress' }
      }

      resendInFlight.current = true
      try {
        const { error } = await supabase.auth.resend({
          type: 'signup',
          email: email.trim(),
          options: {
            emailRedirectTo: getAuthCallbackUrl(),
          },
        })

        if (error) {
          logAuthError('resendSignupEmail', error)
          const classified = classifyAuthError(
            error,
            'Unable to resend verification email.',
          )
          return {
            error: classified.message,
            errorKind: classified.kind,
            errorTitle: classified.title,
          }
        }

        return { error: null, errorKind: null }
      } finally {
        resendInFlight.current = false
      }
    },
    [],
  )

  const refreshUser = useCallback(async () => {
    const { data, error } = await supabase.auth.getUser()
    if (error) return null
    setUser(data.user)
    return data.user
  }, [])

  const signOut = useCallback(async () => {
    const { error } = await supabase.auth.signOut()
    return { error: error ? getErrorMessage(error, 'Unable to sign out.') : null }
  }, [])

  const resetPassword = useCallback(async (email: string) => {
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: getPasswordResetRedirectUrl(),
    })
    return {
      error: error ? getErrorMessage(error, 'Unable to send reset email.') : null,
    }
  }, [])

  const updatePassword = useCallback(async (password: string) => {
    const { error } = await supabase.auth.updateUser({ password })
    return {
      error: error ? getErrorMessage(error, 'Unable to update password.') : null,
    }
  }, [])

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      session,
      isLoading,
      isAuthenticated: Boolean(session?.user),
      // Product soft-verify uses profiles.email_verified_at; this mirrors Auth.
      isEmailVerified: Boolean(user?.email_confirmed_at),
      signIn,
      signUp,
      resendSignupEmail,
      refreshUser,
      signOut,
      resetPassword,
      updatePassword,
    }),
    [
      user,
      session,
      isLoading,
      signIn,
      signUp,
      resendSignupEmail,
      refreshUser,
      signOut,
      resetPassword,
      updatePassword,
    ],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
