import { Link } from 'react-router-dom'
import { LandingFooter } from '@/components/landing/LandingFooter'
import { LandingNav } from '@/components/landing/LandingNav'
import type { ReactNode } from 'react'

export function BlogShell({
  children,
  hero,
}: {
  children: ReactNode
  hero?: ReactNode
}) {
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
        {hero}
        {children}
      </main>
      <LandingFooter />
    </div>
  )
}

export function BlogPageHero({
  eyebrow,
  title,
  support,
}: {
  eyebrow: string
  title: string
  support: string
}) {
  return (
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
        <p className="mt-6 text-sm text-white/55">
          <Link to="/blog" className="underline-offset-2 hover:underline">
            Browse all articles
          </Link>
        </p>
      </div>
    </section>
  )
}
