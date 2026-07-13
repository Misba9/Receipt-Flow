import { useQuery } from '@tanstack/react-query'
import { useDebouncedValue } from '@/hooks/useDebouncedValue'
import { useAuth } from '@/hooks/useAuth'
import {
  findExactCustomerDuplicate,
  searchCustomersAutocomplete,
} from '@/services/customers/api'
import { customerKeys } from '@/services/customers/hooks'

export function useCustomerAutocompleteSearch(
  query: string,
  options: { enabled?: boolean; excludeId?: string; limit?: number } = {},
) {
  const { isAuthenticated, isLoading: authLoading } = useAuth()
  const debouncedQuery = useDebouncedValue(query.trim(), 300)
  const enabled =
    (options.enabled ?? true) &&
    isAuthenticated &&
    !authLoading &&
    debouncedQuery.length >= 1

  const result = useQuery({
    queryKey: [
      ...customerKeys.all,
      'autocomplete',
      debouncedQuery,
      options.excludeId ?? null,
      options.limit ?? 10,
    ],
    queryFn: () =>
      searchCustomersAutocomplete(debouncedQuery, {
        excludeId: options.excludeId,
        limit: options.limit ?? 10,
      }),
    enabled,
    staleTime: 30_000,
    placeholderData: (previous) => previous,
  })

  return {
    ...result,
    debouncedQuery,
    isDebouncing: query.trim() !== debouncedQuery && query.trim().length >= 1,
  }
}

export function useExactCustomerDuplicate(
  input: {
    name: string
    phone: string
    email: string
    excludeId?: string
  },
  enabled: boolean,
) {
  const { isAuthenticated, isLoading: authLoading } = useAuth()
  const name = input.name.trim()
  const phone = input.phone.trim()
  const email = input.email.trim()
  const ready = Boolean(name && phone && email)

  return useQuery({
    queryKey: [
      ...customerKeys.all,
      'duplicate',
      name.toLowerCase(),
      phone.toLowerCase(),
      email.toLowerCase(),
      input.excludeId ?? null,
    ],
    queryFn: () =>
      findExactCustomerDuplicate({
        name,
        phone,
        email,
        excludeId: input.excludeId,
      }),
    enabled: enabled && ready && isAuthenticated && !authLoading,
    staleTime: 15_000,
  })
}
