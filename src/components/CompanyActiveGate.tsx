import { Link, Navigate, Outlet, useLocation } from 'react-router-dom'
import { PageLoader } from '@/components/PageLoader'
import { Alert, Button } from '@/components/ui'
import { useSessionAccess } from '@/services/admin'
import { useAuth } from '@/hooks/useAuth'
import { paths } from '@/lib/paths'

/**
 * Blocks tenant app routes when the company is disabled.
 * Super admins may still reach /admin; they are redirected there from the disabled page.
 */
export function CompanyActiveGate() {
  const { isAuthenticated, isLoading: authLoading, signOut } = useAuth()
  const { data, isPending, isError, error, refetch, isFetching } =
    useSessionAccess()
  const location = useLocation()

  if (authLoading || (isAuthenticated && isPending)) {
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
            <Link to={paths.landing}>
              <Button type="button" variant="ghost">
                Home
              </Button>
            </Link>
          </div>
        </div>
      </div>
    )
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
