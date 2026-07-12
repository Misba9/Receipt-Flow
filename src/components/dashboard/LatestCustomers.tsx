import { Users } from 'lucide-react'
import { Link } from 'react-router-dom'
import { SectionCard } from '@/components/dashboard/SectionCard'
import { Avatar } from '@/components/ui/Avatar'
import { EmptyState } from '@/components/ui/EmptyState'
import { Skeleton } from '@/components/ui/Skeleton'
import { useLatestCustomers } from '@/services/dashboard/hooks'
import { formatDate } from '@/lib/format'
import { paths } from '@/lib/paths'

export function LatestCustomers() {
  const { data, isLoading, isError } = useLatestCustomers()

  return (
    <SectionCard
      title="Latest Customers"
      description="Recently added to your workspace"
      actionLabel="View all"
      actionTo={paths.customers}
    >
      {isLoading ? (
        <div className="space-y-4 p-5">
          {Array.from({ length: 5 }).map((_, index) => (
            <div key={index} className="flex items-center gap-3">
              <Skeleton className="h-9 w-9 rounded-full" />
              <div className="flex-1 space-y-2">
                <Skeleton className="h-4 w-32" />
                <Skeleton className="h-3 w-40" />
              </div>
            </div>
          ))}
        </div>
      ) : isError ? (
        <EmptyState
          icon={Users}
          title="Couldn't load customers"
          description="Check your connection or try again shortly."
        />
      ) : !data?.length ? (
        <EmptyState
          icon={Users}
          title="No customers yet"
          description="Add your first customer to see them here."
          action={
            <Link
              to={paths.customers}
              className="text-sm font-medium text-brand-600 hover:underline dark:text-brand-400"
            >
              Go to customers
            </Link>
          }
        />
      ) : (
        <ul className="divide-y divide-surface-100 dark:divide-surface-800">
          {data.map((customer) => (
            <li key={customer.id}>
              <Link
                to={paths.customers}
                className="flex items-center gap-3 px-5 py-3.5 transition-colors hover:bg-surface-50 dark:hover:bg-surface-800/60"
              >
                <Avatar name={customer.name} />
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium text-surface-900 dark:text-surface-50">
                    {customer.name}
                  </p>
                  <p className="truncate text-xs text-surface-500 dark:text-surface-400">
                    {customer.email ?? customer.company_name ?? 'No email'}
                  </p>
                </div>
                <time className="shrink-0 text-xs text-surface-400">
                  {formatDate(customer.created_at, {
                    month: 'short',
                    day: 'numeric',
                  })}
                </time>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </SectionCard>
  )
}
