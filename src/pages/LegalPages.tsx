import type { ReactNode } from 'react'
import { Link } from 'react-router-dom'
import { LandingFooter } from '@/components/landing/LandingFooter'
import { LandingNav } from '@/components/landing/LandingNav'
import { SkipToContent } from '@/components/seo/SkipToContent'
import { SiteBreadcrumb } from '@/components/seo/SiteBreadcrumb'
import { paths } from '@/lib/paths'
import { APP_NAME } from '@/utils'

export type LegalPageConfig = {
  path: string
  title: string
  description: string
  eyebrow: string
  h1: string
  intro: string
  sections: Array<{ heading: string; paragraphs: string[] }>
}

export const LEGAL_PAGES: LegalPageConfig[] = [
  {
    path: '/about',
    title: 'About ReceiptFlow | Billing Software for Small Businesses',
    description:
      'Learn about ReceiptFlow — cloud billing software for small businesses with invoices, GST fields, PDF email, customers, and payment tracking.',
    eyebrow: 'About',
    h1: 'About ReceiptFlow',
    intro:
      'ReceiptFlow is billing software built for small businesses that need clear invoices, GST-ready fields, branded PDFs, and payment status — without running a heavy ERP.',
    sections: [
      {
        heading: 'What we build',
        paragraphs: [
          'We focus on day-to-day invoicing: create bills, apply tax, download or email PDFs, keep a customer book, and see which invoices are paid.',
          'The product is multi-tenant and cloud-based so each business works in its own secure workspace from a browser.',
        ],
      },
      {
        heading: 'Who it is for',
        paragraphs: [
          'Shops, freelancers, and growing teams across India who want online billing without a long implementation project.',
          'Industry and city pages explain how the same workspace fits grocery, medical, electronics, and other niches.',
        ],
      },
      {
        heading: 'How to get started',
        paragraphs: [
          'Create a free account, set up your company profile, and send your first branded invoice. Compare features and pricing when you are ready to grow.',
        ],
      },
    ],
  },
  {
    path: '/privacy',
    title: 'Privacy Policy | ReceiptFlow',
    description:
      'Privacy Policy for ReceiptFlow billing software — how we collect, use, and protect account and workspace data.',
    eyebrow: 'Legal',
    h1: 'Privacy Policy',
    intro:
      'This Privacy Policy explains how ReceiptFlow (“we”, “us”) handles information when you use our websites and billing software. It is a practical summary for customers and visitors — not a substitute for advice from your counsel.',
    sections: [
      {
        heading: 'Information we collect',
        paragraphs: [
          'Account details you provide (such as name, email, and company profile), billing content you create in a workspace (invoices, customers, and related records), and technical data needed to operate the service (such as logs and device or browser information).',
          'If you contact us, we also keep the message content you send so we can respond.',
        ],
      },
      {
        heading: 'How we use information',
        paragraphs: [
          'We use information to provide and improve ReceiptFlow, authenticate users, send transactional messages (such as invoice emails you trigger), secure the service, and communicate about the product.',
          'We do not sell your personal information.',
        ],
      },
      {
        heading: 'Sharing and processors',
        paragraphs: [
          'We use infrastructure and service providers (for example hosting, authentication, and email delivery) who process data on our behalf under contractual safeguards.',
          'We may disclose information if required by law or to protect the rights, safety, and integrity of the service.',
        ],
      },
      {
        heading: 'Retention and security',
        paragraphs: [
          'We retain account and workspace data while your account is active and for a reasonable period afterward as needed for backups, disputes, or legal obligations.',
          'We apply administrative and technical measures appropriate to a multi-tenant SaaS product. No method of transmission or storage is perfectly secure.',
        ],
      },
      {
        heading: 'Your choices',
        paragraphs: [
          'You can update profile details in the product, request access or deletion where applicable, and stop marketing messages if we send any (transactional billing emails may still be required to operate features you use).',
          'Contact us at hello@velonerp.com for privacy questions.',
        ],
      },
      {
        heading: 'Updates',
        paragraphs: [
          'We may update this policy as the product evolves. The “last updated” date on this page will change when we publish material revisions.',
        ],
      },
    ],
  },
  {
    path: '/terms',
    title: 'Terms of Service | ReceiptFlow',
    description:
      'Terms of Service for using ReceiptFlow billing software, websites, and related free tools.',
    eyebrow: 'Legal',
    h1: 'Terms of Service',
    intro:
      'These Terms govern your use of ReceiptFlow websites, free tools, and the billing software. By creating an account or using the service, you agree to these Terms.',
    sections: [
      {
        heading: 'The service',
        paragraphs: [
          'ReceiptFlow provides cloud billing features such as invoices, customer records, PDF generation, optional email delivery, and related reports. Features may change as we improve the product.',
          'Free tools on the marketing site may run in the browser without an account and are provided as-is for convenience.',
        ],
      },
      {
        heading: 'Accounts and acceptable use',
        paragraphs: [
          'You are responsible for credentials and activity in your workspace. Do not misuse the service, attempt unauthorized access, or upload unlawful content.',
          'You must have the rights to the business data you store and the authority to invoice customers you bill through ReceiptFlow.',
        ],
      },
      {
        heading: 'Billing and plans',
        paragraphs: [
          'Starter may be free to begin. Paid plans, when offered, will be described on the pricing page. Taxes, refunds, and plan changes follow the offer shown at purchase time.',
        ],
      },
      {
        heading: 'Data and compliance',
        paragraphs: [
          'You retain ownership of your business content. You grant us a limited license to host and process that content solely to provide the service.',
          'ReceiptFlow helps you create GST-oriented invoices but is not a tax advisor, CA practice, or government filing portal. Confirm rates and filings with your accountant.',
        ],
      },
      {
        heading: 'Disclaimers and liability',
        paragraphs: [
          'The service is provided “as is” to the extent permitted by law. We are not liable for indirect or consequential damages arising from use of the product.',
          'Our aggregate liability for claims relating to the service is limited to the fees you paid us for the service in the three months before the claim, or zero if you use only free features.',
        ],
      },
      {
        heading: 'Contact',
        paragraphs: [
          'Questions about these Terms: hello@velonerp.com. For product support, use the Contact page.',
        ],
      },
    ],
  },
]

