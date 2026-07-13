import { Link } from 'react-router-dom'
import {
  SITE_NAV_COMPANY,
  SITE_NAV_FEATURES,
  SITE_NAV_INDUSTRIES,
  SITE_NAV_LEGAL,
  SITE_NAV_LOCATIONS,
  SITE_NAV_PRIMARY,
} from '@/content/site-nav'
import { APP_NAME } from '@/utils'
import { paths } from '@/lib/paths'

export function LandingFooter() {
  const year = new Date().getFullYear()

  return (
    <footer className="border-t border-surface-200 bg-surface-950 text-white">
      <div className="mx-auto grid max-w-6xl gap-10 px-4 py-12 sm:px-6 md:grid-cols-2 xl:grid-cols-6">
        <div className="xl:col-span-2">
          <p className="font-display text-lg font-semibold tracking-tight">
            {APP_NAME}
          </p>
          <p className="mt-2 max-w-sm text-sm leading-relaxed text-white/70">
            Billing software for small businesses — invoices, GST fields, PDF
            email, customers, and payment tracking in one workspace.
          </p>
          <Link
            to={paths.register}
            className="mt-5 inline-flex text-sm font-semibold text-white hover:underline"
          >
            Get started free →
          </Link>
        </div>

        <nav aria-label="Features" className="flex flex-col gap-2">
          <Link
            to={SITE_NAV_FEATURES.path}
            className="text-xs font-semibold tracking-wide text-white/70 uppercase hover:text-white"
          >
            Features
          </Link>
          {SITE_NAV_FEATURES.children.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              className="text-sm text-white/70 transition-colors hover:text-white"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <nav aria-label="Industries" className="flex flex-col gap-2">
          <Link
            to={SITE_NAV_INDUSTRIES.path}
            className="text-xs font-semibold tracking-wide text-white/70 uppercase hover:text-white"
          >
            Industries
          </Link>
          {SITE_NAV_INDUSTRIES.children.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              className="text-sm text-white/70 transition-colors hover:text-white"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <nav aria-label="Locations" className="flex flex-col gap-2">
          <Link
            to={SITE_NAV_LOCATIONS.path}
            className="text-xs font-semibold tracking-wide text-white/70 uppercase hover:text-white"
          >
            Locations
          </Link>
          {SITE_NAV_LOCATIONS.children.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              className="text-sm text-white/70 transition-colors hover:text-white"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <nav aria-label="Company" className="flex flex-col gap-2">
          <p className="text-xs font-semibold tracking-wide text-white/70 uppercase">
            Company
          </p>
          {SITE_NAV_PRIMARY.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              className="text-sm text-white/70 transition-colors hover:text-white"
            >
              {link.label}
            </Link>
          ))}
          {SITE_NAV_COMPANY.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              className="text-sm text-white/70 transition-colors hover:text-white"
            >
              {link.label}
            </Link>
          ))}
          {SITE_NAV_LEGAL.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              className="text-sm text-white/70 transition-colors hover:text-white"
            >
              {link.label}
            </Link>
          ))}
        </nav>
      </div>
      <div className="border-t border-white/10">
        <div className="mx-auto flex max-w-6xl flex-col gap-2 px-4 py-5 text-xs text-white/70 sm:flex-row sm:items-center sm:justify-between sm:px-6">
          <p>
            © {year} {APP_NAME}. All rights reserved.
          </p>
          <div className="flex flex-wrap gap-4">
            {SITE_NAV_LEGAL.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className="hover:text-white"
              >
                {link.label}
              </Link>
            ))}
            <Link to="/contact" className="hover:text-white">
              Contact
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
