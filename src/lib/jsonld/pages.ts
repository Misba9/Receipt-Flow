import { faqItems } from '@/components/landing/faq-data'
import { testimonials } from '@/components/landing/testimonials'
import {
  articlePath,
  BLOG_ARTICLES,
  getBlogArticle,
} from '@/content/blog'
import {
  buildBlogAiSearch,
  buildLandingAiSearch,
  buildPricingAiSearch,
  mergeFaqs,
} from '@/content/ai-search'
import {
  COMPARISON_PAGES,
  getComparisonPage,
} from '@/content/comparison-pages'
import {
  PRICING_FAQS,
  PRICING_PLANS,
  PRICING_SEO,
  PRICING_TESTIMONIALS,
} from '@/content/pricing-page'
import { INDUSTRY_LANDING_PAGES } from '@/content/industry-landings'
import { LOCATION_LANDING_PAGES } from '@/content/location-landings'
import { SEO_LANDING_PAGES } from '@/content/seo-landings'
import {
  getMarketingLanding,
  getMarketingLandingSurface,
} from '@/content/get-marketing-landing'
import { getSeoTool, SEO_TOOLS } from '@/content/seo-tools'
import { buildBreadcrumbs } from '@/lib/breadcrumbs'
import { formatDocumentTitle, resolveRouteSeo, SEO_DEFAULTS } from '@/lib/seo'
import {
  buildArticle,
  buildBreadcrumbList,
  buildCollectionPage,
  buildFaqPage,
  buildOrganization,
  buildProduct,
  buildPricingProduct,
  buildSoftwareApplication,
  buildWebPage,
  buildWebSite,
  softwareId,
  toGraph,
} from '@/lib/jsonld/builders'
import { buildWebApplication } from '@/lib/jsonld/web-application'
import { assertValidJsonLd } from '@/lib/jsonld/validate'
import type { JsonLdGraph, ReviewEntry } from '@/lib/jsonld/types'
import { APP_NAME } from '@/utils'

const SITE_PUBLISHED = '2026-01-15T00:00:00+00:00'
const SITE_MODIFIED = '2026-07-13T00:00:00+00:00'

function normalizePath(pathname: string) {
  if (!pathname || pathname === '/') return '/'
  return pathname.length > 1 && pathname.endsWith('/')
    ? pathname.slice(0, -1)
    : pathname
}

function productReviews(): ReviewEntry[] {
  return testimonials.map((item) => ({
    authorName: item.name,
    authorRole: item.role,
    quote: item.quote,
    ratingValue: 5,
  }))
}

/**
 * Dynamic JSON-LD @graph for every route.
 *
 * Google guideline: marked-up content must match visible page content.
 * Reviews / FAQ / full Product+Software rich graphs are therefore limited to
 * the public landing page where those sections are rendered.
 */
