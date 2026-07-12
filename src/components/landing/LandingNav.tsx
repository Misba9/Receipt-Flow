import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Menu, X } from 'lucide-react'
import { useAuth } from '@/hooks/useAuth'
import { APP_NAME, cn } from '@/utils'
import { paths } from '@/lib/paths'

const links = [
  { label: 'Features', href: '#features' },
  { label: 'Pricing', href: '#pricing' },
  { label: 'FAQ', href: '#faq' },
  { label: 'Contact', href: '#contact' },
]

export function LandingNav() {
  const { isAuthenticated } = useAuth()
  const [open, setOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    if (!open) return
    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = previousOverflow
    }
  }, [open])

  return (
    <header
      className={cn(
        'fixed inset-x-0 top-0 z-40 transition-colors duration-300',
        scrolled
          ? 'border-b border-surface-200/80 bg-white/90 backdrop-blur-md'
          : 'bg-transparent',
      )}
    >
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
        <a
          href="#top"
          className={cn(
            'font-display text-lg font-semibold tracking-tight transition-colors',
            scrolled ? 'text-surface-950' : 'text-white',
          )}
        >
          {APP_NAME}
        </a>

        <nav className="hidden items-center gap-8 md:flex" aria-label="Primary">
          {links.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className={cn(
                'text-sm font-medium transition-colors',
                scrolled
                  ? 'text-surface-600 hover:text-surface-950'
                  : 'text-white/75 hover:text-white',
              )}
            >
              {link.label}
            </a>
          ))}
        </nav>

        <div className="hidden items-center gap-2 md:flex">
          {isAuthenticated ? (
            <Link
              to={paths.dashboard}
              className="rounded-lg bg-brand-600 px-3.5 py-2 text-sm font-medium text-white transition-colors hover:bg-brand-700"
            >
              Open dashboard
            </Link>
          ) : (
            <>
              <Link
                to={paths.login}
                className={cn(
                  'rounded-lg px-3 py-2 text-sm font-medium transition-colors',
                  scrolled
                    ? 'text-surface-700 hover:bg-surface-100'
                    : 'text-white/90 hover:bg-white/10',
                )}
              >
                Sign in
              </Link>
              <Link
                to={paths.register}
                className={cn(
                  'rounded-lg px-3.5 py-2 text-sm font-medium transition-colors',
                  scrolled
                    ? 'bg-brand-600 text-white hover:bg-brand-700'
                    : 'bg-white text-surface-950 hover:bg-brand-50',
                )}
              >
                Start free
              </Link>
            </>
          )}
        </div>

        <button
          type="button"
          className={cn(
            'rounded-lg p-2 md:hidden',
            scrolled
              ? 'text-surface-700 hover:bg-surface-100'
              : 'text-white hover:bg-white/10',
          )}
          aria-label={open ? 'Close menu' : 'Open menu'}
          aria-expanded={open}
          onClick={() => setOpen((value) => !value)}
        >
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {open ? (
        <div className="max-h-[calc(100svh-4rem)] overflow-y-auto border-t border-surface-200 bg-white px-4 py-4 md:hidden">
          <nav className="flex flex-col gap-1" aria-label="Mobile">
            {links.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="rounded-lg px-3 py-2.5 text-sm font-medium text-surface-700 hover:bg-surface-50"
                onClick={() => setOpen(false)}
              >
                {link.label}
              </a>
            ))}
            {isAuthenticated ? (
              <Link
                to={paths.dashboard}
                className="mt-1 rounded-lg bg-brand-600 px-3 py-2.5 text-center text-sm font-medium text-white"
                onClick={() => setOpen(false)}
              >
                Open dashboard
              </Link>
            ) : (
              <>
                <Link
                  to={paths.login}
                  className="rounded-lg px-3 py-2.5 text-sm font-medium text-surface-700 hover:bg-surface-50"
                  onClick={() => setOpen(false)}
                >
                  Sign in
                </Link>
                <Link
                  to={paths.register}
                  className="mt-1 rounded-lg bg-brand-600 px-3 py-2.5 text-center text-sm font-medium text-white"
                  onClick={() => setOpen(false)}
                >
                  Start free
                </Link>
              </>
            )}
          </nav>
        </div>
      ) : null}
    </header>
  )
}
