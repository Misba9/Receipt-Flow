import {
  Building2,
  CircleDollarSign,
  FileText,
  Users,
} from 'lucide-react'
import { SubscriptionBadge } from '@/components/admin/SubscriptionBadge'
import { StatCard } from '@/components/dashboard/StatCard'
import { Card, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card'
import type { PlatformStats, SubscriptionStatus } from '@/services/admin'
import {
  formatCompactCurrency,
  formatCurrency,
  formatNumber,
} from '@/lib/format'

type AdminStatsProps = {
  stats?: PlatformStats
  loading?: boolean
}

export function AdminStatsGrid({ stats, loading = false }: AdminStatsProps) {
  const totalRevenue = stats?.totalRevenue ?? 0

  return (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      <StatCard
        title="Companies"
        value={formatNumber(stats?.totalCompanies ?? 0)}
        description={`${formatNumber(stats?.activeCompanies ?? 0)} active · ${formatNumber(stats?.disabledCompanies ?? 0)} disabled`}
        icon={Building2}
        loading={loading}
      />
      <StatCard
        title="Users"
        value={formatNumber(stats?.totalUsers ?? 0)}
        description={`${formatNumber(stats?.superAdmins ?? 0)} super admin(s)`}
        icon={Users}
        loading={loading}
        iconClassName="bg-sky-50 text-sky-600 dark:bg-sky-950 dark:text-sky-300"
      />
      <StatCard
        title="Total revenue"
        value={formatCompactCurrency(totalRevenue, 'INR')}
        valueTooltip={formatCurrency(totalRevenue, 'INR')}
        description="Paid invoices across all tenants"
        icon={CircleDollarSign}
        loading={loading}
        iconClassName="bg-emerald-50 text-emerald-600 dark:bg-emerald-950 dark:text-emerald-300"
      />
      <StatCard
        title="Invoices"
        value={formatNumber(stats?.totalInvoices ?? 0)}
        description={`${formatNumber(stats?.totalCustomers ?? 0)} customers`}
        icon={FileText}
        loading={loading}
        iconClassName="bg-violet-50 text-violet-600 dark:bg-violet-950 dark:text-violet-300"
      />
    </div>
  )
}

export function SubscriptionBreakdown({
  stats,
  loading = false,
}: AdminStatsProps) {
  const entries = Object.entries(stats?.subscriptions ?? {}) as Array<
    [SubscriptionStatus, number]
  >

  return (
    <Card className="p-0">
      <CardHeader className="mb-0 border-b border-surface-100 px-5 py-4 dark:border-surface-800">
        <div>
          <CardTitle>Subscription status</CardTitle>
          <CardDescription className="mt-0.5">
            Company counts by plan status.
          </CardDescription>
        </div>
      </CardHeader>
      <div className="px-5 py-4">
        {loading ? (
          <p className="text-sm text-surface-500">Loading…</p>
        ) : entries.length === 0 ? (
          <p className="text-sm text-surface-500">No subscription data.</p>
        ) : (
          <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {entries.map(([status, count]) => (
              <li
                key={status}
                className="flex items-center justify-between rounded-lg border border-surface-100 px-3 py-2.5 dark:border-surface-800"
              >
                <SubscriptionBadge status={status} />
                <span className="text-sm font-semibold tabular-nums text-surface-900 dark:text-surface-50">
                  {formatNumber(count)}
                </span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </Card>
  )
}
