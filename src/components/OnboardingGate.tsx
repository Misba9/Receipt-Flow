import { Navigate, Outlet, useLocation } from 'react-router-dom'
import { PageLoader } from '@/components/PageLoader'
import { useAuth } from '@/hooks/useAuth'
import { useSessionAccess } from '@/services/admin'
import { useCompanySettings } from '@/services/settings/hooks'
import { paths } from '@/lib/paths'

/**
 * Blocks tenant app routes until onboarding is finished.
 * Email verification is optional and never blocks access.
 * Super admins skip this gate.
 */
export function OnboardingGate() {
  const { isAuthenticated, isLoading: authLoading } = useAuth()
  const { data: access, isLoading: accessLoading } = useSessionAccess()
  const { data, isLoading, isError } = useCompanySettings()
  const location = useLocation()

  if (authLoading || (isAuthenticated && (accessLoading || isLoading))) {
    return <PageLoader label="Loading workspace…" />
  }

  if (access?.isSuperAdmin) {
    return <Outlet />
  }

  const onOnboarding = location.pathname === paths.onboarding
  const onSettings = location.pathname === paths.settings

  if (
    isAuthenticated &&
    !isError &&
    data &&
    !data.onboardingCompletedAt &&
    !onOnboarding &&
    !onSettings
  ) {
    return <Navigate to={paths.onboarding} replace />
  }

  return <Outlet />
}
