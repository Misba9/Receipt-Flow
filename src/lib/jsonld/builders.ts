import { APP_NAME } from '@/utils'
import { SEO_DEFAULTS, absoluteUrl } from '@/lib/seo'
import type {
  BreadcrumbCrumb,
  FaqEntry,
  JsonLdGraph,
  JsonLdNode,
  ReviewEntry,
} from '@/lib/jsonld/types'

export function orgId(siteUrl: string) {
  return `${absoluteUrl('/', siteUrl)}#organization`
}

export function websiteId(siteUrl: string) {
  return `${absoluteUrl('/', siteUrl)}#website`
}

export function softwareId(siteUrl: string) {
  return `${absoluteUrl('/', siteUrl)}#software`
}

export function productId(siteUrl: string) {
  return `${absoluteUrl('/', siteUrl)}#product`
}

export function pageId(path: string, siteUrl: string) {
  return `${absoluteUrl(path, siteUrl)}#webpage`
}

export function logoImageObject(siteUrl: string): JsonLdNode {
  return {
    '@type': 'ImageObject',
    '@id': `${absoluteUrl('/', siteUrl)}#logo`,
    url: absoluteUrl('/apple-touch-icon.png', siteUrl),
    contentUrl: absoluteUrl('/apple-touch-icon.png', siteUrl),
    width: 180,
    height: 180,
    caption: APP_NAME,
  }
}

export function buildOrganization(siteUrl: string): JsonLdNode {
  const url = absoluteUrl('/', siteUrl)
  return {
    '@type': 'Organization',
    '@id': orgId(siteUrl),
    name: APP_NAME,
    legalName: APP_NAME,
    url,
    description: SEO_DEFAULTS.description,
    logo: logoImageObject(siteUrl),
    image: absoluteUrl(SEO_DEFAULTS.imagePath, siteUrl),
    foundingDate: '2026',
    contactPoint: [
      {
        '@type': 'ContactPoint',
        contactType: 'customer support',
        url: absoluteUrl('/contact', siteUrl),
        availableLanguage: ['English'],
      },
    ],
  }
}

export function buildWebSite(siteUrl: string): JsonLdNode {
  const url = absoluteUrl('/', siteUrl)
  return {
    '@type': 'WebSite',
    '@id': websiteId(siteUrl),
    name: APP_NAME,
    url,
    description: SEO_DEFAULTS.description,
    inLanguage: 'en-US',
    publisher: { '@id': orgId(siteUrl) },
    copyrightHolder: { '@id': orgId(siteUrl) },
  }
}

function buildReviews(reviews: ReviewEntry[]): JsonLdNode[] {
  return reviews.map((review) => {
    const node: JsonLdNode = {
      '@type': 'Review',
      author: {
        '@type': 'Person',
        name: review.authorName,
        ...(review.authorRole
          ? { jobTitle: review.authorRole.split(',')[0]?.trim() }
          : {}),
      },
      reviewBody: review.quote,
    }
    if (typeof review.ratingValue === 'number') {
      node.reviewRating = {
        '@type': 'Rating',
        ratingValue: review.ratingValue,
        bestRating: 5,
        worstRating: 1,
      }
    }
    return node
  })
}

/**
 * SoftwareApplication / WebApplication — Google requires name, offers.price,
 * and either aggregateRating or review for Software App rich results.
 */
export function buildSoftwareApplication(
  siteUrl: string,
  reviews: ReviewEntry[] = [],
): JsonLdNode {
  const url = absoluteUrl('/', siteUrl)
  const node: JsonLdNode = {
    '@type': ['SoftwareApplication', 'WebApplication'],
    '@id': softwareId(siteUrl),
    name: APP_NAME,
    applicationCategory: 'BusinessApplication',
    applicationSubCategory: 'Invoicing',
    operatingSystem: 'Web browser',
    browserRequirements: 'Requires JavaScript and HTML5',
    description: SEO_DEFAULTS.description,
    url,
    image: absoluteUrl(SEO_DEFAULTS.imagePath, siteUrl),
    screenshot: absoluteUrl(SEO_DEFAULTS.imagePath, siteUrl),
    author: { '@id': orgId(siteUrl) },
    publisher: { '@id': orgId(siteUrl) },
    offers: {
      '@type': 'Offer',
      price: 0,
      priceCurrency: 'USD',
      availability: 'https://schema.org/InStock',
      url,
    },
  }

  if (reviews.length > 0) {
    const withRatings = reviews.map((r) => ({
      ...r,
      ratingValue: r.ratingValue ?? 5,
    }))
    node.review = buildReviews(withRatings)
    const sum = withRatings.reduce((acc, r) => acc + (r.ratingValue ?? 5), 0)
    node.aggregateRating = {
      '@type': 'AggregateRating',
      ratingValue: Number((sum / withRatings.length).toFixed(1)),
      reviewCount: withRatings.length,
      bestRating: 5,
      worstRating: 1,
    }
  }

  return node
}

