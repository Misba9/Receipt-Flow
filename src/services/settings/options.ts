/** Common ISO 4217 currencies for company invoicing (India-first). */
export const CURRENCY_OPTIONS = [
  { value: 'INR', label: 'INR — Indian Rupee' },
  { value: 'USD', label: 'USD — US Dollar' },
  { value: 'EUR', label: 'EUR — Euro' },
  { value: 'GBP', label: 'GBP — British Pound' },
  { value: 'AED', label: 'AED — UAE Dirham' },
  { value: 'AUD', label: 'AUD — Australian Dollar' },
  { value: 'CAD', label: 'CAD — Canadian Dollar' },
  { value: 'SGD', label: 'SGD — Singapore Dollar' },
  { value: 'JPY', label: 'JPY — Japanese Yen' },
  { value: 'CNY', label: 'CNY — Chinese Yuan' },
  { value: 'CHF', label: 'CHF — Swiss Franc' },
  { value: 'NZD', label: 'NZD — New Zealand Dollar' },
  { value: 'SAR', label: 'SAR — Saudi Riyal' },
  { value: 'PKR', label: 'PKR — Pakistani Rupee' },
  { value: 'BDT', label: 'BDT — Bangladeshi Taka' },
] as const

/** Common IANA timezones for company settings (India-first). */
export const TIMEZONE_OPTIONS = [
  { value: 'Asia/Kolkata', label: 'Asia/Kolkata (India)' },
  { value: 'UTC', label: 'UTC' },
  { value: 'America/New_York', label: 'America/New_York (Eastern)' },
  { value: 'America/Chicago', label: 'America/Chicago (Central)' },
  { value: 'America/Denver', label: 'America/Denver (Mountain)' },
  { value: 'America/Los_Angeles', label: 'America/Los_Angeles (Pacific)' },
  { value: 'America/Toronto', label: 'America/Toronto' },
  { value: 'Europe/London', label: 'Europe/London' },
  { value: 'Europe/Paris', label: 'Europe/Paris' },
  { value: 'Europe/Berlin', label: 'Europe/Berlin' },
  { value: 'Asia/Dubai', label: 'Asia/Dubai' },
  { value: 'Asia/Karachi', label: 'Asia/Karachi' },
  { value: 'Asia/Dhaka', label: 'Asia/Dhaka' },
  { value: 'Asia/Singapore', label: 'Asia/Singapore' },
  { value: 'Asia/Tokyo', label: 'Asia/Tokyo' },
  { value: 'Asia/Shanghai', label: 'Asia/Shanghai' },
  { value: 'Asia/Hong_Kong', label: 'Asia/Hong_Kong' },
  { value: 'Australia/Sydney', label: 'Australia/Sydney' },
  { value: 'Pacific/Auckland', label: 'Pacific/Auckland' },
] as const

export function ensureCurrencyOption(currency: string) {
  const code = currency.trim().toUpperCase() || 'INR'
  if (CURRENCY_OPTIONS.some((option) => option.value === code)) {
    return CURRENCY_OPTIONS.map((option) => ({ ...option }))
  }
  return [
    { value: code, label: `${code} — Custom` },
    ...CURRENCY_OPTIONS.map((option) => ({ ...option })),
  ]
}

export function ensureTimezoneOption(timezone: string) {
  const value = timezone.trim() || 'Asia/Kolkata'
  if (TIMEZONE_OPTIONS.some((option) => option.value === value)) {
    return TIMEZONE_OPTIONS.map((option) => ({ ...option }))
  }
  return [
    { value, label: `${value} — Custom` },
    ...TIMEZONE_OPTIONS.map((option) => ({ ...option })),
  ]
}
