import type { HTMLAttributes, ReactNode } from 'react'
import { cn } from '@/utils'

type CardProps = HTMLAttributes<HTMLDivElement> & {
  children: ReactNode
}

export function Card({ children, className, ...props }: CardProps) {
  return (
    <div
      className={cn(
        'rounded-2xl border border-surface-200 bg-white p-5 shadow-sm',
        'dark:border-surface-800 dark:bg-surface-900',
        className,
      )}
      {...props}
    >
      {children}
    </div>
  )
}

export function CardHeader({
  children,
  className,
}: {
  children: ReactNode
  className?: string
}) {
  return (
    <div className={cn('mb-4 flex items-start justify-between gap-3', className)}>
      {children}
    </div>
  )
}

export function CardTitle({
  children,
  className,
}: {
  children: ReactNode
  className?: string
}) {
  return (
    <h3
      className={cn(
        'text-base font-semibold text-surface-900 dark:text-surface-50',
        className,
      )}
    >
      {children}
    </h3>
  )
}

export function CardDescription({
  children,
  className,
}: {
  children: ReactNode
  className?: string
}) {
  return (
    <p className={cn('text-sm text-surface-500 dark:text-surface-400', className)}>
      {children}
    </p>
  )
}
