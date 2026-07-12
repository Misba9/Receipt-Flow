import { forwardRef, useId, type SelectHTMLAttributes } from 'react'
import { cn } from '@/utils'

type SelectProps = SelectHTMLAttributes<HTMLSelectElement> & {
  label?: string
  error?: string
  options: Array<{ value: string; label: string }>
  placeholder?: string
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ label, error, options, placeholder, className, id, ...props }, ref) => {
    const generatedId = useId()
    const selectId = id ?? props.name ?? generatedId
    const errorId = `${selectId}-error`

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
        <select
          ref={ref}
          id={selectId}
          aria-invalid={error ? true : undefined}
          aria-describedby={error ? errorId : undefined}
          className={cn(
            'h-11 w-full rounded-xl border border-surface-200 bg-white px-3.5 text-sm',
            'text-surface-900 transition-[border-color,box-shadow] duration-200',
            'focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/20',
            'dark:border-surface-700 dark:bg-surface-900 dark:text-surface-50',
            'disabled:cursor-not-allowed disabled:opacity-60',
            error && 'border-red-500 focus:border-red-500 focus:ring-red-500/20',
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
          <p
            id={errorId}
            role="alert"
            className="text-xs text-red-600 dark:text-red-400"
          >
            {error}
          </p>
        ) : null}
      </div>
    )
  },
)

Select.displayName = 'Select'
