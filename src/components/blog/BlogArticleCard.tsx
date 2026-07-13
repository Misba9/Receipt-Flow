import { Link } from 'react-router-dom'
import {
  articlePath,
  formatArticleDate,
  getArticleCategory,
  type BlogArticle,
} from '@/content/blog'
import { BlogCategoryPill } from '@/components/blog/BlogTags'
import { OptimizedImage } from '@/components/seo/OptimizedImage'
import { getBlogCoverAsset } from '@/lib/images'

export function BlogArticleCard({ article }: { article: BlogArticle }) {
  const category = getArticleCategory(article)
  const cover = getBlogCoverAsset(
    article.featuredImageStem,
    article.featuredImageAlt,
  )

  return (
    <article className="group flex h-full flex-col overflow-hidden rounded-2xl border border-surface-200 bg-white transition-shadow hover:shadow-md">
      <Link to={articlePath(article.slug)} className="block overflow-hidden">
        <OptimizedImage
          src={cover.src}
          webpSrc={cover.webpSrc}
          srcSet={cover.srcSet}
          webpSrcSet={cover.webpSrcSet}
          sizes={cover.sizes}
          alt={cover.alt}
          width={cover.width}
          height={cover.height}
          loading="lazy"
          className="aspect-[16/9] w-full object-cover transition-transform duration-500 group-hover:scale-[1.02]"
        />
      </Link>
      <div className="flex flex-1 flex-col gap-3 p-5">
        <div className="flex flex-wrap items-center gap-2">
          <BlogCategoryPill name={category.name} slug={category.slug} />
          <time
            dateTime={article.publishedAt}
            className="text-xs text-surface-500"
          >
            {formatArticleDate(article.publishedAt)}
          </time>
          <span className="text-xs text-surface-400">
            {article.readingTimeMinutes} min read
          </span>
        </div>
        <h3 className="font-display text-lg font-semibold tracking-tight text-surface-950">
          <Link
            to={articlePath(article.slug)}
            className="transition-colors hover:text-brand-700"
          >
            {article.title}
          </Link>
        </h3>
        <p className="line-clamp-3 text-sm leading-relaxed text-surface-600">
          {article.description}
        </p>
      </div>
    </article>
  )
}
