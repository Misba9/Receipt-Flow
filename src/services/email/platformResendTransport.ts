import type {
  InvoiceEmailDispatchRequest,
  InvoiceEmailDispatchResult,
  InvoiceEmailTransport,
} from '@/services/email/transport'
import { invokeSendInvoiceEmail } from '@/services/invoices/email'

/**
 * Default production transport: one global Resend account (Edge Function secrets).
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

/** Active transport — swap here later for custom domains / per-company Resend. */
export function getInvoiceEmailTransport(): InvoiceEmailTransport {
  return platformResendTransport
}
