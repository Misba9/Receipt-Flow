import { BlogArticleCard } from '@/components/blog/BlogArticleCard'
import type { BlogArticle } from '@/content/blog'

export function BlogRelatedArticles({ articles }: { articles: BlogArticle[] }) {
  if (!articles.length) return null

  return (
    <section
      aria-labelledby="related-articles-heading"
      className="border-t border-surface-200 pt-12"
    >
      <h2
        id="related-articles-heading"
        className="font-display text-2xl font-semibold tracking-tight text-surface-950"
      >
        Related articles
      </h2>
      <ul className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {articles.map((article) => (
          <li key={article.slug}>
            <BlogArticleCard article={article} />
          </li>
        ))}
      </ul>
    </section>
  )
}
