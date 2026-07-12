import { useEffect, useRef, useState } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import type { AuthChangeEvent, Session } from '@supabase/supabase-js'
import { Check } from 'lucide-react'
import { Alert, Spinner } from '@/components/ui'
import { getAuthCallbackUrl } from '@/lib/auth-redirect'
import { paths } from '@/lib/paths'
import { supabase } from '@/lib/supabase'
import { markEmailVerified } from '@/services/profile'
import { APP_NAME } from '@/utils'

type CallbackStatus = 'working' | 'verified' | 'error'

function readAuthTypeFromUrl(): string | null {
  const search = new URLSearchParams(window.location.search)
  const fromQuery = search.get('type')
  if (fromQuery) return fromQuery

  const hash = window.location.hash.startsWith('#')
    ? window.location.hash.slice(1)
    : window.location.hash
  if (!hash) return null
  return new URLSearchParams(hash).get('type')
}

function clearAuthParamsFromUrl() {
  const url = new URL(window.location.href)
  url.searchParams.delete('code')
  url.searchParams.delete('error')
  url.searchParams.delete('error_code')
  url.searchParams.delete('error_description')
  url.hash = ''
  window.history.replaceState({}, document.title, url.pathname + url.search)
}

/**
 * Handles Supabase auth redirects (password recovery + optional email verify).
 */
export function AuthCallbackPage() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const [status, setStatus] = useState<CallbackStatus>('working')
  const [message, setMessage] = useState('Confirming your email…')
  const [error, setError] = useState<string | null>(null)
  const handled = useRef(false)
  const redirectTimer = useRef<number | null>(null)

  useEffect(() => {
    let cancelled = false

    const finishWithSession = async (
      event: AuthChangeEvent | 'EXCHANGED',
      session: Session | null,
    ) => {
      if (cancelled || handled.current || !session?.user) return
      handled.current = true

      const next = searchParams.get('next')
      const authType = readAuthTypeFromUrl()
      clearAuthParamsFromUrl()

      const isRecovery =
        event === 'PASSWORD_RECOVERY' ||
        next === 'reset-password' ||
        authType === 'recovery'

      if (isRecovery) {
        setStatus('verified')
        setMessage('Password reset confirmed. Continue to set a new password.')
        redirectTimer.current = window.setTimeout(() => {
          navigate(paths.resetPassword, { replace: true })
        }, 800)
        return
      }

      if (next === 'email-verified') {
        try {
          await markEmailVerified()
        } catch (err) {
          console.error('[auth/callback] markEmailVerified failed', err)
        }
        setStatus('verified')
        setMessage('Email verified successfully.')
        redirectTimer.current = window.setTimeout(() => {
          navigate(paths.dashboard, { replace: true })
        }, 1500)
        return
      }

      // Generic auth redirect (e.g. leftover signup links) → app home.
      setStatus('verified')
      setMessage('Signed in successfully.')
      redirectTimer.current = window.setTimeout(() => {
        navigate(paths.dashboard, { replace: true })
      }, 800)
    }

    const fail = (reason: string) => {
      if (cancelled || handled.current) return
      handled.current = true
      setStatus('error')
      setError(reason)
      setMessage('Confirmation failed')
    }

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      if (
        event === 'SIGNED_IN' ||
        event === 'PASSWORD_RECOVERY' ||
        event === 'USER_UPDATED'
      ) {
        void finishWithSession(event, session)
      }
    })

    void (async () => {
      const urlError =
        searchParams.get('error_description') || searchParams.get('error')
      if (urlError) {
        fail(decodeURIComponent(urlError.replace(/\+/g, ' ')))
        return
      }

      try {
        const code = searchParams.get('code')
        if (code) {
          const { data, error: exchangeError } =
            await supabase.auth.exchangeCodeForSession(code)
          if (exchangeError) {
            const { data: existing } = await supabase.auth.getSession()
            if (existing.session) {
              await finishWithSession('EXCHANGED', existing.session)
              return
            }
            fail(exchangeError.message)
            return
          }
          await finishWithSession('EXCHANGED', data.session)
          return
        }

        const { data, error: sessionError } = await supabase.auth.getSession()
        if (sessionError) {
          fail(sessionError.message)
          return
        }
        if (data.session) {
          await finishWithSession('EXCHANGED', data.session)
          return
        }

        await new Promise((resolve) => window.setTimeout(resolve, 400))
        if (cancelled || handled.current) return

        const { data: retry } = await supabase.auth.getSession()
        if (retry.session) {
          await finishWithSession('EXCHANGED', retry.session)
          return
        }

        fail(
          'No confirmation session was found. Open the latest link from your email, or request a new one.',
        )
      } catch (err) {
        fail(
          err instanceof Error
            ? err.message
            : 'Unable to complete email confirmation.',
        )
      }
    })()

    return () => {
      cancelled = true
      subscription.unsubscribe()
      if (redirectTimer.current != null) {
        window.clearTimeout(redirectTimer.current)
      }
    }
  }, [navigate, searchParams])

  const next = searchParams.get('next')

  return (
    <div className="flex min-h-dvh flex-col items-center justify-center bg-surface-50 px-4 dark:bg-surface-950">
      <div className="w-full max-w-md rounded-2xl border border-surface-200 bg-white p-8 text-center shadow-sm dark:border-surface-800 dark:bg-surface-900">
        <p className="text-xs font-semibold uppercase tracking-wider text-surface-400">
          {APP_NAME}
        </p>

        {status === 'working' ? (
          <div className="mt-6 flex flex-col items-center gap-4">
            <Spinner className="h-8 w-8" />
            <p className="text-sm text-surface-600 dark:text-surface-300">
              {message}
            </p>
          </div>
        ) : null}

        {status === 'verified' ? (
          <div className="mt-6 space-y-3" role="status" aria-live="polite">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-emerald-100 text-emerald-600 dark:bg-emerald-950 dark:text-emerald-300">
              <Check className="h-7 w-7" aria-hidden />
            </div>
            <h1 className="text-xl font-semibold text-surface-900 dark:text-surface-50">
              {message}
            </h1>
            <p className="text-sm text-surface-500">
              {next === 'reset-password'
                ? 'Opening password reset…'
                : 'Taking you to the app…'}
            </p>
            <Spinner className="mx-auto h-5 w-5" />
          </div>
        ) : null}

        {status === 'error' ? (
          <div className="mt-6 space-y-4 text-left">
            <h1 className="text-center text-xl font-semibold text-surface-900 dark:text-surface-50">
              {message}
            </h1>
            {error ? <Alert>{error}</Alert> : null}
            <p className="text-center text-sm text-surface-500">
              Expected callback host:{' '}
              <span className="break-all font-medium text-surface-700 dark:text-surface-200">
                {getAuthCallbackUrl()}
              </span>
            </p>
            <div className="flex flex-col gap-2 sm:flex-row sm:justify-center">
              <Link
                to={paths.dashboard}
                className="inline-flex h-11 items-center justify-center rounded-xl bg-brand-600 px-4 text-sm font-medium text-white hover:bg-brand-700"
              >
                Go to dashboard
              </Link>
              <Link
                to={paths.login}
                className="inline-flex h-11 items-center justify-center rounded-xl bg-surface-100 px-4 text-sm font-medium text-surface-900 hover:bg-surface-200 dark:bg-surface-800 dark:text-surface-50 dark:hover:bg-surface-700"
              >
                Sign in
              </Link>
            </div>
          </div>
        ) : null}
      </div>
    </div>
  )
}
