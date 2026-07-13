import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { AuthLayout } from '@/layouts/AuthLayout'
import { Alert, Button, Input, Spinner } from '@/components/ui'
import { useAuth } from '@/hooks/useAuth'
import { showFieldSuccess } from '@/lib/formFeedback'
import { toFriendlyError } from '@/lib/friendlyError'
import { paths } from '@/lib/paths'
import {
  forgotPasswordSchema,
  type ForgotPasswordSchema,
} from '@/validation/auth.schema'

export function ForgotPassword() {
  const { resetPassword } = useAuth()
  const [formError, setFormError] = useState<string | null>(null)
  const [successMessage, setSuccessMessage] = useState<string | null>(null)

  const {
    register,
    handleSubmit,
    watch,
    trigger,
    formState: { errors, isSubmitting, isValid, dirtyFields, touchedFields },
  } = useForm<ForgotPasswordSchema>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: { email: '' },
    mode: 'onChange',
  })

  useEffect(() => {
    void trigger()
  }, [trigger])

  const email = watch('email')

  const onSubmit = handleSubmit(async ({ email }) => {
    setFormError(null)
    setSuccessMessage(null)

    const { error } = await resetPassword(email.trim())
    if (error) {
      setFormError(
        toFriendlyError(error, 'Unable to send reset link. Please try again.'),
      )
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
          success={showFieldSuccess({
            dirty: dirtyFields.email,
            touched: touchedFields.email,
            invalid: Boolean(errors.email),
            value: email,
          })}
          {...register('email')}
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
          {isSubmitting ? 'Sending…' : 'Send reset link'}
        </Button>
      </form>
    </AuthLayout>
  )
}
