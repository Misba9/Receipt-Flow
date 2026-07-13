import { APP_NAME } from '@/utils'
import { paths } from '@/lib/paths'
import { LANDING_SEO } from '@/components/landing/landing-seo'
import { ALL_PUBLIC_ROUTE_META } from '@/content/public-route-meta'

/** Production site origin used for static SEO files (robots/sitemap) and fallbacks. */
export const SEO_SITE_URL = 'https://receiptflow.velonerp.com'

export const SEO_DEFAULTS = {
  siteName: APP_NAME,
  title: LANDING_SEO.title,
  description: LANDING_SEO.description,
  ogDescription: LANDING_SEO.ogDescription,
  locale: 'en_US',
  twitterCard: 'summary_large_image' as const,
  imagePath: '/og-image.jpg',
  imageAlt: LANDING_SEO.h1,
  imageWidth: 1200,
  imageHeight: 630,
  themeColor: '#1a73f5',
} as const

export type SeoPageConfig = {
  title: string
  description: string
  path?: string
  noIndex?: boolean
  ogType?: 'website' | 'article'
  image?: string
  imageAlt?: string
}

type RouteSeoRule = {
  match: string
  seo: SeoPageConfig
}

const PRIVATE_DESCRIPTION =
  'Secure ReceiptFlow workspace. Sign in to manage invoices, customers, and reports.'

const PUBLIC_CONTENT_ROUTE_RULES: RouteSeoRule[] = ALL_PUBLIC_ROUTE_META.map(
  (page) => ({
    match: page.path,
    seo: {
      title: page.title,
      description: page.description,
      path: page.path,
      noIndex: false,
      ogType: page.ogType ?? (page.kind === 'article' ? 'article' : 'website'),
      image: page.image,
      imageAlt: page.imageAlt,
    },
  }),
)

export const ROUTE_SEO: RouteSeoRule[] = [
  {
    match: paths.landing,
    seo: {
      title: SEO_DEFAULTS.title,
      description: SEO_DEFAULTS.description,
      path: '/',
      noIndex: false,
      ogType: 'website',
    },
  },
  ...PUBLIC_CONTENT_ROUTE_RULES,
  {
    match: paths.login,
    seo: {
      title: 'Sign in',
      description: `Sign in to your ${APP_NAME} workspace to manage invoices and receipts.`,
      path: paths.login,
      noIndex: true,
    },
  },
  {
    match: paths.register,
    seo: {
      title: 'Create account',
      description: `Create a ${APP_NAME} account and set up your invoicing workspace in minutes.`,
      path: paths.register,
      noIndex: true,
    },
  },
  {
    match: paths.forgotPassword,
    seo: {
      title: 'Reset password',
      description: `Reset your ${APP_NAME} account password.`,
      path: paths.forgotPassword,
      noIndex: true,
    },
  },
  {
    match: paths.resetPassword,
    seo: {
      title: 'Choose a new password',
      description: `Set a new password for your ${APP_NAME} account.`,
      path: paths.resetPassword,
      noIndex: true,
    },
  },
  {
    match: paths.onboarding,
    seo: {
      title: 'Get started',
      description: `Finish setting up your ${APP_NAME} workspace.`,
      path: paths.onboarding,
      noIndex: true,
    },
  },
  {
    match: paths.authCallback,
    seo: {
      title: 'Signing you in',
      description: PRIVATE_DESCRIPTION,
      path: paths.authCallback,
      noIndex: true,
    },
  },
  {
    match: paths.companyDisabled,
    seo: {
      title: 'Workspace unavailable',
      description: PRIVATE_DESCRIPTION,
      path: paths.companyDisabled,
      noIndex: true,
    },
  },
  {
    match: paths.invoiceNew,
    seo: {
      title: 'Create invoice',
      description: PRIVATE_DESCRIPTION,
      noIndex: true,
    },
  },
  {
    match: '/invoices/*/edit',
    seo: {
      title: 'Edit invoice',
      description: PRIVATE_DESCRIPTION,
      noIndex: true,
    },
  },
  {
    match: '/invoices/*',
    seo: {
      title: 'Invoice',
      description: PRIVATE_DESCRIPTION,
      noIndex: true,
    },
  },
  {
    match: paths.invoices,
    seo: {
      title: 'Invoices',
      description: PRIVATE_DESCRIPTION,
      noIndex: true,
    },
  },
  {
    match: paths.customers,
    seo: {
      title: 'Customers',
      description: PRIVATE_DESCRIPTION,
      noIndex: true,
    },
  },
  {
    match: paths.reports,
    seo: {
      title: 'Reports',
      description: PRIVATE_DESCRIPTION,
      noIndex: true,
    },
  },
  {
    match: paths.settings,
    seo: {
      title: 'Settings',
      description: PRIVATE_DESCRIPTION,
      noIndex: true,
    },
  },
  {
    match: paths.dashboard,
    seo: {
      title: 'Dashboard',
      description: PRIVATE_DESCRIPTION,
      noIndex: true,
    },
  },
  {
    match: paths.adminUsers,
    seo: {
      title: 'Admin · Users',
      description: PRIVATE_DESCRIPTION,
      noIndex: true,
    },
  },
  {
    match: paths.adminCompanies,
    seo: {
      title: 'Admin · Companies',
      description: PRIVATE_DESCRIPTION,
      noIndex: true,
    },
  },
  {
    match: paths.admin,
    seo: {
      title: 'Admin',
      description: PRIVATE_DESCRIPTION,
      noIndex: true,
    },
  },
]

export function absoluteUrl(pathOrUrl: string, siteUrl: string): string {
  if (/^https?:\/\//i.test(pathOrUrl)) return pathOrUrl
  const base = siteUrl.replace(/\/$/, '')
  let path = pathOrUrl.startsWith('/') ? pathOrUrl : `/${pathOrUrl}`
  if (path.length > 1 && path.endsWith('/')) {
    path = path.replace(/\/+$/, '')
  }
  return `${base}${path}`
}

function patternToRegex(pattern: string): RegExp {
  if (pattern === '/') return /^\/$/
  const escaped = pattern
    .replace(/[.+?^${}()|[\]\\]/g, '\\$&')
    .replace(/\*/g, '[^/]+')
  return new RegExp(`^${escaped}$`)
}

export function resolveRouteSeo(pathname: string): SeoPageConfig {
  const normalized =
    pathname.length > 1 && pathname.endsWith('/')
      ? pathname.slice(0, -1)
      : pathname || '/'

  for (const rule of ROUTE_SEO) {
    if (rule.match === normalized || patternToRegex(rule.match).test(normalized)) {
      return {
        ...rule.seo,
        path: rule.seo.path ?? normalized,
      }
    }
  }

  return {
    title: 'Page not found',
    description: 'The page you requested does not exist.',
    path: normalized,
    noIndex: true,
  }
}

export function formatDocumentTitle(title?: string): string {
  if (!title) return SEO_DEFAULTS.title
  if (title.includes(APP_NAME) || title === SEO_DEFAULTS.title) return title
  return `${title} · ${APP_NAME}`
}