export function buildPageJsonLd(
  pathname: string,
  siteUrl: string,
): JsonLdGraph {
  const path = normalizePath(pathname)
  const seo = resolveRouteSeo(path)
  const pagePath = seo.path ?? path
  const title = formatDocumentTitle(seo.title)
  const description = seo.description
  const crumbs = buildBreadcrumbs(path)
  const isLanding = path === '/'
  const seoLanding = getMarketingLanding(path)
  const seoTool = getSeoTool(path)
  const comparisonPage = getComparisonPage(path)
  const articleMatch = path.match(/^\/article\/([^/]+)$/)
  const blogArticle = articleMatch ? getBlogArticle(articleMatch[1]) : undefined

  const nodes = [
    buildOrganization(siteUrl),
    buildWebSite(siteUrl),
    buildBreadcrumbList(crumbs, siteUrl),
    buildWebPage({
      siteUrl,
      path: pagePath,
      name: title,
      description,
      noIndex: seo.noIndex,
      primaryEntityId: isLanding ? softwareId(siteUrl) : undefined,
    }),
  ]

  if (isLanding) {
    const reviews = productReviews()
    nodes.push(
      buildSoftwareApplication(siteUrl, reviews),
      buildProduct(siteUrl, reviews),
      buildFaqPage(faqItems, '/', siteUrl),
    )
  } else if (seoTool) {
    nodes.push(
      buildWebApplication({
        siteUrl,
        path: seoTool.path,
        name: seoTool.h1,
        description: seoTool.description,
        applicationCategory: seoTool.applicationCategory,
      }),
      buildFaqPage(seoTool.faqs, seoTool.path, siteUrl),
    )
  } else if (path === '/pricing') {
    const starter = PRICING_PLANS.find((plan) => plan.priceAmount !== null)!
    const reviews = PRICING_TESTIMONIALS.map((item) => ({
      authorName: item.name,
      authorRole: item.role,
      quote: item.quote,
      ratingValue: 5,
    }))
    nodes.push(
      buildFaqPage(
        mergeFaqs(PRICING_FAQS, buildPricingAiSearch().extraFaqs),
        '/pricing',
        siteUrl,
      ),
      buildPricingProduct(siteUrl, {
        name: `${APP_NAME} Billing Software`,
        description: PRICING_SEO.description,
        path: '/pricing',
        offer: {
          name: starter.name,
          price: starter.priceAmount ?? 0,
          priceCurrency: starter.priceCurrency,
          url: '/pricing',
          description: starter.blurb,
        },
        reviews,
      }),
      buildArticle({
        siteUrl,
        path: '/pricing',
        headline: PRICING_SEO.h1,
        description: PRICING_SEO.description,
        datePublished: SITE_PUBLISHED,
        dateModified: SITE_MODIFIED,
      }),
    )
  } else if (blogArticle) {
    const blogAi = buildBlogAiSearch(blogArticle)
    const blogFaqs = mergeFaqs([], blogAi.extraFaqs)
    nodes.push(
      buildArticle({
        siteUrl,
        path: articlePath(blogArticle.slug),
        headline: blogArticle.title,
        description: blogArticle.description,
        datePublished: blogArticle.publishedAt,
        dateModified: blogArticle.updatedAt,
        imagePaths: [
          `/blog/${blogArticle.featuredImageStem}.webp`,
          `/blog/${blogArticle.featuredImageStem}-1200.jpg`,
          SEO_DEFAULTS.imagePath,
        ],
      }),
    )
    if (blogFaqs.length) {
      nodes.push(
        buildFaqPage(blogFaqs, articlePath(blogArticle.slug), siteUrl),
      )
    }
  } else if (comparisonPage) {
    nodes.push(
      buildFaqPage(comparisonPage.faqs, comparisonPage.path, siteUrl),
      buildArticle({
        siteUrl,
        path: comparisonPage.path,
        headline: comparisonPage.h1,
        description: comparisonPage.description,
        datePublished: SITE_PUBLISHED,
        dateModified: SITE_MODIFIED,
      }),
    )
  } else if (seoLanding) {
    const surface = getMarketingLandingSurface(seoLanding.path) ?? 'feature'
    const aiSurface =
      surface === 'industry' || surface === 'location' ? surface : 'feature'
    const landingAi = buildLandingAiSearch(seoLanding, aiSurface)
    nodes.push(
      buildFaqPage(
        mergeFaqs(seoLanding.faqs, landingAi.extraFaqs),
        seoLanding.path,
        siteUrl,
      ),
      buildArticle({
        siteUrl,
        path: seoLanding.path,
        headline: seoLanding.h1,
        description: seoLanding.description,
        datePublished: SITE_PUBLISHED,
        dateModified: SITE_MODIFIED,
      }),
    )
  } else if (path === '/features') {
    nodes.push(
      buildCollectionPage({
        siteUrl,
        path: '/features',
        name: title,
        description,
        items: SEO_LANDING_PAGES.map((page) => ({
          name: page.eyebrow,
          path: page.path,
        })),
      }),
    )
  } else if (path === '/industries') {
    nodes.push(
      buildCollectionPage({
        siteUrl,
        path: '/industries',
        name: title,
        description,
        items: INDUSTRY_LANDING_PAGES.map((page) => ({
          name: page.eyebrow,
          path: page.path,
        })),
      }),
    )
  } else if (path === '/locations') {
    nodes.push(
      buildCollectionPage({
        siteUrl,
        path: '/locations',
        name: title,
        description,
        items: LOCATION_LANDING_PAGES.map((page) => ({
          name: page.eyebrow,
          path: page.path,
        })),
      }),
    )
  } else if (path === '/tools') {
    nodes.push(
      buildCollectionPage({
        siteUrl,
        path: '/tools',
        name: title,
        description,
        items: SEO_TOOLS.map((tool) => ({
          name: tool.h1,
          path: tool.path,
        })),
      }),
    )
  } else if (path === '/comparisons') {
    nodes.push(
      buildCollectionPage({
        siteUrl,
        path: '/comparisons',
        name: title,
        description,
        items: COMPARISON_PAGES.map((page) => ({
          name: page.h1,
          path: page.path,
        })),
      }),
    )
  } else if (path === '/blog') {
    nodes.push(
      buildCollectionPage({
        siteUrl,
        path: '/blog',
        name: title,
        description,
        items: BLOG_ARTICLES.map((article) => ({
          name: article.title,
          path: articlePath(article.slug),
        })),
      }),
    )
  }

  const graph = toGraph(nodes)
  assertValidJsonLd(graph)
  return graph
}

export { buildBreadcrumbs } from '@/lib/breadcrumbs'
