import { Building2, LogOut, ShieldAlert } from 'lucide-react'
import { Link, useNavigate } from 'react-router-dom'
import { Button } from '@/components/ui/Button'
import { useSessionAccess } from '@/services/admin'
import { useAuth } from '@/hooks/useAuth'
import { paths } from '@/lib/paths'

export function CompanyDisabledPage() {
  const { signOut } = useAuth()
  const { data } = useSessionAccess()
  const navigate = useNavigate()

  const handleSignOut = async () => {
    await signOut()
    navigate(paths.login, { replace: true })
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-surface-50 px-4 dark:bg-surface-950">
      <div className="w-full max-w-md rounded-2xl border border-surface-200 bg-white p-8 text-center shadow-sm dark:border-surface-800 dark:bg-surface-900">
        <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-amber-50 text-amber-700 dark:bg-amber-950 dark:text-amber-300">
          <ShieldAlert className="h-6 w-6" />
        </div>
        <h1 className="text-xl font-semibold text-surface-900 dark:text-surface-50">
          Workspace disabled
        </h1>
        <p className="mt-2 text-sm text-surface-500 dark:text-surface-400">
          This company account has been disabled by the platform administrator.
          Contact support if you believe this is a mistake.
        </p>

        <div className="mt-6 flex flex-col gap-2">
          {data?.isSuperAdmin ? (
            <Link to={paths.admin}>
              <Button className="w-full">
                <Building2 className="h-4 w-4" />
                Open Super Admin
              </Button>
            </Link>
          ) : null}
          <Button variant="secondary" className="w-full" onClick={() => void handleSignOut()}>
            <LogOut className="h-4 w-4" />
            Sign out
          </Button>
        </div>
      </div>
    </div>
  )
}
