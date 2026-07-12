import { useState } from 'react'
import { Link, useLocation, useNavigate, useParams } from 'react-router-dom'
import { ArrowLeft, FileText, Mail, Pencil, Trash2 } from 'lucide-react'
import { DeleteInvoiceDialog } from '@/components/invoices/DeleteInvoiceDialog'
import { DemoModeEmailBadge } from '@/components/invoices/DemoModeEmailBadge'
import { DownloadInvoicePdfButton } from '@/components/invoices/DownloadInvoicePdfButton'
import { InvoiceDocument } from '@/components/invoices/InvoiceDocument'
import { PageHeader } from '@/layouts/PageHeader'
import { Alert, Button, Card, EmptyState, Spinner } from '@/components/ui'
import { deliverNewInvoice } from '@/services/invoices/deliver'
import type { InvoiceDeliveryResult } from '@/services/invoices/deliver'
import { useInvoice, invoiceKeys } from '@/services/invoices/hooks'
import { useCompanySettings } from '@/services/settings/hooks'
import { useToast } from '@/hooks/useToast'
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
  const { toast } = useToast()
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
      const result = await deliverNewInvoice(data.id, company, {
        sendMode: 'manual',
      })
      setDelivery(result)
      await queryClient.invalidateQueries({
        queryKey: invoiceKeys.detail(data.id),
      })

      if (result.status === 'sent' && result.mode === 'development') {
        toast(
          'Demo Mode: Invoice would have been sent successfully.',
          'success',
        )
      } else if (result.status === 'sent') {
        toast(result.message ?? 'Invoice email sent.', 'success')
      } else if (result.status === 'failed') {
        toast(result.message ?? 'Unable to send invoice email.', 'error')
      } else if (result.status === 'skipped') {
        toast(result.message ?? 'Email skipped.', 'info')
      }
    } catch (err) {
      const message =
        err instanceof Error ? err.message : 'Unable to send invoice email.'
      setDelivery({
        status: 'failed',
        message,
      })
      toast(message, 'error')
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
            <DemoModeEmailBadge className="w-full basis-full sm:w-auto sm:basis-auto" />
            <Link to={paths.invoices} className="shrink-0">
              <Button variant="secondary" size="sm" className="sm:h-11 sm:px-4">
                <ArrowLeft className="h-4 w-4" />
                Back
              </Button>
            </Link>
            {data ? (
              <>
                <DownloadInvoicePdfButton invoice={data} size="sm" />
                <Button
                  variant="secondary"
                  size="sm"
                  className="sm:h-11 sm:px-4"
                  disabled={isSending || !company}
                  onClick={() => void handleSendEmail()}
                >
                  {isSending ? (
                    <Spinner className="h-4 w-4" />
                  ) : (
                    <Mail className="h-4 w-4" />
                  )}
                  <span className="hidden sm:inline">
                    {isSending ? 'Sending…' : 'Send email'}
                  </span>
                  <span className="sm:hidden">
                    {isSending ? 'Sending…' : 'Email'}
                  </span>
                </Button>
                <Link to={paths.invoiceEdit(data.id)} className="shrink-0">
                  <Button
                    variant="secondary"
                    size="sm"
                    className="sm:h-11 sm:px-4"
                  >
                    <Pencil className="h-4 w-4" />
                    Edit
                  </Button>
                </Link>
                <Button
                  variant="danger"
                  size="sm"
                  className="sm:h-11 sm:px-4"
                  onClick={() => setDeleteOpen(true)}
                >
                  <Trash2 className="h-4 w-4" />
                  <span className="hidden sm:inline">Delete</span>
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
