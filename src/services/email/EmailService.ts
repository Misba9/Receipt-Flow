import { getEmailMode, isEmailDevelopmentMode } from '@/services/email/config'
import {
  buildInvoiceEmailHtml,
  buildInvoiceEmailSubject,
} from '@/services/email/invoiceEmailTemplate'
import type {
  EmailSendSuccess,
  InvoiceEmailPreview,
} from '@/services/email/types'
import { invokeSendInvoiceEmail } from '@/services/invoices/email'
import type { InvoiceDetail } from '@/services/invoices/types'
import type { CompanySettings } from '@/services/settings/types'

const DEMO_SEND_MESSAGE = 'Demo Mode: Email not actually sent.'

function appUrl() {
  return (import.meta.env.VITE_APP_URL || window.location.origin).replace(
    /\/$/,
    '',
  )
}

function requireCustomerEmail(invoice: InvoiceDetail): string {
  const email = invoice.customer?.email?.trim()
  if (!email) {
    throw new Error('Customer does not have an email address.')
  }
  return email
}

/**
 * Single entry point for invoice email delivery.
 * Switch modes with `VITE_EMAIL_MODE` / `VITE_APP_ENV` only.
 */
export const EmailService = {
  getMode: getEmailMode,
  isDevelopmentMode: isEmailDevelopmentMode,

  /**
   * Sends (or simulates) an invoice email.
   * Development: no Edge Function / Resend call.
   * Production: invokes `send-invoice-email` Edge Function.
   */
  async sendInvoiceEmail(invoiceId: string): Promise<EmailSendSuccess> {
    const mode = getEmailMode()

    if (mode === 'development') {
      return {
        success: true,
        mode: 'development',
        message: DEMO_SEND_MESSAGE,
      }
    }

    const result = await invokeSendInvoiceEmail(invoiceId)

    return {
      success: true,
      mode: 'production',
      message: `Invoice emailed to ${result.to}.`,
      id: result.id,
      to: result.to,
      subject: result.subject,
    }
  },

  /** Builds a local preview without sending. */
  previewInvoiceEmail(
    invoice: InvoiceDetail,
    company: CompanySettings,
  ): InvoiceEmailPreview {
    const recipient = requireCustomerEmail(invoice)
    const companyName = company.name || 'Company'
    const subject = buildInvoiceEmailSubject(companyName)

    const html = buildInvoiceEmailHtml({
      companyName,
      companyEmail: company.email || null,
      companyPhone: company.phone || null,
      customerName: invoice.customer?.name ?? 'Customer',
      customerEmail: recipient,
      invoiceNumber: invoice.invoice_number,
      issueDate: invoice.issue_date,
      dueDate: invoice.due_date,
      currency: invoice.currency,
      subtotal: invoice.subtotal,
      discount: invoice.discount_amount,
      taxRate: invoice.tax_rate,
      taxAmount: invoice.tax_amount,
      total: invoice.total,
      brandColor: company.primaryColor || '#1a73f5',
      appUrl: appUrl(),
    })

    return {
      subject,
      recipient,
      html,
      attachmentName: `${invoice.invoice_number}.pdf`,
    }
  },
} as const
