import type {
  InvoiceEmailDispatchRequest,
  InvoiceEmailDispatchResult,
  InvoiceEmailTransport,
} from '@/services/email/transport'
import { invokeSendInvoiceEmail } from '@/services/invoices/email'

/**
 * Production transport: one global Resend account (Edge Function secrets).
 * Tenants never connect Resend or verify a domain.
 */
export const platformResendTransport: InvoiceEmailTransport = {
  kind: 'platform_resend',

  async sendInvoiceEmail(
    request: InvoiceEmailDispatchRequest,
  ): Promise<InvoiceEmailDispatchResult> {
    const result = await invokeSendInvoiceEmail(request.invoiceId, {
      sendMode: request.sendMode,
      idempotencyKey: request.idempotencyKey,
    })
    return {
      success: true,
      id: result.id,
      to: result.to,
      subject: result.subject,
      from: result.from,
      transport: 'platform_resend',
    }
  },
}

export function getInvoiceEmailTransport(): InvoiceEmailTransport {
  return platformResendTransport
}
