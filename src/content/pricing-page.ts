import { testimonials } from '@/components/landing/testimonials'
import type { SeoLandingFaq } from '@/content/marketing-landing-types'
import { paths } from '@/lib/paths'

export const PRICING_SEO = {
  path: '/pricing',
  title: 'Billing Software Pricing | Invoice & GST Billing Plans | ReceiptFlow',
  description:
    'Billing software pricing and invoice software pricing from ReceiptFlow. Compare free Starter and Growth GST billing software plans — start invoicing free, upgrade when you need email PDFs and reports.',
  h1: 'Billing software pricing for small businesses',
  heroSupport:
    'Clear invoice software pricing and GST billing software plans. Start free with branded invoices, then move to Growth when email delivery, payment tracking, and sales reports matter.',
} as const

export type PricingPlan = {
  id: string
  name: string
  priceLabel: string
  /** Numeric price for schema; null when not publicly sold yet. */
  priceAmount: number | null
  priceCurrency: 'INR'
  priceNote: string
  blurb: string
  points: string[]
  ctaLabel: string
  ctaPath: string
  highlight?: boolean
  badge?: string
}

export const PRICING_PLANS: PricingPlan[] = [
  {
    id: 'starter',
    name: 'Starter',
    priceLabel: 'Free',
    priceAmount: 0,
    priceCurrency: 'INR',
    priceNote: 'No card required to start',
    blurb:
      'Invoice software pricing that lets solo owners try cloud billing without a commitment.',
    points: [
      'Branded invoices with logo and color',
      'GST fields and tax on invoices',
      'Customer directory for faster billing',
      'PDF invoice download',
      '1 company workspace',
    ],
    ctaLabel: 'Start free',
    ctaPath: paths.register,
  },
  {
    id: 'growth',
    name: 'Growth',
    priceLabel: 'Coming soon',
    priceAmount: null,
    priceCurrency: 'INR',
    priceNote: 'Join free today — Growth unlocks later',
    blurb:
      'GST billing software plans for shops that email invoices, track dues, and review sales.',
    points: [
      'Everything in Starter',
      'Email invoice PDFs to customers',
      'Payment status tracking',
      'Sales dashboard and reports',
      'Export-friendly month-end workflows',
    ],
    ctaLabel: 'Create free account',
    ctaPath: paths.register,
    highlight: true,
    badge: 'Most popular path',
  },
]

export const PRICING_FAQS: SeoLandingFaq[] = [
  {
    question: 'What is ReceiptFlow billing software pricing?',
    answer:
      'Starter is free so you can create branded invoices, apply GST tax, manage customers, and download PDFs. Growth (coming soon) adds email delivery, payment tracking, and sales reports. Check this page for the latest invoice software pricing.',
  },
  {
    question: 'Is there free invoice software pricing?',
    answer:
      'Yes. The Starter plan is free to begin. Create an account, set up your company, and send your first invoices without a paid plan.',
  },
  {
    question: 'What do GST billing software plans include?',
    answer:
      'Both paths support GST-ready invoice fields and tax on invoices. Starter covers core GST invoicing and PDFs. Growth adds email PDFs, payment status, and reports for teams that bill more often.',
  },
  {
    question: 'Does billing software pricing include GST compliance filings?',
    answer:
      'ReceiptFlow helps you create GST-oriented invoices. Government portal filings, e-invoicing portals, and CA advice stay outside the product — confirm rates and returns with your accountant.',
  },
  {
    question: 'Can I upgrade from Starter later?',
    answer:
      'Yes. Start on free Starter. When Growth launches for your workspace, you can move up for email invoices, dues tracking, and deeper sales reporting.',
  },
  {
    question: 'Is pricing the same for every industry?',
    answer:
      'Plan names and limits are the same. Industry and city pages explain how the same billing software fits grocery, medical, garment, and other niches — the product is one workspace.',
  },
]

export const PRICING_TESTIMONIALS = testimonials

export const PRICING_CTA = {
  heading: 'Start with free billing software pricing',
  support:
    'Create your ReceiptFlow workspace, send a branded GST-ready invoice, and decide when Growth features are worth it.',
  primaryLabel: 'Create free account',
  secondaryLabel: 'Compare features',
} as const
