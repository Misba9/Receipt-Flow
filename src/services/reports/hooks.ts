import { useQuery } from '@tanstack/react-query'
import { companyStatsKeys } from '@/services/dashboard/hooks'
import { fetchCompanyStats } from '@/services/dashboardStats'
import type { ReportsData } from '@/services/reports/types'

export const reportsKeys = {
  all: ['reports'] as const,
  data: () => companyStatsKeys.all,
}

function toReportsData(
  stats: Awaited<ReturnType<typeof fetchCompanyStats>>,
): ReportsData {
  return {
    dailySales: stats.dailySales,
    monthlySales: stats.monthlySales,
    invoicesByStatus: stats.invoicesByStatus,
    topCustomers: stats.topCustomers,
    revenue: stats.revenue,
  }
}

export function useReportsData() {
  return useQuery({
    queryKey: companyStatsKeys.all,
    queryFn: fetchCompanyStats,
    select: toReportsData,
  })
}
