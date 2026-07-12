export type InvoiceStatus =
  | 'draft'
  | 'sent'
  | 'paid'
  | 'partially_paid'
  | 'overdue'
  | 'cancelled'
  | 'void'

export const INVOICE_STATUSES: InvoiceStatus[] = [
  'draft',
  'sent',
  'paid',
  'partially_paid',
  'overdue',
  'cancelled',
  'void',
]

export const INVOICE_STATUS_LABELS: Record<InvoiceStatus, string> = {
  draft: 'Draft',
  sent: 'Sent',
  paid: 'Paid',
  partially_paid: 'Partially Paid',
  overdue: 'Overdue',
  cancelled: 'Cancelled',
  void: 'Void',
}

export type PaymentMode =
  | 'cash'
  | 'card'
  | 'phone_pay'
  | 'google_pay'
  | 'paytm'
  | 'other'

export const PAYMENT_MODES: PaymentMode[] = [
  'cash',
  'card',
  'phone_pay',
  'google_pay',
  'paytm',
  'other',
]

export const PAYMENT_MODE_LABELS: Record<PaymentMode, string> = {
  cash: 'Cash',
  card: 'Card',
  phone_pay: 'Phone Pay',
  google_pay: 'Google Pay',
  paytm: 'Paytm',
  other: 'Other',
}

export type InvoiceItem = {
  id: string
  invoice_id: string
  description: string
  product_type: string | null
  quantity: number
  unit_price: number
  amount: number
  position: number
}

export type InvoiceCustomer = {
  id: string
  name: string
  email: string | null
  phone: string | null
  company_name: string | null
  address_line1: string | null
}

export type InvoiceListItem = {
  id: string
  invoice_number: string
  status: InvoiceStatus
  issue_date: string
  due_date: string | null
  currency: string
  subtotal: number
  tax_rate: number
  tax_amount: number
  discount_amount: number
  total: number
  amount_paid: number
  payment_mode: PaymentMode | null
  payment_mode_other: string | null
  model: string | null
  place: string | null
  employee_name: string | null
  customer: InvoiceCustomer | null
  created_at: string
}

export type InvoiceDetail = InvoiceListItem & {
  company_id: string
  customer_id: string
  notes: string | null
  footer: string | null
  paid_at: string | null
  pdf_url: string | null
  pdf_generated_at: string | null
  items: InvoiceItem[]
}

export type InvoiceItemInput = {
  description: string
  product_type: string
  quantity: number
  unit_price: number
}

export type InvoiceInput = {
  invoice_number: string
  customer_id: string
  issue_date: string
  status: InvoiceStatus
  amount_paid?: number
  discount_amount: number
  tax_rate: number
  notes: string
  payment_mode: PaymentMode | ''
  payment_mode_other: string
  model: string
  place: string
  employee_name: string
  items: InvoiceItemInput[]
}

/** Create-mode payload: customer is created with the invoice in one submit. */
export type CreateBillInput = {
  customer: {
    name: string
    phone: string
    email: string
    company_name: string
    address: string
    notes: string
  }
  invoice: Omit<InvoiceInput, 'customer_id'>
}

export type InvoicesListParams = {
  search?: string
  status?: InvoiceStatus | 'all'
  page: number
  pageSize: number
}

export type InvoicesListResult = {
  data: InvoiceListItem[]
  total: number
  page: number
  pageSize: number
  totalPages: number
}

export type InvoiceDefaults = {
  invoice_number: string
  tax_rate: number
  currency: string
  footer: string
  due_days: number
}
