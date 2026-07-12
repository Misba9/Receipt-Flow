export {
  buildInvoiceEmailHtml,
  buildInvoiceEmailSubject,
} from '@/services/email/invoiceEmailTemplate'
export type {
  EmailMode,
  EmailSendSuccess,
  InvoiceEmailPreview,
} from '@/services/email/types'
export { getEmailMode, isEmailDevelopmentMode } from '@/services/email/config'
export { EmailService } from '@/services/email/EmailService'
export type {
  EmailTransportKind,
  InvoiceEmailTransport,
} from '@/services/email/transport'
export { getInvoiceEmailTransport } from '@/services/email/platformResendTransport'
