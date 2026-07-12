/** Dashboard feature — stats and recent activity. */
export {
  useDashboardStats,
  useLatestCustomers,
  useRecentInvoices,
  dashboardKeys,
  companyStatsKeys,
} from '@/services/dashboard/hooks'
export type {
  DashboardStats,
  DashboardCustomer,
  DashboardInvoice,
} from '@/services/dashboard/types'
export type { InvoiceStatus } from '@/services/invoices/types'
