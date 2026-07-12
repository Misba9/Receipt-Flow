import { InvoiceStatusBadge } from '@/components/dashboard/InvoiceStatusBadge'
import { Card } from '@/components/ui/Card'
import type { InvoiceDetail } from '@/services/invoices/types'
import { PAYMENT_MODE_LABELS } from '@/services/invoices/types'
import { formatCurrency, formatDate } from '@/lib/format'
import { useCompanySettings } from '@/services/settings/hooks'

type InvoiceDocumentProps = {
  invoice: InvoiceDetail
}

export function InvoiceDocument({ invoice }: InvoiceDocumentProps) {
  const { data: company } = useCompanySettings()
  const brand = company?.primaryColor ?? '#1a73f5'

  return (
    <Card className="overflow-hidden p-0">
      <div className="border-b-4 px-4 py-5 sm:px-6 sm:py-6 lg:px-8" style={{ borderColor: brand }}>
        <div className="flex flex-col gap-6 sm:flex-row sm:items-start sm:justify-between">
          <div className="flex min-w-0 items-start gap-3 sm:gap-4">
            {company?.logoUrl ? (
              <img
                src={company.logoUrl}
                alt={company.name}
                className="h-12 w-12 shrink-0 rounded-lg object-contain sm:h-14 sm:w-14"
              />
            ) : null}
            <div className="min-w-0">
              <h2 className="truncate text-lg font-semibold text-surface-900 sm:text-xl dark:text-surface-50">
                {company?.name ?? 'Company'}
              </h2>
              <div className="mt-1 space-y-0.5 text-sm break-words text-surface-500">
                {company?.email ? <p>{company.email}</p> : null}
                {company?.phone ? <p>{company.phone}</p> : null}
                {company?.website ? <p>{company.website}</p> : null}
                {company?.addressLine1 ? <p>{company.addressLine1}</p> : null}
                {company?.addressLine2 ? <p>{company.addressLine2}</p> : null}
                {[company?.city, company?.state, company?.postalCode]
                  .filter(Boolean)
                  .join(', ') ? (
                  <p>
                    {[company?.city, company?.state, company?.postalCode]
                      .filter(Boolean)
                      .join(', ')}
                  </p>
                ) : null}
                {company?.country ? <p>{company.country}</p> : null}
                {company?.taxId ? <p>GST: {company.taxId}</p> : null}
              </div>
            </div>
          </div>

          <div className="text-left sm:shrink-0 sm:text-right">
            <p className="text-2xl font-semibold tracking-tight" style={{ color: brand }}>
              INVOICE
            </p>
            <p className="mt-1 text-sm font-medium break-all text-surface-900 dark:text-surface-50">
              {invoice.invoice_number}
            </p>
            <div className="mt-2 inline-flex">
              <InvoiceStatusBadge status={invoice.status} />
            </div>
          </div>
        </div>
      </div>

      <div className="grid gap-6 border-b border-surface-100 px-4 py-5 sm:grid-cols-2 sm:px-6 sm:py-6 lg:px-8 dark:border-surface-800">
        <div className="min-w-0">
          <p className="text-xs font-semibold uppercase tracking-wide text-surface-400">
            Bill to
          </p>
          <p className="mt-2 font-medium break-words text-surface-900 dark:text-surface-50">
            {invoice.customer?.name ?? '—'}
          </p>
          <div className="mt-1 space-y-0.5 text-sm break-words text-surface-500">
            {invoice.customer?.email ? <p>{invoice.customer.email}</p> : null}
            {invoice.customer?.phone ? <p>{invoice.customer.phone}</p> : null}
            {invoice.customer?.address_line1 ? (
              <p>{invoice.customer.address_line1}</p>
            ) : null}
          </div>
        </div>
        <div className="sm:text-right">
          <dl className="space-y-2 text-sm">
            <div className="flex justify-between gap-4 sm:justify-end">
              <dt className="shrink-0 text-surface-500">Billing date</dt>
              <dd className="font-medium">
                {formatDate(
                  invoice.issue_date,
                  undefined,
                  company?.timezone,
                )}
              </dd>
            </div>
            {invoice.payment_mode ? (
              <div className="flex justify-between gap-4 sm:justify-end">
                <dt className="shrink-0 text-surface-500">Payment mode</dt>
                <dd className="font-medium break-words">
                  {invoice.payment_mode === 'other'
                    ? invoice.payment_mode_other?.trim() || 'Other'
                    : PAYMENT_MODE_LABELS[invoice.payment_mode]}
                </dd>
              </div>
            ) : null}
            {invoice.employee_name ? (
              <div className="flex justify-between gap-4 sm:justify-end">
                <dt className="shrink-0 text-surface-500">Employee</dt>
                <dd className="font-medium break-words">{invoice.employee_name}</dd>
              </div>
            ) : null}
          </dl>
        </div>
      </div>

      {/* Mobile stacked line items */}
      <ul className="divide-y divide-surface-100 lg:hidden dark:divide-surface-800">
        {invoice.items.map((item) => (
          <li key={item.id} className="space-y-2 px-4 py-4 sm:px-6">
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <p className="font-medium break-words text-surface-900 dark:text-surface-50">
                  {item.description}
                </p>
                <p className="mt-0.5 text-sm text-surface-500">
                  {item.product_type || '—'}
                </p>
              </div>
              <p className="shrink-0 font-semibold tabular-nums">
                {formatCurrency(item.amount, invoice.currency)}
              </p>
            </div>
            <div className="flex flex-wrap gap-x-4 gap-y-1 text-sm text-surface-500">
              <span>Qty {item.quantity}</span>
              <span>
                {formatCurrency(item.unit_price, invoice.currency)} each
              </span>
            </div>
          </li>
        ))}
      </ul>

      {/* Desktop table */}
      <div className="hidden overflow-x-auto lg:block">
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="border-b border-surface-100 bg-surface-50 text-xs uppercase tracking-wide text-surface-400 dark:border-surface-800 dark:bg-surface-950">
              <th className="px-6 py-3 font-medium lg:px-8">Product</th>
              <th className="px-4 py-3 font-medium">Type</th>
              <th className="px-4 py-3 text-right font-medium">Qty</th>
              <th className="px-4 py-3 text-right font-medium">Amount</th>
              <th className="px-6 py-3 text-right font-medium lg:px-8">Total</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-surface-100 dark:divide-surface-800">
            {invoice.items.map((item) => (
              <tr key={item.id}>
                <td className="px-6 py-3.5 font-medium text-surface-900 lg:px-8 dark:text-surface-50">
                  {item.description}
                </td>
                <td className="px-4 py-3.5 text-surface-600 dark:text-surface-300">
                  {item.product_type || '—'}
                </td>
                <td className="px-4 py-3.5 text-right text-surface-600 dark:text-surface-300">
                  {item.quantity}
                </td>
                <td className="px-4 py-3.5 text-right text-surface-600 dark:text-surface-300">
                  {formatCurrency(item.unit_price, invoice.currency)}
                </td>
                <td className="px-6 py-3.5 text-right font-medium lg:px-8">
                  {formatCurrency(item.amount, invoice.currency)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="grid gap-6 border-t border-surface-100 px-4 py-5 sm:grid-cols-2 sm:px-6 sm:py-6 lg:px-8 dark:border-surface-800">
        <div className="min-w-0 text-sm text-surface-500">
          {invoice.notes ? (
            <>
              <p className="text-xs font-semibold uppercase tracking-wide text-surface-400">
                Comments
              </p>
              <p className="mt-2 whitespace-pre-wrap break-words text-surface-700 dark:text-surface-300">
                {invoice.notes}
              </p>
            </>
          ) : null}
          {invoice.footer || company?.invoiceFooter ? (
            <p className="mt-4 whitespace-pre-wrap break-words text-xs text-surface-400">
              {invoice.footer || company?.invoiceFooter}
            </p>
          ) : null}
        </div>

        <dl className="w-full space-y-2 text-sm sm:w-64 sm:justify-self-end">
          <div className="flex justify-between gap-4">
            <dt className="text-surface-500">Subtotal</dt>
            <dd className="tabular-nums">{formatCurrency(invoice.subtotal, invoice.currency)}</dd>
          </div>
          <div className="flex justify-between gap-4">
            <dt className="text-surface-500">Discount</dt>
            <dd className="tabular-nums">−{formatCurrency(invoice.discount_amount, invoice.currency)}</dd>
          </div>
          <div className="flex justify-between gap-4">
            <dt className="text-surface-500">Tax ({invoice.tax_rate}%)</dt>
            <dd className="tabular-nums">{formatCurrency(invoice.tax_amount, invoice.currency)}</dd>
          </div>
          <div
            className="flex justify-between gap-4 border-t border-surface-100 pt-3 text-base font-semibold dark:border-surface-800"
            style={{ color: brand }}
          >
            <dt>Total</dt>
            <dd className="tabular-nums">{formatCurrency(invoice.total, invoice.currency)}</dd>
          </div>
        </dl>
      </div>
    </Card>
  )
}
