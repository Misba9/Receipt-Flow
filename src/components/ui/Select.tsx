import { forwardRef, useId, type SelectHTMLAttributes } from 'react'
import { CheckCircle2, CircleAlert } from 'lucide-react'
import { LOOKS_GOOD } from '@/validation/common'
import { cn } from '@/utils'

type SelectProps = SelectHTMLAttributes<HTMLSelectElement> & {
  label?: string
  error?: string
  hint?: string
  success?: boolean
  successMessage?: string
  options: Array<{ value: string; label: string }>
  placeholder?: string
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  (
    {
      label,
      error,
      hint,
      success = false,
      successMessage = LOOKS_GOOD,
      options,
      placeholder,
      className,
      id,
      ...props
    },
    ref,
  ) => {
    const generatedId = useId()
    const selectId = id ?? props.name ?? generatedId
    const errorId = `${selectId}-error`
    const hintId = `${selectId}-hint`
    const successId = `${selectId}-success`
    const showSuccess = Boolean(success && !error)

    return (
      <div className="flex w-full flex-col gap-1.5">
        {label ? (
          <label
            htmlFor={selectId}
            className="text-sm font-medium text-surface-700 dark:text-surface-200"
          >
            {label}
          </label>
        ) : null}
        <div className="relative">
          <select
            ref={ref}
            id={selectId}
            aria-invalid={error ? true : undefined}
            aria-describedby={
              error ? errorId : showSuccess ? successId : hint ? hintId : undefined
            }
            className={cn(
              'h-11 w-full rounded-xl border border-surface-200 bg-white px-3.5 text-sm',
              'text-surface-900 transition-[border-color,box-shadow] duration-200',
              'focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/20',
              'dark:border-surface-700 dark:bg-surface-900 dark:text-surface-50',
              'disabled:cursor-not-allowed disabled:opacity-60',
              (error || showSuccess) && 'pr-10',
              error &&
                'border-red-500 focus:border-red-500 focus:ring-red-500/20',
              showSuccess &&
                'border-emerald-500 focus:border-emerald-500 focus:ring-emerald-500/20',
              className,
            )}
            {...props}
          >
            {placeholder ? (
              <option value="" disabled>
                {placeholder}
              </option>
            ) : null}
            {options.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
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

Select.displayName = 'Select'
