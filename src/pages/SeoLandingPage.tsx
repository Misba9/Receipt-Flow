import { useId, useState } from 'react'
import { Link, Navigate } from 'react-router-dom'
import { Check, ChevronDown } from 'lucide-react'
import { LandingNav } from '@/components/landing/LandingNav'
import { LandingFooter } from '@/components/landing/LandingFooter'
import { AiSearchSections } from '@/components/seo/AiSearchBlocks'
import { InternalLinkHub } from '@/components/seo/InternalLinkHub'
import { SiteBreadcrumb } from '@/components/seo/SiteBreadcrumb'
import {
  buildLandingAiSearch,
  mergeFaqs,
} from '@/content/ai-search'
import {
  getMarketingLanding,
  getMarketingLandingSurface,
} from '@/content/get-marketing-landing'
import type {
  SeoLandingFaq,
  SeoLandingPageConfig,
} from '@/content/marketing-landing-types'
import { PRICING_PATH } from '@/lib/breadcrumbs'
import { paths } from '@/lib/paths'
import { APP_NAME, cn } from '@/utils'

type SeoLandingPageProps = {
  slug: string
}

function FaqBlock({
  heading,
  faqs,
}: {
  heading: string
  faqs: SeoLandingFaq[]
}) {
  const [openIndex, setOpenIndex] = useState<number | null>(0)
  const baseId = useId()

  return (
    <section
      id="faq"
      className="scroll-mt-20 bg-surface-50 py-16 sm:py-20"
      aria-labelledby="seo-faq-heading"
    >
      <div className="mx-auto max-w-3xl px-4 sm:px-6">
        <h2
          id="seo-faq-heading"
          className="font-display text-3xl font-semibold tracking-tight text-surface-950 sm:text-4xl"
        >
          {heading}
        </h2>
        <div className="mt-10 divide-y divide-surface-200 border-y border-surface-200">
          {faqs.map((item, index) => {
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
                        'h-5 w-5 shrink-0 text-surface-400 transition-transform duration-300',
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
                    'grid transition-[grid-template-rows] duration-300 ease-out',
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

function TestimonialsBlock({ page }: { page: SeoLandingPageConfig }) {
  if (!page.testimonials?.length) return null

  return (
    <section
      id="testimonials"
      className="scroll-mt-20 py-16 sm:py-20"
      aria-labelledby="seo-testimonials-heading"
    >
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="max-w-2xl">
          <h2
            id="seo-testimonials-heading"
            className="font-display text-3xl font-semibold tracking-tight text-surface-950 sm:text-4xl"
          >
            {page.testimonialsHeading ?? 'Local stories'}
          </h2>
          {page.testimonialsIntro ? (
            <p className="mt-3 text-base leading-relaxed text-surface-600">
              {page.testimonialsIntro}
            </p>
          ) : null}
        </div>
        <ul className="mt-12 grid gap-10 md:grid-cols-3">
          {page.testimonials.map((item) => (
            <li key={`${item.name}-${item.role}`}>
              <blockquote className="text-base leading-relaxed text-surface-800">
                “{item.quote}”
              </blockquote>
              <footer className="mt-5">
                <p className="text-sm font-semibold text-surface-950">
                  {item.name}
                </p>
                <p className="text-sm text-surface-500">{item.role}</p>
              </footer>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}

export function SeoLandingPage({ slug }: SeoLandingPageProps) {
  const page = getMarketingLanding(slug)
  if (!page) return <Navigate to={paths.landing} replace />
  const surface = getMarketingLandingSurface(slug) ?? 'feature'
  const aiSurface =
    surface === 'industry' || surface === 'location' ? surface : 'feature'
  const ai = buildLandingAiSearch(page, aiSurface)
  const faqs = mergeFaqs(page.faqs, ai.extraFaqs)

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
          aria-labelledby="seo-hero-heading"
        >
          <div
            className="absolute inset-0 bg-[radial-gradient(ellipse_at_20%_0%,#1a73f5_0%,transparent_45%),linear-gradient(180deg,#020617_0%,#0b1220_55%,#0c4a6e_100%)]"
            aria-hidden
          />
          <div className="relative mx-auto max-w-6xl px-4 sm:px-6">
            <SiteBreadcrumb className="mb-6 text-white/55 [&_a]:text-white/70 [&_a:hover]:text-white [&_span[aria-current=page]]:text-white" />
            <p className="text-sm font-medium tracking-wide text-brand-200 uppercase">
              {page.eyebrow}
            </p>
            <h1
              id="seo-hero-heading"
              className="mt-3 max-w-3xl font-display text-3xl font-semibold tracking-tight sm:text-5xl"
            >
              {page.h1}
            </h1>
            <p className="mt-4 max-w-2xl text-base leading-relaxed text-white/75 sm:text-lg">
              {page.heroSupport}
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                to={paths.register}
                className="inline-flex h-11 items-center justify-center rounded-lg bg-white px-5 text-sm font-semibold text-surface-950 transition-colors hover:bg-brand-50"
              >
                {page.primaryCta}
              </Link>
              <a
                href="#benefits"
                className="inline-flex h-11 items-center justify-center rounded-lg border border-white/25 bg-white/5 px-5 text-sm font-medium text-white transition-colors hover:bg-white/10"
              >
                See benefits
              </a>
            </div>
            <p className="mt-6 text-sm text-white/55">
              Part of {APP_NAME}{' '}
              <Link to={paths.landing} className="underline-offset-2 hover:underline">
                billing software for small businesses
              </Link>
              . See{' '}
              <Link to={PRICING_PATH} className="underline-offset-2 hover:underline">
                pricing
              </Link>{' '}
              or{' '}
              <Link to={paths.register} className="underline-offset-2 hover:underline">
                sign up
              </Link>
              .
            </p>
          </div>
        </section>

        <section
          id="benefits"
          className="scroll-mt-20 py-16 sm:py-20"
          aria-labelledby="seo-benefits-heading"
        >
          <div className="mx-auto max-w-6xl px-4 sm:px-6">
            <h2
              id="seo-benefits-heading"
              className="font-display text-3xl font-semibold tracking-tight text-surface-950 sm:text-4xl"
            >
              {page.benefitsHeading}
            </h2>
            <ul className="mt-10 grid gap-8 sm:grid-cols-3">
              {page.benefits.map((item) => (
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
          </div>
        </section>

        <section
          id="features"
          className="scroll-mt-20 border-t border-surface-100 bg-surface-50 py-16 sm:py-20"
          aria-labelledby="seo-features-heading"
        >
          <div className="mx-auto max-w-6xl px-4 sm:px-6">
            <h2
              id="seo-features-heading"
              className="font-display text-3xl font-semibold tracking-tight text-surface-950 sm:text-4xl"
            >
              {page.featuresHeading}
            </h2>
            <ul className="mt-10 grid gap-8 sm:grid-cols-2">
              {page.features.map((item) => (
                <li key={item.title}>
                  <article className="h-full rounded-2xl border border-surface-200 bg-white p-5 sm:p-6">
                    <h3 className="font-display text-lg font-semibold text-surface-950">
                      {item.title}
                    </h3>
                    <p className="mt-2 text-sm leading-relaxed text-surface-600">
                      {item.body}
                    </p>
                  </article>
                </li>
              ))}
            </ul>
            <nav aria-label="Related topics" className="mt-10">
              <p className="text-sm font-medium text-surface-700">
                Related guides
              </p>
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

        <TestimonialsBlock page={page} />
        <AiSearchSections block={ai} />
        <FaqBlock heading={page.faqHeading} faqs={faqs} />
        <InternalLinkHub surface={surface} />

        <section
          id="get-started"
          className="scroll-mt-20 bg-brand-600 py-16 text-white sm:py-20"
          aria-labelledby="seo-cta-heading"
        >
          <div className="mx-auto flex max-w-6xl flex-col gap-8 px-4 sm:flex-row sm:items-center sm:justify-between sm:px-6">
            <div className="max-w-xl">
              <h2
                id="seo-cta-heading"
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
            </div>
          </div>
        </section>
        </article>
      </main>
      <LandingFooter />
    </div>
  )
}
