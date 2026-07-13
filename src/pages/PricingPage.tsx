import { useId, useState } from 'react'
import { Link } from 'react-router-dom'
import { Check, ChevronDown } from 'lucide-react'
import { LandingFooter } from '@/components/landing/LandingFooter'
import { LandingNav } from '@/components/landing/LandingNav'
import { AiSearchSections } from '@/components/seo/AiSearchBlocks'
import { InternalLinkHub } from '@/components/seo/InternalLinkHub'
import { SiteBreadcrumb } from '@/components/seo/SiteBreadcrumb'
import { buildPricingAiSearch, mergeFaqs } from '@/content/ai-search'
import {
  PRICING_CTA,
  PRICING_FAQS,
  PRICING_PLANS,
  PRICING_SEO,
  PRICING_TESTIMONIALS,
} from '@/content/pricing-page'
import {
  FEATURES_INDEX_PATH,
  INDUSTRIES_INDEX_PATH,
  LOCATIONS_INDEX_PATH,
} from '@/lib/breadcrumbs'
import { paths } from '@/lib/paths'
import { APP_NAME, cn } from '@/utils'

function PricingFaq() {
  const faqs = mergeFaqs(PRICING_FAQS, buildPricingAiSearch().extraFaqs)
  const [openIndex, setOpenIndex] = useState<number | null>(0)
  const baseId = useId()

  return (
    <section
      id="faq"
      className="scroll-mt-20 border-t border-surface-100 bg-surface-50 py-16 sm:py-20"
      aria-labelledby="pricing-faq-heading"
    >
      <div className="mx-auto max-w-3xl px-4 sm:px-6">
        <h2
          id="pricing-faq-heading"
          className="font-display text-3xl font-semibold tracking-tight text-surface-950 sm:text-4xl"
        >
          Billing software pricing FAQ
        </h2>
        <p className="mt-3 text-base text-surface-600">
          Answers about invoice software pricing and GST billing software plans.
        </p>
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
        <p className="mt-8 text-sm text-surface-600">
          Explore{' '}
          <Link
            to={FEATURES_INDEX_PATH}
            className="font-medium text-brand-700 hover:underline"
          >
            billing features
          </Link>
          ,{' '}
          <Link
            to="/gst-billing-software"
            className="font-medium text-brand-700 hover:underline"
          >
            GST billing software
          </Link>
          ,{' '}
          <Link
            to={INDUSTRIES_INDEX_PATH}
            className="font-medium text-brand-700 hover:underline"
          >
            industries
          </Link>
          , and{' '}
          <Link
            to={LOCATIONS_INDEX_PATH}
            className="font-medium text-brand-700 hover:underline"
          >
            cities
          </Link>
          .
        </p>
      </div>
    </section>
  )
}

