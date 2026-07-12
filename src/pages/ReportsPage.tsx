import { Download } from 'lucide-react'
import {
  DailySalesChart,
  InvoicesChart,
  MonthlySalesChart,
  RevenueChart,
  RevenueStats,
  TopCustomersChart,
} from '@/components/reports'
import { ExportButton } from '@/components/exports/ExportButton'
import { PageHeader } from '@/layouts/PageHeader'
import { Alert } from '@/components/ui'
import { downloadReportsCsv, useReportsData } from '@/services/reports'

export function ReportsPage() {
  const { data, isLoading, isError, error } = useReportsData()
  const currency = data?.revenue.currency ?? 'USD'

  return (
    <div className="space-y-6">
      <PageHeader
        title="Reports"
        description="Sales trends, invoice mix, top customers, and revenue."
        actions={
          <ExportButton
            label="Download CSV"
            icon={<Download className="h-4 w-4" />}
            onExport={async () => {
              if (!data) throw new Error('Report data is still loading.')
              downloadReportsCsv(data)
            }}
            variant="secondary"
          />
        }
      />

      {isError ? (
        <Alert>
          {error instanceof Error
            ? error.message
            : 'Unable to load reports.'}
        </Alert>
      ) : null}

      <RevenueStats revenue={data?.revenue} loading={isLoading} />

      <div className="grid gap-4 xl:grid-cols-2">
        <DailySalesChart
          data={data?.dailySales ?? []}
          currency={currency}
          loading={isLoading}
        />
        <MonthlySalesChart
          data={data?.monthlySales ?? []}
          currency={currency}
          loading={isLoading}
        />
      </div>

      <div className="grid gap-4 xl:grid-cols-2">
        <InvoicesChart
          data={data?.invoicesByStatus ?? []}
          loading={isLoading}
        />
        <TopCustomersChart
          data={data?.topCustomers ?? []}
          currency={currency}
          loading={isLoading}
        />
      </div>

      <RevenueChart
        monthlySales={data?.monthlySales ?? []}
        currency={currency}
        loading={isLoading}
      />
    </div>
  )
}
