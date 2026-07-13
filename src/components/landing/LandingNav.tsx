import { useEffect, useId, useRef, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { ChevronDown, Menu, X } from 'lucide-react'
import { useAuth } from '@/hooks/useAuth'
import { isMarketingDarkHeroPath } from '@/content/public-nav-links'
import {
  SITE_NAV_COMPANY,
  SITE_NAV_GROUPS,
  SITE_NAV_PRIMARY,
  type SiteNavGroup,
} from '@/content/site-nav'
import { APP_NAME, cn } from '@/utils'
import { paths } from '@/lib/paths'

function NavDropdown({
  group,
  lightNav,
}: {
  group: SiteNavGroup
  lightNav: boolean
}) {
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)
  const menuId = useId()

  useEffect(() => {
    if (!open) return
    const onPointer = (event: MouseEvent) => {
      if (!ref.current?.contains(event.target as Node)) setOpen(false)
    }
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setOpen(false)
    }
    document.addEventListener('mousedown', onPointer)
    document.addEventListener('keydown', onKey)
    return () => {
      document.removeEventListener('mousedown', onPointer)
      document.removeEventListener('keydown', onKey)
    }
  }, [open])

  return (
    <div
      ref={ref}
      className="relative"
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
    >
      <button
        type="button"
        className={cn(
          'inline-flex items-center gap-1 text-sm font-medium transition-colors',
          lightNav
            ? 'text-surface-600 hover:text-surface-950'
            : 'text-white/75 hover:text-white',
        )}
        aria-expanded={open}
        aria-haspopup="true"
        aria-controls={menuId}
        onClick={() => setOpen((value) => !value)}
      >
        {group.label}
        <ChevronDown
          className={cn('h-3.5 w-3.5 transition-transform', open && 'rotate-180')}
          aria-hidden
        />
      </button>
      {open ? (
        <div
          id={menuId}
          role="menu"
          className="absolute top-full left-0 z-50 pt-2"
        >
          <div className="min-w-[220px] rounded-xl border border-surface-200 bg-white p-2 shadow-lg">
            <Link
              to={group.path}
              role="menuitem"
              className="block rounded-lg px-3 py-2 text-sm font-semibold text-surface-950 hover:bg-surface-50"
              onClick={() => setOpen(false)}
            >
              All {group.label.toLowerCase()}
            </Link>
            <div className="my-1 border-t border-surface-100" />
            {group.children.map((child) => (
              <Link
                key={child.path}
                to={child.path}
                role="menuitem"
                className="block rounded-lg px-3 py-2 text-sm text-surface-700 hover:bg-surface-50 hover:text-surface-950"
                onClick={() => setOpen(false)}
              >
                {child.label}
              </Link>
            ))}
          </div>
        </div>
      ) : null}
    </div>
  )
}

function MobileGroup({
  group,
  onNavigate,
}: {
  group: SiteNavGroup
  onNavigate: () => void
}) {
  const [open, setOpen] = useState(false)
  return (
    <div className="border-b border-surface-100 py-1">
      <button
        type="button"
        className="flex w-full items-center justify-between rounded-lg px-3 py-2.5 text-sm font-medium text-surface-800"
        aria-expanded={open}
        onClick={() => setOpen((value) => !value)}
      >
        {group.label}
        <ChevronDown
          className={cn('h-4 w-4 text-surface-400', open && 'rotate-180')}
          aria-hidden
        />
      </button>
      {open ? (
        <div className="pb-2 pl-2">
          <Link
            to={group.path}
            className="block rounded-lg px-3 py-2 text-sm font-medium text-brand-700"
            onClick={onNavigate}
          >
            All {group.label.toLowerCase()}
          </Link>
          {group.children.map((child) => (
            <Link
              key={child.path}
              to={child.path}
              className="block rounded-lg px-3 py-2 text-sm text-surface-700 hover:bg-surface-50"
              onClick={onNavigate}
            >
              {child.label}
            </Link>
          ))}
        </div>
      ) : null}
    </div>
  )
}

