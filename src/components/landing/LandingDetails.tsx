import {
  Building2,
  FileText,
  Lock,
  Settings,
  Users,
  Workflow,
} from 'lucide-react'
import { APP_NAME } from '@/utils'

const modules = [
  {
    icon: Users,
    title: 'Customers',
    body: 'Store contacts, phones, emails, and notes. Search and reuse them when you create bills.',
  },
  {
    icon: FileText,
    title: 'Invoices & PDFs',
    body: 'Build line-item invoices, generate branded PDFs, email them to customers, and track status.',
  },
  {
    icon: Workflow,
    title: 'Dashboard & reports',
    body: 'See today’s sales, recent invoices, revenue trends, top customers, and CSV/Excel exports.',
  },
  {
    icon: Settings,
    title: 'Company settings',
    body: 'Logo, brand color, GST, address, currency, timezone, and invoice footer — applied to every PDF.',
  },
  {
    icon: Building2,
    title: 'Multi-tenant workspaces',
    body: 'Each company is isolated. Users only see their workspace data, enforced with Row Level Security.',
  },
  {
    icon: Lock,
    title: 'Roles & super admin',
    body: 'Tenant users manage their company. Platform super admins can oversee companies and accounts.',
  },
]

const stack = [
  'React + Vite + TypeScript',
  'Tailwind CSS',
  'Supabase Auth & Postgres',
  'Row Level Security',
  'TanStack Query',
  'Recharts · ExcelJS · pdf-lib',
]

const workflow = [
  {
    step: '01',
    title: 'Set up your company',
    body: 'Add branding, contact details, and invoice defaults during onboarding.',
  },
  {
    step: '02',
    title: 'Add customers',
    body: 'Keep a searchable customer book ready for the next bill.',
  },
  {
    step: '03',
    title: 'Create & send invoices',
    body: 'Add products, tax, and discount — then download PDF or email the customer.',
  },
  {
    step: '04',
    title: 'Track & export',
    body: 'Monitor payments on the dashboard and export sales data when you need it.',
  },
]

export function LandingDetails() {
  return (
    <section
      id="details"
      className="scroll-mt-20 bg-surface-50 py-20 sm:py-28"
      aria-labelledby="details-heading"
    >
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="max-w-2xl">
          <h2
            id="details-heading"
            className="font-display text-3xl font-semibold tracking-tight text-surface-950 sm:text-4xl"
          >
            What {APP_NAME} includes
          </h2>
          <p className="mt-3 text-base leading-relaxed text-surface-600 sm:text-lg">
            A multi-tenant invoicing workspace for small businesses and teams —
            customers, branded receipts, email delivery, reports, and secure
            company isolation in one app.
          </p>
        </div>

        <ul className="mt-14 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {modules.map((item) => (
            <li key={item.title} className="min-w-0">
              <item.icon className="h-5 w-5 text-brand-600" aria-hidden />
              <h3 className="mt-4 font-display text-lg font-semibold text-surface-950">
                {item.title}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-surface-600">
                {item.body}
              </p>
            </li>
          ))}
        </ul>

        <div className="mt-16 grid gap-10 border-t border-surface-200 pt-16 lg:grid-cols-2">
          <div>
            <h3 className="font-display text-xl font-semibold text-surface-950">
              How it works
            </h3>
            <ol className="mt-6 space-y-5">
              {workflow.map((item) => (
                <li key={item.step} className="flex gap-4">
                  <span className="font-display text-sm font-semibold tabular-nums text-brand-600">
                    {item.step}
                  </span>
                  <div className="min-w-0">
                    <p className="font-medium text-surface-900">{item.title}</p>
                    <p className="mt-1 text-sm leading-relaxed text-surface-600">
                      {item.body}
                    </p>
                  </div>
                </li>
              ))}
            </ol>
          </div>

          <div>
            <h3 className="font-display text-xl font-semibold text-surface-950">
              Built with
            </h3>
            <p className="mt-3 text-sm leading-relaxed text-surface-600">
              Modern web stack with auth, database, and storage on Supabase —
              designed so each company stays private by default.
            </p>
            <ul className="mt-6 flex flex-wrap gap-2">
              {stack.map((label) => (
                <li
                  key={label}
                  className="rounded-lg border border-surface-200 bg-white px-3 py-1.5 text-sm text-surface-700"
                >
                  {label}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  )
}
