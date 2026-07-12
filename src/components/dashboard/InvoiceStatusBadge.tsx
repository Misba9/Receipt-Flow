import { Badge } from '@/components/ui/Badge'
import type { BadgeVariant } from '@/components/ui/Badge'
import type { InvoiceStatus } from '@/services/invoices/types'

const statusConfig: Record<
  InvoiceStatus,
  { label: string; variant: BadgeVariant }
> = {
  draft: { label: 'Draft', variant: 'default' },
  sent: { label: 'Sent', variant: 'info' },
  paid: { label: 'Paid', variant: 'success' },
  partially_paid: { label: 'Partially Paid', variant: 'warning' },
  overdue: { label: 'Overdue', variant: 'danger' },
  cancelled: { label: 'Cancelled', variant: 'default' },
  void: { label: 'Void', variant: 'warning' },
}

export function InvoiceStatusBadge({ status }: { status: InvoiceStatus }) {
  const config = statusConfig[status] ?? statusConfig.draft
  return <Badge variant={config.variant}>{config.label}</Badge>
}
