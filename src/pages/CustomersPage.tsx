import { useEffect, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { UserPlus } from 'lucide-react'
import { CustomerFormModal } from '@/components/customers/CustomerFormModal'
import { CustomersTable } from '@/components/customers/CustomersTable'
import { DeleteCustomerDialog } from '@/components/customers/DeleteCustomerDialog'
import { ExportButton } from '@/components/exports/ExportButton'
import { PageHeader } from '@/layouts/PageHeader'
import { Alert, Button, Card, Pagination, SearchInput } from '@/components/ui'
import { useCustomers } from '@/services/customers/hooks'
import { fetchCustomers } from '@/services/customers/api'
import type { Customer } from '@/services/customers/types'
import { exportCustomersExcel } from '@/services/exports'
import { useDebouncedValue } from '@/hooks/useDebouncedValue'

const PAGE_SIZE = 10

export function CustomersPage() {
  const [searchParams, setSearchParams] = useSearchParams()
  const urlQuery = searchParams.get('q') ?? ''
  const editId = searchParams.get('edit')
  const search = useDebouncedValue(urlQuery, 300)

  const [page, setPage] = useState(1)
  const [trackedQuery, setTrackedQuery] = useState(urlQuery)
  if (urlQuery !== trackedQuery) {
    setTrackedQuery(urlQuery)
    setPage(1)
  }

  const [formOpen, setFormOpen] = useState(false)
  const [editing, setEditing] = useState<Customer | null>(null)
  const [deleting, setDeleting] = useState<Customer | null>(null)

  const { data, isLoading, isError, error, isFetching } = useCustomers({
    search,
    page,
    pageSize: PAGE_SIZE,
  })

  useEffect(() => {
    if (!editId) return
    let cancelled = false

    void (async () => {
      try {
        const result = await fetchCustomers({
          search: urlQuery,
          page: 1,
          pageSize: 50,
        })
        const found =
          result.data.find((row) => row.id === editId) ??
          (
            await fetchCustomers({ search: '', page: 1, pageSize: 100 })
          ).data.find((row) => row.id === editId)

        if (!cancelled && found) {
          setEditing(found)
          setFormOpen(true)
        }
      } catch {
        // Ignore — user can still open customers manually.
      }
    })()

    return () => {
      cancelled = true
    }
  }, [editId, urlQuery])

  const handleSearchChange = (value: string) => {
    setPage(1)
    const next = new URLSearchParams(searchParams)
    if (value.trim()) next.set('q', value)
    else next.delete('q')
    setSearchParams(next, { replace: true })
  }

  const clearEditParam = () => {
    const next = new URLSearchParams(searchParams)
    next.delete('edit')
    setSearchParams(next, { replace: true })
  }

  const openCreate = () => {
    setEditing(null)
    clearEditParam()
    setFormOpen(true)
  }

  const openEdit = (customer: Customer) => {
    setEditing(customer)
    setFormOpen(true)
  }

  const switchToCustomer = async (customerId: string) => {
    const match =
      data?.data.find((row) => row.id === customerId) ??
      (
        await fetchCustomers({ search: '', page: 1, pageSize: 100 })
      ).data.find((row) => row.id === customerId)
    if (match) {
      setEditing(match)
      setFormOpen(true)
    }
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Customers"
        description="Add, edit, and search customers for your company."
        actions={
          <>
            <ExportButton
              label="Export Excel"
              onExport={exportCustomersExcel}
            />
            <Button type="button" onClick={openCreate}>
              <UserPlus className="h-4 w-4" />
              <span className="hidden sm:inline">Add customer</span>
              <span className="sm:hidden">Add</span>
            </Button>
          </>
        }
      />

      <Card className="overflow-hidden p-0">
        <div className="flex flex-col gap-3 border-b border-surface-100 p-4 sm:flex-row sm:items-center sm:justify-between dark:border-surface-800">
          <SearchInput
            value={urlQuery}
            onChange={handleSearchChange}
            placeholder="Search by name, phone, email, address, or notes…"
            className="sm:max-w-md"
          />
          {isFetching && !isLoading ? (
            <p className="text-xs text-surface-400">Updating…</p>
          ) : null}
        </div>

        {isError ? (
          <div className="p-4">
            <Alert>
              {error instanceof Error
                ? error.message
                : 'Unable to load customers.'}
            </Alert>
          </div>
        ) : (
          <CustomersTable
            customers={data?.data ?? []}
            loading={isLoading}
            search={search}
            onAdd={openCreate}
            onEdit={openEdit}
            onDelete={setDeleting}
          />
        )}

        {data ? (
          <Pagination
            page={data.page}
            totalPages={data.totalPages}
            total={data.total}
            pageSize={data.pageSize}
            onPageChange={setPage}
          />
        ) : null}
      </Card>

      <CustomerFormModal
        open={formOpen}
        customer={editing}
        onClose={() => {
          setFormOpen(false)
          setEditing(null)
          clearEditParam()
        }}
        onSwitchToCustomer={(id) => {
          void switchToCustomer(id)
        }}
      />

      <DeleteCustomerDialog
        open={Boolean(deleting)}
        customer={deleting}
        onClose={() => setDeleting(null)}
      />
    </div>
  )
}
