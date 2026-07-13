export const BLOG_CATEGORY_IDS = [
  'billing',
  'gst',
  'invoices',
  'small-business',
  'accounting',
] as const

export type BlogCategoryId = (typeof BLOG_CATEGORY_IDS)[number]

export type BlogCategory = {
  id: BlogCategoryId
  name: string
  slug: string
  description: string
}

export type BlogBlock =
  | { type: 'p'; text: string }
  | { type: 'ul'; items: string[] }
  | { type: 'ol'; items: string[] }
  | { type: 'callout'; text: string }

export type BlogSection = {
  /** Stable id used for TOC anchors */
  id: string
  heading: string
  blocks: BlogBlock[]
}

export type BlogArticle = {
  slug: string
  title: string
  description: string
  categoryId: BlogCategoryId
  tags: string[]
  /** Stem under /public/blog/ (without extension) for responsive WebP/JPEG. */
  featuredImageStem: string
  featuredImageAlt: string
  publishedAt: string
  updatedAt: string
  readingTimeMinutes: number
  relatedSlugs: string[]
  sections: BlogSection[]
}

export function articlePath(slug: string) {
  return `/article/${slug}`
}

export function blogCategoryPath(slug: string) {
  return `/blog/category/${slug}`
}

export const BLOG_INDEX_PATH = '/blog'
