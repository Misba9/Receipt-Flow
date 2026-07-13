import { Link, useLocation } from 'react-router-dom'
import { buildBreadcrumbs } from '@/lib/breadcrumbs'
import { cn } from '@/utils'

type SiteBreadcrumbProps = {
  /** Override auto-detected pathname. */
  pathname?: string
  className?: string
}

export function SiteBreadcrumb({ pathname, className }: SiteBreadcrumbProps) {
  const location = useLocation()
  const crumbs = buildBreadcrumbs(pathname ?? location.pathname)
  if (crumbs.length < 2) return null

  return (
    <nav
      aria-label="Breadcrumb"
      className={cn('text-sm text-surface-500', className)}
    >
      <ol className="flex flex-wrap items-center gap-1.5">
        {crumbs.map((crumb, index) => {
          const isLast = index === crumbs.length - 1
          return (
            <li
              key={`${crumb.path}-${index}`}
              className="flex items-center gap-1.5"
            >
              {index > 0 ? (
                <span aria-hidden className="text-surface-300">
                  /
                </span>
              ) : null}
              {isLast ? (
                <span
                  aria-current="page"
                  className="font-medium text-surface-800"
                >
                  {crumb.name}
                </span>
              ) : (
                <Link
                  to={crumb.path}
                  className="transition-colors hover:text-brand-700"
                >
                  {crumb.name}
                </Link>
              )}
            </li>
          )
        })}
      </ol>
    </nav>
  )
}