/**
 * Product — Google Product snippets need name + offers (or review / aggregateRating).
 */
export function buildProduct(
  siteUrl: string,
  reviews: ReviewEntry[] = [],
): JsonLdNode {
  const url = absoluteUrl('/', siteUrl)
  const node: JsonLdNode = {
    '@type': 'Product',
    '@id': productId(siteUrl),
    name: APP_NAME,
    description: SEO_DEFAULTS.description,
    image: [
      absoluteUrl(SEO_DEFAULTS.imagePath, siteUrl),
      absoluteUrl('/apple-touch-icon.png', siteUrl),
    ],
    brand: {
      '@type': 'Brand',
      name: APP_NAME,
    },
    category: 'BusinessApplication',
    sku: 'receiptflow-saas',
    mpn: 'receiptflow-web',
    offers: {
      '@type': 'Offer',
      url,
      price: '0',
      priceCurrency: 'USD',
      availability: 'https://schema.org/InStock',
      itemCondition: 'https://schema.org/NewCondition',
      priceValidUntil: '2027-12-31',
      seller: { '@id': orgId(siteUrl) },
    },
    isRelatedTo: { '@id': softwareId(siteUrl) },
  }

  if (reviews.length > 0) {
    const withRatings = reviews.map((r) => ({
      ...r,
      ratingValue: r.ratingValue ?? 5,
    }))
    node.review = buildReviews(withRatings)
    const sum = withRatings.reduce((acc, r) => acc + (r.ratingValue ?? 5), 0)
    node.aggregateRating = {
      '@type': 'AggregateRating',
      ratingValue: Number((sum / withRatings.length).toFixed(1)),
      reviewCount: withRatings.length,
      bestRating: 5,
      worstRating: 1,
    }
  }

  return node
}

export function buildBreadcrumbList(
  crumbs: BreadcrumbCrumb[],
  siteUrl: string,
): JsonLdNode | null {
  if (crumbs.length < 1) return null

  return {
    '@type': 'BreadcrumbList',
    '@id': `${absoluteUrl(crumbs[crumbs.length - 1]?.path ?? '/', siteUrl)}#breadcrumb`,
    itemListElement: crumbs.map((crumb, index) => {
      const item: JsonLdNode = {
        '@type': 'ListItem',
        position: index + 1,
        name: crumb.name,
      }
      // Google: include item URL for all but the final crumb (recommended).
      if (index < crumbs.length - 1) {
        item.item = absoluteUrl(crumb.path, siteUrl)
      } else {
        item.item = absoluteUrl(crumb.path, siteUrl)
      }
      return item
    }),
  }
}

export function buildFaqPage(
  faqs: FaqEntry[],
  pagePath: string,
  siteUrl: string,
): JsonLdNode | null {
  if (faqs.length < 1) return null

  return {
    '@type': 'FAQPage',
    '@id': `${absoluteUrl(pagePath, siteUrl)}#faq`,
    mainEntity: faqs.map((faq) => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer,
      },
    })),
  }
}

/** CollectionPage + ItemList for hub indexes (features, blog, tools, etc.). */
export function buildCollectionPage(options: {
  siteUrl: string
  path: string
  name: string
  description: string
  items: Array<{ name: string; path: string }>
}): JsonLdNode | null {
  if (options.items.length < 1) return null
  const pageUrl = absoluteUrl(options.path, options.siteUrl)
  return {
    '@type': 'CollectionPage',
    '@id': `${pageUrl}#collection`,
    url: pageUrl,
    name: options.name,
    description: options.description,
    isPartOf: { '@id': websiteId(options.siteUrl) },
    mainEntity: {
      '@type': 'ItemList',
      numberOfItems: options.items.length,
      itemListElement: options.items.map((item, index) => ({
        '@type': 'ListItem',
        position: index + 1,
        name: item.name,
        url: absoluteUrl(item.path, options.siteUrl),
      })),
    },
  }
}

