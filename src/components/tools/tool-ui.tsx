import type { ReactNode } from 'react'
import { cn } from '@/utils'

export function ToolField({
  label,
  children,
  className,
}: {
  label: string
  children: ReactNode
  className?: string
}) {
  return (
    <label className={cn('flex flex-col gap-1.5', className)}>
      <span className="text-sm font-medium text-surface-700">{label}</span>
      {children}
    </label>
  )
}

export const toolInputClass =
  'h-10 w-full rounded-lg border border-surface-200 bg-white px-3 text-sm text-surface-900 outline-none transition-colors placeholder:text-surface-400 focus:border-brand-400 focus:ring-2 focus:ring-brand-100'

export const toolSelectClass = toolInputClass

export function ToolResultCard({
  label,
  value,
  emphasize,
}: {
  label: string
  value: string
  emphasize?: boolean
}) {
  return (
    <div
      className={cn(
        'rounded-xl border px-4 py-3',
        emphasize
          ? 'border-brand-200 bg-brand-50'
          : 'border-surface-200 bg-white',
      )}
    >
      <p className="text-xs font-medium tracking-wide text-surface-500 uppercase">
        {label}
      </p>
      <p
        className={cn(
          'mt-1 font-display text-xl font-semibold tabular-nums',
          emphasize ? 'text-brand-800' : 'text-surface-950',
        )}
      >
        {value}
      </p>
    </div>
  )
}

export function ToolPanel({
  title,
  children,
  actions,
}: {
  title: string
  children: ReactNode
  actions?: ReactNode
}) {
  return (
    <div className="rounded-2xl border border-surface-200 bg-white p-5 shadow-sm sm:p-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h2 className="font-display text-lg font-semibold text-surface-950">
          {title}
        </h2>
        {actions}
      </div>
      <div className="mt-5">{children}</div>
    </div>
  )
}

export function parseAmount(value: string): number {
  const n = Number.parseFloat(value.replace(/,/g, ''))
  return Number.isFinite(n) ? n : 0
}

export function formatInr(amount: number): string {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(Number.isFinite(amount) ? amount : 0)
}

export function formatPct(value: number): string {
  if (!Number.isFinite(value)) return '—'
  return `${value.toFixed(2)}%`
}
