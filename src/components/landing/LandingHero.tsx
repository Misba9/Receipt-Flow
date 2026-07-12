import { Link } from 'react-router-dom'
import { APP_NAME } from '@/utils'
import { paths } from '@/lib/paths'

export function LandingHero() {
  return (
    <section
      id="top"
      className="relative isolate overflow-x-hidden bg-surface-950 text-white"
      aria-labelledby="hero-heading"
    >
      {/* Atmosphere */}
      <div
        className="animate-landing-pan absolute inset-0 bg-[radial-gradient(ellipse_at_15%_0%,#1a73f5_0%,transparent_42%),radial-gradient(ellipse_at_85%_15%,#0284c8_0%,transparent_38%),linear-gradient(180deg,#020617_0%,#0b1220_40%,#0c4a6e_100%)]"
        aria-hidden
      />
      <div
        className="landing-grid absolute inset-0 opacity-30 mix-blend-soft-light"
        aria-hidden
      />

      <div className="relative mx-auto flex min-h-[100svh] max-w-6xl flex-col px-4 pt-24 sm:px-6 sm:pt-28 lg:pt-32">
        <div className="flex flex-1 flex-col justify-center py-8 sm:py-10 lg:max-w-2xl lg:py-12">
          <p className="animate-landing-fade-up font-display text-4xl font-semibold tracking-tight text-white sm:text-5xl md:text-6xl lg:text-7xl">
            {APP_NAME}
          </p>
          <h1
            id="hero-heading"
            className="animate-landing-fade-up mt-4 max-w-2xl text-lg leading-snug font-medium text-white/95 sm:mt-5 sm:text-2xl md:text-3xl"
            style={{ animationDelay: '90ms' }}
          >
            Invoices that look like your brand — sent and tracked in one place.
          </h1>
          <p
            className="animate-landing-fade-up mt-3 max-w-lg text-sm leading-relaxed text-white/70 sm:mt-4 sm:text-base md:text-lg"
            style={{ animationDelay: '170ms' }}
          >
            Create, send, and track receipts for every customer in one secure
            workspace built for multi-tenant teams.
          </p>
          <div
            className="animate-landing-fade-up mt-6 flex flex-wrap items-center gap-3 sm:mt-8"
            style={{ animationDelay: '250ms' }}
          >
            <Link
              to={paths.register}
              className="inline-flex h-11 items-center justify-center rounded-lg bg-white px-5 text-sm font-semibold text-surface-950 transition-colors hover:bg-brand-50"
            >
              Get started
            </Link>
            <a
              href="#details"
              className="inline-flex h-11 items-center justify-center rounded-lg border border-white/25 bg-white/5 px-5 text-sm font-medium text-white backdrop-blur-sm transition-colors hover:bg-white/10"
            >
              Project details
            </a>
          </div>
        </div>

        {/* Product preview — no monetary amounts */}
        <div
          className="relative mt-6 w-full border-t border-white/10 bg-white text-surface-900 sm:mt-8"
          aria-hidden
        >
          <div className="mx-auto grid max-w-6xl grid-cols-12">
            <div className="col-span-4 hidden border-r border-surface-100 py-6 pr-6 md:block">
              <p className="text-[11px] font-semibold tracking-wider text-surface-400 uppercase">
                Customers
              </p>
              <ul className="mt-4 space-y-2">
                {['Northwind Labs', 'Harbor Bakery', 'Pixel & Co', 'Cedar Supply'].map(
                  (name, index) => (
                    <li
                      key={name}
                      className={`px-2 py-2 text-sm ${
                        index === 0
                          ? 'bg-brand-50 font-medium text-brand-800'
                          : 'text-surface-600'
                      }`}
                    >
                      {name}
                    </li>
                  ),
                )}
              </ul>
            </div>
            <div className="col-span-12 flex flex-col justify-between px-4 py-5 sm:px-6 md:col-span-8 md:py-6 md:pl-8">
              <div className="flex items-start justify-between gap-4">
                <div className="min-w-0">
                  <p className="text-xs font-medium tracking-wide text-surface-400 uppercase">
                    Invoice INV-0042
                  </p>
                  <p className="mt-1 truncate font-display text-xl font-semibold text-surface-950 sm:text-2xl">
                    Northwind Labs
                  </p>
                </div>
                <span className="shrink-0 text-xs font-semibold tracking-wide text-emerald-700 uppercase">
                  Paid
                </span>
              </div>
              <div className="mt-4 space-y-2 sm:mt-6">
                {[
                  ['Design retainer — March', 'Service'],
                  ['Hosting & support', 'Subscription'],
                  ['Rush delivery', 'Add-on'],
                ].map(([label, type]) => (
                  <div
                    key={label}
                    className="flex items-center justify-between gap-3 border-b border-surface-100 pb-2 text-sm"
                  >
                    <span className="min-w-0 truncate text-surface-600">{label}</span>
                    <span className="shrink-0 text-surface-500">{type}</span>
                  </div>
                ))}
              </div>
              <div className="mt-4 flex items-center justify-between gap-3 sm:mt-6">
                <span className="text-xs text-surface-500">3 line items</span>
                <span className="bg-brand-600 px-3 py-1.5 text-xs font-medium text-white">
                  Email PDF
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
