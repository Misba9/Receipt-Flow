import {
  forwardRef,
  useId,
  useState,
  type InputHTMLAttributes,
} from 'react'
import { Eye, EyeOff } from 'lucide-react'
import { cn } from '@/utils'

type PasswordInputProps = Omit<InputHTMLAttributes<HTMLInputElement>, 'type'> & {
  label?: string
  error?: string
}

export const PasswordInput = forwardRef<HTMLInputElement, PasswordInputProps>(
  ({ label, error, className, id, disabled, ...props }, ref) => {
    const generatedId = useId()
    const inputId = id ?? props.name ?? generatedId
    const errorId = `${inputId}-error`
    const [visible, setVisible] = useState(false)

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
            type={visible ? 'text' : 'password'}
            disabled={disabled}
            aria-invalid={error ? true : undefined}
            aria-describedby={error ? errorId : undefined}
            className={cn(
              'h-11 w-full rounded-xl border border-surface-200 bg-white py-2.5 pl-3.5 pr-11 text-sm',
              'text-surface-900 placeholder:text-surface-400',
              'transition-[border-color,box-shadow] duration-200',
              'focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/20',
              'dark:border-surface-700 dark:bg-surface-900 dark:text-surface-50',
              'dark:placeholder:text-surface-500 dark:focus:border-brand-400',
              'disabled:cursor-not-allowed disabled:opacity-60',
              error && 'border-red-500 focus:border-red-500 focus:ring-red-500/20',
              className,
            )}
            {...props}
          />
          <button
            type="button"
            tabIndex={0}
            disabled={disabled}
            aria-label={visible ? 'Hide password' : 'Show password'}
            aria-pressed={visible}
            onClick={() => setVisible((value) => !value)}
            className={cn(
              'absolute right-1.5 top-1/2 flex h-8 w-8 -translate-y-1/2 items-center justify-center',
              'rounded-lg text-surface-400 transition-colors duration-200',
              'hover:bg-surface-100 hover:text-surface-700',
              'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500/40',
              'dark:hover:bg-surface-800 dark:hover:text-surface-200',
              'disabled:pointer-events-none disabled:opacity-50',
            )}
          >
            {visible ? (
              <EyeOff className="h-4 w-4" aria-hidden />
            ) : (
              <Eye className="h-4 w-4" aria-hidden />
            )}
          </button>
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
      </div>
    )
  },
)

PasswordInput.displayName = 'PasswordInput'
