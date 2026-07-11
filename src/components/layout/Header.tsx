import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { LogOut, Menu } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { ThemeToggle } from '@/components/ui/ThemeToggle'
import { useAuth } from '@/hooks/useAuth'
import { paths } from '@/routes/paths'

type HeaderProps = {
  onMenuClick: () => void
  title?: string
}

export function Header({ onMenuClick, title }: HeaderProps) {
  const { user, signOut } = useAuth()
  const navigate = useNavigate()
  const [isSigningOut, setIsSigningOut] = useState(false)

  const fullName =
    typeof user?.user_metadata?.full_name === 'string'
      ? user.user_metadata.full_name
      : ''

  const initials =
    fullName
      .split(' ')
      .filter(Boolean)
      .map((part) => part[0])
      .join('')
      .slice(0, 2)
      .toUpperCase() ||
    user?.email?.slice(0, 2).toUpperCase() ||
    'RF'

  const handleSignOut = async () => {
    setIsSigningOut(true)
    const { error } = await signOut()
    setIsSigningOut(false)
    if (!error) {
      navigate(paths.login, { replace: true })
    }
  }

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center justify-between gap-4 border-b border-surface-200 bg-white/80 px-4 backdrop-blur-md sm:px-6 dark:border-surface-800 dark:bg-surface-950/80">
      <div className="flex min-w-0 items-center gap-3">
        <button
          type="button"
          onClick={onMenuClick}
          className="rounded-lg p-2 text-surface-600 hover:bg-surface-100 lg:hidden dark:text-surface-300 dark:hover:bg-surface-800"
          aria-label="Open sidebar"
        >
          <Menu className="h-5 w-5" />
        </button>
        {title ? (
          <h1 className="truncate text-lg font-semibold text-surface-900 dark:text-surface-50">
            {title}
          </h1>
        ) : null}
      </div>

      <div className="flex items-center gap-2">
        {user?.email ? (
          <span className="hidden max-w-[12rem] truncate text-sm text-surface-500 sm:inline dark:text-surface-400">
            {user.email}
          </span>
        ) : null}
        <ThemeToggle />
        <div
          className="flex h-8 w-8 items-center justify-center rounded-full bg-surface-200 text-xs font-semibold text-surface-700 dark:bg-surface-700 dark:text-surface-200"
          title={user?.email ?? 'Account'}
        >
          {initials}
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
    </header>
  )
}
