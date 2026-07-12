import { Navigate, Outlet, useLocation } from 'react-router-dom'
import { PageLoader } from '@/components/PageLoader'
import { useSessionAccess } from '@/services/admin'
import { useAuth } from '@/hooks/useAuth'
import { paths } from '@/lib/paths'

/** Only platform super admins may enter /admin routes. */
export function SuperAdminRoute() {
  const { isAuthenticated, isLoading: authLoading } = useAuth()
  const { data, isLoading, isError } = useSessionAccess()
  const location = useLocation()

  if (authLoading || isLoading) {
    return <PageLoader label="Verifying access…" />
  }

  if (!isAuthenticated) {
    return <Navigate to={paths.login} replace state={{ from: location }} />
  }

  if (isError || !data?.isSuperAdmin) {
    return <Navigate to={paths.dashboard} replace />
  }

  return <Outlet />
}
