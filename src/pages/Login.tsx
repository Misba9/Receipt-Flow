import { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { AuthLayout } from '@/layouts/AuthLayout'
import { Alert, Button, Input, PasswordInput, Spinner } from '@/components/ui'
import { useAuth } from '@/hooks/useAuth'
import { fetchSessionAccess } from '@/services/admin/api'
import { paths } from '@/lib/paths'

type LoginFormValues = {
  email: string
  password: string
}

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
    formState: { errors, isSubmitting },
  } = useForm<LoginFormValues>({
    defaultValues: { email: '', password: '' },
    mode: 'onBlur',
  })

  const onSubmit = handleSubmit(async ({ email, password }) => {
    setFormError(null)
    const { error } = await signIn(email.trim(), password)
    if (error) {
      setFormError(error)
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
          {...register('email', {
            required: 'Email is required',
            pattern: {
              value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
              message: 'Enter a valid email address',
            },
          })}
        />

        <div className="space-y-2">
          <PasswordInput
            label="Password"
            autoComplete="current-password"
            placeholder="Enter your password"
            disabled={isSubmitting}
            error={errors.password?.message}
            {...register('password', {
              required: 'Password is required',
              minLength: {
                value: 6,
                message: 'Password must be at least 6 characters',
              },
            })}
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
          disabled={isSubmitting}
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
