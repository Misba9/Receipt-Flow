import { fetchInvoice, uploadInvoicePdf } from '@/services/invoices/api'
import { sendInvoiceEmail } from '@/services/invoices/email'
import { generateInvoicePdf } from '@/services/invoices/pdf'
import type { CompanySettings } from '@/services/settings/types'

export type InvoiceDeliveryStatus = 'sent' | 'skipped' | 'failed'

export type InvoiceDeliveryResult = {
  status: InvoiceDeliveryStatus
  message?: string
  to?: string
}

/**
 * After an invoice is created: generate PDF → upload to Storage → email via Resend.
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
    const result = await sendInvoiceEmail(invoiceId)
    return {
      status: 'sent',
      to: result.to,
      message: `Invoice emailed to ${result.to}.`,
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
