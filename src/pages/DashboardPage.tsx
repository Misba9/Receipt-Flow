import { Plus, Receipt } from 'lucide-react'
import { PageHeader } from '@/components/layout/PageHeader'
import { Badge, Button, Card, CardDescription, CardHeader, CardTitle } from '@/components/ui'

export function DashboardPage() {
  return (
    <div>
      <PageHeader
        title="Dashboard"
        description="Overview of your receipts and spending."
        actions={
          <Button disabled>
            <Plus className="h-4 w-4" />
            Add receipt
          </Button>
        }
      />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        <Card>
          <CardHeader>
            <div>
              <CardTitle>Total receipts</CardTitle>
              <CardDescription>All time</CardDescription>
            </div>
            <Badge>Soon</Badge>
          </CardHeader>
          <p className="text-3xl font-semibold tracking-tight">—</p>
        </Card>

        <Card>
          <CardHeader>
            <div>
              <CardTitle>This month</CardTitle>
              <CardDescription>Spending total</CardDescription>
            </div>
            <Badge variant="success">Soon</Badge>
          </CardHeader>
          <p className="text-3xl font-semibold tracking-tight">—</p>
        </Card>

        <Card className="sm:col-span-2 xl:col-span-1">
          <CardHeader>
            <div>
              <CardTitle>Recent activity</CardTitle>
              <CardDescription>Latest uploads</CardDescription>
            </div>
            <Receipt className="h-4 w-4 text-surface-400" />
          </CardHeader>
          <p className="text-sm text-surface-500 dark:text-surface-400">
            Business logic will populate this section.
          </p>
        </Card>
      </div>
    </div>
  )
}
