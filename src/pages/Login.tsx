import { useEffect, useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { AuthLayout } from '@/layouts/AuthLayout'
import { Alert, Button, Input, PasswordInput, Spinner } from '@/components/ui'
import { useAuth } from '@/hooks/useAuth'
import { showFieldSuccess } from '@/lib/formFeedback'
import { toFriendlyError } from '@/lib/friendlyError'
import { fetchSessionAccess } from '@/services/admin/api'
import { paths } from '@/lib/paths'
import { loginSchema, type LoginSchema } from '@/validation/auth.schema'

export function Login() {
  const { signIn } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const [formError, setFormError] = useState<string | null>(null)

  const from =
    (location.state as { from?: { pathname?: string } } | null)?.from?.pathname ??
    null

  const {
    register,
    handleSubmit,
    watch,
    trigger,
    formState: { errors, isSubmitting, isValid, dirtyFields, touchedFields },
  } = useForm<LoginSchema>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: '', password: '' },
    mode: 'onChange',
  })

  useEffect(() => {
    void trigger()
  }, [trigger])

  const email = watch('email')
  const password = watch('password')

  const onSubmit = handleSubmit(async ({ email, password }) => {
    setFormError(null)
    const { error } = await signIn(email.trim(), password)
    if (error) {
      setFormError(toFriendlyError(error, 'Unable to sign in. Please try again.'))
      return
    }

    try {
      const access = await fetchSessionAccess()
      if (access.isSuperAdmin) {
        navigate(from?.startsWith('/admin') ? from : paths.admin, {
          replace: true,
        })
        return
      }
    } catch {
      // Fall through to tenant destination
    }

    navigate(from && from !== paths.login ? from : paths.dashboard, {
      replace: true,
    })
  })

  return (
    <AuthLayout
      title="Welcome back"
      description="Sign in to manage your receipts."
      footer={
        <>
          Don&apos;t have an account?{' '}
          <Link
            to={paths.register}
            className="font-medium text-brand-600 transition-colors hover:text-brand-700 hover:underline dark:text-brand-400"
          >
            Create one
          </Link>
        </>
      }
    >
      <form className="space-y-5" onSubmit={onSubmit} noValidate>
        {formError ? (
          <Alert role="alert">{formError}</Alert>
        ) : null}

        <Input
          label="Email"
          type="email"
          autoComplete="email"
          inputMode="email"
          placeholder="you@company.com"
          disabled={isSubmitting}
          error={errors.email?.message}
          success={showFieldSuccess({
            dirty: dirtyFields.email,
            touched: touchedFields.email,
            invalid: Boolean(errors.email),
            value: email,
          })}
          {...register('email')}
        />

        <div className="space-y-2">
          <PasswordInput
            label="Password"
            autoComplete="current-password"
            placeholder="Enter your password"
            disabled={isSubmitting}
            error={errors.password?.message}
            success={showFieldSuccess({
              dirty: dirtyFields.password,
              touched: touchedFields.password,
              invalid: Boolean(errors.password),
              value: password,
            })}
            {...register('password')}
          />
          <div className="text-right">
            <Link
              to={paths.forgotPassword}
              className="text-xs font-medium text-brand-600 transition-colors hover:text-brand-700 hover:underline dark:text-brand-400"
            >
              Forgot password?
            </Link>
          </div>
        </div>

        <Button
          type="submit"
          className="mt-1 w-full"
          size="lg"
          disabled={!isValid || isSubmitting}
          aria-busy={isSubmitting}
        >
          {isSubmitting ? (
            <Spinner className="h-4 w-4 border-white/30 border-t-white" />
          ) : null}
          {isSubmitting ? 'Signing in…' : 'Sign in'}
        </Button>
      </form>
    </AuthLayout>
  )
}
