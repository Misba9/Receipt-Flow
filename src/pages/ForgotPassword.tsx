import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { AuthLayout } from '@/layouts/AuthLayout'
import { Alert, Button, Input, Spinner } from '@/components/ui'
import { useAuth } from '@/hooks/useAuth'
import { paths } from '@/lib/paths'

type ForgotPasswordFormValues = {
  email: string
}

export function ForgotPassword() {
  const { resetPassword } = useAuth()
  const [formError, setFormError] = useState<string | null>(null)
  const [successMessage, setSuccessMessage] = useState<string | null>(null)

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ForgotPasswordFormValues>({
    defaultValues: { email: '' },
    mode: 'onBlur',
  })

  const onSubmit = handleSubmit(async ({ email }) => {
    setFormError(null)
    setSuccessMessage(null)

    const { error } = await resetPassword(email.trim())
    if (error) {
      setFormError(error)
      return
    }

    setSuccessMessage(
      'If an account exists for that email, a reset link has been sent. Check your inbox.',
    )
  })

  return (
    <AuthLayout
      title="Reset your password"
      description="We'll email you a link to choose a new password."
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

        <Button
          type="submit"
          className="w-full"
          size="lg"
          disabled={isSubmitting}
          aria-busy={isSubmitting}
        >
          {isSubmitting ? (
            <Spinner className="h-4 w-4 border-white/30 border-t-white" />
          ) : null}
          {isSubmitting ? 'Sending…' : 'Send reset link'}
        </Button>
      </form>
    </AuthLayout>
  )
}
