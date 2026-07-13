/**
 * Writes public/sitemap-images.xml from blog + OG assets.
 * Run: npm run optimize:images && npm run sitemap:images
 *
 * Uses the generated image-manifest + article list via dynamic import of built
 * content is awkward in plain node — keep a parallel list here matching articles.
 */
import { writeFile } from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const site = 'https://receiptflow.velonerp.com'

const articles = [
  {
    slug: 'how-to-create-gst-invoice',
    title: 'How to Create a GST Invoice (Step-by-Step)',
    stem: 'how-to-create-gst-invoice',
    alt: 'Illustration of a GST invoice with tax breakdown',
  },
  {
    slug: 'gst-vs-non-gst-invoices',
    title: 'GST vs Non-GST Invoices: When to Use Each',
    stem: 'gst-vs-non-gst-invoices',
    alt: 'Side-by-side comparison of GST and non-GST invoices',
  },
  {
    slug: 'billing-software-for-small-businesses-guide',
    title: 'Billing Software for Small Businesses: A Practical Guide',
    stem: 'billing-software-guide',
    alt: 'Small business owner reviewing online billing software',
  },
  {
    slug: 'invoice-numbering-best-practices',
    title: 'Invoice Numbering Best Practices for Growing Teams',
    stem: 'invoice-numbering',
    alt: 'Sequential invoice numbers on organized documents',
  },
  {
    slug: 'how-to-email-invoices-professionally',
    title: 'How to Email Invoices Professionally',
    stem: 'email-invoices',
    alt: 'Professional invoice email with PDF attachment',
  },
  {
    slug: 'how-small-businesses-track-payments',
    title: 'How Small Businesses Can Track Payments Better',
    stem: 'track-payments',
    alt: 'Payment tracking checklist for small businesses',
  },
  {
    slug: 'accounting-basics-for-invoice-software-users',
    title: 'Accounting Basics for Invoice Software Users',
    stem: 'accounting-basics',
    alt: 'Invoice reports prepared for accounting review',
  },
]

function imageBlock(loc, title, caption) {
  const cap = caption
    ? `\n      <image:caption><![CDATA[${caption}]]></image:caption>`
    : ''
  return `    <image:image>
      <image:loc>${loc}</image:loc>
      <image:title><![CDATA[${title}]]></image:title>${cap}
    </image:image>`
}

const urls = [
  `  <url>
    <loc>${site}/</loc>
${imageBlock(`${site}/og-image.webp`, 'Billing Software for Small Businesses | ReceiptFlow', 'ReceiptFlow — billing software for small businesses')}
${imageBlock(`${site}/og-image.jpg`, 'Billing Software for Small Businesses | ReceiptFlow')}
  </url>`,
  ...articles.map(
    (a) => `  <url>
    <loc>${site}/article/${a.slug}</loc>
${imageBlock(`${site}/blog/${a.stem}.webp`, a.title, a.alt)}
${imageBlock(`${site}/blog/${a.stem}-1200.jpg`, a.title, a.alt)}
  </url>`,
  ),
]

const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">
${urls.join('\n')}
</urlset>
`

await writeFile(path.join(root, 'public/sitemap-images.xml'), xml)
console.log('wrote public/sitemap-images.xml')
