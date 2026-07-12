import { Link } from 'react-router-dom'
import { APP_NAME } from '@/utils'
import { paths } from '@/lib/paths'

const footerLinks = [
  { label: 'Features', href: '#features' },
  { label: 'Details', href: '#details' },
  { label: 'FAQ', href: '#faq' },
  { label: 'Contact', href: '#contact' },
]

export function LandingFooter() {
  const year = new Date().getFullYear()

  return (
    <footer className="border-t border-surface-200 bg-surface-950 text-white">
      <div className="mx-auto flex max-w-6xl flex-col gap-8 px-4 py-12 sm:px-6 md:flex-row md:items-start md:justify-between">
        <div>
          <p className="font-display text-lg font-semibold tracking-tight">
            {APP_NAME}
          </p>
          <p className="mt-2 max-w-sm text-sm leading-relaxed text-white/60">
            Multi-tenant invoicing for teams that need clean receipts, secure
            workspaces, and reports they can trust.
          </p>
        </div>

        <nav aria-label="Footer" className="flex flex-wrap gap-x-6 gap-y-2">
          {footerLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="text-sm text-white/70 transition-colors hover:text-white"
            >
              {link.label}
            </a>
          ))}
          <Link
            to={paths.login}
            className="text-sm text-white/70 transition-colors hover:text-white"
          >
            Sign in
          </Link>
        </nav>
      </div>
      <div className="border-t border-white/10">
        <p className="mx-auto max-w-6xl px-4 py-5 text-xs text-white/45 sm:px-6">
          © {year} {APP_NAME}. All rights reserved.
        </p>
      </div>
    </footer>
  )
}
