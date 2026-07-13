export type ProfileRole = 'owner' | 'admin' | 'member'

/**
 * Unified per-company settings DTO.
 * Maps to `companies` + `settings` (never exposes Resend API keys).
 * Invoice From uses company name + the platform EMAIL_FROM mailbox.
 * Reply-To uses company email when set.
 */
export type CompanySettings = {
  companyId: string
  /** companies.name — used in subjects, documents, and email From display name */
  name: string
  businessType: string
  description: string
  /** companies.email — also used as invoice Reply-To when set */
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
  primaryColor: string
  invoiceFooter: string
  currency: string
  timezone: string
  invoicePrefix: string
  onboardingCompletedAt: string | null
  role: ProfileRole
  canEdit: boolean
}

/** Full settings payload (onboarding / legacy full save). */
export type CompanySettingsInput = {
  name: string
  businessType: string
  description: string
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
  primaryColor: string
  invoiceFooter: string
  currency: string
  timezone: string
  invoicePrefix: string
}

export type CompanyProfileInput = {
  name: string
  businessType: string
  description: string
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
}

export type CompanyLocalizationInput = {
  currency: string
  timezone: string
  invoicePrefix: string
  invoiceFooter: string
}

export type CompanyBrandingInput = {
  primaryColor: string
}
