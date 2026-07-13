import { lazy, Suspense } from 'react'
import { LandingCta } from '@/components/landing/LandingCta'
import { LandingFaq } from '@/components/landing/LandingFaq'
import { LandingFeatures } from '@/components/landing/LandingFeatures'
import { LandingFooter } from '@/components/landing/LandingFooter'
import { LandingHero } from '@/components/landing/LandingHero'
import { LandingNav } from '@/components/landing/LandingNav'
import { SkipToContent } from '@/components/seo/SkipToContent'
import { LazySection } from '@/components/seo/LazySection'

const LandingDetails = lazy(() =>
  import('@/components/landing/LandingDetails').then((m) => ({
    default: m.LandingDetails,
  })),
)
const LandingTestimonials = lazy(() =>
  import('@/components/landing/LandingTestimonials').then((m) => ({
    default: m.LandingTestimonials,
  })),
)
const LandingAiSearch = lazy(() =>
  import('@/components/landing/LandingAiSearch').then((m) => ({
    default: m.LandingAiSearch,
  })),
)
const LandingContact = lazy(() =>
  import('@/components/landing/LandingContact').then((m) => ({
    default: m.LandingContact,
  })),
)
const InternalLinkHub = lazy(() =>
  import('@/components/seo/InternalLinkHub').then((m) => ({
    default: m.InternalLinkHub,
  })),
)

function SoftFallback({ minHeight }: { minHeight: number }) {
  return (
    <div
      className="w-full animate-pulse bg-surface-100/80"
      style={{ minHeight }}
      aria-hidden
    />
  )
}

/**
 * Public marketing homepage.
 * Above-the-fold hero + features stay eager for LCP; heavier sections lazy-load.
 */
export function LandingPage() {
  return (
    <div className="min-h-screen bg-white text-surface-900">
      <SkipToContent />
      <LandingNav />
      <main id="main-content">
        <LandingHero />
        <LandingFeatures />
        <LazySection minHeight={420}>
          <Suspense fallback={<SoftFallback minHeight={420} />}>
            <LandingDetails />
          </Suspense>
        </LazySection>
        <LazySection minHeight={360}>
          <Suspense fallback={<SoftFallback minHeight={360} />}>
            <LandingTestimonials />
          </Suspense>
        </LazySection>
        <LazySection minHeight={720}>
          <Suspense fallback={<SoftFallback minHeight={720} />}>
            <LandingAiSearch />
          </Suspense>
        </LazySection>
        <LandingFaq />
        <LandingCta />
        <LazySection minHeight={320}>
          <Suspense fallback={<SoftFallback minHeight={320} />}>
            <InternalLinkHub surface="hub" />
          </Suspense>
        </LazySection>
        <LazySection minHeight={280}>
          <Suspense fallback={<SoftFallback minHeight={280} />}>
            <LandingContact />
          </Suspense>
        </LazySection>
      </main>
      <LandingFooter />
    </div>
  )
}