/**
 * Product offer helper used on the pricing page.
 */
export function buildPricingProduct(
  siteUrl: string,
  options: {
    name: string
    description: string
    path: string
    offer: {
      name: string
      price: number
      priceCurrency: string
      url: string
      description?: string
    }
    reviews?: ReviewEntry[]
  },
): JsonLdNode {
  const pageUrl = absoluteUrl(options.path, siteUrl)
  const node: JsonLdNode = {
    '@type': 'Product',
    '@id': `${pageUrl}#product`,
    name: options.name,
    description: options.description,
    image: [
      absoluteUrl(SEO_DEFAULTS.imagePath, siteUrl),
      absoluteUrl('/apple-touch-icon.png', siteUrl),
    ],
    brand: {
      '@type': 'Brand',
      name: APP_NAME,
    },
    category: 'BusinessApplication',
    url: pageUrl,
    offers: {
      '@type': 'Offer',
      name: options.offer.name,
      description: options.offer.description,
      url: absoluteUrl(options.offer.url, siteUrl),
      price: String(options.offer.price),
      priceCurrency: options.offer.priceCurrency,
      availability: 'https://schema.org/InStock',
      itemCondition: 'https://schema.org/NewCondition',
      priceValidUntil: '2027-12-31',
      seller: { '@id': orgId(siteUrl) },
    },
    isRelatedTo: { '@id': softwareId(siteUrl) },
  }

  if (options.reviews && options.reviews.length > 0) {
    const withRatings = options.reviews.map((r) => ({
      ...r,
      ratingValue: r.ratingValue ?? 5,
    }))
    node.review = buildReviews(withRatings)
    const sum = withRatings.reduce((acc, r) => acc + (r.ratingValue ?? 5), 0)
    node.aggregateRating = {
      '@type': 'AggregateRating',
      ratingValue: Number((sum / withRatings.length).toFixed(1)),
      reviewCount: withRatings.length,
      bestRating: 5,
      worstRating: 1,
    }
  }

  return node
}

export function buildArticle(options: {
  siteUrl: string
  path: string
  headline: string
  description: string
  datePublished: string
  dateModified?: string
  imagePaths?: string[]
}): JsonLdNode {
  const { siteUrl, path, headline, description, datePublished } = options
  const pageUrl = absoluteUrl(path, siteUrl)
  const images = (options.imagePaths ?? [
    SEO_DEFAULTS.imagePath,
    '/apple-touch-icon.png',
  ]).map((p) => absoluteUrl(p, siteUrl))

  return {
    '@type': 'Article',
    '@id': `${pageUrl}#article`,
    headline: headline.slice(0, 110),
    description,
    image: images,
    datePublished,
    dateModified: options.dateModified ?? datePublished,
    author: {
      '@type': 'Organization',
      name: APP_NAME,
      url: absoluteUrl('/', siteUrl),
    },
    publisher: { '@id': orgId(siteUrl) },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': pageId(path, siteUrl),
    },
    inLanguage: 'en-US',
    isAccessibleForFree: true,
  }
}

export function buildWebPage(options: {
  siteUrl: string
  path: string
  name: string
  description: string
  noIndex?: boolean
  primaryEntityId?: string
}): JsonLdNode {
  const pageUrl = absoluteUrl(options.path, options.siteUrl)
  const node: JsonLdNode = {
    '@type': 'WebPage',
    '@id': pageId(options.path, options.siteUrl),
    url: pageUrl,
    name: options.name,
    description: options.description,
    isPartOf: { '@id': websiteId(options.siteUrl) },
    about: { '@id': orgId(options.siteUrl) },
    inLanguage: 'en-US',
  }

  if (options.primaryEntityId) {
    node.primaryEntityOfPage = { '@id': options.primaryEntityId }
    node.mainEntity = { '@id': options.primaryEntityId }
  }

  if (options.noIndex) {
    node.robots = 'noindex, nofollow'
  } else {
    node.speakable = {
      '@type': 'SpeakableSpecification',
      cssSelector: ['h1', '#summary', '[data-speakable=true]'],
    }
  }

  return node
}

export function toGraph(nodes: Array<JsonLdNode | null | undefined>): JsonLdGraph {
  const graph = nodes.filter((node): node is JsonLdNode => Boolean(node))
  return {
    '@context': 'https://schema.org',
    '@graph': graph,
  }
}
