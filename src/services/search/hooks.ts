import { useQuery } from '@tanstack/react-query'
import { globalSearch } from '@/services/search/api'
import { useAuth } from '@/hooks/useAuth'
import { useDebouncedValue } from '@/hooks/useDebouncedValue'

export const searchKeys = {
  all: ['global-search'] as const,
  query: (term: string) => [...searchKeys.all, term] as const,
}

export function useGlobalSearch(rawQuery: string, delay = 300) {
  const { isAuthenticated, isLoading: authLoading } = useAuth()
  const debouncedQuery = useDebouncedValue(rawQuery.trim(), delay)
  const enabled =
    isAuthenticated &&
    !authLoading &&
    debouncedQuery.length >= 2

  const query = useQuery({
    queryKey: searchKeys.query(debouncedQuery),
    queryFn: () => globalSearch(debouncedQuery),
    enabled,
    placeholderData: (previous) => previous,
  })

  return {
    ...query,
    debouncedQuery,
    isDebouncing: rawQuery.trim() !== debouncedQuery && rawQuery.trim().length >= 2,
  }
}
