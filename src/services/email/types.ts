export type EmailMode = 'development' | 'production'

export type EmailSendSuccess = {
  success: true
  mode: EmailMode
  message: string
  id?: string | null
  to?: string
  subject?: string
}

export type InvoiceEmailPreview = {
  subject: string
  recipient: string
  html: string
  attachmentName: string
}

export type BuildInvoiceEmailInput = {
  companyName: string
  companyEmail: string | null
  companyPhone: string | null
  customerName: string
  customerEmail: string
  invoiceNumber: string
  issueDate: string
  dueDate: string | null
  currency: string
  subtotal: number
  discount: number
  taxRate: number
  taxAmount: number
  total: number
  brandColor: string
  appUrl: string
}
