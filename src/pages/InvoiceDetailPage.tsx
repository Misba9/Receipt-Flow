import { useState } from 'react'
import { Link, useLocation, useNavigate, useParams } from 'react-router-dom'
import { Eye, FileText, Mail, Pencil, Trash2 } from 'lucide-react'
import { DeleteInvoiceDialog } from '@/components/invoices/DeleteInvoiceDialog'
import { DemoModeEmailBadge } from '@/components/invoices/DemoModeEmailBadge'
import { DownloadInvoicePdfButton } from '@/components/invoices/DownloadInvoicePdfButton'
import { EmailPreviewModal } from '@/components/invoices/EmailPreviewModal'
import { InvoiceDocument } from '@/components/invoices/InvoiceDocument'
import { PageHeader } from '@/layouts/PageHeader'
import { Alert, Button, Card, EmptyState, Spinner } from '@/components/ui'
import { EmailService, type InvoiceEmailPreview } from '@/services/email'
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
  const [previewOpen, setPreviewOpen] = useState(false)
  const [preview, setPreview] = useState<InvoiceEmailPreview | null>(null)
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

  const handlePreviewEmail = () => {
    if (!data || !company) return
    try {
      const next = EmailService.previewInvoiceEmail(data, company)
      setPreview(next)
      setPreviewOpen(true)
    } catch (err) {
      toast(
        err instanceof Error ? err.message : 'Unable to preview email.',
        'error',
      )
    }
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title={data?.invoice_number ?? 'Invoice'}
        description="View invoice details, download PDF, or email the customer."
        actions={
          <>
            <DemoModeEmailBadge />
            <Link to={paths.invoices}>
              <Button variant="secondary">Back</Button>
            </Link>
            {data ? (
              <>
                <DownloadInvoicePdfButton invoice={data} />
                <Button
                  variant="secondary"
                  disabled={!company}
                  onClick={handlePreviewEmail}
                >
                  <Eye className="h-4 w-4" />
                  Preview email
                </Button>
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

      <EmailPreviewModal
        open={previewOpen}
        preview={preview}
        onClose={() => setPreviewOpen(false)}
      />

      <DeleteInvoiceDialog
        open={deleteOpen}
        invoice={data ?? null}
        onClose={() => setDeleteOpen(false)}
        onDeleted={() => navigate(paths.invoices)}
      />
    </div>
  )
}
