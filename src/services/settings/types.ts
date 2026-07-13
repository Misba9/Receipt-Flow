export type ProfileRole = 'owner' | 'admin' | 'member'

/**
 * Unified per-company settings DTO.
 * Maps to `companies` + `settings` (never exposes Resend API keys).
 */
export type CompanySettings = {
  companyId: string
  /** companies.name — used in subjects and documents */
  name: string
  businessType: string
  description: string
  email: string
  /** companies.sender_name — Resend From display name */
  senderName: string
  /** companies.reply_to — optional Reply-To for invoice emails */
  replyTo: string
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
  senderName: string
  replyTo: string
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

export type CompanyEmailBrandingInput = {
  senderName: string
  replyTo: string
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