export const ABOUT_PAGE = LEGAL_PAGES.find((p) => p.path === '/about')!
export const PRIVACY_PAGE = LEGAL_PAGES.find((p) => p.path === '/privacy')!
export const TERMS_PAGE = LEGAL_PAGES.find((p) => p.path === '/terms')!

export function getLegalPage(path: string): LegalPageConfig | undefined {
  return LEGAL_PAGES.find((page) => page.path === path)
}

function LegalShell({
  page,
  children,
}: {
  page: LegalPageConfig
  children?: ReactNode
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
            <SiteBreadcrumb className="mb-6 text-white/55 [&_a]:text-white/70 [&_a:hover]:text-white [&_span[aria-current=page]]:text-white" />
            <p className="text-sm font-medium tracking-wide text-brand-200 uppercase">
              {page.eyebrow}
            </p>
            <h1 className="mt-3 max-w-3xl font-display text-3xl font-semibold tracking-tight sm:text-5xl">
              {page.h1}
            </h1>
            <p className="mt-4 max-w-2xl text-base leading-relaxed text-white/75 sm:text-lg">
              {page.intro}
            </p>
          </div>
        </section>
        <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6 sm:py-16">
          {children}
          <div className="mt-12 space-y-10">
            {page.sections.map((section) => (
              <section key={section.heading}>
                <h2 className="font-display text-xl font-semibold text-surface-950">
                  {section.heading}
                </h2>
                {section.paragraphs.map((paragraph) => (
                  <p
                    key={paragraph.slice(0, 48)}
                    className="mt-3 text-sm leading-relaxed text-surface-600 sm:text-base"
                  >
                    {paragraph}
                  </p>
                ))}
              </section>
            ))}
          </div>
          <p className="mt-12 text-sm text-surface-600">
            <Link to={paths.register} className="font-medium text-brand-700 hover:underline">
              Start free with {APP_NAME}
            </Link>
            {' · '}
            <Link to="/contact" className="font-medium text-brand-700 hover:underline">
              Contact
            </Link>
            {' · '}
            <Link to="/pricing" className="font-medium text-brand-700 hover:underline">
              Pricing
            </Link>
          </p>
        </div>
      </main>
      <LandingFooter />
    </div>
  )
}

export function AboutPage() {
  return <LegalShell page={ABOUT_PAGE} />
}

export function PrivacyPage() {
  return (
    <LegalShell page={PRIVACY_PAGE}>
      <p className="text-sm text-surface-500">Last updated: 13 July 2026</p>
    </LegalShell>
  )
}

export function TermsPage() {
  return (
    <LegalShell page={TERMS_PAGE}>
      <p className="text-sm text-surface-500">Last updated: 13 July 2026</p>
    </LegalShell>
  )
}
