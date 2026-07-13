export type SeoLandingFaq = {
  question: string
  answer: string
}

export type SeoLandingTestimonial = {
  quote: string
  name: string
  role: string
}

export type SeoLandingPageConfig = {
  slug: string
  path: string
  /** Browser / OG title */
  title: string
  description: string
  /** Small label above H1 */
  eyebrow: string
  h1: string
  heroSupport: string
  primaryCta: string
  benefitsHeading: string
  benefits: Array<{ title: string; body: string }>
  featuresHeading: string
  features: Array<{ title: string; body: string }>
  faqHeading: string
  faqs: SeoLandingFaq[]
  /** Optional local / SEO testimonials (placeholders allowed). */
  testimonialsHeading?: string
  testimonialsIntro?: string
  testimonials?: SeoLandingTestimonial[]
  ctaHeading: string
  ctaSupport: string
  related: Array<{ label: string; path: string }>
}
