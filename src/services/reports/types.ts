import type { InvoiceStatus } from '@/services/invoices/types'

export type DailySalesPoint = {
  date: string
  label: string
  total: number
  count: number
}

export type MonthlySalesPoint = {
  month: string
  label: string
  total: number
  count: number
}

export type InvoiceStatusPoint = {
  status: InvoiceStatus
  label: string
  count: number
  total: number
}

export type TopCustomerPoint = {
  customerId: string
  name: string
  email: string | null
  total: number
  invoiceCount: number
}

export type RevenueSummary = {
  totalRevenue: number
  thisMonthRevenue: number
  lastMonthRevenue: number
  outstanding: number
  paidCount: number
  invoiceCount: number
  currency: string
  /** Fully paid invoices with payment date = today (shared with Dashboard). */
  todaysSales: number
}

export type ReportsData = {
  dailySales: DailySalesPoint[]
  monthlySales: MonthlySalesPoint[]
  invoicesByStatus: InvoiceStatusPoint[]
  topCustomers: TopCustomerPoint[]
  revenue: RevenueSummary
}
