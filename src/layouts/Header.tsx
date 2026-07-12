import { useMemo, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { Bell, LogOut, Menu } from 'lucide-react'
import { GlobalSearch } from '@/components/search/GlobalSearch'
import { Button } from '@/components/ui/Button'
import { ThemeToggle } from '@/components/ui/ThemeToggle'
import { useAuth } from '@/hooks/useAuth'
import { getInitials } from '@/lib/format'
import { paths } from '@/lib/paths'

type HeaderProps = {
  onMenuClick: () => void
}

function getPageTitle(pathname: string) {
  if (pathname === paths.dashboard) return 'Dashboard'
  if (pathname === paths.customers) return 'Customers'
  if (pathname === paths.reports) return 'Reports'
  if (pathname === paths.settings) return 'Settings'
  if (pathname === paths.admin) return 'Super Admin'
  if (pathname === paths.adminCompanies) return 'Companies'
  if (pathname === paths.adminUsers) return 'Users'
  if (pathname === paths.invoiceNew) return 'New invoice'
  if (pathname.startsWith('/invoices/') && pathname.endsWith('/edit')) {
    return 'Edit invoice'
  }
  if (pathname.startsWith('/invoices/') && pathname !== paths.invoices) {
    return 'Invoice'
  }
  if (pathname === paths.invoices) return 'Invoices'
  return 'ReceiptFlow'
}

export function Header({ onMenuClick }: HeaderProps) {
  const { user, signOut } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const [isSigningOut, setIsSigningOut] = useState(false)

  const fullName =
    typeof user?.user_metadata?.full_name === 'string'
      ? user.user_metadata.full_name
      : ''

  const initials = getInitials(fullName || user?.email || 'RF', 'RF')
  const pageTitle = useMemo(
    () => getPageTitle(location.pathname),
    [location.pathname],
  )

  const greeting = useMemo(() => {
    const hour = new Date().getHours()
    if (hour < 12) return 'Good morning'
    if (hour < 18) return 'Good afternoon'
    return 'Good evening'
  }, [])

  const firstName = fullName.trim().split(/\s+/)[0] || 'there'

  const handleSignOut = async () => {
    setIsSigningOut(true)
    const { error } = await signOut()
    setIsSigningOut(false)
    if (!error) {
      navigate(paths.login, { replace: true })
    }
  }

  return (
    <header className="sticky top-0 z-30 border-b border-surface-200/80 bg-white/80 backdrop-blur-md dark:border-surface-800 dark:bg-surface-950/80">
      <div className="flex h-16 items-center gap-3 px-4 sm:px-6">
        <button
          type="button"
          onClick={onMenuClick}
          className="rounded-lg p-2 text-surface-600 hover:bg-surface-100 lg:hidden dark:text-surface-300 dark:hover:bg-surface-800"
          aria-label="Open sidebar"
        >
          <Menu className="h-5 w-5" />
        </button>

        <div className="min-w-0 flex-1 md:flex-none md:basis-48 lg:basis-56">
          <p className="truncate text-xs font-medium text-surface-400 sm:hidden">
            {pageTitle}
          </p>
          <div className="hidden sm:block">
            <p className="text-xs font-medium text-surface-400">{pageTitle}</p>
            <h1 className="truncate text-base font-semibold text-surface-900 dark:text-surface-50">
              {greeting}, {firstName}
            </h1>
          </div>
        </div>

        <div className="hidden min-w-0 flex-1 md:block">
          <GlobalSearch className="mx-auto w-full max-w-xl" />
        </div>

        <div className="flex items-center gap-1.5 sm:gap-2">
          <div className="md:hidden">
            <GlobalSearch mobile />
          </div>

          <Button
            variant="ghost"
            size="sm"
            className="relative h-9 w-9 px-0"
            aria-label="Notifications"
            type="button"
          >
            <Bell className="h-4 w-4" />
            <span className="absolute top-1.5 right-1.5 h-1.5 w-1.5 rounded-full bg-brand-500" />
          </Button>

          <ThemeToggle />

          <div className="mx-1 hidden h-6 w-px bg-surface-200 sm:block dark:bg-surface-700" />

          <div className="hidden items-center gap-2 sm:flex">
            <div
              className="flex h-8 w-8 items-center justify-center rounded-full bg-brand-100 text-xs font-semibold text-brand-700 dark:bg-brand-950 dark:text-brand-300"
              title={user?.email ?? 'Account'}
            >
              {initials}
            </div>
          </div>

          <Button
            variant="ghost"
            size="sm"
            onClick={handleSignOut}
            disabled={isSigningOut}
            aria-label="Sign out"
            className="h-9 w-9 px-0"
          >
            <LogOut className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </header>
  )
}
