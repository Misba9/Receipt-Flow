import { useEffect } from 'react'
import { env } from '@/lib/env'
import {
  SEO_DEFAULTS,
  absoluteUrl,
  formatDocumentTitle,
  type SeoPageConfig,
} from '@/lib/seo'
import type { JsonLdGraph } from '@/lib/jsonld'

type UseDocumentMetaOptions = SeoPageConfig & {
  /** Override OG/Twitter image path or absolute URL. */
  image?: string
  imageAlt?: string
  /** Full JSON-LD @graph (preferred) or legacy node list. */
  jsonLd?: JsonLdGraph | Record<string, unknown>[]
}

type MetaDescriptor =
  | { kind: 'name'; key: string; content: string }
  | { kind: 'property'; key: string; content: string }

function upsertMeta(descriptor: MetaDescriptor): HTMLMetaElement {
  const selector =
    descriptor.kind === 'name'
      ? `meta[name="${descriptor.key}"]`
      : `meta[property="${descriptor.key}"]`

  let el = document.head.querySelector(selector) as HTMLMetaElement | null
  if (!el) {
    el = document.createElement('meta')
    if (descriptor.kind === 'name') el.setAttribute('name', descriptor.key)
    else el.setAttribute('property', descriptor.key)
    document.head.appendChild(el)
  }
  el.setAttribute('content', descriptor.content)
  return el
}

function upsertLink(rel: string, href: string, attrs?: Record<string, string>) {
  const attrQuery = attrs
    ? Object.entries(attrs)
        .map(([key, value]) => `[${key}="${value}"]`)
        .join('')
    : ''
  let el = document.head.querySelector(
    `link[rel="${rel}"]${attrQuery}`,
  ) as HTMLLinkElement | null
  if (!el) {
    el = document.createElement('link')
    el.rel = rel
    if (attrs) {
      for (const [key, value] of Object.entries(attrs)) {
        el.setAttribute(key, value)
      }
    }
    document.head.appendChild(el)
  }
  el.href = href
  return el
}

function setJsonLdScripts(
  graph: { '@context': string; '@graph': Record<string, unknown>[] } | Record<string, unknown>[] | undefined,
) {
  document
    .querySelectorAll('script[data-seo-jsonld="true"]')
    .forEach((node) => node.remove())

  if (!graph) return

  const payload = Array.isArray(graph)
    ? { '@context': 'https://schema.org', '@graph': graph }
    : graph

  if (!payload['@graph']?.length) return

  const script = document.createElement('script')
  script.type = 'application/ld+json'
  script.dataset.seoJsonld = 'true'
  script.text = JSON.stringify(payload)
  document.head.appendChild(script)
}

/**
 * SPA document head manager: title, description, canonical, OG, Twitter, robots, JSON-LD.
 */
export function useDocumentMeta({
  title,
  description,
  path = '/',
  noIndex = false,
  ogType = 'website',
  jsonLd,
  image,
  imageAlt,
}: UseDocumentMetaOptions) {
  useEffect(() => {
    const siteUrl = env.appUrl || window.location.origin
    const pageUrl = absoluteUrl(path, siteUrl)
    const fullTitle = formatDocumentTitle(title)
    const desc = description || SEO_DEFAULTS.description
    const ogDesc =
      description && description !== SEO_DEFAULTS.description
        ? description
        : SEO_DEFAULTS.ogDescription
    const imageUrl = absoluteUrl(image ?? SEO_DEFAULTS.imagePath, siteUrl)
    const alt = imageAlt ?? SEO_DEFAULTS.imageAlt

    document.title = fullTitle

    upsertMeta({ kind: 'name', key: 'description', content: desc })
    upsertMeta({
      kind: 'name',
      key: 'robots',
      content: noIndex ? 'noindex, nofollow' : 'index, follow',
    })
    upsertMeta({
      kind: 'name',
      key: 'googlebot',
      content: noIndex ? 'noindex, nofollow' : 'index, follow',
    })

    upsertLink('canonical', pageUrl)

    const googleToken = env.googleSiteVerification
    if (googleToken && !googleToken.startsWith('REPLACE_')) {
      upsertMeta({
        kind: 'name',
        key: 'google-site-verification',
        content: googleToken,
      })
    }
    const bingToken = env.bingSiteVerification
    if (bingToken && !bingToken.startsWith('REPLACE_')) {
      upsertMeta({
        kind: 'name',
        key: 'msvalidate.01',
        content: bingToken,
      })
    }

    upsertMeta({ kind: 'property', key: 'og:type', content: ogType })
    upsertMeta({
      kind: 'property',
      key: 'og:site_name',
      content: SEO_DEFAULTS.siteName,
    })
    upsertMeta({ kind: 'property', key: 'og:locale', content: SEO_DEFAULTS.locale })
    upsertMeta({ kind: 'property', key: 'og:title', content: fullTitle })
    upsertMeta({ kind: 'property', key: 'og:description', content: ogDesc })
    upsertMeta({ kind: 'property', key: 'og:url', content: pageUrl })
    upsertMeta({ kind: 'property', key: 'og:image', content: imageUrl })
    upsertMeta({
      kind: 'property',
      key: 'og:image:secure_url',
      content: imageUrl,
    })
    upsertMeta({
      kind: 'property',
      key: 'og:image:alt',
      content: alt,
    })
    upsertMeta({
      kind: 'property',
      key: 'og:image:width',
      content: String(SEO_DEFAULTS.imageWidth),
    })
    upsertMeta({
      kind: 'property',
      key: 'og:image:height',
      content: String(SEO_DEFAULTS.imageHeight),
    })
    upsertMeta({
      kind: 'property',
      key: 'og:image:type',
      content: imageUrl.endsWith('.webp')
        ? 'image/webp'
        : imageUrl.endsWith('.svg')
          ? 'image/svg+xml'
          : imageUrl.endsWith('.png')
            ? 'image/png'
            : 'image/jpeg',
    })

    upsertMeta({
      kind: 'name',
      key: 'twitter:card',
      content: SEO_DEFAULTS.twitterCard,
    })
    upsertMeta({ kind: 'name', key: 'twitter:title', content: fullTitle })
    upsertMeta({ kind: 'name', key: 'twitter:description', content: ogDesc })
    upsertMeta({ kind: 'name', key: 'twitter:image', content: imageUrl })
    upsertMeta({ kind: 'name', key: 'twitter:image:alt', content: alt })

    upsertMeta({
      kind: 'name',
      key: 'theme-color',
      content: SEO_DEFAULTS.themeColor,
    })
    upsertMeta({
      kind: 'name',
      key: 'application-name',
      content: SEO_DEFAULTS.siteName,
    })

    setJsonLdScripts(jsonLd)

    return () => {
      setJsonLdScripts(undefined)
    }
  }, [title, description, path, noIndex, ogType, jsonLd, image, imageAlt])
}
