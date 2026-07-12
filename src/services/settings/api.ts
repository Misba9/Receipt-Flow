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
    // Throws RangeError for invalid IANA zones in modern runtimes
    Intl.DateTimeFormat(undefined, { timeZone: timezone })
  } catch {
    throw new Error('Enter a valid timezone (e.g. Asia/Kolkata).')
  }
  return timezone
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
          'id, name, email, phone, tax_id, address_line1, address_line2, city, state, postal_code, country, logo_url',
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

  return {
    companyId: company.id,
    name: company.name ?? '',
    email: company.email ?? '',
    phone: company.phone ?? '',
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
    currency: settings.default_currency ?? 'USD',
    timezone: settings.timezone ?? 'UTC',
    invoicePrefix: settings.invoice_prefix ?? 'INV-',
    role,
    canEdit: role === 'owner' || role === 'admin',
  }
}

/**
 * Updates the signed-in user's company only.
 * Company id is resolved server-side via RLS / tenant context — never from the client payload.
 */
export async function updateCompanySettings(
  input: CompanySettingsInput,
): Promise<void> {
  const companyId = await getCurrentCompanyId()

  const currency = normalizeCurrency(input.currency)
  const timezone = normalizeTimezone(input.timezone)
  const invoicePrefix = normalizeInvoicePrefix(input.invoicePrefix)

  const [{ error: companyError }, { error: settingsError }] = await Promise.all([
    supabase
      .from('companies')
      .update({
        name: input.name.trim(),
        email: emptyToNull(input.email),
        phone: emptyToNull(input.phone),
        tax_id: emptyToNull(input.taxId),
        address_line1: emptyToNull(input.addressLine1),
        address_line2: emptyToNull(input.addressLine2),
        city: emptyToNull(input.city),
        state: emptyToNull(input.state),
        postal_code: emptyToNull(input.postalCode),
        country: emptyToNull(input.country),
        logo_url: input.logoUrl,
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
