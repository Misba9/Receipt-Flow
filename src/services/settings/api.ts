import { supabase } from '@/lib/supabase'
import { getCurrentCompanyId } from '@/lib/tenant'
import type {
  CompanyBrandingInput,
  CompanyEmailBrandingInput,
  CompanyLocalizationInput,
  CompanyProfileInput,
  CompanySettings,
  CompanySettingsInput,
  ProfileRole,
} from '@/services/settings/types'

const LOGO_BUCKET = 'company-logos'
const HEX_PATTERN = /^#[0-9A-Fa-f]{6}$/

function emptyToNull(value: string) {
  const trimmed = value.trim()
  return trimmed.length > 0 ? trimmed : null
}

function normalizeCurrency(value: string) {
  const code = value.trim().toUpperCase()
  if (!/^[A-Z]{3}$/.test(code)) {
    throw new Error('Currency must be a 3-letter ISO code (e.g. INR).')
  }
  return code
}

function normalizeInvoicePrefix(value: string) {
  const prefix = value.trim()
  if (!prefix) {
    throw new Error('Invoice prefix is required.')
  }
  if (prefix.length > 20) {
    throw new Error('Invoice prefix must be 20 characters or less.')
  }
  return prefix
}

function normalizeTimezone(value: string) {
  const timezone = value.trim() || 'Asia/Kolkata'
  try {
    Intl.DateTimeFormat(undefined, { timeZone: timezone })
  } catch {
    throw new Error('Enter a valid timezone (e.g. Asia/Kolkata).')
  }
  return timezone
}

function normalizeOptionalEmail(value: string, label: string) {
  const trimmed = value.trim()
  if (!trimmed) return ''
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmed)) {
    throw new Error(`Enter a valid ${label}.`)
  }
  return trimmed.toLowerCase()
}

function normalizeDescription(value: string) {
  const trimmed = value.trim()
  if (trimmed.length > 500) {
    throw new Error('Company description must be 500 characters or less.')
  }
  return trimmed
}

function normalizePrimaryColor(value: string) {
  const color = value.trim().toLowerCase()
  if (!HEX_PATTERN.test(color)) {
    throw new Error('Use a hex color like #1a73f5.')
  }
  return color
}

