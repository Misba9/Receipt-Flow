import { Check, Mail, MailOpen } from 'lucide-react'
import { Alert, Button, Spinner } from '@/components/ui'
import { cn } from '@/utils'

type EmailVerifyPanelProps = {
  email: string
  verified: boolean
  busy?: boolean
  resendIn: number
  error?: string | null
  errorTitle?: string | null
  onResend: () => void
  onChangeEmail: () => void
  onBack?: () => void
  onRetryFinish?: () => void
  className?: string
}

export function EmailVerifyPanel({
  email,
  verified,
  busy,
  resendIn,
  error,
  errorTitle,
  onResend,
  onChangeEmail,
  onBack,
  onRetryFinish,
  className,
}: EmailVerifyPanelProps) {
  if (verified && !error) {
    return (
      <div
        className={cn(
          'flex flex-col items-center space-y-4 py-4 text-center motion-safe:animate-[fadeSlideIn_0.3s_ease-out]',
          className,
        )}
        role="status"
        aria-live="polite"
      >
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100 text-emerald-600 dark:bg-emerald-950 dark:text-emerald-300">
          <Check className="h-8 w-8" aria-hidden />
        </div>
        <div>
          <h2 className="text-xl font-semibold text-surface-900 dark:text-surface-50">
            Email Verified Successfully
          </h2>
          <p className="mt-2 text-sm text-surface-500">
            Taking you to your dashboard…
          </p>
        </div>
        <Spinner className="h-5 w-5" />
      </div>
    )
  }

  return (
    <div className={cn('space-y-6', className)}>
      <div className="flex flex-col items-center text-center">
        <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-brand-50 text-brand-600 dark:bg-brand-950 dark:text-brand-300">
          <Mail className="h-8 w-8" aria-hidden />
        </div>
        <h2 className="text-xl font-semibold text-surface-900 dark:text-surface-50">
          Verify your email
        </h2>
        <p className="mt-2 max-w-sm text-sm leading-relaxed text-surface-500">
          We&apos;ve sent a verification link to your email address.
        </p>
        <p className="mt-3 break-all rounded-xl bg-surface-50 px-3 py-2 text-sm font-medium text-surface-800 dark:bg-surface-950 dark:text-surface-100">
          {email}
        </p>
      </div>

      {error ? (
        <Alert>
          {errorTitle ? <p className="font-semibold">{errorTitle}</p> : null}
          <p className={errorTitle ? 'mt-1' : undefined}>{error}</p>
          {resendIn > 0 ? (
            <p className="mt-2 text-xs opacity-90">
              You can try again in {resendIn} seconds.
            </p>
          ) : null}
        </Alert>
      ) : null}

      {verified && error && onRetryFinish ? (
        <Button
          type="button"
          className="w-full"
          size="lg"
          disabled={busy}
          onClick={onRetryFinish}
        >
          {busy ? <Spinner className="h-4 w-4 border-white/30 border-t-white" /> : null}
          Retry setup
        </Button>
      ) : null}

      {!verified ? (
      <Alert variant="info">
        Open the email and click the verification link. This page updates
        automatically once your email is confirmed.
      </Alert>
      ) : null}

      {!verified ? (
      <div className="space-y-3">
        <a
          href="https://mail.google.com"
          target="_blank"
          rel="noreferrer"
          className={cn(
            'inline-flex h-11 w-full items-center justify-center gap-2 rounded-xl bg-brand-600 px-4 text-sm font-medium text-white',
            'transition-[color,background-color,box-shadow,transform] duration-200 hover:-translate-y-px hover:bg-brand-700',
            'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 focus-visible:ring-offset-2',
            'dark:focus-visible:ring-offset-surface-950',
          )}
        >
          <MailOpen className="h-4 w-4" aria-hidden />
          Open Gmail
        </a>
        <Button
          type="button"
          variant="secondary"
          className="w-full"
          size="lg"
          disabled={busy || resendIn > 0}
          aria-busy={busy}
          onClick={onResend}
        >
          {busy ? <Spinner className="h-4 w-4" /> : null}
          {resendIn > 0 ? `Resend email in ${resendIn}s` : 'Resend Email'}
        </Button>
        <Button
          type="button"
          variant="ghost"
          className="w-full"
          disabled={busy}
          onClick={onChangeEmail}
        >
          Change Email
        </Button>
      </div>
      ) : null}

      {onBack ? (
        <div className="pt-1">
          <Button
            type="button"
            variant="secondary"
            className="w-full sm:w-auto"
            disabled={busy}
            onClick={onBack}
          >
            Back
          </Button>
        </div>
      ) : null}
    </div>
  )
}
