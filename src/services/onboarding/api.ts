import {
  markOnboardingComplete,
  updateCompanySettings,
  uploadCompanyLogo,
} from '@/services/settings/api'
import {
  dataUrlToFile,
  type OnboardingDraft,
} from '@/services/onboarding/types'

function toSettingsInput(draft: OnboardingDraft, logoUrl: string | null) {
  const companyEmail = draft.companyEmail.trim() || draft.email.trim()
  const companyName = draft.companyName.trim()

  return {
    name: companyName,
    businessType: draft.businessType.trim(),
    email: companyEmail,
    phone: draft.phone.trim(),
    website: draft.website.trim(),
    taxId: draft.taxId.trim(),
    addressLine1: draft.addressLine1.trim(),
    addressLine2: draft.addressLine2.trim(),
    city: draft.city.trim(),
    state: draft.state.trim(),
    postalCode: draft.postalCode.trim(),
    country: draft.country.trim(),
    logoUrl,
    primaryColor: draft.primaryColor,
    invoiceFooter: draft.invoiceFooter.trim(),
    currency: draft.currency.trim().toUpperCase() || 'USD',
    timezone: draft.timezone.trim() || 'UTC',
    invoicePrefix: draft.invoicePrefix.trim() || 'INV-',
  }
}

async function resolveLogoUrl(logoUrl: string | null): Promise<string | null> {
  if (!logoUrl) return null
  if (!logoUrl.startsWith('data:')) return logoUrl
  const file = await dataUrlToFile(logoUrl, 'logo.png')
  return uploadCompanyLogo(file)
}

/**
 * Saves wizard answers into companies + settings without completing onboarding.
 * Safe to call whenever the user is authenticated.
 */
export async function saveOnboardingProgress(
  draft: OnboardingDraft,
): Promise<string | null> {
  const companyName = draft.companyName.trim()
  if (!companyName) return draft.logoUrl

  const logoUrl = await resolveLogoUrl(draft.logoUrl)
  await updateCompanySettings(toSettingsInput(draft, logoUrl))
  return logoUrl
}

/**
 * Persists wizard answers and marks onboarding done.
 */
export async function finishOnboarding(draft: OnboardingDraft): Promise<void> {
  const companyName = draft.companyName.trim()
  if (!companyName) {
    throw new Error('Company name is required.')
  }

  const logoUrl = await resolveLogoUrl(draft.logoUrl)
  await updateCompanySettings(toSettingsInput(draft, logoUrl))
  await markOnboardingComplete()
}