export async function fetchCompanySettings(): Promise<CompanySettings> {
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser()

  if (userError) throw userError
  if (!user) throw new Error('You must be signed in to manage company settings.')

  const { data: profile, error: profileError } = await supabase
    .from('profiles')
    .select('company_id, role')
    .eq('id', user.id)
    .maybeSingle()

  if (profileError) throw profileError
  if (!profile?.company_id) {
    throw new Error('Your account is not linked to a company.')
  }

  const companyId = String(profile.company_id)

  const [{ data: company, error: companyError }, { data: settings, error: settingsError }] =
    await Promise.all([
      supabase
        .from('companies')
        .select(
          'id, name, business_type, description, email, sender_name, reply_to, phone, website, tax_id, address_line1, address_line2, city, state, postal_code, country, logo_url, onboarding_completed_at',
        )
        .eq('id', companyId)
        .maybeSingle(),
      supabase
        .from('settings')
        .select(
          'primary_color, invoice_footer, default_currency, timezone, invoice_prefix',
        )
        .eq('company_id', companyId)
        .maybeSingle(),
    ])

  if (companyError) {
    // description column may be missing before migration — retry without it
    if (companyError.message?.includes('description')) {
      const fallback = await supabase
        .from('companies')
        .select(
          'id, name, business_type, email, sender_name, reply_to, phone, website, tax_id, address_line1, address_line2, city, state, postal_code, country, logo_url, onboarding_completed_at',
        )
        .eq('id', companyId)
        .maybeSingle()
      if (fallback.error) throw fallback.error
      if (!fallback.data) throw new Error('Company not found.')
      if (settingsError) throw settingsError
      if (!settings) throw new Error('Company settings not found.')

      const role = profile.role as ProfileRole
      const companyName = fallback.data.name ?? ''
      return {
        companyId: fallback.data.id,
        name: companyName,
        businessType: fallback.data.business_type ?? '',
        description: '',
        email: fallback.data.email ?? '',
        senderName:
          (fallback.data.sender_name as string | null)?.trim() || companyName,
        replyTo: (fallback.data.reply_to as string | null) ?? '',
        phone: fallback.data.phone ?? '',
        website: fallback.data.website ?? '',
        taxId: fallback.data.tax_id ?? '',
        addressLine1: fallback.data.address_line1 ?? '',
        addressLine2: fallback.data.address_line2 ?? '',
        city: fallback.data.city ?? '',
        state: fallback.data.state ?? '',
        postalCode: fallback.data.postal_code ?? '',
        country: fallback.data.country ?? '',
        logoUrl: fallback.data.logo_url,
        primaryColor: settings.primary_color ?? '#1a73f5',
        invoiceFooter: settings.invoice_footer ?? '',
        currency: settings.default_currency ?? 'INR',
        timezone: settings.timezone ?? 'Asia/Kolkata',
        invoicePrefix: settings.invoice_prefix ?? 'INV-',
        onboardingCompletedAt: fallback.data.onboarding_completed_at ?? null,
        role,
        canEdit: role === 'owner' || role === 'admin',
      }
    }
    throw companyError
  }
  if (settingsError) throw settingsError
  if (!company) throw new Error('Company not found.')
  if (!settings) throw new Error('Company settings not found.')

  const role = profile.role as ProfileRole
  const companyName = company.name ?? ''

  return {
    companyId: company.id,
    name: companyName,
    businessType: company.business_type ?? '',
    description: (company.description as string | null) ?? '',
    email: company.email ?? '',
    senderName: (company.sender_name as string | null)?.trim() || companyName,
    replyTo: (company.reply_to as string | null) ?? '',
    phone: company.phone ?? '',
    website: company.website ?? '',
    taxId: company.tax_id ?? '',
    addressLine1: company.address_line1 ?? '',
    addressLine2: company.address_line2 ?? '',
    city: company.city ?? '',
    state: company.state ?? '',
    postalCode: company.postal_code ?? '',
    country: company.country ?? '',
    logoUrl: company.logo_url,
    primaryColor: settings.primary_color ?? '#1a73f5',
    invoiceFooter: settings.invoice_footer ?? '',
    currency: settings.default_currency ?? 'INR',
    timezone: settings.timezone ?? 'Asia/Kolkata',
    invoicePrefix: settings.invoice_prefix ?? 'INV-',
    onboardingCompletedAt: company.onboarding_completed_at ?? null,
    role,
    canEdit: role === 'owner' || role === 'admin',
  }
}

/**
 * Full settings update (onboarding). Prefer section-specific saves in Settings UI.
 */
export async function updateCompanySettings(
  input: CompanySettingsInput,
): Promise<void> {
  await Promise.all([
    updateCompanyProfile({
      name: input.name,
      businessType: input.businessType,
      description: input.description,
      email: input.email,
      phone: input.phone,
      website: input.website,
      taxId: input.taxId,
      addressLine1: input.addressLine1,
      addressLine2: input.addressLine2,
      city: input.city,
      state: input.state,
      postalCode: input.postalCode,
      country: input.country,
      logoUrl: input.logoUrl,
    }),
    updateCompanyEmailBranding({
      senderName: input.senderName,
      replyTo: input.replyTo,
    }),
    updateCompanyLocalization({
      currency: input.currency,
      timezone: input.timezone,
      invoicePrefix: input.invoicePrefix,
      invoiceFooter: input.invoiceFooter,
    }),
    updateCompanyBranding({ primaryColor: input.primaryColor }),
  ])
}

