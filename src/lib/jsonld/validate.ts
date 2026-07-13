import type {
  JsonLdGraph,
  JsonLdNode,
  ValidationIssue,
  ValidationResult,
} from '@/lib/jsonld/types'

function issue(
  level: ValidationIssue['level'],
  type: string,
  message: string,
  path?: string,
): ValidationIssue {
  return { level, type, message, path }
}

function asArray(value: unknown): unknown[] {
  if (Array.isArray(value)) return value
  if (value == null) return []
  return [value]
}

function typesOf(node: JsonLdNode): string[] {
  return asArray(node['@type']).map(String)
}

function hasType(node: JsonLdNode, type: string) {
  return typesOf(node).includes(type)
}

function requireString(
  node: JsonLdNode,
  key: string,
  type: string,
  errors: ValidationIssue[],
) {
  const value = node[key]
  if (typeof value !== 'string' || !value.trim()) {
    errors.push(issue('error', type, `Missing required property "${key}".`, key))
  }
}

function getOffer(node: JsonLdNode): JsonLdNode | null {
  const offers = node.offers
  if (!offers || typeof offers !== 'object' || Array.isArray(offers)) return null
  return offers as JsonLdNode
}

/**
 * Validates a JSON-LD @graph against Google Rich Results required fields.
 * Does not call Google's API — mirrors documented requirements locally.
 */
