import type { ReactNode } from 'react'
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/Card'
import { Skeleton } from '@/components/ui/Skeleton'
import { cn } from '@/utils'

type ChartCardProps = {
  title: string
  description?: string
  loading?: boolean
  empty?: boolean
  emptyMessage?: string
  className?: string
  children: ReactNode
  action?: ReactNode
}

export function ChartCard({
  title,
  description,
  loading = false,
  empty = false,
  emptyMessage = 'No data for this period.',
  className,
  children,
  action,
}: ChartCardProps) {
  return (
    <Card className={cn('flex flex-col p-0', className)}>
      <CardHeader className="mb-0 border-b border-surface-100 px-5 py-4 dark:border-surface-800">
        <div>
          <CardTitle>{title}</CardTitle>
          {description ? (
            <CardDescription className="mt-0.5">{description}</CardDescription>
          ) : null}
        </div>
        {action}
      </CardHeader>
      <div className="flex-1 px-2 pt-4 pb-3 sm:px-4">
        {loading ? (
          <Skeleton className="h-64 w-full rounded-lg" />
        ) : empty ? (
          <div className="flex h-64 items-center justify-center px-4 text-center text-sm text-surface-500">
            {emptyMessage}
          </div>
        ) : (
          <div className="h-64 w-full min-w-0">{children}</div>
        )}
      </div>
    </Card>
  )
}
