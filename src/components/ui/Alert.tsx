import type { ReactNode } from 'react'
import { cn } from '@/utils'

type AlertProps = {
  variant?: 'error' | 'success' | 'info'
  children: ReactNode
  className?: string
}

const variantStyles = {
  error:
    'border-red-200 bg-red-50 text-red-800 dark:border-red-900 dark:bg-red-950/50 dark:text-red-200',
  success:
    'border-emerald-200 bg-emerald-50 text-emerald-800 dark:border-emerald-900 dark:bg-emerald-950/50 dark:text-emerald-200',
  info: 'border-brand-200 bg-brand-50 text-brand-800 dark:border-brand-900 dark:bg-brand-950/50 dark:text-brand-200',
}

export function Alert({ variant = 'error', children, className }: AlertProps) {
  return (
    <div
      role="alert"
      className={cn(
        'rounded-lg border px-3 py-2 text-sm',
        variantStyles[variant],
        className,
      )}
    >
      {children}
    </div>
  )
}
