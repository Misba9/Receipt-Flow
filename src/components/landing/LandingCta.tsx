import { Link } from 'react-router-dom'
import { APP_NAME } from '@/utils'
import { paths } from '@/lib/paths'

export function LandingCta() {
  return (
    <section
      id="get-started"
      className="scroll-mt-20 bg-brand-600 py-16 text-white sm:py-20"
      aria-labelledby="cta-heading"
    >
      <div className="mx-auto flex max-w-6xl flex-col gap-8 px-4 sm:flex-row sm:items-center sm:justify-between sm:px-6">
        <div className="max-w-xl">
          <h2
            id="cta-heading"
            className="font-display text-3xl font-semibold tracking-tight sm:text-4xl"
          >
            Start using billing software built for small businesses
          </h2>
          <p className="mt-3 text-base leading-relaxed text-white/85">
            Set up {APP_NAME} in minutes — invoice software, GST billing, and
            customer management in one secure online workspace.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <Link
            to={paths.register}
            className="inline-flex h-11 items-center justify-center rounded-lg bg-white px-5 text-sm font-semibold text-brand-800 transition-colors hover:bg-brand-50"
          >
            Create free account
          </Link>
          <Link
            to={paths.login}
            className="inline-flex h-11 items-center justify-center rounded-lg border border-white/40 bg-white/10 px-5 text-sm font-medium text-white transition-colors hover:bg-white/15"
          >
            Sign in
          </Link>
          <a
            href="#faq"
            className="inline-flex h-11 items-center justify-center px-2 text-sm font-medium text-white/90 underline-offset-4 hover:underline"
          >
            Read billing FAQ
          </a>
        </div>
      </div>
    </section>
  )
}
