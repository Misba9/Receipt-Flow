import { readFileSync, writeFileSync } from 'node:fs'

function extractPages(file, kind) {
  const src = readFileSync(file, 'utf8')
  const pages = []
  const objs = src.split(/\n  \{\n/).slice(1)
  for (const chunk of objs) {
    const slug = chunk.match(/slug:\s*'([^']+)'/)?.[1]
    const id = chunk.match(/id:\s*'([^']+)'/)?.[1]
    const path = chunk.match(/path:\s*'([^']+)'/)?.[1]
    const title = chunk.match(/title:\s*'([^']+)'/)?.[1]
    const description = chunk.match(/description:\s*\n?\s*'([^']+)'/)?.[1]
    const eyebrow = chunk.match(/eyebrow:\s*'([^']+)'/)?.[1]
    const h1 = chunk.match(/h1:\s*'([^']+)'/)?.[1]
    if (path && title && description) {
      pages.push({
        kind,
        slug: slug || id,
        path,
        title,
        description,
        eyebrow: eyebrow || h1 || title,
      })
    }
  }
  return pages
}

const feature = extractPages('src/content/seo-landings.ts', 'feature')
const industry = extractPages('src/content/industry-landings.ts', 'industry')
const location = extractPages('src/content/location-landings.ts', 'location')
const tools = extractPages('src/content/seo-tools.ts', 'tool')
const comparisons = extractPages('src/content/comparison-pages.ts', 'comparison')

const blogSrc = readFileSync('src/content/blog/articles.ts', 'utf8')
const blog = []
for (const chunk of blogSrc.split(/\n  \{\n/).slice(1)) {
  const slug = chunk.match(/slug:\s*'([^']+)'/)?.[1]
  const title = chunk.match(/title:\s*'([^']+)'/)?.[1]
  const description = chunk.match(/description:\s*\n?\s*'([^']+)'/)?.[1]
  const stem = chunk.match(/featuredImageStem:\s*'([^']+)'/)?.[1]
  const alt = chunk.match(/featuredImageAlt:\s*'([^']+)'/)?.[1]
  if (slug && title && description) {
    blog.push({
      kind: 'article',
      slug,
      path: `/article/${slug}`,
      title: `${title} | ReceiptFlow Blog`,
      description,
      image: stem ? `/blog/${stem}.webp` : undefined,
      imageAlt: alt,
      ogType: 'article',
    })
  }
}

const categories = [
  [
    'billing',
    'Billing',
    'Guides on billing workflows, software choices, and day-to-day invoicing habits for growing teams.',
  ],
  [
    'gst',
    'GST',
    'Practical GST invoicing tips — tax fields, buyer GSTIN, and cleaner month-end paperwork.',
  ],
  [
    'invoices',
    'Invoices',
    'How to structure, number, email, and follow up on professional invoices.',
  ],
  [
    'small-business',
    'Small Business',
    'Cash flow, customers, and operations advice tailored to small business owners.',
  ],
  [
    'accounting',
    'Accounting',
    'How invoicing connects to bookkeeping, reports, and working with your CA.',
  ],
].map(([slug, name, description]) => ({
  kind: 'blog-category',
  slug,
  path: `/blog/category/${slug}`,
  title: `${name} Articles | ReceiptFlow Blog`,
  description,
  eyebrow: name,
}))

