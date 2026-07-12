import { useState } from 'react'
import { Plus } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { ExportButton } from '@/components/exports/ExportButton'
import { DeleteInvoiceDialog } from '@/components/invoices/DeleteInvoiceDialog'
import { InvoicesTable } from '@/components/invoices/InvoicesTable'
import { PageHeader } from '@/layouts/PageHeader'
import { Alert, Button, Card, Pagination, SearchInput, Select } from '@/components/ui'
import { exportInvoicesExcel } from '@/services/exports'
import { useInvoices } from '@/services/invoices/hooks'
import type { InvoiceListItem, InvoiceStatus } from '@/services/invoices/types'
import { INVOICE_STATUSES } from '@/services/invoices/types'
import { useDebouncedValue } from '@/hooks/useDebouncedValue'
import { paths } from '@/lib/paths'

const PAGE_SIZE = 10

const statusFilterOptions = [
  { value: 'all', label: 'All statuses' },
  ...INVOICE_STATUSES.map((status) => ({
    value: status,
    label: status.charAt(0).toUpperCase() + status.slice(1),
  })),
]

export function InvoicesPage() {
  const navigate = useNavigate()
  const [searchInput, setSearchInput] = useState('')
  const search = useDebouncedValue(searchInput, 300)
  const [status, setStatus] = useState<InvoiceStatus | 'all'>('all')
  const [page, setPage] = useState(1)
  const [deleting, setDeleting] = useState<InvoiceListItem | null>(null)

  const { data, isLoading, isError, error, isFetching } = useInvoices({
    search,
    status,
    page,
    pageSize: PAGE_SIZE,
  })

  return (
    <div className="space-y-6">
      <PageHeader
        title="Invoices"
        description="Create, track, and manage customer invoices."
        actions={
          <>
            <ExportButton label="Export Excel" onExport={exportInvoicesExcel} />
            <Button type="button" onClick={() => navigate(paths.invoiceNew)}>
              <Plus className="h-4 w-4" />
              New invoice
            </Button>
          </>
        }
      />

      <Card className="overflow-hidden p-0">
        <div className="flex flex-col gap-3 border-b border-surface-100 p-4 lg:flex-row lg:items-center dark:border-surface-800">
          <SearchInput
            value={searchInput}
            onChange={(value) => {
              setSearchInput(value)
              setPage(1)
            }}
            placeholder="Search invoice number or customer…"
            className="lg:max-w-md"
          />
          <Select
            aria-label="Filter by status"
            value={status}
            options={statusFilterOptions}
            className="lg:w-48"
            onChange={(event) => {
              setStatus(event.target.value as InvoiceStatus | 'all')
              setPage(1)
            }}
          />
          {isFetching && !isLoading ? (
            <p className="text-xs text-surface-400 lg:ml-auto">Updating…</p>
          ) : null}
        </div>

        {isError ? (
          <div className="p-4">
            <Alert>
              {error instanceof Error
                ? error.message
                : 'Unable to load invoices.'}
            </Alert>
          </div>
        ) : (
          <InvoicesTable
            invoices={data?.data ?? []}
            loading={isLoading}
            search={search || status !== 'all' ? 'filtered' : ''}
            onCreate={() => navigate(paths.invoiceNew)}
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

      <DeleteInvoiceDialog
        open={Boolean(deleting)}
        invoice={deleting}
        onClose={() => setDeleting(null)}
      />
    </div>
  )
}
