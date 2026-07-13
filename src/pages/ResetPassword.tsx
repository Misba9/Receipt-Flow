import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { AuthLayout } from '@/layouts/AuthLayout'
import { Alert, Button, PasswordInput, Spinner } from '@/components/ui'
import { useAuth } from '@/hooks/useAuth'
import { showFieldSuccess } from '@/lib/formFeedback'
import { toFriendlyError } from '@/lib/friendlyError'
import { paths } from '@/lib/paths'
import {
  resetPasswordSchema,
  type ResetPasswordSchema,
} from '@/validation/auth.schema'

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
    watch,
    trigger,
    formState: { errors, isSubmitting, isValid, dirtyFields, touchedFields },
  } = useForm<ResetPasswordSchema>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: { password: '', confirmPassword: '' },
    mode: 'onChange',
  })

  useEffect(() => {
    void trigger()
  }, [trigger])

  const password = watch('password')
  const confirmPassword = watch('confirmPassword')

  const onSubmit = handleSubmit(async ({ password: pwd }) => {
    setFormError(null)
    setSuccessMessage(null)

    const { error } = await updatePassword(pwd)
    if (error) {
      setFormError(
        toFriendlyError(error, 'Unable to update password. Please try again.'),
      )
      return
    }

    setSuccessMessage('Password updated. Redirecting to your dashboard…')
    window.setTimeout(() => {
      navigate(paths.dashboard, { replace: true })
    }, 1200)
  })

  if (isLoading) {
    return (
      <div className="flex min-h-dvh items-center justify-center bg-surface-50 dark:bg-surface-950">
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
            className="font-medium text-brand-600 transition-colors hover:text-brand-700 hover:underline dark:text-brand-400"
          >
            Request another link
          </Link>
        }
      >
        <Alert role="alert">
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
          className="font-medium text-brand-600 transition-colors hover:text-brand-700 hover:underline dark:text-brand-400"
        >
          Back to sign in
        </Link>
      }
    >
      <form className="space-y-5" onSubmit={onSubmit} noValidate>
        {formError ? <Alert role="alert">{formError}</Alert> : null}
        {successMessage ? (
          <Alert variant="success" role="status">
            {successMessage}
          </Alert>
        ) : null}

        <PasswordInput
          label="New password"
          autoComplete="new-password"
          placeholder="At least 8 characters"
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

        <PasswordInput
          label="Confirm password"
          autoComplete="new-password"
          placeholder="Re-enter your password"
          disabled={isSubmitting}
          error={errors.confirmPassword?.message}
          success={showFieldSuccess({
            dirty: dirtyFields.confirmPassword,
            touched: touchedFields.confirmPassword,
            invalid: Boolean(errors.confirmPassword),
            value: confirmPassword,
          })}
          {...register('confirmPassword')}
        />

        <Button
          type="submit"
          className="w-full"
          size="lg"
          disabled={!isValid || isSubmitting}
          aria-busy={isSubmitting}
        >
          {isSubmitting ? (
            <Spinner className="h-4 w-4 border-white/30 border-t-white" />
          ) : null}
          {isSubmitting ? 'Updating…' : 'Update password'}
        </Button>
      </form>
    </AuthLayout>
  )
}
