import { Link } from 'react-router-dom'
import { BlogArticleCard } from '@/components/blog/BlogArticleCard'
import { SiteBreadcrumb } from '@/components/seo/SiteBreadcrumb'
import { InternalLinkHub } from '@/components/seo/InternalLinkHub'
import { BlogPageHero, BlogShell } from '@/components/blog/BlogShell'
import {
  BLOG_CATEGORIES,
  blogCategoryPath,
  listArticlesNewestFirst,
} from '@/content/blog'

export function BlogIndexPage() {
  const articles = listArticlesNewestFirst()

  return (
    <BlogShell
      hero={
        <BlogPageHero
          eyebrow="ReceiptFlow Blog"
          title="Guides on billing, GST, and invoices"
          support="Practical articles for small businesses that want clearer invoicing, cleaner GST paperwork, and fewer payment surprises."
        />
      }
    >
      <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 sm:py-16">
        <SiteBreadcrumb className="mb-2" />

        <section aria-labelledby="blog-categories-heading" className="mt-8">
          <h2
            id="blog-categories-heading"
            className="font-display text-xl font-semibold text-surface-950"
          >
            Categories
          </h2>
          <ul className="mt-4 flex flex-wrap gap-2">
            {BLOG_CATEGORIES.map((category) => (
              <li key={category.id}>
                <Link
                  to={blogCategoryPath(category.slug)}
                  className="inline-flex rounded-lg border border-surface-200 bg-white px-3 py-2 text-sm font-medium text-surface-700 transition-colors hover:border-brand-200 hover:bg-brand-50 hover:text-brand-800"
                >
                  {category.name}
                </Link>
              </li>
            ))}
          </ul>
        </section>

        <section aria-labelledby="latest-articles-heading" className="mt-12">
          <h2
            id="latest-articles-heading"
            className="font-display text-2xl font-semibold tracking-tight text-surface-950"
          >
            Latest articles
          </h2>
          <ul className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {articles.map((article) => (
              <li key={article.slug}>
                <BlogArticleCard article={article} />
              </li>
            ))}
          </ul>
        </section>
      </div>
      <InternalLinkHub surface="blog" />
    </BlogShell>
  )
}
