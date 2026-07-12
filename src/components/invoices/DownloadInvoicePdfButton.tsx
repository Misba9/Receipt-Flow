import { useState } from 'react'
import { useQueryClient } from '@tanstack/react-query'
import { Download, RefreshCw } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Spinner } from '@/components/ui/Spinner'
import { invoiceKeys } from '@/services/invoices/hooks'
import { downloadInvoicePdf } from '@/services/invoices/pdf'
import type { InvoiceDetail } from '@/services/invoices/types'
import { useCompanySettings } from '@/services/settings/hooks'
import { formatDate } from '@/lib/format'

type DownloadInvoicePdfButtonProps = {
  invoice: InvoiceDetail
  variant?: 'primary' | 'secondary' | 'ghost'
}

export function DownloadInvoicePdfButton({
  invoice,
  variant = 'primary',
}: DownloadInvoicePdfButtonProps) {
  const queryClient = useQueryClient()
  const { data: company, isLoading: companyLoading } = useCompanySettings()
  const [isWorking, setIsWorking] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const hasStoredPdf = Boolean(invoice.pdf_url)

  const runDownload = async (regenerate: boolean) => {
    if (!company) {
      setError('Company settings are required to generate a PDF.')
      return
    }

    setError(null)
    setIsWorking(true)
    try {
      const result = await downloadInvoicePdf(invoice, company, { regenerate })
      if (!result.fromStorage) {
        await queryClient.invalidateQueries({
          queryKey: invoiceKeys.detail(invoice.id),
        })
      }
    } catch (err) {
      setError(
        err instanceof Error ? err.message : 'Unable to download PDF invoice.',
      )
    } finally {
      setIsWorking(false)
    }
  }

  return (
    <div className="flex flex-col items-stretch gap-1 sm:items-end">
      <div className="flex flex-wrap justify-end gap-2">
        <Button
          type="button"
          variant={variant}
          disabled={isWorking || companyLoading || !company}
          onClick={() => void runDownload(false)}
        >
          {isWorking ? (
            <Spinner className="h-4 w-4 border-white/30 border-t-white" />
          ) : (
            <Download className="h-4 w-4" />
          )}
          {isWorking
            ? hasStoredPdf
              ? 'Downloading…'
              : 'Generating…'
            : hasStoredPdf
              ? 'Download PDF'
              : 'Generate & download'}
        </Button>

        {hasStoredPdf ? (
          <Button
            type="button"
            variant="secondary"
            disabled={isWorking || companyLoading || !company}
            onClick={() => void runDownload(true)}
            title="Regenerate PDF from current invoice data and replace the stored file"
          >
            <RefreshCw className="h-4 w-4" />
            Regenerate
          </Button>
        ) : null}
      </div>

      {hasStoredPdf && invoice.pdf_generated_at ? (
        <p className="text-xs text-surface-400">
          Saved PDF from {formatDate(invoice.pdf_generated_at)}
        </p>
      ) : null}

      {error ? (
        <p className="max-w-xs text-right text-xs text-red-600 dark:text-red-400">
          {error}
        </p>
      ) : null}
    </div>
  )
}
