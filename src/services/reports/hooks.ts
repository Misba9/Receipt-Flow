import { useQuery } from '@tanstack/react-query'
import { fetchReportsData } from '@/services/reports/api'

export const reportsKeys = {
  all: ['reports'] as const,
  data: () => [...reportsKeys.all, 'data'] as const,
}

export function useReportsData() {
  return useQuery({
    queryKey: reportsKeys.data(),
    queryFn: fetchReportsData,
  })
}