const out = `/**
 * Slim public-route metadata for SEO + routing (keeps full page copy out of the main bundle).
 * Regenerate after content edits: node scripts/generate-route-meta.mjs
 */
export type PublicRouteMeta = {
  kind:
    | 'feature'
    | 'industry'
    | 'location'
    | 'tool'
    | 'article'
    | 'blog-category'
    | 'hub'
    | 'comparison'
  slug?: string
  path: string
  title: string
  description: string
  eyebrow?: string
  image?: string
  imageAlt?: string
  ogType?: 'website' | 'article'
}

export const FEATURE_ROUTE_META: PublicRouteMeta[] = ${JSON.stringify(feature, null, 2)}

export const INDUSTRY_ROUTE_META: PublicRouteMeta[] = ${JSON.stringify(industry, null, 2)}

export const LOCATION_ROUTE_META: PublicRouteMeta[] = ${JSON.stringify(location, null, 2)}

export const TOOL_ROUTE_META: PublicRouteMeta[] = ${JSON.stringify(tools, null, 2)}

export const COMPARISON_ROUTE_META: PublicRouteMeta[] = ${JSON.stringify(comparisons, null, 2)}

export const ARTICLE_ROUTE_META: PublicRouteMeta[] = ${JSON.stringify(blog, null, 2)}

export const BLOG_CATEGORY_ROUTE_META: PublicRouteMeta[] = ${JSON.stringify(categories, null, 2)}

export const HUB_ROUTE_META: PublicRouteMeta[] = [
  {
    kind: 'hub',
    path: '/blog',
    title: 'Blog | Billing, GST & Invoice Guides',
    description:
      'Read ReceiptFlow guides on billing software, GST invoices, payment tracking, and small business invoicing.',
  },
  {
    kind: 'hub',
    path: '/tools',
    title: 'Free Billing Tools | Invoice, GST & Calculators',
    description:
      'Free online tools from ReceiptFlow — invoice generator, GST calculator, profit and margin calculators, QR generator, and receipt generator.',
  },
  {
    kind: 'hub',
    path: '/features',
    title: 'Billing Software Features | ReceiptFlow',
    description:
      'Explore ReceiptFlow features — invoice software, GST billing, PDF invoices, email delivery, dashboards, reports, and payment tracking.',
  },
  {
    kind: 'hub',
    path: '/industries',
    title: 'Billing Software by Industry | ReceiptFlow',
    description:
      'Industry billing pages for grocery, mobile shops, medical stores, garments, hardware, wholesale, and electronics.',
  },
  {
    kind: 'hub',
    path: '/locations',
    title: 'Billing Software by City | ReceiptFlow',
    description:
      'Local billing software pages for Hyderabad, Bangalore, Chennai, Mumbai, and Delhi.',
  },
  {
    kind: 'hub',
    path: '/pricing',
    title: 'Billing Software Pricing | Invoice & GST Billing Plans | ReceiptFlow',
    description:
      'Billing software pricing and invoice software pricing from ReceiptFlow. Compare free Starter and Growth GST billing software plans — start invoicing free, upgrade when you need email PDFs and reports.',
  },
  {
    kind: 'hub',
    path: '/comparisons',
    title: 'ReceiptFlow Comparisons | vs Zoho, Vyapar, Busy, Tally, Marg',
    description:
      'Factual comparisons of ReceiptFlow billing software with Zoho, Vyapar, Busy, TallyPrime, and Marg ERP.',
  },
  {
    kind: 'hub',
    path: '/about',
    title: 'About ReceiptFlow | Billing Software for Small Businesses',
    description:
      'Learn about ReceiptFlow — cloud billing software for small businesses with invoices, GST fields, PDF email, customers, and payment tracking.',
  },
  {
    kind: 'hub',
    path: '/contact',
    title: 'Contact ReceiptFlow | Billing Software Support',
    description:
      'Contact ReceiptFlow about billing software, GST invoicing, migrations, or product questions. We reply within one business day.',
  },
  {
    kind: 'hub',
    path: '/privacy',
    title: 'Privacy Policy | ReceiptFlow',
    description:
      'Privacy Policy for ReceiptFlow billing software — how we collect, use, and protect account and workspace data.',
  },
  {
    kind: 'hub',
    path: '/terms',
    title: 'Terms of Service | ReceiptFlow',
    description:
      'Terms of Service for using ReceiptFlow billing software, websites, and related free tools.',
  },
]

export const LANDING_ROUTE_META: PublicRouteMeta[] = [
  ...FEATURE_ROUTE_META,
  ...INDUSTRY_ROUTE_META,
  ...LOCATION_ROUTE_META,
]

export const ALL_PUBLIC_ROUTE_META: PublicRouteMeta[] = [
  ...HUB_ROUTE_META,
  ...LANDING_ROUTE_META,
  ...TOOL_ROUTE_META,
  ...COMPARISON_ROUTE_META,
  ...ARTICLE_ROUTE_META,
  ...BLOG_CATEGORY_ROUTE_META,
]

export const PUBLIC_ROUTE_META_BY_PATH = Object.fromEntries(
  ALL_PUBLIC_ROUTE_META.map((route) => [route.path, route]),
) as Record<string, PublicRouteMeta>
`

writeFileSync('src/content/public-route-meta.ts', out)
console.log('meta counts', {
  feature: feature.length,
  industry: industry.length,
  location: location.length,
  tools: tools.length,
  comparisons: comparisons.length,
  blog: blog.length,
})
