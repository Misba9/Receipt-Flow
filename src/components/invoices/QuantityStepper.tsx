import { Minus, Plus } from 'lucide-react'
import { cn } from '@/utils'

type QuantityStepperProps = {
  label?: string
  value: number
  min?: number
  disabled?: boolean
  error?: string
  onChange: (value: number) => void
  className?: string
}

/** Whole-number quantity control with large +/- buttons (1, 2, 3, …). */
export function QuantityStepper({
  label = 'Qty',
  value,
  min = 1,
  disabled = false,
  error,
  onChange,
  className,
}: QuantityStepperProps) {
  const qty = Number.isFinite(value) ? Math.max(min, Math.floor(value)) : min

  const setQty = (next: number) => {
    const whole = Math.floor(next)
    onChange(Number.isFinite(whole) && whole >= min ? whole : min)
  }

  return (
    <div className={cn('flex w-full flex-col gap-1.5', className)}>
      {label ? (
        <span className="text-sm font-medium text-surface-700 dark:text-surface-200">
          {label}
        </span>
      ) : null}

      <div
        className={cn(
          'flex h-11 items-stretch overflow-hidden rounded-xl border bg-white',
          'dark:bg-surface-900',
          error
            ? 'border-red-500'
            : 'border-surface-200 dark:border-surface-700',
          disabled && 'opacity-60',
        )}
      >
        <button
          type="button"
          disabled={disabled || qty <= min}
          onClick={() => setQty(qty - 1)}
          className={cn(
            'flex w-12 shrink-0 items-center justify-center border-r border-surface-200',
            'text-surface-700 transition-colors hover:bg-surface-100',
            'disabled:cursor-not-allowed disabled:opacity-40',
            'dark:border-surface-700 dark:text-surface-200 dark:hover:bg-surface-800',
          )}
          aria-label="Decrease quantity"
        >
          <Minus className="h-5 w-5" strokeWidth={2.5} />
        </button>

        <input
          type="text"
          inputMode="numeric"
          pattern="[0-9]*"
          disabled={disabled}
          value={String(qty)}
          onChange={(event) => {
            const digits = event.target.value.replace(/\D/g, '')
            if (digits === '') {
              setQty(min)
              return
            }
            setQty(Number(digits))
          }}
          onBlur={() => setQty(qty)}
          className={cn(
            'min-w-0 flex-1 bg-transparent text-center text-base font-semibold tabular-nums',
            'text-surface-900 outline-none dark:text-surface-50',
            'disabled:cursor-not-allowed',
          )}
          aria-label={label}
          aria-invalid={error ? true : undefined}
        />

        <button
          type="button"
          disabled={disabled}
          onClick={() => setQty(qty + 1)}
          className={cn(
            'flex w-12 shrink-0 items-center justify-center border-l border-surface-200',
            'text-surface-700 transition-colors hover:bg-surface-100',
            'disabled:cursor-not-allowed disabled:opacity-40',
            'dark:border-surface-700 dark:text-surface-200 dark:hover:bg-surface-800',
          )}
          aria-label="Increase quantity"
        >
          <Plus className="h-5 w-5" strokeWidth={2.5} />
        </button>
      </div>

      {error ? (
        <p role="alert" className="text-xs text-red-600 dark:text-red-400">
          {error}
        </p>
      ) : null}
    </div>
  )
}