export function LandingNav() {
  const { isAuthenticated } = useAuth()
  const { pathname } = useLocation()
  const [open, setOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const isDarkHero = isMarketingDarkHeroPath(pathname)
  const lightNav = scrolled || !isDarkHero

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

  const closeMobile = () => setOpen(false)

  return (
    <header
      className={cn(
        'fixed inset-x-0 top-0 z-40 transition-colors duration-300',
        scrolled
          ? 'border-b border-surface-200/80 bg-white/90 backdrop-blur-md'
          : 'bg-transparent',
      )}
    >
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-4 px-4 sm:px-6">
        <Link
          to={paths.landing}
          className={cn(
            'shrink-0 font-display text-lg font-semibold tracking-tight transition-colors',
            lightNav ? 'text-surface-950' : 'text-white',
          )}
        >
          {APP_NAME}
        </Link>

        <nav
          className="hidden items-center gap-5 xl:flex"
          aria-label="Primary"
        >
          {SITE_NAV_GROUPS.map((group) => (
            <NavDropdown key={group.path} group={group} lightNav={lightNav} />
          ))}
          {SITE_NAV_PRIMARY.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              className={cn(
                'text-sm font-medium transition-colors',
                lightNav
                  ? 'text-surface-600 hover:text-surface-950'
                  : 'text-white/75 hover:text-white',
              )}
            >
              {link.label}
            </Link>
          ))}
          {SITE_NAV_COMPANY.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              className={cn(
                'text-sm font-medium transition-colors',
                lightNav
                  ? 'text-surface-600 hover:text-surface-950'
                  : 'text-white/75 hover:text-white',
              )}
            >
              {link.label}
            </Link>
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
                  lightNav
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
                  lightNav
                    ? 'bg-brand-600 text-white hover:bg-brand-700'
                    : 'bg-white text-surface-950 hover:bg-brand-50',
                )}
              >
                Get started
              </Link>
            </>
          )}
        </div>

        <button
          type="button"
          className={cn(
            'rounded-lg p-2 xl:hidden',
            lightNav
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
        <div className="max-h-[calc(100svh-4rem)] overflow-y-auto border-t border-surface-200 bg-white px-4 py-3 xl:hidden">
          <nav className="flex flex-col" aria-label="Mobile">
            <Link
              to={paths.landing}
              className="rounded-lg px-3 py-2.5 text-sm font-medium text-surface-700 hover:bg-surface-50"
              onClick={closeMobile}
            >
              Home
            </Link>
            {SITE_NAV_GROUPS.map((group) => (
              <MobileGroup
                key={group.path}
                group={group}
                onNavigate={closeMobile}
              />
            ))}
            {[...SITE_NAV_PRIMARY, ...SITE_NAV_COMPANY].map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className="rounded-lg px-3 py-2.5 text-sm font-medium text-surface-700 hover:bg-surface-50"
                onClick={closeMobile}
              >
                {link.label}
              </Link>
            ))}
            {isAuthenticated ? (
              <Link
                to={paths.dashboard}
                className="mt-2 rounded-lg bg-brand-600 px-3 py-2.5 text-center text-sm font-medium text-white"
                onClick={closeMobile}
              >
                Open dashboard
              </Link>
            ) : (
              <>
                <Link
                  to={paths.login}
                  className="rounded-lg px-3 py-2.5 text-sm font-medium text-surface-700 hover:bg-surface-50"
                  onClick={closeMobile}
                >
                  Sign in
                </Link>
                <Link
                  to={paths.register}
                  className="mt-1 rounded-lg bg-brand-600 px-3 py-2.5 text-center text-sm font-medium text-white"
                  onClick={closeMobile}
                >
                  Get started
                </Link>
              </>
            )}
          </nav>
        </div>
      ) : null}
    </header>
  )
}
