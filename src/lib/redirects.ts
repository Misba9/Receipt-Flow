/**
 * Shared redirect map for React Router and documentation.
 * Vercel permanent redirects live in vercel.json (must stay in sync).
 */
export const MARKETING_REDIRECTS: Array<{
  from: string
  to: string
}> = [
  { from: '/home', to: '/' },
  { from: '/index.html', to: '/' },
  { from: '/signin', to: '/login' },
  { from: '/sign-in', to: '/login' },
  { from: '/signup', to: '/register' },
  { from: '/sign-up', to: '/register' },
  { from: '/pricing.html', to: '/pricing' },
  { from: '/compare', to: '/comparisons' },
  { from: '/comparison', to: '/comparisons' },
  { from: '/sales-reports', to: '/reports' },
  { from: '/gst-billing', to: '/gst-billing-software' },
  { from: '/invoice', to: '/invoice-software' },
  { from: '/billing-software', to: '/features' },
]

export const APP_REDIRECTS: Array<{
  from: string
  to: string
}> = [
  { from: '/app', to: '/dashboard' },
  { from: '/receipts', to: '/invoices' },
]
