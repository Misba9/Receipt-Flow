import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import {
  fetchCompanySettings,
  updateCompanySettings,
  uploadCompanyLogo,
  removeCompanyLogo,
} from '@/services/settings/api'
import type { CompanySettingsInput } from '@/services/settings/types'
import { useAuth } from '@/hooks/useAuth'

export const settingsKeys = {
  all: ['settings'] as const,
  company: () => [...settingsKeys.all, 'company'] as const,
}

export function useCompanySettings() {
  const { isAuthenticated, isLoading: authLoading } = useAuth()

  return useQuery({
    queryKey: settingsKeys.company(),
    queryFn: fetchCompanySettings,
    enabled: isAuthenticated && !authLoading,
  })
}

export function useUpdateCompanySettings() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (input: CompanySettingsInput) => updateCompanySettings(input),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: settingsKeys.company() })
    },
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
