/** Intrinsic + responsive sources for marketing images. */

export type ResponsiveImageAsset = {
  /** JPEG/PNG fallback URL used as img src. */
  src: string
  webpSrc: string
  srcSet: string
  webpSrcSet: string
  width: number
  height: number
  alt: string
  sizes?: string
}

const WIDTHS = [480, 768, 1200] as const

function buildSrcSet(basePath: string, ext: 'webp' | 'jpg') {
  const dir = basePath.includes('/')
    ? basePath.slice(0, basePath.lastIndexOf('/') + 1)
    : '/'
  const name = basePath.slice(basePath.lastIndexOf('/') + 1)
  return WIDTHS.map((w) => `${dir}${name}-${w}.${ext} ${w}w`).join(', ')
}

export const OG_IMAGE_ASSET: ResponsiveImageAsset = {
  src: '/og-image-1200.jpg',
  webpSrc: '/og-image.webp',
  srcSet: buildSrcSet('/og-image', 'jpg'),
  webpSrcSet: buildSrcSet('/og-image', 'webp'),
  width: 1200,
  height: 630,
  alt: 'Billing Software for Small Businesses | ReceiptFlow',
  sizes: '(max-width: 768px) 100vw, 1200px',
}

/** Blog cover assets keyed by filename stem (without extension). */
export function getBlogCoverAsset(
  stem: string,
  alt: string,
): ResponsiveImageAsset {
  const base = `/blog/${stem}`
  return {
    src: `${base}-1200.jpg`,
    webpSrc: `${base}.webp`,
    srcSet: buildSrcSet(base, 'jpg'),
    webpSrcSet: buildSrcSet(base, 'webp'),
    width: 1200,
    height: 630,
    alt,
    sizes:
      '(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 400px',
  }
}

export function getBlogHeroCoverAsset(
  stem: string,
  alt: string,
): ResponsiveImageAsset {
  return {
    ...getBlogCoverAsset(stem, alt),
    sizes: '(max-width: 1024px) 100vw, 1152px',
  }
}

/** Entries for the Google image sitemap. */
export type SitemapImageEntry = {
  pageUrl: string
  imageUrl: string
  title: string
  caption?: string
}

export function listMarketingSitemapImages(siteUrl: string): SitemapImageEntry[] {
  const base = siteUrl.replace(/\/$/, '')
  const abs = (path: string) => `${base}${path.startsWith('/') ? path : `/${path}`}`

  return [
    {
      pageUrl: abs('/'),
      imageUrl: abs('/og-image.webp'),
      title: OG_IMAGE_ASSET.alt,
      caption: 'ReceiptFlow billing software for small businesses',
    },
    {
      pageUrl: abs('/'),
      imageUrl: abs('/og-image.jpg'),
      title: OG_IMAGE_ASSET.alt,
    },
  ]
}
