import { Plus } from 'lucide-react'
import { Link } from 'react-router-dom'
import {
  DashboardStatsGrid,
  LatestCustomers,
  RecentInvoices,
} from '@/components/dashboard'
import { ExportButton } from '@/components/exports/ExportButton'
import { PageHeader } from '@/layouts/PageHeader'
import { Button } from '@/components/ui/Button'
import { exportSalesExcel } from '@/services/exports'
import { paths } from '@/lib/paths'

export function DashboardPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Dashboard"
        description="Monitor sales, customers, and invoices at a glance."
        actions={
          <>
            <ExportButton
              label="Export sales"
              onExport={exportSalesExcel}
              variant="secondary"
            />
            <Link to={paths.customers}>
              <Button variant="secondary">Customers</Button>
            </Link>
            <Link to={paths.invoiceNew}>
              <Button>
                <Plus className="h-4 w-4" />
                Create bill
              </Button>
            </Link>
          </>
        }
      />

      <DashboardStatsGrid />

      <div className="grid gap-4 xl:grid-cols-5">
        <div className="xl:col-span-2">
          <LatestCustomers />
        </div>
        <div className="min-w-0 xl:col-span-3">
          <RecentInvoices />
        </div>
      </div>
    </div>
  )
}
