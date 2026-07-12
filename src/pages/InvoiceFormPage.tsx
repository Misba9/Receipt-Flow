import { Link, useParams } from 'react-router-dom'
import { InvoiceForm } from '@/components/invoices/InvoiceForm'
import { PageHeader } from '@/layouts/PageHeader'
import { Alert, Button, Card, EmptyState, Spinner } from '@/components/ui'
import { useInvoice, useInvoiceDefaults } from '@/services/invoices/hooks'
import { FileText } from 'lucide-react'
import { paths } from '@/lib/paths'

export function InvoiceCreatePage() {
  const { data: defaults, isLoading, isError, error } = useInvoiceDefaults()

  return (
    <div className="space-y-6">
      <PageHeader
        title="Create bill"
        description="Enter customer and invoice details, then save both at once."
        actions={
          <Link to={paths.invoices}>
            <Button variant="secondary">Back to invoices</Button>
          </Link>
        }
      />

      {isLoading ? (
        <Card className="flex items-center justify-center gap-3 py-16">
          <Spinner className="h-6 w-6" />
          <span className="text-sm text-surface-500">Preparing form…</span>
        </Card>
      ) : isError ? (
        <Alert>
          {error instanceof Error ? error.message : 'Unable to load defaults.'}
        </Alert>
      ) : defaults ? (
        <InvoiceForm key={defaults.invoice_number} defaults={defaults} />
      ) : null}
    </div>
  )
}

export function InvoiceEditPage() {
  const { id } = useParams<{ id: string }>()
  const { data, isLoading, isError, error } = useInvoice(id)

  return (
    <div className="space-y-6">
      <PageHeader
        title="Edit invoice"
        description={data ? `Editing ${data.invoice_number}` : 'Update invoice details.'}
        actions={
          <Link to={id ? paths.invoiceDetail(id) : paths.invoices}>
            <Button variant="secondary">Cancel</Button>
          </Link>
        }
      />

      {isLoading ? (
        <Card className="flex items-center justify-center gap-3 py-16">
          <Spinner className="h-6 w-6" />
          <span className="text-sm text-surface-500">Loading invoice…</span>
        </Card>
      ) : isError ? (
        <Card className="p-0">
          <EmptyState
            icon={FileText}
            title="Invoice not found"
            description={
              error instanceof Error
                ? error.message
                : 'This invoice may have been deleted.'
            }
            action={
              <Link to={paths.invoices}>
                <Button>Back to invoices</Button>
              </Link>
            }
          />
        </Card>
      ) : data ? (
        <InvoiceForm key={data.id} invoice={data} />
      ) : null}
    </div>
  )
}
