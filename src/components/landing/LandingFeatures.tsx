import {
  FileSpreadsheet,
  Mail,
  Search,
  Shield,
  Sparkles,
  BarChart3,
} from 'lucide-react'
import { Link } from 'react-router-dom'
import { paths } from '@/lib/paths'

const features = [
  {
    id: 'online-billing',
    icon: FileSpreadsheet,
    title: 'Online invoice software',
    body: 'Create branded invoices with line items, tax, and discounts — then download a PDF in one click.',
  },
  {
    id: 'gst-billing',
    icon: Mail,
    title: 'GST billing & email PDFs',
    body: 'Apply GST on bills, keep your GSTIN in settings, and email polished invoice PDFs to customers.',
  },
  {
    id: 'customer-management',
    icon: Search,
    title: 'Customer management software',
    body: 'Search customers by name, phone, or email and reuse contacts when you create the next bill.',
  },
  {
    icon: BarChart3,
    title: 'Sales reports for small teams',
    body: 'Daily and monthly charts, top customers, and CSV downloads that keep your books current.',
  },
  {
    icon: Shield,
    title: 'Secure company workspaces',
    body: 'Every business is a private tenant. Row Level Security keeps other companies out of your data.',
  },
  {
    icon: Sparkles,
    title: 'Built for small businesses',
    body: 'Customers, invoices, GST settings, and exports — organized for how growing teams actually bill.',
  },
]

export function LandingFeatures() {
  return (
    <section
      id="features"
      className="relative scroll-mt-20 bg-white py-20 sm:py-28"
      aria-labelledby="features-heading"
    >
      <div
        className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,#eef8ff_0%,transparent_55%)]"
        aria-hidden
      />
      <div className="relative mx-auto max-w-6xl px-4 sm:px-6">
        <header className="max-w-2xl">
          <h2
            id="features-heading"
            className="font-display text-3xl font-semibold tracking-tight text-surface-950 sm:text-4xl"
          >
            Invoice software features for small businesses
          </h2>
          <p className="mt-3 text-base leading-relaxed text-surface-600 sm:text-lg">
            Online billing software that covers invoicing, GST billing, and
            customer management — without juggling spreadsheets or shared
            inboxes.
          </p>
        </header>

        <ul className="mt-14 grid gap-10 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((feature, index) => (
            <li
              key={feature.title}
              id={feature.id}
              className="animate-landing-rise scroll-mt-24"
              style={{ animationDelay: `${index * 60}ms` }}
            >
              <article>
                <feature.icon
                  className="h-5 w-5 text-brand-600"
                  aria-hidden
                />
                <h3 className="mt-4 font-display text-lg font-semibold text-surface-950">
                  {feature.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-surface-600">
                  {feature.body}
                </p>
              </article>
            </li>
          ))}
        </ul>

        <p className="mt-12 text-sm text-surface-600">
          Ready to try it?{' '}
          <Link
            to={paths.register}
            className="font-medium text-brand-700 hover:underline"
          >
            Create your billing workspace
          </Link>{' '}
          or{' '}
          <a href="#details" className="font-medium text-brand-700 hover:underline">
            see how GST billing and customers fit together
          </a>
          .
        </p>
      </div>
    </section>
  )
}
