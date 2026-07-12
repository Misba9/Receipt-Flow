import type { HTMLAttributes, ReactNode } from 'react'
import { cn } from '@/utils'

type AlertProps = {
  variant?: 'error' | 'success' | 'info'
  children: ReactNode
  className?: string
  role?: HTMLAttributes<HTMLDivElement>['role']
}

const variantStyles = {
  error:
    'border-red-200 bg-red-50 text-red-800 dark:border-red-900 dark:bg-red-950/50 dark:text-red-200',
  success:
    'border-emerald-200 bg-emerald-50 text-emerald-800 dark:border-emerald-900 dark:bg-emerald-950/50 dark:text-emerald-200',
  info: 'border-brand-200 bg-brand-50 text-brand-800 dark:border-brand-900 dark:bg-brand-950/50 dark:text-brand-200',
}

export function Alert({
  variant = 'error',
  children,
  className,
  role = 'alert',
}: AlertProps) {
  return (
    <div
      role={role}
      className={cn(
        'rounded-xl border px-3.5 py-2.5 text-sm leading-relaxed',
        variantStyles[variant],
        className,
      )}
    >
      {children}
    </div>
  )
}
