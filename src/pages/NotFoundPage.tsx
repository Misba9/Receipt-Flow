import { Link } from 'react-router-dom'
import { LandingFooter } from '@/components/landing/LandingFooter'
import { LandingNav } from '@/components/landing/LandingNav'
import { SkipToContent } from '@/components/seo/SkipToContent'
import { useAuth } from '@/hooks/useAuth'
import {
  COMPARISONS_INDEX_PATH,
  FEATURES_INDEX_PATH,
  PRICING_PATH,
} from '@/lib/breadcrumbs'
import { paths } from '@/lib/paths'

const HELPFUL_LINKS = [
  { label: 'Home', path: paths.landing },
  { label: 'Features', path: FEATURES_INDEX_PATH },
  { label: 'Pricing', path: PRICING_PATH },
  { label: 'Comparisons', path: COMPARISONS_INDEX_PATH },
  { label: 'Blog', path: paths.blog },
  { label: 'Free tools', path: paths.tools },
] as const

/**
 * Public 404 — noindex via RouteSeo fallback; helpful links for users and crawlers.
 */
export function NotFoundPage() {
  const { isAuthenticated } = useAuth()

  return (
    <div className="min-h-screen bg-white text-surface-900">
      <SkipToContent />
      <LandingNav />
      <main
        id="main-content"
        className="mx-auto flex max-w-3xl flex-col px-4 pt-28 pb-20 sm:px-6 sm:pt-32"
      >
        <p className="text-sm font-semibold tracking-wider text-surface-400 uppercase">
          Error 404
        </p>
        <h1 className="mt-3 font-display text-3xl font-semibold tracking-tight text-surface-950 sm:text-5xl">
          Page not found
        </h1>
        <p className="mt-4 text-base leading-relaxed text-surface-600 sm:text-lg">
          This URL is not in our sitemap. It may have moved, or the link might be
          outdated. Try one of the pages below, or return home.
        </p>

        <div className="mt-8 flex flex-wrap gap-3">
          <Link
            to={isAuthenticated ? paths.dashboard : paths.landing}
            className="inline-flex h-11 items-center justify-center rounded-lg bg-brand-600 px-5 text-sm font-semibold text-white transition-colors hover:bg-brand-700"
          >
            {isAuthenticated ? 'Go to dashboard' : 'Back to home'}
          </Link>
          {!isAuthenticated ? (
            <Link
              to={paths.login}
              className="inline-flex h-11 items-center justify-center rounded-lg border border-surface-200 bg-surface-50 px-5 text-sm font-medium text-surface-900 transition-colors hover:bg-surface-100"
            >
              Sign in
            </Link>
          ) : null}
        </div>

        <nav aria-label="Helpful links" className="mt-14">
          <h2 className="text-sm font-semibold tracking-wide text-surface-700 uppercase">
            Popular pages
          </h2>
          <ul className="mt-4 grid gap-2 sm:grid-cols-2">
            {HELPFUL_LINKS.map((item) => (
              <li key={item.path}>
                <Link
                  to={item.path}
                  className="text-sm font-medium text-brand-700 hover:underline"
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </main>
      <LandingFooter />
    </div>
  )
}
