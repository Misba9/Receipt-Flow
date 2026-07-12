import { Navigate, Outlet, useLocation } from 'react-router-dom'
import { PageLoader } from '@/components/PageLoader'
import { useSessionAccess } from '@/services/admin'
import { useAuth } from '@/hooks/useAuth'
import { paths } from '@/lib/paths'

/**
 * Blocks tenant app routes when the company is disabled.
 * Super admins may still reach /admin; they are redirected there from the disabled page.
 */
export function CompanyActiveGate() {
  const { isAuthenticated, isLoading: authLoading } = useAuth()
  const { data, isLoading } = useSessionAccess()
  const location = useLocation()

  if (authLoading || (isAuthenticated && isLoading)) {
    return <PageLoader label="Loading workspace…" />
  }

  if (
    isAuthenticated &&
    data &&
    !data.companyActive &&
    !data.isSuperAdmin &&
    location.pathname !== paths.companyDisabled
  ) {
    return <Navigate to={paths.companyDisabled} replace />
  }

  return <Outlet />
}
