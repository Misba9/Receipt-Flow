export type SubscriptionStatus =
  | 'trial'
  | 'active'
  | 'past_due'
  | 'canceled'
  | 'none'

export const SUBSCRIPTION_STATUSES: SubscriptionStatus[] = [
  'trial',
  'active',
  'past_due',
  'canceled',
  'none',
]

export type PlatformStats = {
  totalCompanies: number
  activeCompanies: number
  disabledCompanies: number
  totalUsers: number
  superAdmins: number
  totalInvoices: number
  totalCustomers: number
  totalRevenue: number
  subscriptions: Record<string, number>
}

export type AdminCompany = {
  id: string
  name: string
  email: string | null
  phone: string | null
  isActive: boolean
  disabledAt: string | null
  disabledReason: string | null
  subscriptionStatus: SubscriptionStatus
  subscriptionPlan: string | null
  subscriptionEndsAt: string | null
  createdAt: string
  userCount: number
  customerCount: number
  invoiceCount: number
  revenue: number
}

export type AdminUser = {
  id: string
  email: string | null
  fullName: string | null
  role: 'owner' | 'admin' | 'member'
  isSuperAdmin: boolean
  companyId: string
  companyName: string
  companyActive: boolean
  createdAt: string
  lastSignInAt: string | null
}

export type SessionAccess = {
  isSuperAdmin: boolean
  companyActive: boolean
  companyId: string | null
  fullName: string | null
}
