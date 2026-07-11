import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { AuthLayout } from '@/components/layout/AuthLayout'
import { Alert, Button, Input, Spinner } from '@/components/ui'
import { useAuth } from '@/hooks/useAuth'
import { paths } from '@/routes/paths'

type RegisterFormValues = {
  fullName: string
  email: string
  password: string
  confirmPassword: string
}

export function Register() {
  const { signUp } = useAuth()
  const navigate = useNavigate()
  const [formError, setFormError] = useState<string | null>(null)
  const [successMessage, setSuccessMessage] = useState<string | null>(null)

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RegisterFormValues>({
    defaultValues: {
      fullName: '',
      email: '',
      password: '',
      confirmPassword: '',
    },
  })

  const onSubmit = handleSubmit(async ({ fullName, email, password: pwd }) => {
    setFormError(null)
    setSuccessMessage(null)

    const { error, needsEmailConfirmation } = await signUp(
      email.trim(),
      pwd,
      fullName.trim() || undefined,
    )

    if (error) {
      setFormError(error)
      return
    }

    if (needsEmailConfirmation) {
      setSuccessMessage(
        'Account created. Check your email to confirm your address, then sign in.',
      )
      return
    }

    navigate(paths.dashboard, { replace: true })
  })

  return (
    <AuthLayout
      title="Create your account"
      description="Start organizing receipts in minutes."
      footer={
        <>
          Already have an account?{' '}
          <Link
            to={paths.login}
            className="font-medium text-brand-600 hover:underline dark:text-brand-400"
          >
            Sign in
          </Link>
        </>
      }
    >
      <form className="space-y-4" onSubmit={onSubmit} noValidate>
        {formError ? <Alert>{formError}</Alert> : null}
        {successMessage ? <Alert variant="success">{successMessage}</Alert> : null}

        <Input
          label="Full name"
          type="text"
          autoComplete="name"
          placeholder="Alex Rivera"
          error={errors.fullName?.message}
          {...register('fullName', {
            maxLength: { value: 100, message: 'Name is too long' },
          })}
        />

        <Input
          label="Email"
          type="email"
          autoComplete="email"
          placeholder="you@example.com"
          error={errors.email?.message}
          {...register('email', {
            required: 'Email is required',
            pattern: {
              value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
              message: 'Enter a valid email address',
            },
          })}
        />

        <Input
          label="Password"
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
          {isSubmitting ? 'Creating account…' : 'Create account'}
        </Button>
      </form>
    </AuthLayout>
  )
}
