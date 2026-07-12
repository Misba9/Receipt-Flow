import { useEffect } from 'react'
import { LandingContact } from '@/components/landing/LandingContact'
import { LandingDetails } from '@/components/landing/LandingDetails'
import { LandingFaq } from '@/components/landing/LandingFaq'
import { faqItems } from '@/components/landing/faq-data'
import { LandingFeatures } from '@/components/landing/LandingFeatures'
import { LandingFooter } from '@/components/landing/LandingFooter'
import { LandingHero } from '@/components/landing/LandingHero'
import { LandingNav } from '@/components/landing/LandingNav'
import { LandingTestimonials } from '@/components/landing/LandingTestimonials'
import { APP_NAME } from '@/utils'
import { env } from '@/lib/env'

const PAGE_TITLE = `${APP_NAME} — Invoices & receipts for growing teams`
const PAGE_DESCRIPTION =
  'ReceiptFlow is multi-tenant invoicing software for small businesses. Create branded invoices, track payments, email PDFs, and run sales reports — securely by company.'

export function LandingPage() {
  useEffect(() => {
    document.title = PAGE_TITLE

    const meta = document.querySelector('meta[name="description"]')
    if (meta) meta.setAttribute('content', PAGE_DESCRIPTION)

    const siteUrl = (env.appUrl || window.location.origin).replace(/\/$/, '')
    const pageUrl = `${siteUrl}/`

    let canonical = document.querySelector(
      'link[rel="canonical"]',
    ) as HTMLLinkElement | null
    if (!canonical) {
      canonical = document.createElement('link')
      canonical.rel = 'canonical'
      document.head.appendChild(canonical)
    }
    canonical.href = pageUrl

    let ogUrl = document.querySelector(
      'meta[property="og:url"]',
    ) as HTMLMetaElement | null
    if (!ogUrl) {
      ogUrl = document.createElement('meta')
      ogUrl.setAttribute('property', 'og:url')
      document.head.appendChild(ogUrl)
    }
    ogUrl.content = pageUrl

    const softwareLd = {
      '@context': 'https://schema.org',
      '@type': 'SoftwareApplication',
      name: APP_NAME,
      applicationCategory: 'BusinessApplication',
      operatingSystem: 'Web',
      description: PAGE_DESCRIPTION,
      url: pageUrl,
    }

    const faqLd = {
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      mainEntity: faqItems.map((item) => ({
        '@type': 'Question',
        name: item.question,
        acceptedAnswer: {
          '@type': 'Answer',
          text: item.answer,
        },
      })),
    }

    const scriptSoftware = document.createElement('script')
    scriptSoftware.type = 'application/ld+json'
    scriptSoftware.id = 'ld-software'
    scriptSoftware.text = JSON.stringify(softwareLd)

    const scriptFaq = document.createElement('script')
    scriptFaq.type = 'application/ld+json'
    scriptFaq.id = 'ld-faq'
    scriptFaq.text = JSON.stringify(faqLd)

    document.getElementById('ld-software')?.remove()
    document.getElementById('ld-faq')?.remove()
    document.head.appendChild(scriptSoftware)
    document.head.appendChild(scriptFaq)

    return () => {
      scriptSoftware.remove()
      scriptFaq.remove()
    }
  }, [])

  return (
    <div className="min-h-screen bg-white text-surface-900">
      <a
        href="#features"
        className="sr-only focus:not-sr-only focus:absolute focus:top-3 focus:left-3 focus:z-50 focus:rounded-lg focus:bg-white focus:px-3 focus:py-2 focus:text-sm focus:shadow"
      >
        Skip to content
      </a>
      <LandingNav />
      <main>
        <LandingHero />
        <LandingFeatures />
        <LandingDetails />
        <LandingTestimonials />
        <LandingFaq />
        <LandingContact />
      </main>
      <LandingFooter />
    </div>
  )
}
