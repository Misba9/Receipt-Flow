import { Eye } from 'lucide-react'
import { Modal } from '@/components/ui/Modal'
import { Badge } from '@/components/ui/Badge'
import type { InvoiceEmailPreview } from '@/services/email'

type EmailPreviewModalProps = {
  open: boolean
  preview: InvoiceEmailPreview | null
  onClose: () => void
}

export function EmailPreviewModal({
  open,
  preview,
  onClose,
}: EmailPreviewModalProps) {
  return (
    <Modal
      open={open}
      onClose={onClose}
      title="Preview email"
      description="This is a local preview. Nothing is sent."
      className="max-w-3xl"
    >
      {!preview ? (
        <p className="text-sm text-surface-500">No preview available.</p>
      ) : (
        <div className="space-y-4">
          <dl className="grid gap-3 text-sm sm:grid-cols-2">
            <div className="rounded-lg border border-surface-200 p-3 dark:border-surface-800">
              <dt className="text-xs font-medium uppercase tracking-wide text-surface-500">
                Subject
              </dt>
              <dd className="mt-1 font-medium text-surface-900 dark:text-surface-50">
                {preview.subject}
              </dd>
            </div>
            <div className="rounded-lg border border-surface-200 p-3 dark:border-surface-800">
              <dt className="text-xs font-medium uppercase tracking-wide text-surface-500">
                Recipient
              </dt>
              <dd className="mt-1 font-medium text-surface-900 dark:text-surface-50">
                {preview.recipient}
              </dd>
            </div>
            <div className="rounded-lg border border-surface-200 p-3 sm:col-span-2 dark:border-surface-800">
              <dt className="text-xs font-medium uppercase tracking-wide text-surface-500">
                Attachment
              </dt>
              <dd className="mt-1 flex items-center gap-2 font-medium text-surface-900 dark:text-surface-50">
                <Badge variant="info">{preview.attachmentName}</Badge>
              </dd>
            </div>
          </dl>

          <div>
            <div className="mb-2 flex items-center gap-2 text-sm font-medium text-surface-700 dark:text-surface-200">
              <Eye className="h-4 w-4" />
              HTML email
            </div>
            <div className="overflow-hidden rounded-xl border border-surface-200 bg-surface-50 dark:border-surface-800 dark:bg-surface-950">
              <iframe
                title="Invoice email preview"
                srcDoc={preview.html}
                className="h-[420px] w-full bg-white"
                sandbox=""
              />
            </div>
          </div>
        </div>
      )}
    </Modal>
  )
}
