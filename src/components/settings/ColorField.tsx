import { forwardRef } from 'react'
import { cn } from '@/utils'

type ColorFieldProps = {
  label?: string
  error?: string
  value: string
  disabled?: boolean
  onChange: (value: string) => void
  className?: string
}

export const ColorField = forwardRef<HTMLInputElement, ColorFieldProps>(
  function ColorField(
    { label, error, value, disabled, onChange, className },
    ref,
  ) {
    return (
      <div className={cn('flex w-full flex-col gap-1.5', className)}>
        {label ? (
          <span className="text-sm font-medium text-surface-700 dark:text-surface-200">
            {label}
          </span>
        ) : null}

        <div className="flex items-center gap-3">
          <label
            className={cn(
              'relative h-10 w-14 shrink-0 overflow-hidden rounded-lg border border-surface-200 dark:border-surface-700',
              disabled && 'opacity-50',
            )}
          >
            <input
              ref={ref}
              type="color"
              value={value}
              disabled={disabled}
              onChange={(event) => onChange(event.target.value)}
              className="absolute inset-0 h-[150%] w-[150%] -translate-x-1/4 -translate-y-1/4 cursor-pointer disabled:cursor-not-allowed"
              aria-label={label ?? 'Primary color'}
            />
          </label>

          <input
            type="text"
            value={value}
            disabled={disabled}
            onChange={(event) => onChange(event.target.value)}
            placeholder="#1a73f5"
            spellCheck={false}
            className={cn(
              'h-10 w-full max-w-[10rem] rounded-lg border border-surface-200 bg-white px-3 font-mono text-sm uppercase',
              'text-surface-900 placeholder:text-surface-400',
              'focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/20',
              'dark:border-surface-700 dark:bg-surface-900 dark:text-surface-50',
              'disabled:cursor-not-allowed disabled:opacity-60',
              error && 'border-red-500 focus:border-red-500 focus:ring-red-500/20',
            )}
          />

          <div
            className="hidden h-10 flex-1 items-center rounded-lg border border-surface-200 px-3 text-xs text-surface-500 sm:flex dark:border-surface-700 dark:text-surface-400"
            style={{
              background: `linear-gradient(90deg, ${value}22, transparent)`,
              borderLeftColor: value,
              borderLeftWidth: 4,
            }}
          >
            Invoice accents & branding
          </div>
        </div>

        {error ? (
          <p className="text-xs text-red-600 dark:text-red-400">{error}</p>
        ) : null}
      </div>
    )
  },
)
