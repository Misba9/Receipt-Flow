import { EmailService } from '@/services/email'
import { fetchInvoice, uploadInvoicePdf } from '@/services/invoices/api'
import type { InvoiceEmailSendMode } from '@/services/invoices/email'
import { generateInvoicePdf } from '@/services/invoices/pdf'
import type { CompanySettings } from '@/services/settings/types'

export type InvoiceDeliveryStatus = 'sent' | 'skipped' | 'failed'

export type InvoiceDeliveryResult = {
  status: InvoiceDeliveryStatus
  message?: string
  to?: string
  mode?: 'development' | 'production'
}

export type DeliverInvoiceOptions = {
  /**
   * automatic — create-bill / first delivery (content-based idempotency)
   * manual — Send email button (fresh UUID every click)
   */
  sendMode?: InvoiceEmailSendMode
}

/**
 * Generate PDF → upload to Storage → email via EmailService.
 * PDF generation always runs; only the email transport respects development mode.
 */
export async function deliverNewInvoice(
  invoiceId: string,
  company: CompanySettings,
  options: DeliverInvoiceOptions = {},
): Promise<InvoiceDeliveryResult> {
  const sendMode = options.sendMode ?? 'automatic'
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
    const result = await EmailService.sendInvoiceEmail(invoiceId, {
      sendMode,
      // Manual clicks always get a brand-new key; automatic uses server content hash.
      idempotencyKey:
        sendMode === 'manual' ? `rf-manual-${crypto.randomUUID()}` : undefined,
    })
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
    console.error('[email] deliverNewInvoice failed', error)
    return {
      status: 'failed',
      message:
        error instanceof Error
          ? error.message
          : 'Unable to send email. Please try again later.',
    }
  }
}
