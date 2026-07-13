import { forwardRef, useId, type InputHTMLAttributes } from 'react'
import { CheckCircle2, CircleAlert } from 'lucide-react'
import { LOOKS_GOOD } from '@/validation/common'
import { cn } from '@/utils'

type InputProps = InputHTMLAttributes<HTMLInputElement> & {
  label?: string
  error?: string
  hint?: string
  /** Show green success affordance when the field is valid after interaction. */
  success?: boolean
  successMessage?: string
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  (
    {
      label,
      error,
      hint,
      success = false,
      successMessage = LOOKS_GOOD,
      className,
      id,
      ...props
    },
    ref,
  ) => {
    const generatedId = useId()
    const inputId = id ?? props.name ?? generatedId
    const errorId = `${inputId}-error`
    const hintId = `${inputId}-hint`
    const successId = `${inputId}-success`
    const showSuccess = Boolean(success && !error)

    return (
      <div className="flex w-full flex-col gap-1.5">
        {label ? (
          <label
            htmlFor={inputId}
            className="text-sm font-medium text-surface-700 dark:text-surface-200"
          >
            {label}
          </label>
        ) : null}
        <div className="relative">
          <input
            ref={ref}
            id={inputId}
            aria-invalid={error ? true : undefined}
            aria-describedby={
              error ? errorId : showSuccess ? successId : hint ? hintId : undefined
            }
            className={cn(
              'h-11 w-full rounded-xl border border-surface-200 bg-white px-3.5 text-sm',
              'text-surface-900 placeholder:text-surface-400',
              'transition-[border-color,box-shadow] duration-200',
              'focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/20',
              'dark:border-surface-700 dark:bg-surface-900 dark:text-surface-50',
              'dark:placeholder:text-surface-500 dark:focus:border-brand-400',
              'disabled:cursor-not-allowed disabled:opacity-60',
              (error || showSuccess) && 'pr-10',
              error &&
                'border-red-500 focus:border-red-500 focus:ring-red-500/20',
              showSuccess &&
                'border-emerald-500 focus:border-emerald-500 focus:ring-emerald-500/20',
              className,
            )}
            {...props}
          />
          {error ? (
            <CircleAlert
              className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-red-500"
              aria-hidden
            />
          ) : showSuccess ? (
            <CheckCircle2
              className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-emerald-500"
              aria-hidden
            />
          ) : null}
        </div>
        {error ? (
          <p
            id={errorId}
            role="alert"
            className="text-xs text-red-600 dark:text-red-400"
          >
            {error}
          </p>
        ) : null}
        {!error && showSuccess ? (
          <p
            id={successId}
            className="text-xs text-emerald-600 dark:text-emerald-400"
          >
            {successMessage}
          </p>
        ) : null}
        {!error && !showSuccess && hint ? (
          <p id={hintId} className="text-xs text-surface-500">
            {hint}
          </p>
        ) : null}
      </div>
    )
  },
)

Input.displayName = 'Input'
