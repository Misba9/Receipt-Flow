import { BLOG_ARTICLES, articlePath } from '@/content/blog'
import { SEO_SITE_URL } from '@/lib/seo'
import { OG_IMAGE_ASSET } from '@/lib/images'

/**
 * Build Google image sitemap XML for marketing assets.
 * Prefer running via: node scripts/generate-image-sitemap.mjs
 * This module mirrors the same entries for type-safe reuse.
 */
export function buildImageSitemapEntries(siteUrl = SEO_SITE_URL) {
  const base = siteUrl.replace(/\/$/, '')
  const abs = (path: string) => `${base}${path.startsWith('/') ? path : `/${path}`}`

  const entries: Array<{
    pageUrl: string
    images: Array<{ loc: string; title: string; caption?: string }>
  }> = [
    {
      pageUrl: abs('/'),
      images: [
        {
          loc: abs('/og-image.webp'),
          title: OG_IMAGE_ASSET.alt,
          caption: 'ReceiptFlow — billing software for small businesses',
        },
        {
          loc: abs('/og-image.jpg'),
          title: OG_IMAGE_ASSET.alt,
        },
      ],
    },
  ]

  for (const article of BLOG_ARTICLES) {
    entries.push({
      pageUrl: abs(articlePath(article.slug)),
      images: [
        {
          loc: abs(`/blog/${article.featuredImageStem}.webp`),
          title: article.title,
          caption: article.featuredImageAlt,
        },
        {
          loc: abs(`/blog/${article.featuredImageStem}-1200.jpg`),
          title: article.title,
          caption: article.featuredImageAlt,
        },
      ],
    })
  }

  return entries
}

export function renderImageSitemapXml(siteUrl = SEO_SITE_URL): string {
  const entries = buildImageSitemapEntries(siteUrl)
  const body = entries
    .map((entry) => {
      const images = entry.images
        .map((image) => {
          const caption = image.caption
            ? `\n      <image:caption><![CDATA[${image.caption}]]></image:caption>`
            : ''
          return `    <image:image>
      <image:loc>${image.loc}</image:loc>
      <image:title><![CDATA[${image.title}]]></image:title>${caption}
    </image:image>`
        })
        .join('\n')
      return `  <url>
    <loc>${entry.pageUrl}</loc>
${images}
  </url>`
    })
    .join('\n')

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">
${body}
</urlset>
`
}
