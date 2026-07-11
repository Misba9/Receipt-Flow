import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { AuthLayout } from '@/components/layout/AuthLayout'
import { Alert, Button, Input, Spinner } from '@/components/ui'
import { useAuth } from '@/hooks/useAuth'
import { paths } from '@/routes/paths'

type ResetPasswordFormValues = {
  password: string
  confirmPassword: string
}

/**
 * Completes the forgot-password flow after the user opens the email link.
 * Supabase restores a recovery session via detectSessionInUrl.
 */
export function ResetPassword() {
  const { isAuthenticated, isLoading, updatePassword } = useAuth()
  const navigate = useNavigate()
  const [formError, setFormError] = useState<string | null>(null)
  const [successMessage, setSuccessMessage] = useState<string | null>(null)

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ResetPasswordFormValues>({
    defaultValues: { password: '', confirmPassword: '' },
  })

  const onSubmit = handleSubmit(async ({ password: pwd }) => {
    setFormError(null)
    setSuccessMessage(null)

    const { error } = await updatePassword(pwd)
    if (error) {
      setFormError(error)
      return
    }

    setSuccessMessage('Password updated. Redirecting to your dashboard…')
    window.setTimeout(() => {
      navigate(paths.dashboard, { replace: true })
    }, 1200)
  })

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-surface-50 dark:bg-surface-950">
        <Spinner className="h-8 w-8" />
      </div>
    )
  }

  if (!isAuthenticated) {
    return (
      <AuthLayout
        title="Link expired or invalid"
        description="Request a new password reset link to continue."
        footer={
          <Link
            to={paths.forgotPassword}
            className="font-medium text-brand-600 hover:underline dark:text-brand-400"
          >
            Request another link
          </Link>
        }
      >
        <Alert>
          This reset link is invalid or has expired. Please try again.
        </Alert>
      </AuthLayout>
    )
  }

  return (
    <AuthLayout
      title="Choose a new password"
      description="Enter a strong password for your account."
      footer={
        <Link
          to={paths.login}
          className="font-medium text-brand-600 hover:underline dark:text-brand-400"
        >
          Back to sign in
        </Link>
      }
    >
      <form className="space-y-4" onSubmit={onSubmit} noValidate>
        {formError ? <Alert>{formError}</Alert> : null}
        {successMessage ? <Alert variant="success">{successMessage}</Alert> : null}

        <Input
          label="New password"
          type="password"
          autoComplete="new-password"
          placeholder="••••••••"
          error={errors.password?.message}
          {...register('password', {
            required: 'Password is required',
            minLength: {
              value: 8,
              message: 'Password must be at least 8 characters',
            },
          })}
        />

        <Input
          label="Confirm password"
          type="password"
          autoComplete="new-password"
          placeholder="••••••••"
          error={errors.confirmPassword?.message}
          {...register('confirmPassword', {
            required: 'Please confirm your password',
            validate: (value, values) =>
              value === values.password || 'Passwords do not match',
          })}
        />

        <Button type="submit" className="w-full" disabled={isSubmitting}>
          {isSubmitting ? <Spinner className="h-4 w-4 border-white/30 border-t-white" /> : null}
          {isSubmitting ? 'Updating…' : 'Update password'}
        </Button>
      </form>
    </AuthLayout>
  )
}
