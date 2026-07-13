/** Locale used for full Indian-style grouping (e.g. ₹3,45,701.00). */
const INDIAN_LOCALE = 'en-IN'

function resolveLocale(currency: string, locale?: string) {
  if (locale) return locale
  return currency.toUpperCase() === 'INR' ? INDIAN_LOCALE : 'en-US'
}

/** Currency symbol / prefix for compact labels (₹, $, …). */
export function getCurrencySymbol(currency = 'INR'): string {
  try {
    const parts = new Intl.NumberFormat(INDIAN_LOCALE, {
      style: 'currency',
      currency: currency.toUpperCase(),
      currencyDisplay: 'narrowSymbol',
    }).formatToParts(0)
    return parts.find((part) => part.type === 'currency')?.value ?? `${currency} `
  } catch {
    return `${currency} `
  }
}

/**
 * Full currency for invoices, tables, PDFs, emails, and detail views.
 * INR uses Indian digit grouping.
 */
export function formatCurrency(
  amount: number,
  currency = 'INR',
  locale?: string,
) {
  const value = Number(amount)
  const safe = Number.isFinite(value) ? value : 0

  try {
    return new Intl.NumberFormat(resolveLocale(currency, locale), {
      style: 'currency',
      currency: currency.toUpperCase(),
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(safe)
  } catch {
    return `${getCurrencySymbol(currency)}${safe.toFixed(2)}`
  }
}

/**
 * Trim trailing zeros: 3 → "3", 3.5 → "3.5", 2.35 → "2.35", 2.50 → "2.5"
 */
function formatCompactMagnitude(value: number, maxFractionDigits = 2): string {
  if (!Number.isFinite(value)) return '0'

  const factor = 10 ** maxFractionDigits
  const rounded = Math.round((value + Number.EPSILON) * factor) / factor

  if (Object.is(rounded, -0) || rounded === 0) return '0'
  if (Number.isInteger(rounded)) return String(rounded)

  return rounded
    .toFixed(maxFractionDigits)
    .replace(/(\.\d*?[1-9])0+$/, '$1')
    .replace(/\.0+$/, '')
}

/**
 * Compact Indian numbering for dashboard / summary statistic cards only.
 *
 *  ₹999 · ₹3K · ₹3.5K · ₹13K · ₹2.5L · ₹10L · ₹1Cr · ₹2.35Cr
 */
export function formatCompactCurrency(
  amount: number,
  currency = 'INR',
): string {
  const value = Number(amount)
  const safe = Number.isFinite(value) ? value : 0
  const sign = safe < 0 ? '-' : ''
  const abs = Math.abs(safe)
  const symbol = getCurrencySymbol(currency)

  if (abs < 1_000) {
    const whole = Math.abs(abs - Math.round(abs)) < 1e-9
    const body = whole ? String(Math.round(abs)) : formatCompactMagnitude(abs, 2)
    return `${sign}${symbol}${body}`
  }

  if (abs < 100_000) {
    return `${sign}${symbol}${formatCompactMagnitude(abs / 1_000)}K`
  }

  if (abs < 10_000_000) {
    return `${sign}${symbol}${formatCompactMagnitude(abs / 100_000)}L`
  }

  return `${sign}${symbol}${formatCompactMagnitude(abs / 10_000_000)}Cr`
}

export function formatNumber(value: number, locale = INDIAN_LOCALE) {
  return new Intl.NumberFormat(locale).format(value)
}

function toDate(value: string | Date) {
  if (value instanceof Date) return value
  // Date-only values: noon UTC avoids off-by-one when formatting in a timezone
  if (/^\d{4}-\d{2}-\d{2}$/.test(value)) {
    const [year, month, day] = value.split('-').map(Number)
    return new Date(Date.UTC(year, month - 1, day, 12, 0, 0))
  }
  return new Date(value)
}

export function formatDate(
  value: string | Date,
  options: Intl.DateTimeFormatOptions = {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  },
  timeZone?: string,
) {
  const date = toDate(value)
  if (Number.isNaN(date.getTime())) return '—'

  const formatOptions: Intl.DateTimeFormatOptions = timeZone
    ? { ...options, timeZone }
    : options

  try {
    return new Intl.DateTimeFormat('en-US', formatOptions).format(date)
  } catch {
    return new Intl.DateTimeFormat('en-US', options).format(date)
  }
}

export function getInitials(name: string, fallback = '?') {
  const parts = name.trim().split(/\s+/).filter(Boolean)
  if (parts.length === 0) return fallback
  return parts
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? '')
    .join('')
}
