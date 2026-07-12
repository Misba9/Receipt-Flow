export type { InvoiceStatus } from '@/services/invoices/types'

export type DashboardCustomer = {
  id: string
  name: string
  email: string | null
  company_name: string | null
  created_at: string
}

export type DashboardInvoice = {
  id: string
  invoice_number: string
  status: import('@/services/invoices/types').InvoiceStatus
  total: number
  currency: string
  issue_date: string
  customer: {
    name: string
  } | null
}

export type DashboardStats = {
  todaysSales: number
  totalCustomers: number
  totalInvoices: number
  revenue: number
  outstanding: number
  currency: string
}
