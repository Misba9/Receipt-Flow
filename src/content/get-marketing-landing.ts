import { getIndustryLanding } from '@/content/industry-landings'
import { getLocationLanding } from '@/content/location-landings'
import { getSeoLanding } from '@/content/seo-landings'
import type { SeoLandingPageConfig } from '@/content/marketing-landing-types'
import type { MarketingSurface } from '@/lib/internal-links'

/** Resolve feature, industry, or location SEO landing by slug or path. */
export function getMarketingLanding(
  slugOrPath: string,
): SeoLandingPageConfig | undefined {
  return (
    getSeoLanding(slugOrPath) ??
    getIndustryLanding(slugOrPath) ??
    getLocationLanding(slugOrPath)
  )
}

export function getMarketingLandingSurface(
  slugOrPath: string,
): Extract<MarketingSurface, 'feature' | 'industry' | 'location'> | undefined {
  if (getSeoLanding(slugOrPath)) return 'feature'
  if (getIndustryLanding(slugOrPath)) return 'industry'
  if (getLocationLanding(slugOrPath)) return 'location'
  return undefined
}
