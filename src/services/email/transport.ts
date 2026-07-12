/**
 * Email transport abstraction.
 * Today: platform Resend via Edge Function.
 * Later: custom domains / per-company Resend without changing the frontend.
 */

export type EmailTransportKind = 'platform_resend' | 'custom_domain' | 'company_resend'

export type InvoiceEmailDispatchRequest = {
  invoiceId: string
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
