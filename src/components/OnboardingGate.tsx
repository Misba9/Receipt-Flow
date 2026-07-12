import { Navigate, Outlet, useLocation } from 'react-router-dom'
import { PageLoader } from '@/components/PageLoader'
import { useAuth } from '@/hooks/useAuth'
import { useCompanySettings } from '@/services/settings/hooks'
import { paths } from '@/lib/paths'

/**
 * Blocks the app until email is verified and onboarding is finished.
 * Settings remains reachable for authenticated users finishing profile details.
 */
export function OnboardingGate() {
  const {
    isAuthenticated,
    isEmailVerified,
    isLoading: authLoading,
  } = useAuth()
  const { data, isLoading, isError } = useCompanySettings()
  const location = useLocation()

  if (authLoading || (isAuthenticated && isLoading)) {
    return <PageLoader label="Loading workspace…" />
  }

  const onOnboarding = location.pathname === paths.onboarding
  const onSettings = location.pathname === paths.settings

  if (isAuthenticated && !isEmailVerified && !onOnboarding) {
    return <Navigate to={paths.onboarding} replace />
  }

  if (
    isAuthenticated &&
    isEmailVerified &&
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
