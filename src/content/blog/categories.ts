import type { BlogCategory } from '@/content/blog/types'

export const BLOG_CATEGORIES: BlogCategory[] = [
  {
    id: 'billing',
    name: 'Billing',
    slug: 'billing',
    description:
      'Guides on billing workflows, software choices, and day-to-day invoicing habits for growing teams.',
  },
  {
    id: 'gst',
    name: 'GST',
    slug: 'gst',
    description:
      'Practical GST invoicing tips — tax fields, buyer GSTIN, and cleaner month-end paperwork.',
  },
  {
    id: 'invoices',
    name: 'Invoices',
    slug: 'invoices',
    description:
      'How to structure, number, email, and follow up on professional invoices.',
  },
  {
    id: 'small-business',
    name: 'Small Business',
    slug: 'small-business',
    description:
      'Cash flow, customers, and operations advice tailored to small business owners.',
  },
  {
    id: 'accounting',
    name: 'Accounting',
    slug: 'accounting',
    description:
      'How invoicing connects to bookkeeping, reports, and working with your CA.',
  },
]

export const BLOG_CATEGORY_BY_ID = Object.fromEntries(
  BLOG_CATEGORIES.map((c) => [c.id, c]),
) as Record<BlogCategory['id'], BlogCategory>

export const BLOG_CATEGORY_BY_SLUG = Object.fromEntries(
  BLOG_CATEGORIES.map((c) => [c.slug, c]),
) as Record<string, BlogCategory>

export function getBlogCategory(slugOrId: string) {
  return BLOG_CATEGORY_BY_SLUG[slugOrId] ?? BLOG_CATEGORY_BY_ID[slugOrId as BlogCategory['id']]
}
