import type { SubscriptionStatus } from '@/services/admin/types'
import { Badge, type BadgeVariant } from '@/components/ui/Badge'

const labels: Record<SubscriptionStatus, string> = {
  trial: 'Trial',
  active: 'Active',
  past_due: 'Past due',
  canceled: 'Canceled',
  none: 'None',
}

const variants: Record<SubscriptionStatus, BadgeVariant> = {
  trial: 'info',
  active: 'success',
  past_due: 'warning',
  canceled: 'default',
  none: 'default',
}

export function SubscriptionBadge({ status }: { status: SubscriptionStatus }) {
  return <Badge variant={variants[status] ?? 'default'}>{labels[status] ?? status}</Badge>
}
