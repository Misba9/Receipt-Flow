import { Link } from 'react-router-dom'
import type { ReactNode } from 'react'
import { LandingFooter } from '@/components/landing/LandingFooter'
import { LandingNav } from '@/components/landing/LandingNav'
import { AiSearchSections } from '@/components/seo/AiSearchBlocks'
import { InternalLinkHub } from '@/components/seo/InternalLinkHub'
import { SiteBreadcrumb } from '@/components/seo/SiteBreadcrumb'
import {
  buildHubAiSearch,
} from '@/content/ai-search'
import { INDUSTRY_LANDING_PAGES } from '@/content/industry-landings'
import { LOCATION_LANDING_PAGES } from '@/content/location-landings'
import { SEO_LANDING_PAGES } from '@/content/seo-landings'
import {
  INDUSTRIES_INDEX_PATH,
  LOCATIONS_INDEX_PATH,
  PRICING_PATH,
} from '@/lib/breadcrumbs'
import { paths } from '@/lib/paths'

import { SkipToContent } from '@/components/seo/SkipToContent'

function HubShell({
  eyebrow,
  title,
  support,
  children,
}: {
  eyebrow: string
  title: string
  support: string
  children: ReactNode
}) {
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
              {eyebrow}
            </p>
            <h1 className="mt-3 max-w-3xl font-display text-3xl font-semibold tracking-tight sm:text-5xl">
              {title}
            </h1>
            <p className="mt-4 max-w-2xl text-base leading-relaxed text-white/75 sm:text-lg">
              {support}
            </p>
          </div>
        </section>
        <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 sm:py-12">
          <SiteBreadcrumb className="mb-8" />
          {children}
        </div>
        <InternalLinkHub surface="hub" />
      </main>
      <LandingFooter />
    </div>
  )
}

export function FeaturesIndexPage() {
  return (
    <HubShell
      eyebrow="Features"
      title="Billing features for small businesses"
      support="Explore invoice software, GST billing, PDF and email invoices, dashboards, reports, and payment tracking."
    >
      <ul className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {SEO_LANDING_PAGES.map((page) => (
          <li key={page.path}>
            <Link
              to={page.path}
              className="flex h-full flex-col rounded-2xl border border-surface-200 bg-white p-5 transition-shadow hover:shadow-md"
            >
              <h2 className="font-display text-lg font-semibold text-surface-950">
                {page.eyebrow}
              </h2>
              <p className="mt-2 flex-1 text-sm leading-relaxed text-surface-600">
                {page.description}
              </p>
              <span className="mt-4 text-sm font-medium text-brand-700">
                View feature →
              </span>
            </Link>
          </li>
        ))}
      </ul>
      <p className="mt-10 text-sm text-surface-600">
        Ready to choose a plan?{' '}
        <Link to={PRICING_PATH} className="font-semibold text-brand-700 hover:underline">
          See pricing
        </Link>{' '}
        or{' '}
        <Link to={paths.register} className="font-semibold text-brand-700 hover:underline">
          sign up free
        </Link>
        .
      </p>
      <AiSearchSections
        block={buildHubAiSearch('features')}
        className="mt-12 -mx-4 border-y border-surface-100 sm:-mx-6"
      />
    </HubShell>
  )
}

export function IndustriesIndexPage() {
  return (
    <HubShell
      eyebrow="Industries"
      title="Billing software by industry"
      support="Industry pages for grocery, mobile shops, medical stores, garments, hardware, wholesale, and electronics."
    >
      <ul className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {INDUSTRY_LANDING_PAGES.map((page) => (
          <li key={page.path}>
            <Link
              to={page.path}
              className="flex h-full flex-col rounded-2xl border border-surface-200 bg-white p-5 transition-shadow hover:shadow-md"
            >
              <h2 className="font-display text-lg font-semibold text-surface-950">
                {page.eyebrow}
              </h2>
              <p className="mt-2 flex-1 text-sm leading-relaxed text-surface-600">
                {page.description}
              </p>
              <span className="mt-4 text-sm font-medium text-brand-700">
                View industry →
              </span>
            </Link>
          </li>
        ))}
      </ul>
      <p className="mt-10 text-sm text-surface-600">
        Also explore{' '}
        <Link
          to={LOCATIONS_INDEX_PATH}
          className="font-semibold text-brand-700 hover:underline"
        >
          city pages
        </Link>{' '}
        and{' '}
        <Link to={PRICING_PATH} className="font-semibold text-brand-700 hover:underline">
          pricing
        </Link>
        .
      </p>
      <AiSearchSections
        block={buildHubAiSearch('industries')}
        className="mt-12 -mx-4 border-y border-surface-100 sm:-mx-6"
      />
    </HubShell>
  )
}

export function LocationsIndexPage() {
  return (
    <HubShell
      eyebrow="Locations"
      title="Billing software by city"
      support="Local landing pages for Hyderabad, Bangalore, Chennai, Mumbai, and Delhi with city-specific keywords."
    >
      <ul className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {LOCATION_LANDING_PAGES.map((page) => (
          <li key={page.path}>
            <Link
              to={page.path}
              className="flex h-full flex-col rounded-2xl border border-surface-200 bg-white p-5 transition-shadow hover:shadow-md"
            >
              <h2 className="font-display text-lg font-semibold text-surface-950">
                {page.eyebrow}
              </h2>
              <p className="mt-2 flex-1 text-sm leading-relaxed text-surface-600">
                {page.description}
              </p>
              <span className="mt-4 text-sm font-medium text-brand-700">
                View city →
              </span>
            </Link>
          </li>
        ))}
      </ul>
      <p className="mt-10 text-sm text-surface-600">
        Compare{' '}
        <Link
          to={INDUSTRIES_INDEX_PATH}
          className="font-semibold text-brand-700 hover:underline"
        >
          industry solutions
        </Link>{' '}
        or{' '}
        <Link to={paths.register} className="font-semibold text-brand-700 hover:underline">
          create your account
        </Link>
        .
      </p>
      <AiSearchSections
        block={buildHubAiSearch('locations')}
        className="mt-12 -mx-4 border-y border-surface-100 sm:-mx-6"
      />
    </HubShell>
  )
}
