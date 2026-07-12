export function formatCurrency(
  amount: number,
  currency = 'USD',
  locale = 'en-US',
) {
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency,
    maximumFractionDigits: 2,
  }).format(amount)
}

export function formatNumber(value: number, locale = 'en-US') {
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
