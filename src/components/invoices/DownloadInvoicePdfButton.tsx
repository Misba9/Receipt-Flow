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
import { cn } from '@/utils'

type DownloadInvoicePdfButtonProps = {
  invoice: InvoiceDetail
  variant?: 'primary' | 'secondary' | 'ghost'
  size?: 'sm' | 'md' | 'lg'
  className?: string
}

export function DownloadInvoicePdfButton({
  invoice,
  variant = 'primary',
  size = 'md',
  className,
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
    <div className="relative shrink-0">
      <Button
        type="button"
        variant={variant}
        size={size}
        className={cn(size === 'sm' && 'sm:h-11 sm:px-4', className)}
        disabled={isWorking || companyLoading || !company}
        onClick={() => void handleDownload()}
      >
        {isWorking ? (
          <Spinner className="h-4 w-4 border-white/30 border-t-white" />
        ) : (
          <Download className="h-4 w-4" />
        )}
        <span className="hidden sm:inline">
          {isWorking ? 'Generating…' : 'Download PDF'}
        </span>
        <span className="sm:hidden">{isWorking ? '…' : 'PDF'}</span>
      </Button>

      {error ? (
        <p className="absolute top-full right-0 z-10 mt-1 max-w-[16rem] text-right text-xs text-red-600 dark:text-red-400">
          {error}
        </p>
      ) : null}
    </div>
  )
}
