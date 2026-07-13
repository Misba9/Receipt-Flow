import { useEffect } from 'react'
import { NavLink, useLocation } from 'react-router-dom'
import {
  Building2,
  ChartColumn,
  FileText,
  LayoutDashboard,
  Settings,
  Shield,
  Users,
  X,
} from 'lucide-react'
import { useSessionAccess } from '@/services/admin'
import { useCompanySettings } from '@/services/settings/hooks'
import { useAuth } from '@/hooks/useAuth'
import { APP_NAME, cn } from '@/utils'
import { paths } from '@/lib/paths'

const mainNav = [
  { label: 'Dashboard', href: paths.dashboard, icon: LayoutDashboard },
  { label: 'Customers', href: paths.customers, icon: Users },
  { label: 'Invoices', href: paths.invoices, icon: FileText },
  { label: 'Reports', href: paths.reports, icon: ChartColumn },
]

const secondaryNav = [
  { label: 'Settings', href: paths.settings, icon: Settings },
]

const adminNav = [
  { label: 'Overview', href: paths.admin, icon: Shield },
  { label: 'Companies', href: paths.adminCompanies, icon: Building2 },
  { label: 'Users', href: paths.adminUsers, icon: Users },
]

type SidebarProps = {
  open: boolean
  onClose: () => void
}

function NavItem({
  label,
  href,
  icon: Icon,
  onNavigate,
  end,
}: {
  label: string
  href: string
  icon: typeof LayoutDashboard
  onNavigate: () => void
  end?: boolean
}) {
  return (
    <NavLink
      to={href}
      end={end}
      onClick={onNavigate}
      className={({ isActive }) =>
        cn(
          'group flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors',
          isActive
            ? 'bg-brand-50 text-brand-700 dark:bg-brand-950 dark:text-brand-300'
            : 'text-surface-600 hover:bg-surface-100 hover:text-surface-900 dark:text-surface-300 dark:hover:bg-surface-900 dark:hover:text-surface-50',
        )
      }
    >
      {({ isActive }) => (
        <>
          <Icon
            className={cn(
              'h-4 w-4 shrink-0 transition-colors',
              isActive
                ? 'text-brand-600 dark:text-brand-400'
                : 'text-surface-400 group-hover:text-surface-600 dark:group-hover:text-surface-300',
            )}
          />
          {label}
        </>
      )}
    </NavLink>
  )
}

export function Sidebar({ open, onClose }: SidebarProps) {
  const { user } = useAuth()
  const location = useLocation()
  const { data: access } = useSessionAccess()
  const { data: company } = useCompanySettings()
  const isAdminConsole =
    Boolean(access?.isSuperAdmin) && location.pathname.startsWith('/admin')

  const displayName =
    typeof user?.user_metadata?.full_name === 'string' &&
    user.user_metadata.full_name.trim()
      ? user.user_metadata.full_name
      : (user?.email ?? 'Account')

  const companyName = company?.name?.trim() || 'Workspace'
  const invoicePrefix = company?.invoicePrefix?.trim()
  const brandTitle = isAdminConsole ? APP_NAME : companyName
  const brandSubtitle = isAdminConsole
    ? 'Super Admin'
    : invoicePrefix
      ? `Invoices · ${invoicePrefix}`
      : 'Workspace'

  useEffect(() => {
    if (!open) return
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [open, onClose])

  return (
    <>
      <div
        className={cn(
          'fixed inset-0 z-40 bg-surface-950/40 backdrop-blur-[2px] transition-opacity lg:hidden',
          open ? 'opacity-100' : 'pointer-events-none opacity-0',
        )}
        onClick={onClose}
        aria-hidden={!open}
      />

      <aside
        className={cn(
          'fixed inset-y-0 left-0 z-50 flex h-dvh w-[min(18rem,85vw)] flex-col border-r border-surface-200/80 bg-white/95',
          'dark:border-surface-800 dark:bg-surface-950/95',
          'transition-transform duration-200 ease-out lg:static lg:z-0 lg:h-full lg:w-72 lg:shrink-0 lg:translate-x-0',
          open ? 'translate-x-0' : '-translate-x-full',
        )}
      >
        <div className="flex h-16 shrink-0 items-center justify-between gap-2 border-b border-surface-200 px-5 dark:border-surface-800">
          <div className="flex min-w-0 items-center gap-2.5">
            {!isAdminConsole && company?.logoUrl ? (
              <img
                src={company.logoUrl}
                alt={`${companyName} logo`}
                width={36}
                height={36}
                loading="lazy"
                decoding="async"
                className="h-9 w-9 rounded-xl object-contain"
              />
            ) : (
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-brand-600 text-white shadow-sm shadow-brand-600/30">
                {isAdminConsole ? (
                  <Shield className="h-4 w-4" />
                ) : (
                  <FileText className="h-4 w-4" />
                )}
              </div>
            )}
            <div className="min-w-0 leading-tight">
              <span className="block truncate text-base font-semibold tracking-tight text-surface-900 dark:text-surface-50">
                {brandTitle}
              </span>
              <span className="text-[11px] font-medium uppercase tracking-wider text-surface-400">
                {brandSubtitle}
              </span>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-md p-1.5 text-surface-500 hover:bg-surface-100 lg:hidden dark:hover:bg-surface-800"
            aria-label="Close sidebar"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="flex min-h-0 flex-1 flex-col gap-6 overflow-y-auto p-3">
          {isAdminConsole ? (
            <nav className="flex flex-col gap-1">
              <p className="px-3 pb-1 text-[11px] font-semibold uppercase tracking-wider text-surface-400">
                Platform
              </p>
              {adminNav.map((item) => (
                <NavItem
                  key={item.href}
                  {...item}
                  end={item.href === paths.admin}
                  onNavigate={onClose}
                />
              ))}
            </nav>
          ) : (
            <>
              <nav className="flex flex-col gap-1">
                <p className="px-3 pb-1 text-[11px] font-semibold uppercase tracking-wider text-surface-400">
                  Menu
                </p>
                {mainNav.map((item) => (
                  <NavItem
                    key={item.href}
                    {...item}
                    end={item.href === paths.dashboard}
                    onNavigate={onClose}
                  />
                ))}
              </nav>

              {access?.isSuperAdmin ? (
                <nav className="flex flex-col gap-1">
                  <p className="px-3 pb-1 text-[11px] font-semibold uppercase tracking-wider text-surface-400">
                    Super Admin
                  </p>
                  {adminNav.map((item) => (
                    <NavItem
                      key={item.href}
                      {...item}
                      end={item.href === paths.admin}
                      onNavigate={onClose}
                    />
                  ))}
                </nav>
              ) : null}

              <nav className="flex flex-col gap-1">
                <p className="px-3 pb-1 text-[11px] font-semibold uppercase tracking-wider text-surface-400">
                  Account
                </p>
                {secondaryNav.map((item) => (
                  <NavItem key={item.href} {...item} onNavigate={onClose} />
                ))}
              </nav>
            </>
          )}
        </div>

        <div className="shrink-0 border-t border-surface-200 p-4 dark:border-surface-800">
          <div className="rounded-xl bg-surface-50 px-3 py-3 dark:bg-surface-900">
            <p className="truncate text-sm font-medium text-surface-900 dark:text-surface-50">
              {displayName}
            </p>
            <p className="truncate text-xs text-surface-500 dark:text-surface-400">
              {user?.email}
            </p>
          </div>
        </div>
      </aside>
    </>
  )
}
