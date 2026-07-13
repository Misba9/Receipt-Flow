import { Navigate, Outlet, useLocation } from 'react-router-dom'
import { PageLoader } from '@/components/PageLoader'
import { Alert, Button } from '@/components/ui'
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
  const { isAuthenticated, isLoading: authLoading, signOut } = useAuth()
  const { data: access, isLoading: accessLoading } = useSessionAccess()
  const {
    data,
    isLoading,
    isError,
    error,
    refetch,
    isFetching,
  } = useCompanySettings()
  const location = useLocation()

  if (authLoading || (isAuthenticated && (accessLoading || isLoading))) {
    return <PageLoader label="Loading workspace…" />
  }

  if (isAuthenticated && isError) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-surface-50 px-4 dark:bg-surface-950">
        <div className="w-full max-w-md space-y-4 rounded-2xl border border-surface-200 bg-white p-6 shadow-sm dark:border-surface-800 dark:bg-surface-900">
          <Alert>
            {error instanceof Error
              ? error.message
              : 'Unable to load your workspace.'}
          </Alert>
          <div className="flex flex-wrap gap-2">
            <Button
              type="button"
              onClick={() => void refetch()}
              disabled={isFetching}
            >
              Try again
            </Button>
            <Button
              type="button"
              variant="secondary"
              onClick={() => void signOut()}
            >
              Sign out
            </Button>
          </div>
        </div>
      </div>
    )
  }

  if (access?.isSuperAdmin) {
    return <Outlet />
  }

  const onOnboarding = location.pathname === paths.onboarding
  const onSettings = location.pathname === paths.settings

  if (
    isAuthenticated &&
    data &&
    !data.onboardingCompletedAt &&
    !onOnboarding &&
    !onSettings
  ) {
    return <Navigate to={paths.onboarding} replace />
  }

  return <Outlet />
}
