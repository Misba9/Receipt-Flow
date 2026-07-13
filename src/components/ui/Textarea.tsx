import { forwardRef, useId, type TextareaHTMLAttributes } from 'react'
import { CheckCircle2, CircleAlert } from 'lucide-react'
import { LOOKS_GOOD } from '@/validation/common'
import { cn } from '@/utils'

type TextareaProps = TextareaHTMLAttributes<HTMLTextAreaElement> & {
  label?: string
  error?: string
  hint?: string
  success?: boolean
  successMessage?: string
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
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
    const textareaId = id ?? props.name ?? generatedId
    const errorId = `${textareaId}-error`
    const hintId = `${textareaId}-hint`
    const successId = `${textareaId}-success`
    const showSuccess = Boolean(success && !error)

    return (
      <div className="flex w-full flex-col gap-1.5">
        {label ? (
          <label
            htmlFor={textareaId}
            className="text-sm font-medium text-surface-700 dark:text-surface-200"
          >
            {label}
          </label>
        ) : null}
        <div className="relative">
          <textarea
            ref={ref}
            id={textareaId}
            aria-invalid={error ? true : undefined}
            aria-describedby={
              error ? errorId : showSuccess ? successId : hint ? hintId : undefined
            }
            className={cn(
              'min-h-24 w-full rounded-xl border border-surface-200 bg-white px-3.5 py-2.5 text-sm',
              'text-surface-900 placeholder:text-surface-400',
              'transition-[border-color,box-shadow] duration-200',
              'focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/20',
              'dark:border-surface-700 dark:bg-surface-900 dark:text-surface-50',
              'dark:placeholder:text-surface-500 dark:focus:border-brand-400',
              'disabled:cursor-not-allowed disabled:opacity-60',
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
              className="pointer-events-none absolute right-3 top-3 h-4 w-4 text-red-500"
              aria-hidden
            />
          ) : showSuccess ? (
            <CheckCircle2
              className="pointer-events-none absolute right-3 top-3 h-4 w-4 text-emerald-500"
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

Textarea.displayName = 'Textarea'
