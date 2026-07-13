import {
  forwardRef,
  useId,
  useState,
  type InputHTMLAttributes,
} from 'react'
import { CheckCircle2, CircleAlert, Eye, EyeOff } from 'lucide-react'
import { LOOKS_GOOD } from '@/validation/common'
import { cn } from '@/utils'

type PasswordInputProps = Omit<InputHTMLAttributes<HTMLInputElement>, 'type'> & {
  label?: string
  error?: string
  success?: boolean
  successMessage?: string
}

export const PasswordInput = forwardRef<HTMLInputElement, PasswordInputProps>(
  (
    {
      label,
      error,
      success = false,
      successMessage = LOOKS_GOOD,
      className,
      id,
      disabled,
      ...props
    },
    ref,
  ) => {
    const generatedId = useId()
    const inputId = id ?? props.name ?? generatedId
    const errorId = `${inputId}-error`
    const successId = `${inputId}-success`
    const [visible, setVisible] = useState(false)
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
            type={visible ? 'text' : 'password'}
            disabled={disabled}
            aria-invalid={error ? true : undefined}
            aria-describedby={
              error ? errorId : showSuccess ? successId : undefined
            }
            className={cn(
              'h-11 w-full rounded-xl border border-surface-200 bg-white py-2.5 pl-3.5 pr-20 text-sm',
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
          <div className="absolute right-1.5 top-1/2 flex -translate-y-1/2 items-center gap-0.5">
            {error ? (
              <CircleAlert className="h-4 w-4 text-red-500" aria-hidden />
            ) : showSuccess ? (
              <CheckCircle2 className="h-4 w-4 text-emerald-500" aria-hidden />
            ) : null}
            <button
              type="button"
              tabIndex={0}
              disabled={disabled}
              aria-label={visible ? 'Hide password' : 'Show password'}
              aria-pressed={visible}
              onClick={() => setVisible((value) => !value)}
              className={cn(
                'flex h-8 w-8 items-center justify-center',
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
      </div>
    )
  },
)

PasswordInput.displayName = 'PasswordInput'
