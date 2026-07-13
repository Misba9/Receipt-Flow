import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import {
  fetchCompanySettings,
  removeCompanyLogo,
  updateCompanyBranding,
  updateCompanyLocalization,
  updateCompanyProfile,
  updateCompanySettings,
  uploadCompanyLogo,
} from '@/services/settings/api'
import type {
  CompanyBrandingInput,
  CompanyLocalizationInput,
  CompanyProfileInput,
  CompanySettingsInput,
} from '@/services/settings/types'
import { invoiceKeys } from '@/services/invoices/hooks'
import { companyStatsKeys, dashboardKeys } from '@/services/dashboard/hooks'
import { useAuth } from '@/hooks/useAuth'

export const settingsKeys = {
  all: ['settings'] as const,
  company: () => [...settingsKeys.all, 'company'] as const,
}

async function invalidateSettingsCaches(
  queryClient: ReturnType<typeof useQueryClient>,
) {
  await Promise.all([
    queryClient.invalidateQueries({ queryKey: settingsKeys.company() }),
    queryClient.invalidateQueries({ queryKey: invoiceKeys.defaults() }),
    queryClient.invalidateQueries({ queryKey: dashboardKeys.all }),
    queryClient.invalidateQueries({ queryKey: companyStatsKeys.all }),
  ])
}

export function useCompanySettings() {
  const { isAuthenticated, isLoading: authLoading } = useAuth()

  return useQuery({
    queryKey: settingsKeys.company(),
    queryFn: fetchCompanySettings,
    enabled: isAuthenticated && !authLoading,
    staleTime: 30_000,
    retry: 1,
    refetchOnWindowFocus: false,
  })
}

export function useUpdateCompanySettings() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (input: CompanySettingsInput) => updateCompanySettings(input),
    onSuccess: () => invalidateSettingsCaches(queryClient),
  })
}

export function useUpdateCompanyProfile() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (input: CompanyProfileInput) => updateCompanyProfile(input),
    onSuccess: () => invalidateSettingsCaches(queryClient),
  })
}

export function useUpdateCompanyLocalization() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (input: CompanyLocalizationInput) =>
      updateCompanyLocalization(input),
    onSuccess: () => invalidateSettingsCaches(queryClient),
  })
}

export function useUpdateCompanyBranding() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (input: CompanyBrandingInput) => updateCompanyBranding(input),
    onSuccess: () => invalidateSettingsCaches(queryClient),
  })
}

export function useUploadCompanyLogo() {
  return useMutation({
    mutationFn: (file: File) => uploadCompanyLogo(file),
  })
}

export function useRemoveCompanyLogo() {
  return useMutation({
    mutationFn: (logoUrl: string | null) => removeCompanyLogo(logoUrl),
  })
}