export function validateJsonLdGraph(graph: JsonLdGraph): ValidationResult {
  const errors: ValidationIssue[] = []
  const warnings: ValidationIssue[] = []
  const nodes = graph['@graph'] ?? []

  if (!graph['@context'] || graph['@context'] !== 'https://schema.org') {
    errors.push(
      issue('error', 'Graph', '@context must be "https://schema.org".'),
    )
  }

  if (nodes.length === 0) {
    errors.push(issue('error', 'Graph', '@graph must include at least one node.'))
    return { ok: false, errors, warnings }
  }

  for (const node of nodes) {
    const typeList = typesOf(node)
    if (typeList.length === 0) {
      errors.push(issue('error', 'Node', 'Every node needs an @type.'))
      continue
    }

    if (hasType(node, 'Organization')) {
      requireString(node, 'name', 'Organization', errors)
      requireString(node, 'url', 'Organization', errors)
      if (!node.logo) {
        errors.push(
          issue(
            'error',
            'Organization',
            'Missing required property "logo" (ImageObject or URL).',
            'logo',
          ),
        )
      } else if (typeof node.logo === 'object' && node.logo !== null) {
        const logo = node.logo as JsonLdNode
        if (!logo.url && !logo.contentUrl) {
          errors.push(
            issue(
              'error',
              'Organization',
              'Organization logo must include url or contentUrl.',
              'logo',
            ),
          )
        }
      }
    }

    if (hasType(node, 'WebSite')) {
      requireString(node, 'name', 'WebSite', errors)
      requireString(node, 'url', 'WebSite', errors)
      if (!node.publisher) {
        warnings.push(
          issue(
            'warning',
            'WebSite',
            'Recommended: publisher referencing Organization.',
            'publisher',
          ),
        )
      }
    }

    if (
      hasType(node, 'SoftwareApplication') ||
      hasType(node, 'WebApplication')
    ) {
      requireString(node, 'name', 'SoftwareApplication', errors)
      const offer = getOffer(node)
      if (!offer || (offer.price !== 0 && offer.price !== '0' && !offer.price)) {
        errors.push(
          issue(
            'error',
            'SoftwareApplication',
            'Missing required offers.price (use 0 for free apps).',
            'offers.price',
          ),
        )
      }
      const hasRating = Boolean(node.aggregateRating)
      const hasReview = asArray(node.review).length > 0
      if (!hasRating && !hasReview) {
        errors.push(
          issue(
            'error',
            'SoftwareApplication',
            'Google requires aggregateRating or review for Software App rich results.',
            'review',
          ),
        )
      }
      if (!node.applicationCategory) {
        warnings.push(
          issue(
            'warning',
            'SoftwareApplication',
            'Recommended: applicationCategory (e.g. BusinessApplication).',
            'applicationCategory',
          ),
        )
      }
      if (!node.operatingSystem) {
        warnings.push(
          issue(
            'warning',
            'SoftwareApplication',
            'Recommended: operatingSystem.',
            'operatingSystem',
          ),
        )
      }
    }

    if (hasType(node, 'Product')) {
      requireString(node, 'name', 'Product', errors)
      const offer = getOffer(node)
      const hasOffer = Boolean(offer)
      const hasRating = Boolean(node.aggregateRating)
      const hasReview = asArray(node.review).length > 0
      if (!hasOffer && !hasRating && !hasReview) {
        errors.push(
          issue(
            'error',
            'Product',
            'Product rich results need offers, review, or aggregateRating.',
            'offers',
          ),
        )
      }
      if (offer) {
        if (offer.price === undefined || offer.price === null || offer.price === '') {
          errors.push(
            issue('error', 'Product', 'Offer requires price.', 'offers.price'),
          )
        }
        if (!offer.priceCurrency) {
          errors.push(
            issue(
              'error',
              'Product',
              'Offer requires priceCurrency.',
              'offers.priceCurrency',
            ),
          )
        }
        if (!offer.availability) {
          warnings.push(
            issue(
              'warning',
              'Product',
              'Recommended: offers.availability (schema.org/InStock).',
              'offers.availability',
            ),
          )
        }
      }
      if (!node.image) {
        warnings.push(
          issue('warning', 'Product', 'Recommended: image.', 'image'),
        )
      }
    }

    if (hasType(node, 'BreadcrumbList')) {
      const items = asArray(node.itemListElement)
      if (items.length < 1) {
        errors.push(
          issue(
            'error',
            'BreadcrumbList',
            'itemListElement must include at least one ListItem.',
            'itemListElement',
          ),
        )
      }
      items.forEach((raw, index) => {
        if (!raw || typeof raw !== 'object') return
        const item = raw as JsonLdNode
        if (!item.name) {
          errors.push(
            issue(
              'error',
              'BreadcrumbList',
              `ListItem[${index}] requires name.`,
              `itemListElement[${index}].name`,
            ),
          )
        }
        if (item.position == null) {
          errors.push(
            issue(
              'error',
              'BreadcrumbList',
              `ListItem[${index}] requires position.`,
              `itemListElement[${index}].position`,
            ),
          )
        }
      })
    }

    if (hasType(node, 'FAQPage')) {
      const entities = asArray(node.mainEntity)
      if (entities.length < 1) {
        errors.push(
          issue(
            'error',
            'FAQPage',
            'FAQPage requires mainEntity with at least one Question.',
            'mainEntity',
          ),
        )
      }
      entities.forEach((raw, index) => {
        if (!raw || typeof raw !== 'object') return
        const q = raw as JsonLdNode
        if (!q.name) {
          errors.push(
            issue(
              'error',
              'FAQPage',
              `Question[${index}] requires name.`,
              `mainEntity[${index}].name`,
            ),
          )
        }
        const answer = q.acceptedAnswer as JsonLdNode | undefined
        if (!answer?.text) {
          errors.push(
            issue(
              'error',
              'FAQPage',
              `Question[${index}] requires acceptedAnswer.text.`,
              `mainEntity[${index}].acceptedAnswer.text`,
            ),
          )
        }
      })
      warnings.push(
        issue(
          'warning',
          'FAQPage',
          'FAQ rich results are limited for many sites; keep FAQ visible on-page and valid for knowledge graph / AI parsing.',
        ),
      )
    }

    if (hasType(node, 'Article') || hasType(node, 'BlogPosting') || hasType(node, 'NewsArticle')) {
      if (!node.headline) {
        warnings.push(
          issue(
            'warning',
            'Article',
            'Recommended for rich results: headline.',
            'headline',
          ),
        )
      }
      if (!node.image) {
        warnings.push(
          issue(
            'warning',
            'Article',
            'Recommended for rich results: image.',
            'image',
          ),
        )
      }
      if (!node.datePublished) {
        warnings.push(
          issue(
            'warning',
            'Article',
            'Recommended for rich results: datePublished.',
            'datePublished',
          ),
        )
      }
      if (!node.author) {
        warnings.push(
          issue(
            'warning',
            'Article',
            'Recommended for rich results: author.',
            'author',
          ),
        )
      }
      if (!node.publisher) {
        warnings.push(
          issue(
            'warning',
            'Article',
            'Recommended: publisher referencing Organization.',
            'publisher',
          ),
        )
      }
    }
  }

  return {
    ok: errors.length === 0,
    errors,
    warnings,
  }
}

export function assertValidJsonLd(
  graph: JsonLdGraph,
  options?: { throwOnError?: boolean },
): ValidationResult {
  const result = validateJsonLdGraph(graph)
  if (import.meta.env.DEV && (result.errors.length || result.warnings.length)) {
    const label = result.ok ? 'JSON-LD warnings' : 'JSON-LD validation failed'
    console[result.ok ? 'warn' : 'error'](`[SEO] ${label}`, result)
  }
  if (!result.ok && options?.throwOnError) {
    throw new Error(
      result.errors.map((e) => `${e.type}: ${e.message}`).join('; '),
    )
  }
  return result
}
