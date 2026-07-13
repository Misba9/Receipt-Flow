import { LandingContact } from '@/components/landing/LandingContact'
import { LandingFooter } from '@/components/landing/LandingFooter'
import { LandingNav } from '@/components/landing/LandingNav'
import { SiteBreadcrumb } from '@/components/seo/SiteBreadcrumb'
import { SkipToContent } from '@/components/seo/SkipToContent'
import { Link } from 'react-router-dom'
import { paths } from '@/lib/paths'

export const CONTACT_SEO = {
  path: '/contact',
  title: 'Contact ReceiptFlow | Billing Software Support',
  description:
    'Contact ReceiptFlow about billing software, GST invoicing, migrations, or product questions. We reply within one business day.',
} as const

export function ContactPage() {
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
            <SiteBreadcrumb className="mb-6 text-white/55 [&_a]:text-white/70 [&_a:hover]:text-white [&_span[aria-current=page]]:text-white" />
            <p className="text-sm font-medium tracking-wide text-brand-200 uppercase">
              Contact
            </p>
            <h1 className="mt-3 max-w-3xl font-display text-3xl font-semibold tracking-tight sm:text-5xl">
              Contact ReceiptFlow
            </h1>
            <p className="mt-4 max-w-2xl text-base leading-relaxed text-white/75 sm:text-lg">
              Questions about invoice software, GST billing, or your workspace?
              Send a note — or start free while you wait for a reply.
            </p>
            <Link
              to={paths.register}
              className="mt-8 inline-flex h-11 items-center justify-center rounded-lg bg-white px-5 text-sm font-semibold text-surface-950 hover:bg-brand-50"
            >
              Start free
            </Link>
          </div>
        </section>
        <LandingContact />
      </main>
      <LandingFooter />
    </div>
  )
}
