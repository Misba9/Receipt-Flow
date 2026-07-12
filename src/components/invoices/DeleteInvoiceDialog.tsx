import { useState } from 'react'
import { AlertTriangle } from 'lucide-react'
import { Alert, Button, Modal, Spinner } from '@/components/ui'
import { useDeleteInvoice } from '@/services/invoices/hooks'
import type { InvoiceListItem } from '@/services/invoices/types'

type DeleteInvoiceDialogProps = {
  open: boolean
  invoice: InvoiceListItem | null
  onClose: () => void
  onDeleted?: () => void
}

export function DeleteInvoiceDialog({
  open,
  invoice,
  onClose,
  onDeleted,
}: DeleteInvoiceDialogProps) {
  const deleteInvoice = useDeleteInvoice()
  const [error, setError] = useState<string | null>(null)

  const handleDelete = async () => {
    if (!invoice) return
    setError(null)
    try {
      await deleteInvoice.mutateAsync(invoice.id)
      onClose()
      onDeleted?.()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unable to delete invoice.')
    }
  }

  return (
    <Modal
      open={open}
      onClose={onClose}
      title="Delete invoice"
      description="This permanently removes the invoice and its line items."
      className="max-w-md"
    >
      <div className="space-y-4">
        {error ? <Alert>{error}</Alert> : null}

        <div className="flex gap-3 rounded-xl border border-amber-200 bg-amber-50 p-3 dark:border-amber-900 dark:bg-amber-950/40">
          <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0 text-amber-600 dark:text-amber-400" />
          <p className="text-sm text-amber-900 dark:text-amber-100">
            Delete invoice{' '}
            <span className="font-semibold">{invoice?.invoice_number}</span>? This
            cannot be undone.
          </p>
        </div>

        <div className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
          <Button
            type="button"
            variant="secondary"
            onClick={onClose}
            disabled={deleteInvoice.isPending}
          >
            Cancel
          </Button>
          <Button
            type="button"
            variant="danger"
            onClick={() => void handleDelete()}
            disabled={deleteInvoice.isPending}
          >
            {deleteInvoice.isPending ? (
              <Spinner className="h-4 w-4 border-white/30 border-t-white" />
            ) : null}
            {deleteInvoice.isPending ? 'Deleting…' : 'Delete'}
          </Button>
        </div>
      </div>
    </Modal>
  )
}
