import { useId, useState, type ReactNode } from 'react'
import { Link, Navigate } from 'react-router-dom'
import { ChevronDown } from 'lucide-react'
import { LandingFooter } from '@/components/landing/LandingFooter'
import { LandingNav } from '@/components/landing/LandingNav'
import { GstCalculatorTool } from '@/components/tools/GstCalculatorTool'
import { InvoiceGeneratorTool } from '@/components/tools/InvoiceGeneratorTool'
import { MarginCalculatorTool } from '@/components/tools/MarginCalculatorTool'
import { ProfitCalculatorTool } from '@/components/tools/ProfitCalculatorTool'
import { QrGeneratorTool } from '@/components/tools/QrGeneratorTool'
import { ReceiptGeneratorTool } from '@/components/tools/ReceiptGeneratorTool'
import { AiSearchSections } from '@/components/seo/AiSearchBlocks'
import { InternalLinkHub } from '@/components/seo/InternalLinkHub'
import { SiteBreadcrumb } from '@/components/seo/SiteBreadcrumb'
import { SkipToContent } from '@/components/seo/SkipToContent'
import { buildHubAiSearch, buildToolAiSearch } from '@/content/ai-search'
import {
  SEO_TOOLS,
  TOOLS_INDEX_PATH,
  getSeoTool,
  type SeoToolConfig,
  type SeoToolId,
} from '@/content/seo-tools'
import { PRICING_PATH } from '@/lib/breadcrumbs'
import { paths } from '@/lib/paths'
import { APP_NAME, cn } from '@/utils'

function ToolWidget({ id }: { id: SeoToolId }) {
  switch (id) {
    case 'invoice-generator':
      return <InvoiceGeneratorTool />
    case 'gst-calculator':
      return <GstCalculatorTool />
    case 'profit-calculator':
      return <ProfitCalculatorTool />
    case 'margin-calculator':
      return <MarginCalculatorTool />
    case 'qr-generator':
      return <QrGeneratorTool />
    case 'receipt-generator':
      return <ReceiptGeneratorTool />
    default:
      return null
  }
}

