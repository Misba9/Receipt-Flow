import { BLOG_ARTICLES } from '@/content/blog/articles'
import { BLOG_CATEGORY_BY_ID, getBlogCategory } from '@/content/blog/categories'
import {
  articlePath,
  type BlogArticle,
  type BlogCategory,
  type BlogCategoryId,
} from '@/content/blog/types'

export * from '@/content/blog/types'
export * from '@/content/blog/categories'
export { BLOG_ARTICLES } from '@/content/blog/articles'

export const BLOG_ARTICLE_BY_SLUG = Object.fromEntries(
  BLOG_ARTICLES.map((article) => [article.slug, article]),
) as Record<string, BlogArticle>

export function getBlogArticle(slug: string): BlogArticle | undefined {
  return BLOG_ARTICLE_BY_SLUG[slug]
}

export function getArticlesByCategory(categoryId: BlogCategoryId): BlogArticle[] {
  return BLOG_ARTICLES.filter((article) => article.categoryId === categoryId).sort(
    (a, b) => Date.parse(b.publishedAt) - Date.parse(a.publishedAt),
  )
}

export function getArticlesByCategorySlug(categorySlug: string): BlogArticle[] {
  const category = getBlogCategory(categorySlug)
  if (!category) return []
  return getArticlesByCategory(category.id)
}

export function getRelatedArticles(article: BlogArticle): BlogArticle[] {
  return article.relatedSlugs
    .map((slug) => BLOG_ARTICLE_BY_SLUG[slug])
    .filter((item): item is BlogArticle => Boolean(item))
}

export function getArticleCategory(article: BlogArticle): BlogCategory {
  return BLOG_CATEGORY_BY_ID[article.categoryId]
}

export function listArticlesNewestFirst(): BlogArticle[] {
  return [...BLOG_ARTICLES].sort(
    (a, b) => Date.parse(b.publishedAt) - Date.parse(a.publishedAt),
  )
}

export function getArticleToc(article: BlogArticle) {
  return [
    ...article.sections.map((section) => ({
      id: section.id,
      label: section.heading,
    })),
    { id: 'summary', label: 'Summary' },
    { id: 'key-takeaways', label: 'Key takeaways' },
    { id: 'pros-cons', label: 'Pros and cons' },
    { id: 'comparison', label: 'Comparison' },
    { id: 'entities', label: 'Key terms' },
    { id: 'faq', label: 'FAQ' },
  ]
}

export function formatArticleDate(iso: string) {
  return new Intl.DateTimeFormat('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  }).format(new Date(iso))
}

export { articlePath }
