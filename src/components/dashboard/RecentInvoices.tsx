import { FileText } from 'lucide-react'
import { Link } from 'react-router-dom'
import { InvoiceStatusBadge } from '@/components/dashboard/InvoiceStatusBadge'
import { SectionCard } from '@/components/dashboard/SectionCard'
import { EmptyState } from '@/components/ui/EmptyState'
import { Skeleton } from '@/components/ui/Skeleton'
import { useRecentInvoices } from '@/services/dashboard/hooks'
import { formatCurrency, formatDate } from '@/lib/format'
import { paths } from '@/lib/paths'

export function RecentInvoices() {
  const { data, isLoading, isError } = useRecentInvoices()

  return (
    <SectionCard
      title="Recent Invoices"
      description="Latest billing activity"
      actionLabel="View all"
      actionTo={paths.invoices}
      className="min-w-0"
    >
      {isLoading ? (
        <div className="space-y-4 p-5">
          {Array.from({ length: 5 }).map((_, index) => (
            <div key={index} className="flex items-center justify-between gap-3">
              <div className="space-y-2">
                <Skeleton className="h-4 w-28" />
                <Skeleton className="h-3 w-36" />
              </div>
              <Skeleton className="h-6 w-16" />
            </div>
          ))}
        </div>
      ) : isError ? (
        <EmptyState
          icon={FileText}
          title="Couldn't load invoices"
          description="Check your connection or try again shortly."
        />
      ) : !data?.length ? (
        <EmptyState
          icon={FileText}
          title="No invoices yet"
          description="Create an invoice to track revenue and payments."
          action={
            <Link
              to={paths.invoices}
              className="text-sm font-medium text-brand-600 hover:underline dark:text-brand-400"
            >
              Go to invoices
            </Link>
          }
        />
      ) : (
        <>
          {/* Mobile / tablet list */}
          <ul className="divide-y divide-surface-100 lg:hidden dark:divide-surface-800">
            {data.map((invoice) => (
              <li key={invoice.id} className="px-5 py-3.5">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium text-surface-900 dark:text-surface-50">
                      {invoice.invoice_number}
                    </p>
                    <p className="truncate text-xs text-surface-500 dark:text-surface-400">
                      {invoice.customer?.name ?? 'Unknown customer'}
                    </p>
                  </div>
                  <InvoiceStatusBadge status={invoice.status} />
                </div>
                <div className="mt-2 flex items-center justify-between text-xs text-surface-500">
                  <span>{formatDate(invoice.issue_date)}</span>
                  <span className="font-medium text-surface-900 dark:text-surface-50">
                    {formatCurrency(invoice.total, invoice.currency)}
                  </span>
                </div>
              </li>
            ))}
          </ul>

          {/* Desktop table */}
          <div className="hidden overflow-x-auto lg:block">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-surface-100 text-xs uppercase tracking-wide text-surface-400 dark:border-surface-800">
                  <th className="px-5 py-3 font-medium">Invoice</th>
                  <th className="px-5 py-3 font-medium">Customer</th>
                  <th className="px-5 py-3 font-medium">Date</th>
                  <th className="px-5 py-3 font-medium">Status</th>
                  <th className="px-5 py-3 text-right font-medium">Amount</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-surface-100 dark:divide-surface-800">
                {data.map((invoice) => (
                  <tr
                    key={invoice.id}
                    className="transition-colors hover:bg-surface-50 dark:hover:bg-surface-800/60"
                  >
                    <td className="px-5 py-3.5 font-medium text-surface-900 dark:text-surface-50">
                      <Link
                        to={paths.invoices}
                        className="hover:text-brand-600 dark:hover:text-brand-400"
                      >
                        {invoice.invoice_number}
                      </Link>
                    </td>
                    <td className="max-w-[10rem] truncate px-5 py-3.5 text-surface-600 dark:text-surface-300">
                      {invoice.customer?.name ?? '—'}
                    </td>
                    <td className="whitespace-nowrap px-5 py-3.5 text-surface-500">
                      {formatDate(invoice.issue_date)}
                    </td>
                    <td className="px-5 py-3.5">
                      <InvoiceStatusBadge status={invoice.status} />
                    </td>
                    <td className="whitespace-nowrap px-5 py-3.5 text-right font-medium text-surface-900 dark:text-surface-50">
                      {formatCurrency(invoice.total, invoice.currency)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}
    </SectionCard>
  )
}
