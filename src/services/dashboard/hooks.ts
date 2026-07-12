import { useQuery } from '@tanstack/react-query'
import {
  fetchDashboardStats,
  fetchLatestCustomers,
  fetchRecentInvoices,
} from '@/services/dashboard/api'

export const dashboardKeys = {
  all: ['dashboard'] as const,
  stats: () => [...dashboardKeys.all, 'stats'] as const,
  latestCustomers: () => [...dashboardKeys.all, 'latest-customers'] as const,
  recentInvoices: () => [...dashboardKeys.all, 'recent-invoices'] as const,
}

export function useDashboardStats() {
  return useQuery({
    queryKey: dashboardKeys.stats(),
    queryFn: fetchDashboardStats,
  })
}

export function useLatestCustomers() {
  return useQuery({
    queryKey: dashboardKeys.latestCustomers(),
    queryFn: () => fetchLatestCustomers(5),
  })
}

export function useRecentInvoices() {
  return useQuery({
    queryKey: dashboardKeys.recentInvoices(),
    queryFn: () => fetchRecentInvoices(5),
  })
}
