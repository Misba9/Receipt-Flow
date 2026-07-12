import type { ReactNode } from 'react'
import { Link } from 'react-router-dom'
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/Card'
import { cn } from '@/utils'

type SectionCardProps = {
  title: string
  description?: string
  actionLabel?: string
  actionTo?: string
  children: ReactNode
  className?: string
}

export function SectionCard({
  title,
  description,
  actionLabel,
  actionTo,
  children,
  className,
}: SectionCardProps) {
  return (
    <Card className={cn('flex flex-col p-0', className)}>
      <CardHeader className="mb-0 border-b border-surface-100 px-5 py-4 dark:border-surface-800">
        <div>
          <CardTitle>{title}</CardTitle>
          {description ? (
            <CardDescription className="mt-0.5">{description}</CardDescription>
          ) : null}
        </div>
        {actionLabel && actionTo ? (
          <Link
            to={actionTo}
            className="text-sm font-medium text-brand-600 hover:text-brand-700 dark:text-brand-400 dark:hover:text-brand-300"
          >
            {actionLabel}
          </Link>
        ) : null}
      </CardHeader>
      <div className="flex-1">{children}</div>
    </Card>
  )
}
