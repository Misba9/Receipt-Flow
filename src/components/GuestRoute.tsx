import { Navigate, Outlet } from 'react-router-dom'
import { PageLoader } from '@/components/PageLoader'
import { useAuth } from '@/hooks/useAuth'
import { paths } from '@/lib/paths'

/**
 * Auth pages only — redirects signed-in users to the dashboard.
 */
export function GuestRoute() {
  const { isAuthenticated, isLoading } = useAuth()

  if (isLoading) {
    return <PageLoader label="Checking session…" />
  }

  if (isAuthenticated) {
    return <Navigate to={paths.dashboard} replace />
  }

  return <Outlet />
}
