import { useState } from 'react'
import { Link, useLocation, useNavigate, useParams } from 'react-router-dom'
import { FileText, Mail, Pencil, Trash2 } from 'lucide-react'
import { DeleteInvoiceDialog } from '@/components/invoices/DeleteInvoiceDialog'
import { DownloadInvoicePdfButton } from '@/components/invoices/DownloadInvoicePdfButton'
import { InvoiceDocument } from '@/components/invoices/InvoiceDocument'
import { PageHeader } from '@/layouts/PageHeader'
import { Alert, Button, Card, EmptyState, Spinner } from '@/components/ui'
import { deliverNewInvoice } from '@/services/invoices/deliver'
import type { InvoiceDeliveryResult } from '@/services/invoices/deliver'
import { useInvoice, invoiceKeys } from '@/services/invoices/hooks'
import { useCompanySettings } from '@/services/settings/hooks'
import { useQueryClient } from '@tanstack/react-query'
import { paths } from '@/lib/paths'

type LocationState = {
  delivery?: InvoiceDeliveryResult
}

export function InvoiceDetailPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const location = useLocation()
  const queryClient = useQueryClient()
  const { data, isLoading, isError, error } = useInvoice(id)
  const { data: company } = useCompanySettings()
  const [deleteOpen, setDeleteOpen] = useState(false)
  const [delivery, setDelivery] = useState<InvoiceDeliveryResult | null>(
    (location.state as LocationState | null)?.delivery ?? null,
  )
  const [isSending, setIsSending] = useState(false)

  const handleSendEmail = async () => {
    if (!data || !company) return
    setIsSending(true)
    try {
      const result = await deliverNewInvoice(data.id, company)
      setDelivery(result)
      await queryClient.invalidateQueries({
        queryKey: invoiceKeys.detail(data.id),
      })
    } catch (err) {
      setDelivery({
        status: 'failed',
        message:
          err instanceof Error ? err.message : 'Unable to send invoice email.',
      })
    } finally {
      setIsSending(false)
    }
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title={data?.invoice_number ?? 'Invoice'}
        description="View invoice details, download PDF, or email the customer."
        actions={
          <>
            <Link to={paths.invoices}>
              <Button variant="secondary">Back</Button>
            </Link>
            {data ? (
              <>
                <DownloadInvoicePdfButton invoice={data} />
                <Button
                  variant="secondary"
                  disabled={isSending || !company}
                  onClick={() => void handleSendEmail()}
                >
                  {isSending ? (
                    <Spinner className="h-4 w-4" />
                  ) : (
                    <Mail className="h-4 w-4" />
                  )}
                  {isSending ? 'Sending…' : 'Send email'}
                </Button>
                <Link to={paths.invoiceEdit(data.id)}>
                  <Button variant="secondary">
                    <Pencil className="h-4 w-4" />
                    Edit
                  </Button>
                </Link>
                <Button variant="danger" onClick={() => setDeleteOpen(true)}>
                  <Trash2 className="h-4 w-4" />
                  Delete
                </Button>
              </>
            ) : null}
          </>
        }
      />

      {delivery ? (
        <Alert
          variant={
            delivery.status === 'sent'
              ? 'success'
              : delivery.status === 'skipped'
                ? 'info'
                : 'error'
          }
        >
          {delivery.message ??
            (delivery.status === 'sent'
              ? 'Invoice email sent.'
              : 'Email was not sent.')}
        </Alert>
      ) : null}

      {isLoading ? (
        <Card className="flex items-center justify-center gap-3 py-16">
          <Spinner className="h-6 w-6" />
          <span className="text-sm text-surface-500">Loading invoice…</span>
        </Card>
      ) : isError ? (
        <div className="space-y-4">
          <Alert>
            {error instanceof Error ? error.message : 'Unable to load invoice.'}
          </Alert>
          <Card className="p-0">
            <EmptyState
              icon={FileText}
              title="Invoice not found"
              description="It may have been deleted or you don’t have access."
              action={
                <Link to={paths.invoices}>
                  <Button>Back to invoices</Button>
                </Link>
              }
            />
          </Card>
        </div>
      ) : data ? (
        <InvoiceDocument invoice={data} />
      ) : null}

      <DeleteInvoiceDialog
        open={deleteOpen}
        invoice={data ?? null}
        onClose={() => setDeleteOpen(false)}
        onDeleted={() => navigate(paths.invoices)}
      />
    </div>
  )
}
