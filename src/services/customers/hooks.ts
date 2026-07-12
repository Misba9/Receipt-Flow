import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import {
  createCustomer,
  deleteCustomer,
  fetchCustomers,
  updateCustomer,
} from '@/services/customers/api'
import type { CustomerInput, CustomersListParams } from '@/services/customers/types'
import {
  companyStatsKeys,
  dashboardKeys,
} from '@/services/dashboard/hooks'
import { useAuth } from '@/hooks/useAuth'

export const customerKeys = {
  all: ['customers'] as const,
  lists: () => [...customerKeys.all, 'list'] as const,
  list: (params: CustomersListParams) =>
    [...customerKeys.lists(), params] as const,
}

export function useCustomers(params: CustomersListParams) {
  const { isAuthenticated, isLoading: authLoading } = useAuth()

  return useQuery({
    queryKey: customerKeys.list(params),
    queryFn: () => fetchCustomers(params),
    enabled: isAuthenticated && !authLoading,
    placeholderData: (previous) => previous,
  })
}

function invalidateCustomerQueries(queryClient: ReturnType<typeof useQueryClient>) {
  return Promise.all([
    queryClient.invalidateQueries({ queryKey: customerKeys.all }),
    queryClient.invalidateQueries({ queryKey: dashboardKeys.all }),
    queryClient.invalidateQueries({ queryKey: companyStatsKeys.all }),
  ])
}

export function useCreateCustomer() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (input: CustomerInput) => createCustomer(input),
    onSuccess: () => invalidateCustomerQueries(queryClient),
  })
}

export function useUpdateCustomer() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, input }: { id: string; input: CustomerInput }) =>
      updateCustomer(id, input),
    onSuccess: () => invalidateCustomerQueries(queryClient),
  })
}

export function useDeleteCustomer() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: string) => deleteCustomer(id),
    onSuccess: () => invalidateCustomerQueries(queryClient),
  })
}
