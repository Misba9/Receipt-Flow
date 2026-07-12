import { useEffect } from 'react'
import type { ReactNode } from 'react'
import { useCompanySettings } from '@/services/settings/hooks'
import { applyBrandColor, clearBrandColor } from '@/lib/branding'
import { useAuth } from '@/hooks/useAuth'

/**
 * Loads the signed-in company's primary color and applies it as CSS variables.
 */
export function CompanyBrandingProvider({ children }: { children: ReactNode }) {
  const { isAuthenticated } = useAuth()
  const { data } = useCompanySettings()

  useEffect(() => {
    if (!isAuthenticated) {
      clearBrandColor()
      return
    }

    if (data?.primaryColor) {
      applyBrandColor(data.primaryColor)
    }
  }, [isAuthenticated, data?.primaryColor])

  return children
}
