export type ProfileRole = 'owner' | 'admin' | 'member'

/**
 * Unified per-company settings DTO.
 * Maps to `companies` + `settings` (never exposes Resend API keys).
 */
export type CompanySettings = {
  companyId: string
  /** companies.name */
  name: string
  businessType: string
  email: string
  phone: string
  website: string
  taxId: string
  addressLine1: string
  addressLine2: string
  city: string
  state: string
  postalCode: string
  country: string
  logoUrl: string | null
  senderName: string
  senderEmail: string
  replyTo: string
  primaryColor: string
  invoiceFooter: string
  currency: string
  timezone: string
  invoicePrefix: string
  onboardingCompletedAt: string | null
  role: ProfileRole
  canEdit: boolean
}

export type CompanySettingsInput = {
  name: string
  businessType: string
  email: string
  phone: string
  website: string
  taxId: string
  addressLine1: string
  addressLine2: string
  city: string
  state: string
  postalCode: string
  country: string
  logoUrl: string | null
  senderName: string
  senderEmail: string
  replyTo: string
  primaryColor: string
  invoiceFooter: string
  currency: string
  timezone: string
  invoicePrefix: string
}
