import { Navigate, useParams } from 'react-router-dom'
import { BlogArticleCard } from '@/components/blog/BlogArticleCard'
import { BlogPageHero, BlogShell } from '@/components/blog/BlogShell'
import { InternalLinkHub } from '@/components/seo/InternalLinkHub'
import { SiteBreadcrumb } from '@/components/seo/SiteBreadcrumb'
import {
  getArticlesByCategorySlug,
  getBlogCategory,
} from '@/content/blog'

export function BlogCategoryPage() {
  const { categorySlug = '' } = useParams<{ categorySlug: string }>()
  const category = getBlogCategory(categorySlug)
  if (!category) return <Navigate to="/blog" replace />

  const articles = getArticlesByCategorySlug(category.slug)

  return (
    <BlogShell
      hero={
        <BlogPageHero
          eyebrow="Category"
          title={category.name}
          support={category.description}
        />
      }
    >
      <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 sm:py-16">
        <SiteBreadcrumb />

        {articles.length === 0 ? (
          <p className="mt-10 text-surface-600">
            No articles in this category yet.{' '}
            <a href="/blog" className="font-medium text-brand-700 hover:underline">
              Back to blog
            </a>
            .
          </p>
        ) : (
          <ul className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {articles.map((article) => (
              <li key={article.slug}>
                <BlogArticleCard article={article} />
              </li>
            ))}
          </ul>
        )}
      </div>
      <InternalLinkHub surface="blog" blogCategoryId={category.id} />
    </BlogShell>
  )
}
