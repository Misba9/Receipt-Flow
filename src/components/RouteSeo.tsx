import { useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom'
import { useDocumentMeta } from '@/hooks/useDocumentMeta'
import { env } from '@/lib/env'
import { resolveRouteSeo } from '@/lib/seo'
import type { JsonLdGraph } from '@/lib/jsonld'

/**
 * Applies route-level SEO metadata immediately; defers JSON-LD to idle time
 * so parsing large graphs does not compete with LCP/INP on first paint.
 */
export function RouteSeo() {
  const { pathname } = useLocation()
  const seo = resolveRouteSeo(pathname)
  const [jsonLd, setJsonLd] = useState<JsonLdGraph | undefined>()

  useEffect(() => {
    let cancelled = false
    setJsonLd(undefined)

    const run = () => {
      void import('@/lib/jsonld').then(({ buildPageJsonLd }) => {
        if (cancelled) return
        const siteUrl = env.appUrl || window.location.origin
        setJsonLd(buildPageJsonLd(pathname, siteUrl))
      })
    }

    const idleWindow = window as Window & {
      requestIdleCallback?: (cb: () => void, opts?: { timeout: number }) => number
      cancelIdleCallback?: (id: number) => void
    }

    if (typeof idleWindow.requestIdleCallback === 'function') {
      const id = idleWindow.requestIdleCallback(run, { timeout: 1800 })
      return () => {
        cancelled = true
        idleWindow.cancelIdleCallback?.(id)
      }
    }

    const timer = window.setTimeout(run, 200)
    return () => {
      cancelled = true
      window.clearTimeout(timer)
    }
  }, [pathname])

  useDocumentMeta({
    ...seo,
    image: seo.image,
    imageAlt: seo.imageAlt,
    jsonLd,
  })

  return null
}
