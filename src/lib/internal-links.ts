import { BLOG_INDEX_PATH } from '@/lib/breadcrumbs'
import {
  COMPARISONS_INDEX_PATH,
  FEATURES_INDEX_PATH,
  INDUSTRIES_INDEX_PATH,
  LOCATIONS_INDEX_PATH,
  PRICING_PATH,
} from '@/lib/breadcrumbs'
import {
  FEATURE_ROUTE_META,
  INDUSTRY_ROUTE_META,
  LOCATION_ROUTE_META,
} from '@/content/public-route-meta'
import { paths } from '@/lib/paths'
import type { BlogCategoryId } from '@/content/blog/types'

export type InternalLink = {
  label: string
  path: string
  description?: string
}

export const CONVERSION_FUNNEL: InternalLink[] = [
  {
    label: 'Blog',
    path: BLOG_INDEX_PATH,
    description: 'Guides on billing, GST, and invoices',
  },
  {
    label: 'Features',
    path: FEATURES_INDEX_PATH,
    description: 'Invoice, GST, PDF, email, and reports',
  },
  {
    label: 'Pricing',
    path: PRICING_PATH,
    description: 'Simple plans for small businesses',
  },
  {
    label: 'Sign up',
    path: paths.register,
    description: 'Create your ReceiptFlow workspace',
  },
  {
    label: 'Industries',
    path: INDUSTRIES_INDEX_PATH,
    description: 'Billing software by business type',
  },
  {
    label: 'Locations',
    path: LOCATIONS_INDEX_PATH,
    description: 'Billing software by city',
  },
]

export type MarketingSurface =
  | 'blog'
  | 'feature'
  | 'pricing'
  | 'signup'
  | 'industry'
  | 'location'
  | 'tool'
  | 'hub'
  | 'other'

const BLOG_CATEGORY_FEATURE_LINKS: Record<BlogCategoryId, InternalLink[]> = {
  billing: [
    { label: 'Invoice software', path: '/invoice-software' },
    { label: 'Payment tracking', path: '/payment-tracking' },
  ],
  gst: [
    { label: 'GST billing software', path: '/gst-billing-software' },
    { label: 'Invoice software', path: '/invoice-software' },
  ],
  invoices: [
    { label: 'PDF invoices', path: '/pdf-invoices' },
    { label: 'Email invoices', path: '/email-invoices' },
  ],
  'small-business': [
    { label: 'Customer management', path: '/customer-management' },
    { label: 'Sales dashboard', path: '/sales-dashboard' },
  ],
  accounting: [
    { label: 'Sales reports', path: '/reports' },
    { label: 'GST billing software', path: '/gst-billing-software' },
  ],
}

export function getFunnelStepIndex(surface: MarketingSurface): number {
  switch (surface) {
    case 'blog':
      return 0
    case 'feature':
      return 1
    case 'pricing':
      return 2
    case 'signup':
      return 3
    case 'industry':
      return 4
    case 'location':
      return 5
    default:
      return -1
  }
}

export function getNextFunnelStep(
  surface: MarketingSurface,
): InternalLink | undefined {
  const index = getFunnelStepIndex(surface)
  if (index < 0 || index >= CONVERSION_FUNNEL.length - 1) return undefined
  return CONVERSION_FUNNEL[index + 1]
}

export function getContextualInternalLinks(
  surface: MarketingSurface,
  options?: { blogCategoryId?: BlogCategoryId },
): InternalLink[] {
  const features = FEATURE_ROUTE_META.slice(0, 4).map((page) => ({
    label: page.eyebrow || page.title,
    path: page.path,
  }))
  const industries = INDUSTRY_ROUTE_META.slice(0, 4).map((page) => ({
    label: page.eyebrow || page.title,
    path: page.path,
  }))
  const locations = LOCATION_ROUTE_META.slice(0, 4).map((page) => ({
    label: page.eyebrow || page.title,
    path: page.path,
  }))

  switch (surface) {
    case 'blog':
      return [
        ...(options?.blogCategoryId
          ? BLOG_CATEGORY_FEATURE_LINKS[options.blogCategoryId]
          : features.slice(0, 2)),
        { label: 'See pricing', path: PRICING_PATH },
        { label: 'Create account', path: paths.register },
        { label: 'Browse industries', path: INDUSTRIES_INDEX_PATH },
      ]
    case 'feature':
      return [
        { label: 'View pricing', path: PRICING_PATH },
        { label: 'Start free', path: paths.register },
        { label: 'Compare software', path: COMPARISONS_INDEX_PATH },
        { label: 'Industry solutions', path: INDUSTRIES_INDEX_PATH },
        { label: 'City pages', path: LOCATIONS_INDEX_PATH },
      ]
    case 'pricing':
      return [
        { label: 'Create account', path: paths.register },
        { label: 'Explore features', path: FEATURES_INDEX_PATH },
        { label: 'Compare alternatives', path: COMPARISONS_INDEX_PATH },
        { label: 'Industry billing', path: INDUSTRIES_INDEX_PATH },
        { label: 'Location pages', path: LOCATIONS_INDEX_PATH },
      ]
    case 'signup':
      return [
        { label: 'Back to pricing', path: PRICING_PATH },
        { label: 'Features', path: FEATURES_INDEX_PATH },
        { label: 'Industries', path: INDUSTRIES_INDEX_PATH },
      ]
    case 'industry':
      return [
        { label: 'See pricing', path: PRICING_PATH },
        { label: 'Sign up free', path: paths.register },
        { label: 'Billing by city', path: LOCATIONS_INDEX_PATH },
        ...locations.slice(0, 2),
        { label: 'Features', path: FEATURES_INDEX_PATH },
      ]
    case 'location':
      return [
        { label: 'See pricing', path: PRICING_PATH },
        { label: 'Create account', path: paths.register },
        { label: 'Industry pages', path: INDUSTRIES_INDEX_PATH },
        ...industries.slice(0, 2),
        { label: 'Features', path: FEATURES_INDEX_PATH },
      ]
    case 'tool':
      return [
        { label: 'Features', path: FEATURES_INDEX_PATH },
        { label: 'Pricing', path: PRICING_PATH },
        { label: 'Sign up', path: paths.register },
        { label: 'Blog guides', path: BLOG_INDEX_PATH },
      ]
    case 'hub':
      return [
        ...CONVERSION_FUNNEL.filter((step) => step.path !== paths.register),
        { label: 'Comparisons', path: COMPARISONS_INDEX_PATH },
      ]
    default:
      return CONVERSION_FUNNEL
  }
}
