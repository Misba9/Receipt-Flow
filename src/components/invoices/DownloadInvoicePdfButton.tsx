import { useState } from 'react'
import { useQueryClient } from '@tanstack/react-query'
import { Download } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Spinner } from '@/components/ui/Spinner'
import { invoiceKeys } from '@/services/invoices/hooks'
import { downloadInvoicePdf } from '@/services/invoices/pdf'
import type { InvoiceDetail } from '@/services/invoices/types'
import { useCompanySettings } from '@/services/settings/hooks'
import { useToast } from '@/hooks/useToast'

type DownloadInvoicePdfButtonProps = {
  invoice: InvoiceDetail
  variant?: 'primary' | 'secondary' | 'ghost'
}

export function DownloadInvoicePdfButton({
  invoice,
  variant = 'primary',
}: DownloadInvoicePdfButtonProps) {
  const queryClient = useQueryClient()
  const { toast } = useToast()
  const { data: company, isLoading: companyLoading } = useCompanySettings()
  const [isWorking, setIsWorking] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleDownload = async () => {
    if (!company) {
      setError('Company settings are required to generate a PDF.')
      return
    }

    setError(null)
    setIsWorking(true)
    try {
      // Always regenerate so totals/layout fixes are never stuck on a stale stored file.
      await downloadInvoicePdf(invoice, company, { regenerate: true })
      await queryClient.invalidateQueries({
        queryKey: invoiceKeys.detail(invoice.id),
      })
      toast('PDF downloaded.', 'success')
    } catch (err) {
      const message =
        err instanceof Error ? err.message : 'Unable to download PDF invoice.'
      setError(message)
      toast(message, 'error')
    } finally {
      setIsWorking(false)
    }
  }

  return (
    <div className="flex flex-col items-stretch gap-1 sm:items-end">
      <Button
        type="button"
        variant={variant}
        disabled={isWorking || companyLoading || !company}
        onClick={() => void handleDownload()}
      >
        {isWorking ? (
          <Spinner className="h-4 w-4 border-white/30 border-t-white" />
        ) : (
          <Download className="h-4 w-4" />
        )}
        {isWorking ? 'Generating…' : 'Download PDF'}
      </Button>

      {error ? (
        <p className="max-w-xs text-right text-xs text-red-600 dark:text-red-400">
          {error}
        </p>
      ) : null}
    </div>
  )
}
