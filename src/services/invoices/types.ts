export type InvoiceStatus =
  | 'draft'
  | 'sent'
  | 'paid'
  | 'overdue'
  | 'cancelled'
  | 'void'

export const INVOICE_STATUSES: InvoiceStatus[] = [
  'draft',
  'sent',
  'paid',
  'overdue',
  'cancelled',
  'void',
]

export type InvoiceItem = {
  id: string
  invoice_id: string
  description: string
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
  quantity: number
  unit_price: number
}

export type InvoiceInput = {
  invoice_number: string
  customer_id: string
  issue_date: string
  status: InvoiceStatus
  discount_amount: number
  tax_rate: number
  notes: string
  items: InvoiceItemInput[]
}

/** Create-mode payload: customer is created with the invoice in one submit. */
export type CreateBillInput = {
  customer: {
    name: string
    phone: string
    email: string
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
