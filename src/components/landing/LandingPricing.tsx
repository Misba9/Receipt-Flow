import { Link } from 'react-router-dom'
import { Check } from 'lucide-react'
import { cn } from '@/utils'
import { paths } from '@/lib/paths'

const plans = [
  {
    name: 'Starter',
    price: '$0',
    period: 'during trial',
    description: 'For freelancers proving the workflow.',
    features: [
      '1 company workspace',
      'Unlimited customers',
      'Invoice PDFs',
      'Email sending',
      'Basic reports',
    ],
    cta: 'Start free',
    featured: false,
  },
  {
    name: 'Growth',
    price: '$29',
    period: 'per month',
    description: 'For studios sending invoices every week.',
    features: [
      'Everything in Starter',
      'Excel & CSV exports',
      'Priority email delivery',
      'Custom branding',
      'Sales dashboards',
    ],
    cta: 'Choose Growth',
    featured: true,
  },
  {
    name: 'Business',
    price: '$79',
    period: 'per month',
    description: 'For multi-user companies that need control.',
    features: [
      'Everything in Growth',
      'Team roles',
      'Advanced reports',
      'Dedicated support',
      'Custom onboarding',
    ],
    cta: 'Talk to us',
    featured: false,
  },
]

export function LandingPricing() {
  return (
    <section
      id="pricing"
      className="scroll-mt-20 bg-surface-50 py-20 sm:py-28"
      aria-labelledby="pricing-heading"
    >
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="mx-auto max-w-2xl text-center">
          <h2
            id="pricing-heading"
            className="font-display text-3xl font-semibold tracking-tight text-surface-950 sm:text-4xl"
          >
            Simple pricing that scales with you
          </h2>
          <p className="mt-3 text-base text-surface-600 sm:text-lg">
            Start free. Upgrade when your invoice volume — and your team — grow.
          </p>
        </div>

        <div className="mt-14 grid gap-6 lg:grid-cols-3">
          {plans.map((plan) => (
            <article
              key={plan.name}
              className={cn(
                'flex flex-col rounded-2xl border p-6 sm:p-8',
                plan.featured
                  ? 'border-brand-600 bg-white shadow-lg shadow-brand-600/10'
                  : 'border-surface-200 bg-white',
              )}
            >
              <h3 className="font-display text-xl font-semibold text-surface-950">
                {plan.name}
              </h3>
              <p className="mt-2 text-sm text-surface-600">{plan.description}</p>
              <p className="mt-6 flex items-baseline gap-1">
                <span className="font-display text-4xl font-semibold tracking-tight text-surface-950">
                  {plan.price}
                </span>
                <span className="text-sm text-surface-500">{plan.period}</span>
              </p>
              <ul className="mt-8 flex-1 space-y-3">
                {plan.features.map((feature) => (
                  <li
                    key={feature}
                    className="flex items-start gap-2 text-sm text-surface-700"
                  >
                    <Check
                      className="mt-0.5 h-4 w-4 shrink-0 text-brand-600"
                      aria-hidden
                    />
                    {feature}
                  </li>
                ))}
              </ul>
              <Link
                to={plan.name === 'Business' ? `${paths.landing}#contact` : paths.register}
                className={cn(
                  'mt-8 inline-flex h-11 items-center justify-center rounded-lg text-sm font-semibold transition-colors',
                  plan.featured
                    ? 'bg-brand-600 text-white hover:bg-brand-700'
                    : 'bg-surface-100 text-surface-900 hover:bg-surface-200',
                )}
              >
                {plan.cta}
              </Link>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
