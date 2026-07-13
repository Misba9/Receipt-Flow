import { PUBLIC_ROUTE_META_BY_PATH } from '@/content/public-route-meta'
import type { BreadcrumbCrumb } from '@/lib/jsonld/types'
import { paths } from '@/lib/paths'

export const FEATURES_INDEX_PATH = '/features'
export const INDUSTRIES_INDEX_PATH = '/industries'
export const LOCATIONS_INDEX_PATH = '/locations'
export const PRICING_PATH = '/pricing'
export const BLOG_INDEX_PATH = '/blog'
export const TOOLS_INDEX_PATH = '/tools'
export const COMPARISONS_INDEX_PATH = '/comparisons'
export const ABOUT_PATH = '/about'
export const CONTACT_PATH = '/contact'
export const PRIVACY_PATH = '/privacy'
export const TERMS_PATH = '/terms'

const SEGMENT_LABELS: Record<string, string> = {
  features: 'Features',
  industries: 'Industries',
  locations: 'Locations',
  pricing: 'Pricing',
  blog: 'Blog',
  tools: 'Tools',
  comparisons: 'Comparisons',
  about: 'About',
  contact: 'Contact',
  privacy: 'Privacy',
  terms: 'Terms',
  category: 'Category',
  article: 'Article',
  register: 'Sign up',
  login: 'Sign in',
}

function normalizePath(pathname: string) {
  if (!pathname || pathname === '/') return '/'
  return pathname.length > 1 && pathname.endsWith('/')
    ? pathname.slice(0, -1)
    : pathname
}

function humanizeSegment(segment: string) {
  if (SEGMENT_LABELS[segment]) return SEGMENT_LABELS[segment]
  if (/^[0-9a-f-]{8,}$/i.test(segment)) return 'Details'
  return segment
    .split('-')
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(' ')
}

function metaLabel(path: string) {
  const meta = PUBLIC_ROUTE_META_BY_PATH[path]
  return meta?.eyebrow || meta?.title?.split('|')[0]?.trim() || humanizeSegment(path.split('/').pop() || path)
}

/**
 * Single source of truth for UI breadcrumbs and BreadcrumbList JSON-LD.
 * Uses slim route meta so the main bundle does not pull full landing copy.
 */
export function buildBreadcrumbs(pathname: string): BreadcrumbCrumb[] {
  const path = normalizePath(pathname)
  const crumbs: BreadcrumbCrumb[] = [{ name: 'Home', path: '/' }]
  if (path === '/') return crumbs

  if (path === BLOG_INDEX_PATH) {
    crumbs.push({ name: 'Blog', path: BLOG_INDEX_PATH })
    return crumbs
  }
  if (path === FEATURES_INDEX_PATH) {
    crumbs.push({ name: 'Features', path: FEATURES_INDEX_PATH })
    return crumbs
  }
  if (path === INDUSTRIES_INDEX_PATH) {
    crumbs.push({ name: 'Industries', path: INDUSTRIES_INDEX_PATH })
    return crumbs
  }
  if (path === LOCATIONS_INDEX_PATH) {
    crumbs.push({ name: 'Locations', path: LOCATIONS_INDEX_PATH })
    return crumbs
  }
  if (path === PRICING_PATH) {
    crumbs.push({ name: 'Pricing', path: PRICING_PATH })
    return crumbs
  }
  if (path === TOOLS_INDEX_PATH) {
    crumbs.push({ name: 'Tools', path: TOOLS_INDEX_PATH })
    return crumbs
  }
  if (path === COMPARISONS_INDEX_PATH) {
    crumbs.push({ name: 'Comparisons', path: COMPARISONS_INDEX_PATH })
    return crumbs
  }
  if (
    path === ABOUT_PATH ||
    path === CONTACT_PATH ||
    path === PRIVACY_PATH ||
    path === TERMS_PATH
  ) {
    crumbs.push({ name: metaLabel(path), path })
    return crumbs
  }
  if (path === paths.register) {
    crumbs.push({ name: 'Pricing', path: PRICING_PATH })
    crumbs.push({ name: 'Sign up', path: paths.register })
    return crumbs
  }

  const meta = PUBLIC_ROUTE_META_BY_PATH[path]
  if (meta?.kind === 'feature') {
    crumbs.push({ name: 'Features', path: FEATURES_INDEX_PATH })
    crumbs.push({ name: metaLabel(path), path })
    return crumbs
  }
  if (meta?.kind === 'industry') {
    crumbs.push({ name: 'Industries', path: INDUSTRIES_INDEX_PATH })
    crumbs.push({ name: metaLabel(path), path })
    return crumbs
  }
  if (meta?.kind === 'location') {
    crumbs.push({ name: 'Locations', path: LOCATIONS_INDEX_PATH })
    crumbs.push({ name: metaLabel(path), path })
    return crumbs
  }
  if (meta?.kind === 'tool') {
    crumbs.push({ name: 'Tools', path: TOOLS_INDEX_PATH })
    crumbs.push({ name: metaLabel(path), path })
    return crumbs
  }
  if (meta?.kind === 'comparison') {
    crumbs.push({ name: 'Comparisons', path: COMPARISONS_INDEX_PATH })
    crumbs.push({ name: metaLabel(path), path })
    return crumbs
  }
  if (meta?.kind === 'blog-category') {
    crumbs.push({ name: 'Blog', path: BLOG_INDEX_PATH })
    crumbs.push({ name: metaLabel(path), path })
    return crumbs
  }
  if (meta?.kind === 'article') {
    crumbs.push({ name: 'Blog', path: BLOG_INDEX_PATH })
    // Prefer category crumb when path pattern matches /article/…
    crumbs.push({
      name: meta.title.replace(/\s*\|\s*ReceiptFlow Blog$/, ''),
      path,
    })
    return crumbs
  }

  const parts = path.split('/').filter(Boolean)
  let cursor = ''
  for (const part of parts) {
    cursor += `/${part}`
    crumbs.push({
      name: humanizeSegment(part),
      path: cursor,
    })
  }
  return crumbs
}
