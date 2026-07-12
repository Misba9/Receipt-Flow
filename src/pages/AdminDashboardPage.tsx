import { Link } from 'react-router-dom'
import {
  AdminStatsGrid,
  SubscriptionBreakdown,
} from '@/components/admin/AdminStatsGrid'
import { PageHeader } from '@/layouts/PageHeader'
import { Alert, Button, Card } from '@/components/ui'
import { useAdminCompanies, usePlatformStats } from '@/services/admin'
import { formatCurrency, formatDate } from '@/lib/format'
import { paths } from '@/lib/paths'
import { SubscriptionBadge } from '@/components/admin/SubscriptionBadge'

export function AdminDashboardPage() {
  const { data: stats, isLoading, isError, error } = usePlatformStats()
  const { data: companies = [] } = useAdminCompanies()
  const recent = companies.slice(0, 5)

  return (
    <div className="space-y-6">
      <PageHeader
        title="Super Admin"
        description="Platform overview across all tenant companies."
        actions={
          <>
            <Link to={paths.adminCompanies}>
              <Button variant="secondary">Companies</Button>
            </Link>
            <Link to={paths.adminUsers}>
              <Button variant="secondary">Users</Button>
            </Link>
          </>
        }
      />

      {isError ? (
        <Alert>
          {error instanceof Error
            ? error.message
            : 'Unable to load platform stats. Confirm you are a super admin and migrations are applied.'}
        </Alert>
      ) : null}

      <AdminStatsGrid stats={stats} loading={isLoading} />

      <div className="grid gap-4 xl:grid-cols-5">
        <div className="xl:col-span-2">
          <SubscriptionBreakdown stats={stats} loading={isLoading} />
        </div>
        <Card className="p-0 xl:col-span-3">
          <div className="flex items-center justify-between border-b border-surface-100 px-5 py-4 dark:border-surface-800">
            <div>
              <h3 className="text-base font-semibold text-surface-900 dark:text-surface-50">
                Recent companies
              </h3>
              <p className="text-sm text-surface-500">Newest workspaces</p>
            </div>
            <Link
              to={paths.adminCompanies}
              className="text-sm font-medium text-brand-600 hover:text-brand-700 dark:text-brand-400"
            >
              View all
            </Link>
          </div>
          <ul className="divide-y divide-surface-100 dark:divide-surface-800">
            {recent.length === 0 ? (
              <li className="px-5 py-8 text-center text-sm text-surface-500">
                No companies yet.
              </li>
            ) : (
              recent.map((company) => (
                <li
                  key={company.id}
                  className="flex items-center justify-between gap-3 px-5 py-3"
                >
                  <div className="min-w-0">
                    <p className="truncate font-medium text-surface-900 dark:text-surface-50">
                      {company.name}
                    </p>
                    <p className="text-xs text-surface-500">
                      {formatDate(company.createdAt)} · {company.userCount}{' '}
                      users
                    </p>
                  </div>
                  <div className="flex shrink-0 items-center gap-2">
                    <SubscriptionBadge status={company.subscriptionStatus} />
                    <span className="text-sm tabular-nums text-surface-700 dark:text-surface-300">
                      {formatCurrency(company.revenue)}
                    </span>
                  </div>
                </li>
              ))
            )}
          </ul>
        </Card>
      </div>
    </div>
  )
}
