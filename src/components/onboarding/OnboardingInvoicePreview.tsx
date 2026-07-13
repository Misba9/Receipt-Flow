import type { OnboardingDraft } from '@/services/onboarding'
import { formatCurrency } from '@/lib/format'

type OnboardingInvoicePreviewProps = {
  draft: OnboardingDraft
}

export function OnboardingInvoicePreview({ draft }: OnboardingInvoicePreviewProps) {
  const brand = draft.primaryColor || '#1a73f5'
  const company = draft.companyName.trim() || 'Your company'
  const prefix = draft.invoicePrefix.trim() || 'INV-'

  return (
    <div className="overflow-hidden rounded-2xl border border-surface-200 bg-white shadow-sm dark:border-surface-800 dark:bg-surface-900">
      <div className="h-1.5" style={{ backgroundColor: brand }} />
      <div className="space-y-5 p-5">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-3">
            {draft.logoUrl ? (
              <img
                src={draft.logoUrl}
                alt={`${company} logo`}
                width={40}
                height={40}
                loading="lazy"
                decoding="async"
                className="h-10 w-10 rounded-lg object-contain"
              />
            ) : (
              <div
                className="flex h-10 w-10 items-center justify-center rounded-lg text-sm font-bold text-white"
                style={{ backgroundColor: brand }}
              >
                {company.slice(0, 1).toUpperCase()}
              </div>
            )}
            <div>
              <p className="font-semibold text-surface-900 dark:text-surface-50">
                {company}
              </p>
              <p className="text-xs text-surface-500">
                {[draft.city, draft.country].filter(Boolean).join(', ') ||
                  'Address on invoice'}
              </p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-xs font-semibold uppercase tracking-wide text-surface-400">
              Invoice
            </p>
            <p className="font-medium" style={{ color: brand }}>
              {prefix}0001
            </p>
          </div>
        </div>

        <div className="rounded-xl bg-surface-50 p-3 text-sm dark:bg-surface-950">
          <div className="flex justify-between gap-4">
            <span className="text-surface-500">Sample line</span>
            <span className="font-medium">
              {formatCurrency(120, draft.currency || 'USD')}
            </span>
          </div>
          <div className="mt-2 flex justify-between gap-4 border-t border-surface-200 pt-2 dark:border-surface-800">
            <span className="font-semibold">Total</span>
            <span className="font-semibold" style={{ color: brand }}>
              {formatCurrency(120, draft.currency || 'USD')}
            </span>
          </div>
        </div>

        {draft.invoiceFooter ? (
          <p className="text-xs leading-relaxed text-surface-400">
            {draft.invoiceFooter}
          </p>
        ) : null}
      </div>
    </div>
  )
}
