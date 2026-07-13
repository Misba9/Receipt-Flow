import { useId, useState } from 'react'
import { Link, Navigate } from 'react-router-dom'
import { Check, ChevronDown } from 'lucide-react'
import { LandingFooter } from '@/components/landing/LandingFooter'
import { LandingNav } from '@/components/landing/LandingNav'
import { InternalLinkHub } from '@/components/seo/InternalLinkHub'
import { SiteBreadcrumb } from '@/components/seo/SiteBreadcrumb'
import { SkipToContent } from '@/components/seo/SkipToContent'
import {
  COMPARISON_PAGES,
  COMPARISONS_INDEX_PATH,
  getComparisonPage,
  type ComparisonPageConfig,
} from '@/content/comparison-pages'
import { PRICING_PATH } from '@/lib/breadcrumbs'
import { paths } from '@/lib/paths'
import { APP_NAME, cn } from '@/utils'

function FaqBlock({ page }: { page: ComparisonPageConfig }) {
  const [openIndex, setOpenIndex] = useState<number | null>(0)
  const baseId = useId()

  return (
    <section
      id="faq"
      className="scroll-mt-20 border-t border-surface-100 bg-surface-50 py-16 sm:py-20"
      aria-labelledby="comparison-faq-heading"
    >
      <div className="mx-auto max-w-3xl px-4 sm:px-6">
        <h2
          id="comparison-faq-heading"
          className="font-display text-3xl font-semibold tracking-tight text-surface-950 sm:text-4xl"
        >
          {page.faqHeading}
        </h2>
        <div className="mt-10 divide-y divide-surface-200 border-y border-surface-200">
          {page.faqs.map((item, index) => {
            const isOpen = openIndex === index
            const panelId = `${baseId}-panel-${index}`
            const buttonId = `${baseId}-button-${index}`
            return (
              <div key={item.question}>
                <h3>
                  <button
                    type="button"
                    id={buttonId}
                    aria-expanded={isOpen}
                    aria-controls={panelId}
                    className="flex w-full items-center justify-between gap-4 py-5 text-left"
                    onClick={() =>
                      setOpenIndex((current) =>
                        current === index ? null : index,
                      )
                    }
                  >
                    <span className="text-base font-semibold text-surface-950">
                      {item.question}
                    </span>
                    <ChevronDown
                      className={cn(
                        'h-5 w-5 shrink-0 text-surface-400 transition-transform',
                        isOpen && 'rotate-180',
                      )}
                      aria-hidden
                    />
                  </button>
                </h3>
                <div
                  id={panelId}
                  role="region"
                  aria-labelledby={buttonId}
                  className={cn(
                    'grid transition-[grid-template-rows] duration-300',
                    isOpen ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]',
                  )}
                >
                  <div className="overflow-hidden">
                    <p className="pb-5 text-sm leading-relaxed text-surface-600">
                      {item.answer}
                    </p>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}

export function ComparisonPage({ slug }: { slug: string }) {
  const page = getComparisonPage(slug)
  if (!page) return <Navigate to={COMPARISONS_INDEX_PATH} replace />

  return (
    <div className="min-h-screen bg-white text-surface-900">
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:top-3 focus:left-3 focus:z-50 focus:rounded-lg focus:bg-white focus:px-3 focus:py-2 focus:text-sm focus:shadow"
      >
        Skip to content
      </a>
      <LandingNav />
      <main id="main-content">
        <article>
          <section
            className="relative isolate overflow-hidden bg-surface-950 pt-28 pb-16 text-white sm:pt-32 sm:pb-20"
            aria-labelledby="comparison-hero-heading"
          >
            <div
              className="absolute inset-0 bg-[radial-gradient(ellipse_at_20%_0%,#1a73f5_0%,transparent_45%),linear-gradient(180deg,#020617_0%,#0b1220_55%,#0c4a6e_100%)]"
              aria-hidden
            />
            <div className="relative mx-auto max-w-6xl px-4 sm:px-6">
              <SiteBreadcrumb className="mb-6 text-white/55 [&_a]:text-white/70 [&_a:hover]:text-white [&_span[aria-current=page]]:text-white" />
              <p className="text-sm font-medium tracking-wide text-brand-200 uppercase">
                Comparison
              </p>
              <h1
                id="comparison-hero-heading"
                className="mt-3 max-w-3xl font-display text-3xl font-semibold tracking-tight sm:text-5xl"
              >
                {page.h1}
              </h1>
              <p className="mt-4 max-w-2xl text-base leading-relaxed text-white/75 sm:text-lg">
                {page.heroSupport}
              </p>
              <p className="mt-3 text-sm text-white/55">
                Comparing {APP_NAME} with {page.competitorProduct}.
              </p>
              <div className="mt-8 flex flex-wrap gap-3">
                <Link
                  to={paths.register}
                  className="inline-flex h-11 items-center justify-center rounded-lg bg-white px-5 text-sm font-semibold text-surface-950 transition-colors hover:bg-brand-50"
                >
                  {page.primaryCta}
                </Link>
                <Link
                  to={PRICING_PATH}
                  className="inline-flex h-11 items-center justify-center rounded-lg border border-white/25 bg-white/5 px-5 text-sm font-medium text-white transition-colors hover:bg-white/10"
                >
                  View pricing
                </Link>
                <a
                  href="#comparison-table"
                  className="inline-flex h-11 items-center justify-center rounded-lg border border-white/25 bg-white/5 px-5 text-sm font-medium text-white transition-colors hover:bg-white/10"
                >
                  See comparison table
                </a>
              </div>
            </div>
          </section>

          <section
            id="summary"
            className="scroll-mt-20 py-12 sm:py-16"
            aria-labelledby="summary-heading"
          >
            <div className="mx-auto max-w-6xl px-4 sm:px-6">
              <h2
                id="summary-heading"
                className="font-display text-2xl font-semibold tracking-tight text-surface-950 sm:text-3xl"
              >
                Summary
              </h2>
              <p
                className="mt-6 max-w-3xl text-base leading-relaxed text-surface-700 sm:text-lg"
                data-speakable="true"
              >
                {page.summary}
              </p>
              <p className="mt-4 max-w-3xl text-sm leading-relaxed text-surface-500">
                {page.disclaimer}
              </p>
            </div>
          </section>

          <section
            id="who-should-choose"
            className="scroll-mt-20 border-t border-surface-100 bg-surface-50 py-12 sm:py-16"
            aria-labelledby="who-choose-heading"
          >
            <div className="mx-auto max-w-6xl px-4 sm:px-6">
              <h2
                id="who-choose-heading"
                className="font-display text-2xl font-semibold tracking-tight text-surface-950 sm:text-3xl"
              >
                Who should choose what
              </h2>
              <div className="mt-10 grid gap-8 md:grid-cols-2">
                <div>
                  <h3 className="text-sm font-semibold tracking-wide text-brand-800 uppercase">
                    {page.whenReceiptFlowHeading}
                  </h3>
                  <ul className="mt-4 space-y-3 text-sm leading-relaxed text-surface-700">
                    {page.whenReceiptFlow.map((item) => (
                      <li key={item} className="flex gap-2">
                        <Check
                          className="mt-0.5 h-4 w-4 shrink-0 text-brand-600"
                          aria-hidden
                        />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h3 className="text-sm font-semibold tracking-wide text-surface-700 uppercase">
                    {page.whenCompetitorHeading}
                  </h3>
                  <ul className="mt-4 space-y-3 text-sm leading-relaxed text-surface-700">
                    {page.whenCompetitor.map((item) => (
                      <li key={item} className="flex gap-2">
                        <span className="mt-0.5 text-surface-400" aria-hidden>
                          ·
                        </span>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </section>

          <section
            id="comparison-table"
            className="scroll-mt-20 border-t border-surface-100 py-12 sm:py-16"
            aria-labelledby="comparison-table-heading"
          >
            <div className="mx-auto max-w-6xl px-4 sm:px-6">
              <h2
                id="comparison-table-heading"
                className="font-display text-2xl font-semibold tracking-tight text-surface-950 sm:text-3xl"
              >
                {page.tableHeading}
              </h2>
              <p className="mt-3 max-w-3xl text-base leading-relaxed text-surface-600">
                {page.tableIntro}
              </p>
              <div className="mt-8 overflow-x-auto rounded-2xl border border-surface-200 bg-white">
                <table className="min-w-full text-left text-sm">
                  <caption className="sr-only">{page.tableHeading}</caption>
                  <thead className="border-b border-surface-200 bg-surface-50">
                    <tr>
                      <th
                        scope="col"
                        className="px-4 py-3 font-semibold text-surface-800"
                      >
                        Criterion
                      </th>
                      <th
                        scope="col"
                        className="px-4 py-3 font-semibold text-surface-800"
                      >
                        {APP_NAME}
                      </th>
                      <th
                        scope="col"
                        className="px-4 py-3 font-semibold text-surface-800"
                      >
                        {page.competitorProduct}
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {page.rows.map((row) => (
                      <tr
                        key={row.criterion}
                        className="border-b border-surface-100 align-top"
                      >
                        <th
                          scope="row"
                          className="px-4 py-3 font-medium text-surface-900"
                        >
                          {row.criterion}
                        </th>
                        <td className="px-4 py-3 text-surface-700">
                          {row.receiptflow}
                        </td>
                        <td className="px-4 py-3 text-surface-700">
                          {row.competitor}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </section>

          <section
            id="receiptflow-features"
            className="scroll-mt-20 border-t border-surface-100 bg-surface-50 py-12 sm:py-16"
            aria-labelledby="highlights-heading"
          >
            <div className="mx-auto max-w-6xl px-4 sm:px-6">
              <h2
                id="highlights-heading"
                className="font-display text-2xl font-semibold tracking-tight text-surface-950 sm:text-3xl"
              >
                {page.highlightsHeading}
              </h2>
              <ul className="mt-10 grid gap-8 sm:grid-cols-2">
                {page.highlights.map((item) => (
                  <li key={item.title}>
                    <article>
                      <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-brand-50 text-brand-700">
                        <Check className="h-4 w-4" aria-hidden />
                      </div>
                      <h3 className="mt-4 font-display text-lg font-semibold text-surface-950">
                        {item.title}
                      </h3>
                      <p className="mt-2 text-sm leading-relaxed text-surface-600">
                        {item.body}
                      </p>
                    </article>
                  </li>
                ))}
              </ul>
              <nav aria-label="Related pages" className="mt-10">
                <p className="text-sm font-medium text-surface-700">Related</p>
                <ul className="mt-3 flex flex-wrap gap-x-4 gap-y-2">
                  {page.related.map((item) => (
                    <li key={item.path}>
                      <Link
                        to={item.path}
                        className="text-sm font-medium text-brand-700 hover:underline"
                      >
                        {item.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </nav>
            </div>
          </section>

          <FaqBlock page={page} />
          <InternalLinkHub surface="hub" />

          <section
            id="get-started"
            className="scroll-mt-20 bg-brand-600 py-16 text-white sm:py-20"
            aria-labelledby="comparison-cta-heading"
          >
            <div className="mx-auto flex max-w-6xl flex-col gap-8 px-4 sm:flex-row sm:items-center sm:justify-between sm:px-6">
              <div className="max-w-xl">
                <h2
                  id="comparison-cta-heading"
                  className="font-display text-3xl font-semibold tracking-tight sm:text-4xl"
                >
                  {page.ctaHeading}
                </h2>
                <p className="mt-3 text-base leading-relaxed text-white/85">
                  {page.ctaSupport}
                </p>
              </div>
              <div className="flex flex-wrap gap-3">
                <Link
                  to={paths.register}
                  className="inline-flex h-11 items-center justify-center rounded-lg bg-white px-5 text-sm font-semibold text-brand-800 transition-colors hover:bg-brand-50"
                >
                  {page.primaryCta}
                </Link>
                <Link
                  to={PRICING_PATH}
                  className="inline-flex h-11 items-center justify-center rounded-lg border border-white/40 bg-white/10 px-5 text-sm font-medium text-white transition-colors hover:bg-white/15"
                >
                  View pricing
                </Link>
                <Link
                  to={COMPARISONS_INDEX_PATH}
                  className="inline-flex h-11 items-center justify-center rounded-lg border border-white/40 bg-white/10 px-5 text-sm font-medium text-white transition-colors hover:bg-white/15"
                >
                  All comparisons
                </Link>
              </div>
            </div>
          </section>
        </article>
      </main>
      <LandingFooter />
    </div>
  )
}

export function ComparisonsIndexPage() {
  return (
    <div className="min-h-screen bg-white text-surface-900">
      <SkipToContent />
      <LandingNav />
      <main id="main-content">
        <section className="relative isolate overflow-hidden bg-surface-950 pt-28 pb-14 text-white sm:pt-32 sm:pb-16">
          <div
            className="absolute inset-0 bg-[radial-gradient(ellipse_at_20%_0%,#1a73f5_0%,transparent_45%),linear-gradient(180deg,#020617_0%,#0b1220_55%,#0c4a6e_100%)]"
            aria-hidden
          />
          <div className="relative mx-auto max-w-6xl px-4 sm:px-6">
            <p className="text-sm font-medium tracking-wide text-brand-200 uppercase">
              Comparisons
            </p>
            <h1 className="mt-3 max-w-3xl font-display text-3xl font-semibold tracking-tight sm:text-5xl">
              ReceiptFlow vs popular billing software
            </h1>
            <p className="mt-4 max-w-2xl text-base leading-relaxed text-white/75 sm:text-lg">
              Factual category comparisons with Zoho, Vyapar, Busy, Tally, and
              Marg ERP — plus a clear CTA to try ReceiptFlow when cloud invoicing
              is enough.
            </p>
          </div>
        </section>

        <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 sm:py-12">
          <SiteBreadcrumb className="mb-8" />
          <ul className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {COMPARISON_PAGES.map((page) => (
              <li key={page.path}>
                <Link
                  to={page.path}
                  className="flex h-full flex-col rounded-2xl border border-surface-200 bg-white p-5 transition-shadow hover:shadow-md"
                >
                  <h2 className="font-display text-lg font-semibold text-surface-950">
                    {page.h1}
                  </h2>
                  <p className="mt-2 flex-1 text-sm leading-relaxed text-surface-600">
                    {page.description}
                  </p>
                  <span className="mt-4 text-sm font-medium text-brand-700">
                    Read comparison →
                  </span>
                </Link>
              </li>
            ))}
          </ul>
          <p className="mt-10 text-sm text-surface-600">
            Ready to try?{' '}
            <Link
              to={paths.register}
              className="font-semibold text-brand-700 hover:underline"
            >
              Sign up free
            </Link>{' '}
            or{' '}
            <Link
              to={PRICING_PATH}
              className="font-semibold text-brand-700 hover:underline"
            >
              see pricing
            </Link>
            .
          </p>
        </div>
        <InternalLinkHub surface="hub" />
      </main>
      <LandingFooter />
    </div>
  )
}
