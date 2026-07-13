import { Link } from 'react-router-dom'
import { BLOG_INDEX_PATH } from '@/content/blog'

export type BlogBreadcrumbItem = {
  label: string
  to?: string
}

export function BlogBreadcrumb({ items }: { items: BlogBreadcrumbItem[] }) {
  const crumbs = [{ label: 'Home', to: '/' }, { label: 'Blog', to: BLOG_INDEX_PATH }, ...items]

  return (
    <nav aria-label="Breadcrumb" className="text-sm text-surface-500">
      <ol className="flex flex-wrap items-center gap-1.5">
        {crumbs.map((item, index) => {
          const isLast = index === crumbs.length - 1
          return (
            <li key={`${item.label}-${index}`} className="flex items-center gap-1.5">
              {index > 0 ? (
                <span aria-hidden className="text-surface-300">
                  /
                </span>
              ) : null}
              {isLast || !item.to ? (
                <span
                  aria-current={isLast ? 'page' : undefined}
                  className={isLast ? 'font-medium text-surface-800' : undefined}
                >
                  {item.label}
                </span>
              ) : (
                <Link
                  to={item.to}
                  className="transition-colors hover:text-brand-700"
                >
                  {item.label}
                </Link>
              )}
            </li>
          )
        })}
      </ol>
    </nav>
  )
}
