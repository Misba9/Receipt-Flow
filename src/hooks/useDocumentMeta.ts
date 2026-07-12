import { useEffect } from 'react'
import { env } from '@/lib/env'
import { APP_NAME } from '@/utils'

type DocumentMetaProps = {
  title?: string
  description?: string
  path?: string
  noIndex?: boolean
}

/**
 * Lightweight document head updates for SPA routes (title, description, robots).
 */
export function useDocumentMeta({
  title,
  description,
  path = '/',
  noIndex = false,
}: DocumentMetaProps) {
  useEffect(() => {
    const previousTitle = document.title
    const fullTitle = title
      ? title.includes(APP_NAME)
        ? title
        : `${title} · ${APP_NAME}`
      : `${APP_NAME} — Invoices & receipts for growing teams`

    document.title = fullTitle

    const metaDescription = document.querySelector('meta[name="description"]')
    const previousDescription = metaDescription?.getAttribute('content')
    if (description && metaDescription) {
      metaDescription.setAttribute('content', description)
    }

    let robots = document.querySelector(
      'meta[name="robots"]',
    ) as HTMLMetaElement | null
    const createdRobots = !robots
    if (!robots) {
      robots = document.createElement('meta')
      robots.name = 'robots'
      document.head.appendChild(robots)
    }
    robots.content = noIndex ? 'noindex, nofollow' : 'index, follow'

    const siteUrl = env.appUrl || window.location.origin
    const pageUrl = `${siteUrl.replace(/\/$/, '')}${path.startsWith('/') ? path : `/${path}`}`

    let canonical = document.querySelector(
      'link[rel="canonical"]',
    ) as HTMLLinkElement | null
    const createdCanonical = !canonical
    if (!canonical) {
      canonical = document.createElement('link')
      canonical.rel = 'canonical'
      document.head.appendChild(canonical)
    }
    canonical.href = pageUrl

    return () => {
      document.title = previousTitle
      if (metaDescription && previousDescription) {
        metaDescription.setAttribute('content', previousDescription)
      }
      if (createdRobots) robots?.remove()
      else if (robots) robots.content = 'index, follow'
      if (createdCanonical) canonical?.remove()
    }
  }, [title, description, path, noIndex])
}
