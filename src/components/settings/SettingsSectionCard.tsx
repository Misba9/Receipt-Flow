import type { ReactNode } from 'react'
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/Card'
import { cn } from '@/utils'

type SettingsSectionCardProps = {
  title: string
  description?: string
  action?: ReactNode
  children: ReactNode
  className?: string
  bodyClassName?: string
}

/** Shared Settings card shell — 16px radius, 32px padding. */
export function SettingsSectionCard({
  title,
  description,
  action,
  children,
  className,
  bodyClassName,
}: SettingsSectionCardProps) {
  return (
    <Card className={cn('p-6 sm:p-8', className)}>
      <CardHeader className="mb-6 items-start">
        <div className="min-w-0 space-y-1">
          <CardTitle className="text-lg tracking-tight">{title}</CardTitle>
          {description ? (
            <CardDescription>{description}</CardDescription>
          ) : null}
        </div>
        {action ? <div className="shrink-0">{action}</div> : null}
      </CardHeader>
      <div className={cn(bodyClassName)}>{children}</div>
    </Card>
  )
}
