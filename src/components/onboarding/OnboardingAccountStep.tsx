import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { ArrowRight } from 'lucide-react'
import { OnboardingActions } from '@/components/onboarding/OnboardingActions'
import { Alert, Button, Input, PasswordInput, Spinner } from '@/components/ui'
import { useAuth } from '@/hooks/useAuth'
import { paths } from '@/lib/paths'
import {
  saveOnboardingDraft,
  validateStrongPassword,
  type OnboardingDraft,
} from '@/services/onboarding'

const RATE_LIMIT_COOLDOWN_SEC = 30

type AccountForm = {
  fullName: string
  email: string
  password: string
  confirmPassword: string
}

type AccountNotice =
  | { kind: 'rate_limit'; title: string; message: string }
  | { kind: 'email_exists'; message: string }
  | { kind: 'generic'; message: string }
  | null

type OnboardingAccountStepProps = {
  draft: OnboardingDraft
  onDraftChange: (next: OnboardingDraft) => void
  onSuccess: (next: OnboardingDraft, password: string) => void
}

export function OnboardingAccountStep({
  draft,
  onDraftChange,
  onSuccess,
}: OnboardingAccountStepProps) {
  const { signUp } = useAuth()

  const [busy, setBusy] = useState(false)
  const [notice, setNotice] = useState<AccountNotice>(null)
  const [cooldown, setCooldown] = useState(0)

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<AccountForm>({
    defaultValues: {
      fullName: draft.fullName,
      email: draft.email,
      password: '',
      confirmPassword: '',
    },
    mode: 'onBlur',
  })

  useEffect(() => {
    if (cooldown <= 0) return
    const id = window.setInterval(() => {
      setCooldown((value) => Math.max(0, value - 1))
    }, 1000)
    return () => window.clearInterval(id)
  }, [cooldown])

  const startCooldown = () => setCooldown(RATE_LIMIT_COOLDOWN_SEC)

  const persistFields = (values: AccountForm) => {
    const next: OnboardingDraft = {
      ...draft,
      fullName: values.fullName.trim(),
      email: values.email.trim().toLowerCase(),
      companyEmail: draft.companyEmail || values.email.trim().toLowerCase(),
    }
    onDraftChange(next)
    saveOnboardingDraft(next)
    return next
  }

  const submitAccount = async (values: AccountForm) => {
    if (busy || cooldown > 0) return

    setBusy(true)
    setNotice(null)

    try {
      const nextDraft = persistFields(values)

      const result = await signUp(values.email.trim(), values.password, {
        fullName: values.fullName.trim(),
        companyName: draft.companyName.trim() || undefined,
      })

      if (result.errorKind === 'in_progress') {
        return
      }

      if (result.errorKind === 'rate_limit') {
        setNotice({
          kind: 'rate_limit',
          title: result.errorTitle || 'Too many attempts',
          message:
            result.error ||
            'Please wait a few minutes before trying again.',
        })
        startCooldown()
        return
      }

      if (result.errorKind === 'email_exists') {
        setNotice({
          kind: 'email_exists',
          message: result.error || 'This email is already registered.',
        })
        return
      }

      if (result.error) {
        setNotice({
          kind: 'generic',
          message: result.error,
        })
        return
      }

      const created: OnboardingDraft = { ...nextDraft, accountCreated: true }
      onDraftChange(created)
      saveOnboardingDraft(created)
      onSuccess(created, values.password)
    } finally {
      setBusy(false)
    }
  }

  const disabled = busy || cooldown > 0

  return (
    <form
      className="space-y-5"
      onSubmit={handleSubmit((values) => void submitAccount(values))}
      noValidate
    >
      {notice?.kind === 'rate_limit' ? (
        <Alert>
          <p className="font-semibold">{notice.title}</p>
          <p className="mt-1">{notice.message}</p>
          {cooldown > 0 ? (
            <p className="mt-2 text-xs opacity-90">
              You can try again in {cooldown} seconds.
            </p>
          ) : null}
        </Alert>
      ) : null}

      {notice?.kind === 'email_exists' ? (
        <Alert variant="info">
          <p className="font-semibold">{notice.message}</p>
          <p className="mt-1 text-sm opacity-90">
            Sign in with this email to open your workspace.
          </p>
          <div className="mt-4">
            <Link to={paths.login} className="inline-flex w-full sm:w-auto">
              <Button type="button" className="w-full" size="lg">
                Sign In
              </Button>
            </Link>
          </div>
        </Alert>
      ) : null}

      {notice?.kind === 'generic' ? <Alert>{notice.message}</Alert> : null}

      <Input
        label="Full name"
        autoComplete="name"
        placeholder="Jane Doe"
        disabled={busy}
        error={errors.fullName?.message}
        {...register('fullName', {
          required: 'Full name is required',
          minLength: { value: 2, message: 'Enter at least 2 characters' },
        })}
      />
      <Input
        label="Work email"
        type="email"
        inputMode="email"
        autoComplete="email"
        placeholder="you@company.com"
        disabled={busy}
        error={errors.email?.message}
        {...register('email', {
          required: 'Work email is required',
          pattern: {
            value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
            message: 'Enter a valid email address',
          },
        })}
      />
      <PasswordInput
        label="Password"
        autoComplete="new-password"
        placeholder="At least 8 characters"
        disabled={busy}
        error={errors.password?.message}
        {...register('password', {
          required: 'Password is required',
          validate: validateStrongPassword,
        })}
      />
      <PasswordInput
        label="Confirm password"
        autoComplete="new-password"
        placeholder="Re-enter your password"
        disabled={busy}
        error={errors.confirmPassword?.message}
        {...register('confirmPassword', {
          required: 'Confirm your password',
          validate: (value, values) =>
            value === values.password || 'Passwords do not match',
        })}
      />

      <OnboardingActions>
        <span className="hidden sm:block" />
        <Button type="submit" size="lg" disabled={disabled} aria-busy={busy}>
          {busy ? (
            <Spinner className="h-4 w-4 border-white/30 border-t-white" />
          ) : null}
          {busy
            ? 'Creating account...'
            : cooldown > 0
              ? `Try again in ${cooldown}s`
              : 'Continue'}
          {!busy && cooldown <= 0 ? (
            <ArrowRight className="h-4 w-4" aria-hidden />
          ) : null}
        </Button>
      </OnboardingActions>
    </form>
  )
}
