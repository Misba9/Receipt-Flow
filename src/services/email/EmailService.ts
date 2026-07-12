import { getEmailMode, isEmailDevelopmentMode } from '@/services/email/config'
import {
  buildInvoiceEmailHtml,
  buildInvoiceEmailSubject,
} from '@/services/email/invoiceEmailTemplate'
import { getInvoiceEmailTransport } from '@/services/email/platformResendTransport'
import type {
  EmailSendSuccess,
  InvoiceEmailPreview,
} from '@/services/email/types'
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
 * Single frontend entry point for invoice email.
 * Transport is swappable (platform Resend today; custom domains later).
 */
export const EmailService = {
  getMode: getEmailMode,
  isDevelopmentMode: isEmailDevelopmentMode,

  async sendInvoiceEmail(invoiceId: string): Promise<EmailSendSuccess> {
    const mode = getEmailMode()

    if (mode === 'development') {
      return {
        success: true,
        mode: 'development',
        message: DEMO_SEND_MESSAGE,
      }
    }

    const transport = getInvoiceEmailTransport()
    const result = await transport.sendInvoiceEmail({ invoiceId })

    return {
      success: true,
      mode: 'production',
      message: `Invoice emailed to ${result.to}.`,
      id: result.id,
      to: result.to,
      subject: result.subject,
    }
  },

  previewInvoiceEmail(
    invoice: InvoiceDetail,
    company: CompanySettings,
  ): InvoiceEmailPreview {
    const recipient = requireCustomerEmail(invoice)
    const companyName = company.name.trim()
    if (!companyName) {
      throw new Error('Company name is required before previewing email.')
    }

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
      brandColor: company.primaryColor,
      appUrl: appUrl(),
    })

    return {
      subject,
      recipient,
      html,
      attachmentName: `${invoice.invoice_number}.pdf`,
      from: `${company.senderName} <${company.senderEmail}>`,
      replyTo: company.replyTo || company.email || undefined,
    }
  },
} as const
