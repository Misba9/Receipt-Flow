import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import {
  deleteCompany,
  fetchAdminCompanies,
  fetchAdminUsers,
  fetchPlatformStats,
  fetchSessionAccess,
  setCompanyActive,
  setCompanySubscription,
} from '@/services/admin/api'
import type { SubscriptionStatus } from '@/services/admin/types'
import { useAuth } from '@/hooks/useAuth'

export const adminKeys = {
  all: ['admin'] as const,
  access: () => [...adminKeys.all, 'access'] as const,
  stats: () => [...adminKeys.all, 'stats'] as const,
  companies: () => [...adminKeys.all, 'companies'] as const,
  users: () => [...adminKeys.all, 'users'] as const,
}

export function useSessionAccess() {
  const { isAuthenticated, isLoading: authLoading, user } = useAuth()

  return useQuery({
    queryKey: [...adminKeys.access(), user?.id ?? null],
    queryFn: fetchSessionAccess,
    enabled: isAuthenticated && !authLoading,
    staleTime: 30_000,
    retry: 1,
    refetchOnWindowFocus: false,
  })
}

export function usePlatformStats(enabled = true) {
  const { isAuthenticated, isLoading: authLoading } = useAuth()

  return useQuery({
    queryKey: adminKeys.stats(),
    queryFn: fetchPlatformStats,
    enabled: enabled && isAuthenticated && !authLoading,
  })
}

export function useAdminCompanies(enabled = true) {
  const { isAuthenticated, isLoading: authLoading } = useAuth()

  return useQuery({
    queryKey: adminKeys.companies(),
    queryFn: fetchAdminCompanies,
    enabled: enabled && isAuthenticated && !authLoading,
  })
}

export function useAdminUsers(enabled = true) {
  const { isAuthenticated, isLoading: authLoading } = useAuth()

  return useQuery({
    queryKey: adminKeys.users(),
    queryFn: fetchAdminUsers,
    enabled: enabled && isAuthenticated && !authLoading,
  })
}

export function useSetCompanyActive() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({
      companyId,
      isActive,
      reason,
    }: {
      companyId: string
      isActive: boolean
      reason?: string
    }) => setCompanyActive(companyId, isActive, reason),
    onSuccess: async () => {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: adminKeys.companies() }),
        queryClient.invalidateQueries({ queryKey: adminKeys.stats() }),
        queryClient.invalidateQueries({ queryKey: adminKeys.users() }),
      ])
    },
  })
}

export function useSetCompanySubscription() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({
      companyId,
      status,
      plan,
      endsAt,
    }: {
      companyId: string
      status: SubscriptionStatus
      plan?: string | null
      endsAt?: string | null
    }) => setCompanySubscription(companyId, status, plan, endsAt),
    onSuccess: async () => {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: adminKeys.companies() }),
        queryClient.invalidateQueries({ queryKey: adminKeys.stats() }),
      ])
    },
  })
}

export function useDeleteCompany() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (companyId: string) => deleteCompany(companyId),
    onSuccess: async () => {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: adminKeys.companies() }),
        queryClient.invalidateQueries({ queryKey: adminKeys.stats() }),
        queryClient.invalidateQueries({ queryKey: adminKeys.users() }),
      ])
    },
  })
}
