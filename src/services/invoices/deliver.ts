import { EmailService } from '@/services/email'
import { fetchInvoice, uploadInvoicePdf } from '@/services/invoices/api'
import { generateInvoicePdf } from '@/services/invoices/pdf'
import type { CompanySettings } from '@/services/settings/types'

export type InvoiceDeliveryStatus = 'sent' | 'skipped' | 'failed'

export type InvoiceDeliveryResult = {
  status: InvoiceDeliveryStatus
  message?: string
  to?: string
  mode?: 'development' | 'production'
}

/**
 * After an invoice is created: generate PDF → upload to Storage → email via EmailService.
 * PDF generation always runs; only the email transport respects development mode.
 */
export async function deliverNewInvoice(
  invoiceId: string,
  company: CompanySettings,
): Promise<InvoiceDeliveryResult> {
  const invoice = await fetchInvoice(invoiceId)

  const blob = await generateInvoicePdf(invoice, company)
  await uploadInvoicePdf(invoice, blob)

  const customerEmail = invoice.customer?.email?.trim()
  if (!customerEmail) {
    return {
      status: 'skipped',
      message:
        'Invoice saved and PDF stored. Customer has no email, so nothing was sent.',
    }
  }

  try {
    const result = await EmailService.sendInvoiceEmail(invoiceId)
    return {
      status: 'sent',
      to: result.to ?? customerEmail,
      mode: result.mode,
      message:
        result.mode === 'development'
          ? 'Demo Mode: Invoice would have been sent successfully.'
          : result.message,
    }
  } catch (error) {
    return {
      status: 'failed',
      message:
        error instanceof Error
          ? error.message
          : 'Invoice saved, but email could not be sent.',
    }
  }
}