export async function updateCompanyProfile(
  input: CompanyProfileInput,
): Promise<void> {
  const companyId = await getCurrentCompanyId()
  const companyName = input.name.trim()
  if (!companyName) throw new Error('Company name is required.')

  const companyEmail = normalizeOptionalEmail(input.email, 'company email')
  const description = normalizeDescription(input.description)

  const { error } = await supabase
    .from('companies')
    .update({
      name: companyName,
      business_type: emptyToNull(input.businessType),
      description: emptyToNull(description),
      email: emptyToNull(companyEmail),
      phone: emptyToNull(input.phone),
      website: emptyToNull(input.website),
      tax_id: emptyToNull(input.taxId),
      address_line1: emptyToNull(input.addressLine1),
      address_line2: emptyToNull(input.addressLine2),
      city: emptyToNull(input.city),
      state: emptyToNull(input.state),
      postal_code: emptyToNull(input.postalCode),
      country: emptyToNull(input.country),
      logo_url: input.logoUrl,
    })
    .eq('id', companyId)

  if (error) {
    if (error.message?.includes('description')) {
      const { error: retryError } = await supabase
        .from('companies')
        .update({
          name: companyName,
          business_type: emptyToNull(input.businessType),
          email: emptyToNull(companyEmail),
          phone: emptyToNull(input.phone),
          website: emptyToNull(input.website),
          tax_id: emptyToNull(input.taxId),
          address_line1: emptyToNull(input.addressLine1),
          address_line2: emptyToNull(input.addressLine2),
          city: emptyToNull(input.city),
          state: emptyToNull(input.state),
          postal_code: emptyToNull(input.postalCode),
          country: emptyToNull(input.country),
          logo_url: input.logoUrl,
        })
        .eq('id', companyId)
      if (retryError) throw retryError
      return
    }
    throw error
  }
}

export async function updateCompanyEmailBranding(
  input: CompanyEmailBrandingInput,
): Promise<void> {
  const companyId = await getCurrentCompanyId()
  const senderName = input.senderName.trim()
  if (!senderName) throw new Error('Sender name is required.')
  const replyTo = normalizeOptionalEmail(input.replyTo, 'reply-to email')

  const { error } = await supabase
    .from('companies')
    .update({
      sender_name: senderName,
      reply_to: emptyToNull(replyTo),
    })
    .eq('id', companyId)

  if (error) throw error
}

export async function updateCompanyLocalization(
  input: CompanyLocalizationInput,
): Promise<void> {
  const companyId = await getCurrentCompanyId()
  const currency = normalizeCurrency(input.currency)
  const timezone = normalizeTimezone(input.timezone)
  const invoicePrefix = normalizeInvoicePrefix(input.invoicePrefix)

  const { error } = await supabase
    .from('settings')
    .update({
      invoice_footer: emptyToNull(input.invoiceFooter),
      default_currency: currency,
      timezone,
      invoice_prefix: invoicePrefix,
    })
    .eq('company_id', companyId)

  if (error) throw error
}

export async function updateCompanyBranding(
  input: CompanyBrandingInput,
): Promise<void> {
  const companyId = await getCurrentCompanyId()
  const primaryColor = normalizePrimaryColor(input.primaryColor)

  const { error } = await supabase
    .from('settings')
    .update({ primary_color: primaryColor })
    .eq('company_id', companyId)

  if (error) throw error
}

export async function markOnboardingComplete(): Promise<void> {
  const companyId = await getCurrentCompanyId()
  const { error } = await supabase
    .from('companies')
    .update({ onboarding_completed_at: new Date().toISOString() })
    .eq('id', companyId)

  if (error) throw error
}

export async function uploadCompanyLogo(file: File): Promise<string> {
  const companyId = await getCurrentCompanyId()
  const extension = file.name.split('.').pop()?.toLowerCase() || 'png'
  const path = `${companyId}/logo.${extension}`

  const { error: uploadError } = await supabase.storage
    .from(LOGO_BUCKET)
    .upload(path, file, {
      upsert: true,
      contentType: file.type,
      cacheControl: '3600',
    })

  if (uploadError) throw uploadError

  const { data } = supabase.storage.from(LOGO_BUCKET).getPublicUrl(path)
  return `${data.publicUrl}?v=${Date.now()}`
}

export async function removeCompanyLogo(logoUrl: string | null): Promise<void> {
  if (!logoUrl) return

  const companyId = await getCurrentCompanyId()
  const { data: files } = await supabase.storage.from(LOGO_BUCKET).list(companyId)

  const names = (files ?? [])
    .filter((file) => file.name.startsWith('logo'))
    .map((file) => `${companyId}/${file.name}`)

  if (names.length === 0) {
    await supabase.storage.from(LOGO_BUCKET).remove([`${companyId}/logo`])
    return
  }

  const { error } = await supabase.storage.from(LOGO_BUCKET).remove(names)
  if (error) throw error
}
