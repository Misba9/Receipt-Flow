import { cn } from '@/utils'

export function Spinner({ className }: { className?: string }) {
  return (
    <div
      role="status"
      aria-label="Loading"
      className={cn(
        'h-5 w-5 animate-spin rounded-full border-2 border-surface-200 border-t-brand-600',
        'dark:border-surface-700 dark:border-t-brand-400',
        className,
      )}
    />
  )
}
