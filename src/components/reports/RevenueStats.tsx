import {
  Banknote,
  CircleDollarSign,
  FileText,
  TrendingUp,
} from 'lucide-react'
import { StatCard } from '@/components/dashboard/StatCard'
import type { RevenueSummary } from '@/services/reports/types'
import {
  formatCompactCurrency,
  formatCurrency,
  formatNumber,
} from '@/lib/format'

type RevenueStatsProps = {
  revenue?: RevenueSummary
  loading?: boolean
}

export function RevenueStats({ revenue, loading = false }: RevenueStatsProps) {
  const currency = revenue?.currency ?? 'INR'
  const totalRevenue = revenue?.totalRevenue ?? 0
  const thisMonthRevenue = revenue?.thisMonthRevenue ?? 0
  const outstanding = revenue?.outstanding ?? 0
  const monthDelta =
    revenue && revenue.lastMonthRevenue > 0
      ? ((revenue.thisMonthRevenue - revenue.lastMonthRevenue) /
          revenue.lastMonthRevenue) *
        100
      : null

  return (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      <StatCard
        title="Total Revenue"
        value={formatCompactCurrency(totalRevenue, currency)}
        valueTooltip={formatCurrency(totalRevenue, currency)}
        description={`${formatNumber(revenue?.paidCount ?? 0)} paid invoices`}
        icon={CircleDollarSign}
        loading={loading}
      />
      <StatCard
        title="Revenue this month"
        value={formatCompactCurrency(thisMonthRevenue, currency)}
        valueTooltip={formatCurrency(thisMonthRevenue, currency)}
        description="Paid this calendar month"
        icon={TrendingUp}
        loading={loading}
        trend={
          monthDelta == null
            ? undefined
            : {
                value: `${monthDelta >= 0 ? '+' : ''}${monthDelta.toFixed(0)}% vs last month`,
                positive: monthDelta >= 0,
              }
        }
        iconClassName="bg-emerald-50 text-emerald-600 dark:bg-emerald-950 dark:text-emerald-300"
      />
      <StatCard
        title="Outstanding"
        value={formatCompactCurrency(outstanding, currency)}
        valueTooltip={formatCurrency(outstanding, currency)}
        description="Sent, overdue & partial"
        icon={Banknote}
        loading={loading}
        iconClassName="bg-amber-50 text-amber-600 dark:bg-amber-950 dark:text-amber-300"
      />
      <StatCard
        title="Total invoices"
        value={formatNumber(revenue?.invoiceCount ?? 0)}
        description="All invoices"
        icon={FileText}
        loading={loading}
        iconClassName="bg-sky-50 text-sky-600 dark:bg-sky-950 dark:text-sky-300"
      />
    </div>
  )
}
