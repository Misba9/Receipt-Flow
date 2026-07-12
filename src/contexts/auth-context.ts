import { createContext } from 'react'
import type { Session, User } from '@supabase/supabase-js'
import type { AuthErrorKind } from '@/lib/auth-errors'

export type SignUpResult = {
  /** Friendly message only — never raw Supabase text. */
  error: string | null
  errorKind: AuthErrorKind | null
  errorTitle?: string
  needsEmailConfirmation: boolean
}

export type ResendSignupResult = {
  error: string | null
  errorKind: AuthErrorKind | null
  errorTitle?: string
}

export type AuthContextValue = {
  user: User | null
  session: Session | null
  isLoading: boolean
  isAuthenticated: boolean
  isEmailVerified: boolean
  signIn: (email: string, password: string) => Promise<{ error: string | null }>
  signUp: (
    email: string,
    password: string,
    options?: { fullName?: string; companyName?: string },
  ) => Promise<SignUpResult>
  resendSignupEmail: (email: string) => Promise<ResendSignupResult>
  refreshUser: () => Promise<User | null>
  signOut: () => Promise<{ error: string | null }>
  resetPassword: (email: string) => Promise<{ error: string | null }>
  updatePassword: (password: string) => Promise<{ error: string | null }>
}

export const AuthContext = createContext<AuthContextValue | null>(null)
