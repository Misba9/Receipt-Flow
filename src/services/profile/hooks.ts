import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useAuth } from '@/hooks/useAuth'
import {
  dismissEmailVerifyBanner,
  fetchProfileVerification,
  markEmailVerified,
  sendEmailVerificationLink,
} from '@/services/profile/api'

export const profileKeys = {
  all: ['profile'] as const,
  verification: (userId: string | null) =>
    [...profileKeys.all, 'verification', userId] as const,
}

export function useProfileVerification() {
  const { isAuthenticated, isLoading: authLoading, user } = useAuth()

  return useQuery({
    queryKey: profileKeys.verification(user?.id ?? null),
    queryFn: fetchProfileVerification,
    enabled: isAuthenticated && !authLoading,
    staleTime: 30_000,
  })
}

export function useDismissEmailVerifyBanner() {
  const queryClient = useQueryClient()
  const { user } = useAuth()

  return useMutation({
    mutationFn: dismissEmailVerifyBanner,
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: profileKeys.verification(user?.id ?? null),
      })
    },
  })
}

export function useMarkEmailVerified() {
  const queryClient = useQueryClient()
  const { user } = useAuth()

  return useMutation({
    mutationFn: markEmailVerified,
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: profileKeys.verification(user?.id ?? null),
      })
    },
  })
}

export function useSendEmailVerification() {
  return useMutation({
    mutationFn: (email: string) => sendEmailVerificationLink(email),
  })
}
