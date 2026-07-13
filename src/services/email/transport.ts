/**
 * Email transport abstraction for the platform Resend Edge Function.
 */

export type EmailTransportKind = 'platform_resend'

export type InvoiceEmailDispatchRequest = {
  invoiceId: string
  /** automatic = content fingerprint; manual = fresh UUID per click */
  sendMode?: 'automatic' | 'manual'
  /** Manual sends should pass a new UUID every click */
  idempotencyKey?: string
}

export type InvoiceEmailDispatchResult = {
  success: true
  id: string | null
  to: string
  subject: string
  from?: string
  transport: EmailTransportKind
}

export interface InvoiceEmailTransport {
  readonly kind: EmailTransportKind
  sendInvoiceEmail(
    request: InvoiceEmailDispatchRequest,
  ): Promise<InvoiceEmailDispatchResult>
}