export function PricingPage() {
  const ai = buildPricingAiSearch()

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
            aria-labelledby="pricing-hero-heading"
          >
            <div
              className="absolute inset-0 bg-[radial-gradient(ellipse_at_20%_0%,#1a73f5_0%,transparent_45%),linear-gradient(180deg,#020617_0%,#0b1220_55%,#0c4a6e_100%)]"
              aria-hidden
            />
            <div className="relative mx-auto max-w-6xl px-4 sm:px-6">
              <SiteBreadcrumb className="mb-6 text-white/55 [&_a]:text-white/70 [&_a:hover]:text-white [&_span[aria-current=page]]:text-white" />
              <p className="text-sm font-medium tracking-wide text-brand-200 uppercase">
                Billing software pricing
              </p>
              <h1
                id="pricing-hero-heading"
                className="mt-3 max-w-3xl font-display text-3xl font-semibold tracking-tight sm:text-5xl"
              >
                {PRICING_SEO.h1}
              </h1>
              <p className="mt-4 max-w-2xl text-base leading-relaxed text-white/75 sm:text-lg">
                {PRICING_SEO.heroSupport}
              </p>
              <div className="mt-8 flex flex-wrap gap-3">
                <Link
                  to={paths.register}
                  className="inline-flex h-11 items-center justify-center rounded-lg bg-white px-5 text-sm font-semibold text-surface-950 transition-colors hover:bg-brand-50"
                >
                  Start free
                </Link>
                <a
                  href="#plans"
                  className="inline-flex h-11 items-center justify-center rounded-lg border border-white/25 bg-white/5 px-5 text-sm font-medium text-white transition-colors hover:bg-white/10"
                >
                  View GST billing software plans
                </a>
              </div>
            </div>
          </section>

          <section
            id="plans"
            className="scroll-mt-20 py-14 sm:py-20"
            aria-labelledby="plans-heading"
          >
            <div className="mx-auto max-w-6xl px-4 sm:px-6">
              <div className="max-w-2xl">
                <h2
                  id="plans-heading"
                  className="font-display text-3xl font-semibold tracking-tight text-surface-950 sm:text-4xl"
                >
                  Invoice software pricing & GST billing plans
                </h2>
                <p className="mt-3 text-base leading-relaxed text-surface-600">
                  Transparent {APP_NAME} plans for small businesses. Start on
                  free invoice software pricing, then grow into fuller GST
                  billing software plans when email and reports matter.
                </p>
              </div>

              <ul className="mt-12 grid gap-6 lg:grid-cols-2">
                {PRICING_PLANS.map((plan) => (
                  <li key={plan.id}>
                    <article
                      className={
                        plan.highlight
                          ? 'flex h-full flex-col rounded-2xl border-2 border-brand-500 bg-white p-6 shadow-sm sm:p-8'
                          : 'flex h-full flex-col rounded-2xl border border-surface-200 bg-white p-6 sm:p-8'
                      }
                    >
                      <div className="flex flex-wrap items-center gap-2">
                        <p className="text-sm font-semibold tracking-wide text-brand-700 uppercase">
                          {plan.name}
                        </p>
                        {plan.badge ? (
                          <span className="rounded-md bg-brand-50 px-2 py-0.5 text-xs font-medium text-brand-800">
                            {plan.badge}
                          </span>
                        ) : null}
                      </div>
                      <p className="mt-3 font-display text-4xl font-semibold tracking-tight text-surface-950">
                        {plan.priceLabel}
                      </p>
                      <p className="mt-1 text-sm text-surface-500">
                        {plan.priceNote}
                      </p>
                      <p className="mt-4 text-sm leading-relaxed text-surface-600">
                        {plan.blurb}
                      </p>
                      <ul className="mt-6 flex-1 space-y-3">
                        {plan.points.map((point) => (
                          <li
                            key={point}
                            className="flex gap-2 text-sm text-surface-700"
                          >
                            <Check
                              className="mt-0.5 h-4 w-4 shrink-0 text-brand-600"
                              aria-hidden
                            />
                            <span>{point}</span>
                          </li>
                        ))}
                      </ul>
                      <Link
                        to={plan.ctaPath}
                        className={
                          plan.highlight
                            ? 'mt-8 inline-flex h-11 items-center justify-center rounded-lg bg-brand-600 px-5 text-sm font-semibold text-white transition-colors hover:bg-brand-700'
                            : 'mt-8 inline-flex h-11 items-center justify-center rounded-lg border border-surface-200 bg-surface-50 px-5 text-sm font-semibold text-surface-900 transition-colors hover:bg-surface-100'
                        }
                      >
                        {plan.ctaLabel}
                      </Link>
                    </article>
                  </li>
                ))}
              </ul>
            </div>
          </section>

          <section
            id="testimonials"
            className="scroll-mt-20 border-t border-surface-100 bg-surface-50 py-16 sm:py-20"
            aria-labelledby="pricing-testimonials-heading"
          >
            <div className="mx-auto max-w-6xl px-4 sm:px-6">
              <div className="max-w-2xl">
                <h2
                  id="pricing-testimonials-heading"
                  className="font-display text-3xl font-semibold tracking-tight text-surface-950 sm:text-4xl"
                >
                  What teams say about ReceiptFlow billing
                </h2>
                <p className="mt-3 text-base text-surface-600">
                  Small businesses use ReceiptFlow invoice software to keep
                  billing calm — before and after they look at pricing.
                </p>
              </div>
              <ul className="mt-12 grid gap-10 md:grid-cols-3">
                {PRICING_TESTIMONIALS.map((item) => (
                  <li key={item.name}>
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

          <AiSearchSections block={ai} />
          <PricingFaq />

          <section
            id="get-started"
            className="scroll-mt-20 bg-brand-600 py-16 text-white sm:py-20"
            aria-labelledby="pricing-cta-heading"
          >
            <div className="mx-auto flex max-w-6xl flex-col gap-8 px-4 sm:flex-row sm:items-center sm:justify-between sm:px-6">
              <div className="max-w-xl">
                <h2
                  id="pricing-cta-heading"
                  className="font-display text-3xl font-semibold tracking-tight sm:text-4xl"
                >
                  {PRICING_CTA.heading}
                </h2>
                <p className="mt-3 text-base leading-relaxed text-white/85">
                  {PRICING_CTA.support}
                </p>
              </div>
              <div className="flex flex-wrap gap-3">
                <Link
                  to={paths.register}
                  className="inline-flex h-11 items-center justify-center rounded-lg bg-white px-5 text-sm font-semibold text-brand-800 transition-colors hover:bg-brand-50"
                >
                  {PRICING_CTA.primaryLabel}
                </Link>
                <Link
                  to={FEATURES_INDEX_PATH}
                  className="inline-flex h-11 items-center justify-center rounded-lg border border-white/40 bg-white/10 px-5 text-sm font-medium text-white transition-colors hover:bg-white/15"
                >
                  {PRICING_CTA.secondaryLabel}
                </Link>
              </div>
            </div>
          </section>

          <InternalLinkHub surface="pricing" />
        </article>
      </main>
      <LandingFooter />
    </div>
  )
}
