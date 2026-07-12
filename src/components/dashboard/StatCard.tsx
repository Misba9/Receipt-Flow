import type { LucideIcon } from 'lucide-react'
import { Card } from '@/components/ui/Card'
import { Skeleton } from '@/components/ui/Skeleton'
import { cn } from '@/utils'

type StatCardProps = {
  title: string
  value: string
  description?: string
  icon: LucideIcon
  trend?: {
    value: string
    positive?: boolean
  }
  loading?: boolean
  className?: string
  iconClassName?: string
}

export function StatCard({
  title,
  value,
  description,
  icon: Icon,
  trend,
  loading = false,
  className,
  iconClassName,
}: StatCardProps) {
  return (
    <Card
      className={cn(
        'relative overflow-hidden transition-shadow hover:shadow-md',
        className,
      )}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0 space-y-3">
          <p className="text-sm font-medium text-surface-500 dark:text-surface-400">
            {title}
          </p>
          {loading ? (
            <Skeleton className="h-9 w-28" />
          ) : (
            <p className="truncate text-3xl font-semibold tracking-tight text-surface-900 dark:text-surface-50">
              {value}
            </p>
          )}
          {loading ? (
            <Skeleton className="h-4 w-24" />
          ) : trend || description ? (
            <div className="flex flex-wrap items-center gap-2 text-xs">
              {trend ? (
                <span
                  className={cn(
                    'font-medium',
                    trend.positive === false
                      ? 'text-red-600 dark:text-red-400'
                      : 'text-emerald-600 dark:text-emerald-400',
                  )}
                >
                  {trend.value}
                </span>
              ) : null}
              {description ? (
                <span className="text-surface-500 dark:text-surface-400">
                  {description}
                </span>
              ) : null}
            </div>
          ) : null}
        </div>

        <div
          className={cn(
            'flex h-11 w-11 shrink-0 items-center justify-center rounded-xl',
            'bg-brand-50 text-brand-600 dark:bg-brand-950 dark:text-brand-300',
            iconClassName,
          )}
        >
          <Icon className="h-5 w-5" aria-hidden />
        </div>
      </div>
    </Card>
  )
}
