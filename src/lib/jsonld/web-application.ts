import type { JsonLdNode } from '@/lib/jsonld/types'
import { absoluteUrl } from '@/lib/seo'
import { APP_NAME } from '@/utils'
import { orgId, pageId } from '@/lib/jsonld/builders'

/** Free browser tool marked up as a WebApplication. */
export function buildWebApplication(options: {
  siteUrl: string
  path: string
  name: string
  description: string
  applicationCategory: string
}): JsonLdNode {
  const pageUrl = absoluteUrl(options.path, options.siteUrl)
  return {
    '@type': 'WebApplication',
    '@id': `${pageUrl}#webapp`,
    name: options.name,
    description: options.description,
    url: pageUrl,
    applicationCategory: options.applicationCategory,
    operatingSystem: 'Any',
    browserRequirements: 'Requires JavaScript',
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'INR',
    },
    isAccessibleForFree: true,
    provider: { '@id': orgId(options.siteUrl) },
    publisher: { '@id': orgId(options.siteUrl) },
    inLanguage: 'en-US',
    mainEntityOfPage: { '@id': pageId(options.path, options.siteUrl) },
    creator: {
      '@type': 'Organization',
      name: APP_NAME,
      url: absoluteUrl('/', options.siteUrl),
    },
  }
}
