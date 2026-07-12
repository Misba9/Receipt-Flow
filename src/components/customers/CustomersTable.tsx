import { MoreHorizontal, Pencil, Trash2, Users } from 'lucide-react'
import { Avatar } from '@/components/ui/Avatar'
import { Button } from '@/components/ui/Button'
import { EmptyState } from '@/components/ui/EmptyState'
import { Skeleton } from '@/components/ui/Skeleton'
import type { Customer } from '@/services/customers/types'
import { formatDate } from '@/lib/format'

type CustomersTableProps = {
  customers: Customer[]
  loading?: boolean
  search?: string
  onEdit: (customer: Customer) => void
  onDelete: (customer: Customer) => void
  onAdd: () => void
}

export function CustomersTable({
  customers,
  loading = false,
  search = '',
  onEdit,
  onDelete,
  onAdd,
}: CustomersTableProps) {
  if (loading) {
    return (
      <div className="space-y-3 p-4">
        {Array.from({ length: 5 }).map((_, index) => (
          <div
            key={index}
            className="flex items-center gap-3 rounded-xl border border-surface-100 p-3 dark:border-surface-800"
          >
            <Skeleton className="h-10 w-10 rounded-full" />
            <div className="flex-1 space-y-2">
              <Skeleton className="h-4 w-40" />
              <Skeleton className="h-3 w-56" />
            </div>
          </div>
        ))}
      </div>
    )
  }

  if (customers.length === 0) {
    return (
      <EmptyState
        icon={Users}
        title={search ? 'No customers match your search' : 'No customers yet'}
        description={
          search
            ? 'Try a different name, email, phone, or note.'
            : 'Add your first customer to start invoicing.'
        }
        action={
          !search ? (
            <Button type="button" onClick={onAdd}>
              Add customer
            </Button>
          ) : null
        }
        className="py-16"
      />
    )
  }

  return (
    <>
      {/* Mobile / tablet cards */}
      <ul className="divide-y divide-surface-100 lg:hidden dark:divide-surface-800">
        {customers.map((customer) => (
          <li key={customer.id} className="p-4">
            <div className="flex items-start gap-3">
              <Avatar name={customer.name} />
              <div className="min-w-0 flex-1">
                <p className="truncate font-medium text-surface-900 dark:text-surface-50">
                  {customer.name}
                </p>
                <p className="truncate text-sm text-surface-500">
                  {customer.email ?? customer.phone ?? 'No contact info'}
                </p>
                {customer.address_line1 ? (
                  <p className="mt-1 line-clamp-2 text-xs text-surface-400">
                    {customer.address_line1}
                  </p>
                ) : null}
              </div>
            </div>
            <div className="mt-3 flex gap-2">
              <Button
                type="button"
                variant="secondary"
                size="sm"
                className="flex-1"
                onClick={() => onEdit(customer)}
              >
                <Pencil className="h-3.5 w-3.5" />
                Edit
              </Button>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="flex-1 text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-950/40"
                onClick={() => onDelete(customer)}
              >
                <Trash2 className="h-3.5 w-3.5" />
                Delete
              </Button>
            </div>
          </li>
        ))}
      </ul>

      {/* Desktop table */}
      <div className="hidden overflow-x-auto lg:block">
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="border-b border-surface-100 text-xs uppercase tracking-wide text-surface-400 dark:border-surface-800">
              <th className="px-5 py-3 font-medium">Name</th>
              <th className="px-5 py-3 font-medium">Phone</th>
              <th className="px-5 py-3 font-medium">Email</th>
              <th className="px-5 py-3 font-medium">Address</th>
              <th className="px-5 py-3 font-medium">Added</th>
              <th className="px-5 py-3 text-right font-medium">
                <span className="sr-only">Actions</span>
                <MoreHorizontal className="ml-auto h-4 w-4 opacity-0" />
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-surface-100 dark:divide-surface-800">
            {customers.map((customer) => (
              <tr
                key={customer.id}
                className="transition-colors hover:bg-surface-50 dark:hover:bg-surface-800/50"
              >
                <td className="px-5 py-3.5">
                  <div className="flex items-center gap-3">
                    <Avatar name={customer.name} className="h-8 w-8" />
                    <div className="min-w-0">
                      <p className="truncate font-medium text-surface-900 dark:text-surface-50">
                        {customer.name}
                      </p>
                      {customer.notes ? (
                        <p className="truncate text-xs text-surface-400">
                          {customer.notes}
                        </p>
                      ) : null}
                    </div>
                  </div>
                </td>
                <td className="whitespace-nowrap px-5 py-3.5 text-surface-600 dark:text-surface-300">
                  {customer.phone ?? '—'}
                </td>
                <td className="max-w-[12rem] truncate px-5 py-3.5 text-surface-600 dark:text-surface-300">
                  {customer.email ?? '—'}
                </td>
                <td className="max-w-[14rem] truncate px-5 py-3.5 text-surface-500">
                  {customer.address_line1 ?? '—'}
                </td>
                <td className="whitespace-nowrap px-5 py-3.5 text-surface-500">
                  {formatDate(customer.created_at)}
                </td>
                <td className="px-5 py-3.5">
                  <div className="flex justify-end gap-1">
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="h-8 w-8 px-0"
                      aria-label={`Edit ${customer.name}`}
                      onClick={() => onEdit(customer)}
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="h-8 w-8 px-0 text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-950/40"
                      aria-label={`Delete ${customer.name}`}
                      onClick={() => onDelete(customer)}
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
