/**
 * Slim helpers for marketing chrome.
 * Primary nav/footer trees live in `site-nav.ts`.
 */

export const MARKETING_DARK_HERO_PREFIXES = [
  '/blog',
  '/tools',
  '/features',
  '/industries',
  '/locations',
  '/pricing',
  '/comparisons',
  '/receiptflow-vs-',
  '/invoice-',
  '/gst-',
  '/customer-',
  '/pdf-',
  '/email-',
  '/sales-',
  '/reports',
  '/payment-',
  '/billing-software',
  '/article/',
  '/about',
  '/contact',
  '/privacy',
  '/terms',
] as const

export function isMarketingDarkHeroPath(pathname: string) {
  if (pathname === '/') return true
  return MARKETING_DARK_HERO_PREFIXES.some(
    (prefix) => pathname === prefix || pathname.startsWith(prefix),
  )
}
