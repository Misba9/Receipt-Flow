export const paths = {
  home: '/',
  landing: '/',
  dashboard: '/dashboard',
  customers: '/customers',
  invoices: '/invoices',
  invoiceNew: '/invoices/new',
  invoiceDetail: (id: string) => `/invoices/${id}`,
  invoiceEdit: (id: string) => `/invoices/${id}/edit`,
  reports: '/reports',
  receipts: '/receipts',
  settings: '/settings',
  onboarding: '/onboarding',
  admin: '/admin',
  adminCompanies: '/admin/companies',
  adminUsers: '/admin/users',
  companyDisabled: '/company-disabled',
  login: '/login',
  register: '/register',
  forgotPassword: '/forgot-password',
  resetPassword: '/reset-password',
} as const

export type AppPath = string
