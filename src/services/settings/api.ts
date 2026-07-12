import { supabase } from '@/lib/supabase'
import { getCurrentCompanyId } from '@/lib/tenant'
import type {
  CompanySettings,
  CompanySettingsInput,
  ProfileRole,
} from '@/services/settings/types'

const LOGO_BUCKET = 'company-logos'

function emptyToNull(value: string) {
  const trimmed = value.trim()
  return trimmed.length > 0 ? trimmed : null
}

function normalizeCurrency(value: string) {
  const code = value.trim().toUpperCase()
  if (!/^[A-Z]{3}$/.test(code)) {
    throw new Error('Currency must be a 3-letter ISO code (e.g. USD).')
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
  const timezone = value.trim() || 'UTC'
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
          'id, name, business_type, email, phone, website, tax_id, address_line1, address_line2, city, state, postal_code, country, logo_url, sender_name, sender_email, reply_to, onboarding_completed_at',
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

  if (companyError) throw companyError
  if (settingsError) throw settingsError
  if (!company) throw new Error('Company not found.')
  if (!settings) throw new Error('Company settings not found.')

  const role = profile.role as ProfileRole
  const companyEmail = company.email ?? ''

  return {
    companyId: company.id,
    name: company.name ?? '',
    businessType: company.business_type ?? '',
    email: companyEmail,
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
    senderName: company.sender_name ?? company.name ?? '',
    senderEmail: company.sender_email ?? companyEmail,
    replyTo: company.reply_to ?? companyEmail,
    primaryColor: settings.primary_color ?? '#1a73f5',
    invoiceFooter: settings.invoice_footer ?? '',
    currency: settings.default_currency ?? 'USD',
    timezone: settings.timezone ?? 'UTC',
    invoicePrefix: settings.invoice_prefix ?? 'INV-',
    onboardingCompletedAt: company.onboarding_completed_at ?? null,
    role,
    canEdit: role === 'owner' || role === 'admin',
  }
}

/**
 * Updates the signed-in user's company only (RLS + tenant context).
 * Never accepts a client-supplied company id or Resend API keys.
 */
export async function updateCompanySettings(
  input: CompanySettingsInput,
): Promise<void> {
  const companyId = await getCurrentCompanyId()

  const currency = normalizeCurrency(input.currency)
  const timezone = normalizeTimezone(input.timezone)
  const invoicePrefix = normalizeInvoicePrefix(input.invoicePrefix)
  const senderEmail = normalizeOptionalEmail(input.senderEmail, 'sender email')
  const replyTo = normalizeOptionalEmail(input.replyTo, 'reply-to email')
  const companyEmail = normalizeOptionalEmail(input.email, 'company email')

  if (!input.name.trim()) {
    throw new Error('Company name is required.')
  }
  if (!input.senderName.trim()) {
    throw new Error('Sender name is required.')
  }
  if (!senderEmail) {
    throw new Error('Sender email is required for invoice delivery.')
  }

  const [{ error: companyError }, { error: settingsError }] = await Promise.all([
    supabase
      .from('companies')
      .update({
        name: input.name.trim(),
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
        sender_name: input.senderName.trim(),
        sender_email: senderEmail,
        reply_to: emptyToNull(replyTo),
      })
      .eq('id', companyId),
    supabase
      .from('settings')
      .update({
        primary_color: input.primaryColor,
        invoice_footer: emptyToNull(input.invoiceFooter),
        default_currency: currency,
        timezone,
        invoice_prefix: invoicePrefix,
      })
      .eq('company_id', companyId),
  ])

  if (companyError) throw companyError
  if (settingsError) throw settingsError
}

/** Marks workspace onboarding as finished for the current company. */
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
