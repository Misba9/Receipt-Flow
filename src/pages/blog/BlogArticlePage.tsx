import { Link, Navigate, useParams } from 'react-router-dom'
import {
  BlogArticleBody,
  BlogRelatedArticles,
  BlogShareButtons,
  BlogTags,
  BlogToc,
  BlogCategoryPill,
} from '@/components/blog'
import { BlogShell } from '@/components/blog/BlogShell'
import { AiSearchSections } from '@/components/seo/AiSearchBlocks'
import { InternalLinkHub } from '@/components/seo/InternalLinkHub'
import { OptimizedImage } from '@/components/seo/OptimizedImage'
import { SiteBreadcrumb } from '@/components/seo/SiteBreadcrumb'
import {
  articlePath,
  formatArticleDate,
  getArticleCategory,
  getArticleToc,
  getBlogArticle,
  getRelatedArticles,
} from '@/content/blog'
import { buildBlogAiSearch, mergeFaqs } from '@/content/ai-search'
import { PRICING_PATH } from '@/lib/breadcrumbs'
import { getBlogHeroCoverAsset } from '@/lib/images'
import { paths } from '@/lib/paths'
import { APP_NAME } from '@/utils'

export function BlogArticlePage() {
  const { slug = '' } = useParams<{ slug: string }>()
  const article = getBlogArticle(slug)
  if (!article) return <Navigate to="/blog" replace />

  const category = getArticleCategory(article)
  const related = getRelatedArticles(article)
  const toc = getArticleToc(article)
  const path = articlePath(article.slug)
  const cover = getBlogHeroCoverAsset(
    article.featuredImageStem,
    article.featuredImageAlt,
  )
  const ai = buildBlogAiSearch(article)
  const faqs = mergeFaqs([], ai.extraFaqs)

  return (
    <BlogShell>
      <article className="pb-16">
        <header className="border-b border-surface-100 bg-surface-50 pt-28 pb-10 sm:pt-32">
          <div className="mx-auto max-w-6xl px-4 sm:px-6">
            <SiteBreadcrumb />

            <div className="mt-6 flex flex-wrap items-center gap-3">
              <BlogCategoryPill name={category.name} slug={category.slug} />
              <time
                dateTime={article.publishedAt}
                className="text-sm text-surface-500"
              >
                {formatArticleDate(article.publishedAt)}
              </time>
              <span className="text-sm text-surface-400">
                {article.readingTimeMinutes} min read
              </span>
            </div>

            <h1 className="mt-4 max-w-3xl font-display text-3xl font-semibold tracking-tight text-surface-950 sm:text-5xl">
              {article.title}
            </h1>
            <p className="mt-4 max-w-2xl text-base leading-relaxed text-surface-600 sm:text-lg">
              {article.description}
            </p>

            <div className="mt-6">
              <BlogTags tags={article.tags} />
            </div>
          </div>
        </header>

        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <figure className="mt-8 overflow-hidden rounded-2xl border border-surface-200">
            <OptimizedImage
              src={cover.src}
              webpSrc={cover.webpSrc}
              srcSet={cover.srcSet}
              webpSrcSet={cover.webpSrcSet}
              sizes={cover.sizes}
              alt={cover.alt}
              width={cover.width}
              height={cover.height}
              loading="eager"
              fetchPriority="high"
              className="aspect-[16/9] w-full object-cover"
            />
          </figure>

          <div className="mt-10 grid gap-10 lg:grid-cols-[minmax(0,1fr)_240px] lg:items-start">
            <div>
              <BlogShareButtons title={article.title} path={path} className="mb-8" />
              <BlogArticleBody sections={article.sections} />

              <AiSearchSections block={ai} className="mt-12" />

              {faqs.length > 0 ? (
                <section
                  id="faq"
                  className="mt-4 scroll-mt-20 border-t border-surface-100 py-10"
                  aria-labelledby="article-faq-heading"
                >
                  <h2
                    id="article-faq-heading"
                    className="font-display text-2xl font-semibold text-surface-950"
                  >
                    Frequently asked questions
                  </h2>
                  <dl className="mt-6 space-y-5">
                    {faqs.map((item) => (
                      <div key={item.question}>
                        <dt className="font-semibold text-surface-900">
                          {item.question}
                        </dt>
                        <dd className="mt-1 text-sm leading-relaxed text-surface-600">
                          {item.answer}
                        </dd>
                      </div>
                    ))}
                  </dl>
                </section>
              ) : null}

              <div className="mt-12 rounded-2xl bg-brand-600 px-6 py-8 text-white sm:px-8">
                <h2 className="font-display text-2xl font-semibold tracking-tight">
                  Put this into practice with {APP_NAME}
                </h2>
                <p className="mt-2 max-w-xl text-sm leading-relaxed text-white/85">
                  Review features and pricing, then create a workspace to send
                  branded invoices.
                </p>
                <div className="mt-5 flex flex-wrap gap-3">
                  <Link
                    to={paths.register}
                    className="inline-flex h-10 items-center justify-center rounded-lg bg-white px-4 text-sm font-semibold text-brand-800 hover:bg-brand-50"
                  >
                    Sign up free
                  </Link>
                  <Link
                    to={PRICING_PATH}
                    className="inline-flex h-10 items-center justify-center rounded-lg border border-white/40 bg-white/10 px-4 text-sm font-medium text-white hover:bg-white/15"
                  >
                    View pricing
                  </Link>
                </div>
              </div>

              <div className="mt-14">
                <BlogRelatedArticles articles={related} />
              </div>
            </div>

            <aside className="space-y-6 lg:sticky lg:top-28">
              <BlogToc items={toc} />
              <InternalLinkHub
                surface="blog"
                blogCategoryId={category.id}
                compact
              />
            </aside>
          </div>
        </div>
      </article>
      <InternalLinkHub surface="blog" blogCategoryId={category.id} />
    </BlogShell>
  )
}
