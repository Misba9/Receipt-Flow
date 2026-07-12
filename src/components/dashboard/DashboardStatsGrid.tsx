import {
  Banknote,
  DollarSign,
  FileText,
  TrendingUp,
  Users,
} from 'lucide-react'
import { StatCard } from '@/components/dashboard/StatCard'
import { Alert } from '@/components/ui'
import { useDashboardStats } from '@/services/dashboard/hooks'
import { formatCurrency, formatNumber } from '@/lib/format'

export function DashboardStatsGrid() {
  const { data, isLoading, isError, error } = useDashboardStats()
  const currency = data?.currency ?? 'USD'

  return (
    <div className="space-y-4">
      {isError ? (
        <Alert>
          {error instanceof Error
            ? error.message
            : 'Unable to load dashboard statistics.'}
        </Alert>
      ) : null}

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
        <StatCard
          title="Today's Sales"
          value={formatCurrency(data?.todaysSales ?? 0, currency)}
          description="Paid invoices today"
          icon={TrendingUp}
          loading={isLoading}
          iconClassName="bg-emerald-50 text-emerald-600 dark:bg-emerald-950 dark:text-emerald-300"
        />
        <StatCard
          title="Revenue"
          value={formatCurrency(data?.revenue ?? 0, currency)}
          description="All paid amounts"
          icon={DollarSign}
          loading={isLoading}
          iconClassName="bg-amber-50 text-amber-700 dark:bg-amber-950 dark:text-amber-300"
        />
        <StatCard
          title="Outstanding"
          value={formatCurrency(data?.outstanding ?? 0, currency)}
          description="Sent, overdue & partial"
          icon={Banknote}
          loading={isLoading}
          iconClassName="bg-rose-50 text-rose-600 dark:bg-rose-950 dark:text-rose-300"
        />
        <StatCard
          title="Invoices"
          value={formatNumber(data?.totalInvoices ?? 0)}
          description="Total invoice count"
          icon={FileText}
          loading={isLoading}
          iconClassName="bg-violet-50 text-violet-600 dark:bg-violet-950 dark:text-violet-300"
        />
        <StatCard
          title="Customers"
          value={formatNumber(data?.totalCustomers ?? 0)}
          description="Active customers"
          icon={Users}
          loading={isLoading}
          iconClassName="bg-sky-50 text-sky-600 dark:bg-sky-950 dark:text-sky-300"
        />
      </div>
    </div>
  )
}
