import {
  FileSpreadsheet,
  Mail,
  Search,
  Shield,
  Sparkles,
  BarChart3,
} from 'lucide-react'

const features = [
  {
    icon: FileSpreadsheet,
    title: 'Branded invoices',
    body: 'Logo, colors, and footers that match your company — PDF ready in one click.',
  },
  {
    icon: Mail,
    title: 'Email with PDF',
    body: 'Send polished invoices straight to the customer inbox with the attachment included.',
  },
  {
    icon: Search,
    title: 'Instant search',
    body: 'Find any customer, phone, email, or invoice number without leaving the page.',
  },
  {
    icon: BarChart3,
    title: 'Sales reports',
    body: 'Daily and monthly charts, top customers, and CSV downloads for your books.',
  },
  {
    icon: Shield,
    title: 'Company isolation',
    body: 'Every workspace is a tenant. Row Level Security keeps other companies out.',
  },
  {
    icon: Sparkles,
    title: 'Built for teams',
    body: 'Customers, invoices, settings, and exports — organized for how small teams actually work.',
  },
]

export function LandingFeatures() {
  return (
    <section
      id="features"
      className="relative scroll-mt-20 bg-white py-20 sm:py-28"
      aria-labelledby="features-heading"
    >
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,#eef8ff_0%,transparent_55%)]" aria-hidden />
      <div className="relative mx-auto max-w-6xl px-4 sm:px-6">
        <div className="max-w-2xl">
          <h2
            id="features-heading"
            className="font-display text-3xl font-semibold tracking-tight text-surface-950 sm:text-4xl"
          >
            Everything you need after the sale
          </h2>
          <p className="mt-3 text-base leading-relaxed text-surface-600 sm:text-lg">
            From first draft to paid receipt — without juggling spreadsheets or
            shared inboxes.
          </p>
        </div>

        <ul className="mt-14 grid gap-10 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((feature, index) => (
            <li
              key={feature.title}
              className="animate-landing-rise"
              style={{ animationDelay: `${index * 60}ms` }}
            >
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
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}
