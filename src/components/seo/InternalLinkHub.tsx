import { Link } from 'react-router-dom'
import {
  CONVERSION_FUNNEL,
  getContextualInternalLinks,
  getNextFunnelStep,
  type MarketingSurface,
} from '@/lib/internal-links'
import type { BlogCategoryId } from '@/content/blog'
import { cn } from '@/utils'

type InternalLinkHubProps = {
  surface: MarketingSurface
  blogCategoryId?: BlogCategoryId
  className?: string
  /** Compact variant for article sidebars / tight layouts. */
  compact?: boolean
}

export function InternalLinkHub({
  surface,
  blogCategoryId,
  className,
  compact = false,
}: InternalLinkHubProps) {
  const next = getNextFunnelStep(surface)
  const links = getContextualInternalLinks(surface, { blogCategoryId })

  return (
    <section
      aria-labelledby="internal-links-heading"
      className={cn(
        compact
          ? 'rounded-2xl border border-surface-200 bg-surface-50 p-5'
          : 'border-t border-surface-100 bg-surface-50 py-14 sm:py-16',
        className,
      )}
    >
      <div className={compact ? undefined : 'mx-auto max-w-6xl px-4 sm:px-6'}>
        <h2
          id="internal-links-heading"
          className={cn(
            'font-display font-semibold tracking-tight text-surface-950',
            compact ? 'text-lg' : 'text-2xl sm:text-3xl',
          )}
        >
          Continue exploring ReceiptFlow
        </h2>
        <p
          className={cn(
            'mt-2 text-surface-600',
            compact ? 'text-sm' : 'max-w-2xl text-base',
          )}
        >
          Blog → Features → Pricing → Sign up → Industries → Locations
        </p>

        {!compact ? (
          <ol className="mt-8 flex flex-wrap gap-2">
            {CONVERSION_FUNNEL.map((step, index) => (
              <li key={step.path} className="flex items-center gap-2">
                {index > 0 ? (
                  <span aria-hidden className="text-surface-300">
                    →
                  </span>
                ) : null}
                <Link
                  to={step.path}
                  className="rounded-lg border border-surface-200 bg-white px-3 py-1.5 text-sm font-medium text-surface-700 transition-colors hover:border-brand-200 hover:bg-brand-50 hover:text-brand-800"
                >
                  {step.label}
                </Link>
              </li>
            ))}
          </ol>
        ) : null}

        {next ? (
          <p className={cn('text-sm text-surface-600', compact ? 'mt-4' : 'mt-8')}>
            Next step:{' '}
            <Link
              to={next.path}
              className="font-semibold text-brand-700 hover:underline"
            >
              {next.label}
            </Link>
            {next.description ? ` — ${next.description}` : null}
          </p>
        ) : null}

        <ul
          className={cn(
            'grid gap-3',
            compact ? 'mt-4' : 'mt-8 sm:grid-cols-2 lg:grid-cols-3',
          )}
        >
          {links.map((link) => (
            <li key={`${link.path}-${link.label}`}>
              <Link
                to={link.path}
                className="flex h-full flex-col rounded-xl border border-surface-200 bg-white px-4 py-3 transition-colors hover:border-brand-200 hover:bg-brand-50/40"
              >
                <span className="text-sm font-semibold text-surface-950">
                  {link.label}
                </span>
                {link.description ? (
                  <span className="mt-1 text-xs leading-relaxed text-surface-500">
                    {link.description}
                  </span>
                ) : null}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}