function FaqBlock({ tool }: { tool: SeoToolConfig }) {
  const [openIndex, setOpenIndex] = useState<number | null>(0)
  const baseId = useId()

  return (
    <section
      id="faq"
      className="scroll-mt-20 border-t border-surface-100 bg-surface-50 py-16 sm:py-20"
      aria-labelledby="tool-faq-heading"
    >
      <div className="mx-auto max-w-3xl px-4 sm:px-6">
        <h2
          id="tool-faq-heading"
          className="font-display text-3xl font-semibold tracking-tight text-surface-950 sm:text-4xl"
        >
          {tool.faqHeading}
        </h2>
        <div className="mt-10 divide-y divide-surface-200 border-y border-surface-200">
          {tool.faqs.map((item, index) => {
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

export function SeoToolPage({ toolId }: { toolId: SeoToolId }) {
  const tool = getSeoTool(toolId)
  if (!tool) return <Navigate to={TOOLS_INDEX_PATH} replace />
  const ai = buildToolAiSearch(tool)

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
        <section className="relative isolate overflow-hidden bg-surface-950 pt-28 pb-14 text-white sm:pt-32 sm:pb-16">
          <div
            className="absolute inset-0 bg-[radial-gradient(ellipse_at_20%_0%,#1a73f5_0%,transparent_45%),linear-gradient(180deg,#020617_0%,#0b1220_55%,#0c4a6e_100%)]"
            aria-hidden
          />
          <div className="relative mx-auto max-w-6xl px-4 sm:px-6">
            <SiteBreadcrumb className="mb-6 text-white/55 [&_a]:text-white/70 [&_a:hover]:text-white [&_span[aria-current=page]]:text-white" />
            <p className="text-sm font-medium tracking-wide text-brand-200 uppercase">
              {tool.eyebrow}
            </p>
            <h1 className="mt-3 max-w-3xl font-display text-3xl font-semibold tracking-tight sm:text-5xl">
              {tool.h1}
            </h1>
            <p className="mt-4 max-w-2xl text-base leading-relaxed text-white/75 sm:text-lg">
              {tool.heroSupport}
            </p>
            <p className="mt-6 text-sm text-white/55">
              <Link to={TOOLS_INDEX_PATH} className="underline-offset-2 hover:underline">
                All free tools
              </Link>
              {' · '}
              Part of {APP_NAME}{' '}
              <Link to={paths.landing} className="underline-offset-2 hover:underline">
                billing software
              </Link>
            </p>
          </div>
        </section>

        <section id="tool" className="scroll-mt-20 py-12 sm:py-16">
          <div className="mx-auto max-w-6xl px-4 sm:px-6">
            <ToolWidget id={tool.id} />
          </div>
        </section>

        <section className="border-t border-surface-100 py-14 sm:py-16">
          <div className="mx-auto max-w-6xl px-4 sm:px-6">
            <h2 className="font-display text-2xl font-semibold tracking-tight text-surface-950 sm:text-3xl">
              {tool.howHeading}
            </h2>
            <ol className="mt-6 grid gap-4 sm:grid-cols-2">
              {tool.howSteps.map((step, index) => (
                <li
                  key={step}
                  className="flex gap-3 rounded-xl border border-surface-200 bg-surface-50 p-4"
                >
                  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-brand-600 text-sm font-semibold text-white">
                    {index + 1}
                  </span>
                  <p className="text-sm leading-relaxed text-surface-700">{step}</p>
                </li>
              ))}
            </ol>
            <nav aria-label="Related tools" className="mt-10">
              <p className="text-sm font-medium text-surface-700">Related</p>
              <ul className="mt-3 flex flex-wrap gap-x-4 gap-y-2">
                {tool.related.map((item) => (
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

        <AiSearchSections block={ai} />
        <FaqBlock tool={tool} />
        <InternalLinkHub surface="tool" />

        <section
          id="get-started"
          className="scroll-mt-20 bg-brand-600 py-16 text-white sm:py-20"
        >
          <div className="mx-auto flex max-w-6xl flex-col gap-8 px-4 sm:flex-row sm:items-center sm:justify-between sm:px-6">
            <div className="max-w-xl">
              <h2 className="font-display text-3xl font-semibold tracking-tight sm:text-4xl">
                {tool.ctaHeading}
              </h2>
              <p className="mt-3 text-base leading-relaxed text-white/85">
                {tool.ctaSupport}
              </p>
            </div>
            <div className="flex flex-wrap gap-3">
              <Link
                to={paths.register}
                className="inline-flex h-11 items-center justify-center rounded-lg bg-white px-5 text-sm font-semibold text-brand-800 hover:bg-brand-50"
              >
                {tool.primaryCta}
              </Link>
              <Link
                to={PRICING_PATH}
                className="inline-flex h-11 items-center justify-center rounded-lg border border-white/40 bg-white/10 px-5 text-sm font-medium text-white hover:bg-white/15"
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

export function ToolsIndexPage() {
  return (
    <ToolIndexShell>
      <SiteBreadcrumb className="mb-8" />
      <ul className="mt-2 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {SEO_TOOLS.map((tool) => (
          <li key={tool.id}>
            <Link
              to={tool.path}
              className="flex h-full flex-col rounded-2xl border border-surface-200 bg-white p-5 transition-shadow hover:shadow-md"
            >
              <p className="text-xs font-semibold tracking-wide text-brand-700 uppercase">
                {tool.eyebrow}
              </p>
              <h2 className="mt-2 font-display text-xl font-semibold text-surface-950">
                {tool.h1}
              </h2>
              <p className="mt-2 flex-1 text-sm leading-relaxed text-surface-600">
                {tool.description}
              </p>
              <span className="mt-4 text-sm font-medium text-brand-700">
                Open tool →
              </span>
            </Link>
          </li>
        ))}
      </ul>
      <AiSearchSections
        block={buildHubAiSearch('tools')}
        className="-mx-4 mt-10 border-y border-surface-100 sm:-mx-6"
      />
      <div className="mt-14">
        <InternalLinkHub surface="tool" className="rounded-2xl border border-surface-200 !border-t !py-8 !px-5" />
      </div>
    </ToolIndexShell>
  )
}

function ToolIndexShell({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-white text-surface-900">
      <SkipToContent />
      <LandingNav />
      <main id="main-content">
        <section className="relative isolate overflow-hidden bg-surface-950 pt-28 pb-14 text-white sm:pt-32">
          <div
            className="absolute inset-0 bg-[radial-gradient(ellipse_at_20%_0%,#1a73f5_0%,transparent_45%),linear-gradient(180deg,#020617_0%,#0b1220_55%,#0c4a6e_100%)]"
            aria-hidden
          />
          <div className="relative mx-auto max-w-6xl px-4 sm:px-6">
            <p className="text-sm font-medium tracking-wide text-brand-200 uppercase">
              Free tools
            </p>
            <h1 className="mt-3 font-display text-3xl font-semibold tracking-tight sm:text-5xl">
              SEO billing tools for small businesses
            </h1>
            <p className="mt-4 max-w-2xl text-base text-white/75 sm:text-lg">
              Invoice and receipt generators, GST and profit calculators, margin
              math, and QR codes — free in your browser.
            </p>
          </div>
        </section>
        <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 sm:py-16">
          {children}
        </div>
      </main>
      <LandingFooter />
    </div>
  )
}
