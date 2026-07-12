import { Navigate, Outlet } from 'react-router-dom'
import { PageLoader } from '@/components/PageLoader'
import { useAuth } from '@/hooks/useAuth'
import { useSessionAccess } from '@/services/admin'
import { paths } from '@/lib/paths'

/**
 * Auth pages only — redirects signed-in users into the app.
 * Super admins go to /admin (not the client dashboard/onboarding).
 */
export function GuestRoute() {
  const { isAuthenticated, isLoading } = useAuth()
  const { data: access, isLoading: accessLoading } = useSessionAccess()

  if (isLoading || (isAuthenticated && accessLoading)) {
    return <PageLoader label="Checking session…" />
  }

  if (isAuthenticated) {
    return (
      <Navigate
        to={access?.isSuperAdmin ? paths.admin : paths.dashboard}
        replace
      />
    )
  }

  return <Outlet />
}
