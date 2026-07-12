import { useQuery } from '@tanstack/react-query'
import { fetchLatestCustomers } from '@/services/dashboard/api'
import {
  fetchCompanyStats,
  fetchRecentInvoices,
} from '@/services/dashboardStats'
import type { DashboardStats } from '@/services/dashboard/types'

export const companyStatsKeys = {
  all: ['company-stats'] as const,
}

export const dashboardKeys = {
  all: ['dashboard'] as const,
  stats: () => companyStatsKeys.all,
  latestCustomers: () => [...dashboardKeys.all, 'latest-customers'] as const,
  recentInvoices: () => [...dashboardKeys.all, 'recent-invoices'] as const,
}

function toDashboardStats(
  stats: Awaited<ReturnType<typeof fetchCompanyStats>>,
): DashboardStats {
  return {
    todaysSales: stats.revenue.todaysSales,
    totalCustomers: stats.customerCount,
    totalInvoices: stats.invoiceCount,
    revenue: stats.revenue.totalRevenue,
    outstanding: stats.revenue.outstanding,
    currency: stats.currency,
  }
}

export function useDashboardStats() {
  return useQuery({
    queryKey: companyStatsKeys.all,
    queryFn: fetchCompanyStats,
    select: toDashboardStats,
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
