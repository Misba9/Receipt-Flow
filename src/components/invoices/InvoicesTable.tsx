import { Link } from 'react-router-dom'
import { Eye, FileText, Pencil, Trash2 } from 'lucide-react'
import { InvoiceStatusBadge } from '@/components/dashboard/InvoiceStatusBadge'
import { Button } from '@/components/ui/Button'
import { EmptyState } from '@/components/ui/EmptyState'
import { Skeleton } from '@/components/ui/Skeleton'
import type { InvoiceListItem } from '@/services/invoices/types'
import { formatCurrency, formatDate } from '@/lib/format'
import { paths } from '@/lib/paths'

type InvoicesTableProps = {
  invoices: InvoiceListItem[]
  loading?: boolean
  search?: string
  onDelete: (invoice: InvoiceListItem) => void
  onCreate: () => void
}

export function InvoicesTable({
  invoices,
  loading = false,
  search = '',
  onDelete,
  onCreate,
}: InvoicesTableProps) {
  if (loading) {
    return (
      <div className="space-y-3 p-4">
        {Array.from({ length: 5 }).map((_, index) => (
          <Skeleton key={index} className="h-16 w-full rounded-xl" />
        ))}
      </div>
    )
  }

  if (invoices.length === 0) {
    return (
      <EmptyState
        icon={FileText}
        title={search ? 'No invoices match your filters' : 'No invoices yet'}
        description={
          search
            ? 'Try a different search term or status filter.'
            : 'Create your first invoice to start tracking revenue.'
        }
        action={
          !search ? (
            <Button type="button" onClick={onCreate}>
              Create bill
            </Button>
          ) : null
        }
        className="py-16"
      />
    )
  }

  return (
    <>
      <ul className="divide-y divide-surface-100 md:hidden dark:divide-surface-800">
        {invoices.map((invoice) => (
          <li key={invoice.id} className="space-y-3 p-4">
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <p className="font-medium text-surface-900 dark:text-surface-50">
                  {invoice.invoice_number}
                </p>
                <p className="truncate text-sm text-surface-500">
                  {invoice.customer?.name ?? 'Unknown customer'}
                </p>
              </div>
              <InvoiceStatusBadge status={invoice.status} />
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-surface-500">
                {formatDate(invoice.issue_date)}
              </span>
              <span className="font-semibold">
                {formatCurrency(invoice.total, invoice.currency)}
              </span>
            </div>
            <div className="flex gap-2">
              <Link to={paths.invoiceDetail(invoice.id)} className="flex-1">
                <Button type="button" variant="secondary" size="sm" className="w-full">
                  <Eye className="h-3.5 w-3.5" />
                  View
                </Button>
              </Link>
              <Link to={paths.invoiceEdit(invoice.id)} className="flex-1">
                <Button type="button" variant="secondary" size="sm" className="w-full">
                  <Pencil className="h-3.5 w-3.5" />
                  Edit
                </Button>
              </Link>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="text-red-600 dark:text-red-400"
                onClick={() => onDelete(invoice)}
              >
                <Trash2 className="h-3.5 w-3.5" />
              </Button>
            </div>
          </li>
        ))}
      </ul>

      <div className="hidden overflow-x-auto md:block">
        <table className="w-full min-w-[52rem] text-left text-sm">
          <thead>
            <tr className="border-b border-surface-100 text-xs uppercase tracking-wide text-surface-400 dark:border-surface-800">
              <th className="px-5 py-3 font-medium">Invoice</th>
              <th className="px-5 py-3 font-medium">Customer</th>
              <th className="px-5 py-3 font-medium">Date</th>
              <th className="px-5 py-3 font-medium">Status</th>
              <th className="px-5 py-3 text-right font-medium">Total</th>
              <th className="px-5 py-3 text-right font-medium">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-surface-100 dark:divide-surface-800">
            {invoices.map((invoice) => (
              <tr
                key={invoice.id}
                className="transition-colors hover:bg-surface-50 dark:hover:bg-surface-800/50"
              >
                <td className="px-5 py-3.5 font-medium text-surface-900 dark:text-surface-50">
                  <Link
                    to={paths.invoiceDetail(invoice.id)}
                    className="hover:text-brand-600 dark:hover:text-brand-400"
                  >
                    {invoice.invoice_number}
                  </Link>
                </td>
                <td className="max-w-[12rem] truncate px-5 py-3.5 text-surface-600 dark:text-surface-300">
                  {invoice.customer?.name ?? '—'}
                </td>
                <td className="whitespace-nowrap px-5 py-3.5 text-surface-500">
                  {formatDate(invoice.issue_date)}
                </td>
                <td className="px-5 py-3.5">
                  <InvoiceStatusBadge status={invoice.status} />
                </td>
                <td className="whitespace-nowrap px-5 py-3.5 text-right font-medium">
                  {formatCurrency(invoice.total, invoice.currency)}
                </td>
                <td className="px-5 py-3.5">
                  <div className="flex justify-end gap-1">
                    <Link to={paths.invoiceDetail(invoice.id)}>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="h-8 w-8 px-0"
                        aria-label="View invoice"
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                    </Link>
                    <Link to={paths.invoiceEdit(invoice.id)}>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="h-8 w-8 px-0"
                        aria-label="Edit invoice"
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                    </Link>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="h-8 w-8 px-0 text-red-600 dark:text-red-400"
                      aria-label="Delete invoice"
                      onClick={() => onDelete(invoice)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  )
}
