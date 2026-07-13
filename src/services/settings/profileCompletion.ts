import type { CompanySettings } from '@/services/settings/types'

export type ProfileFieldCheck = {
  key: string
  label: string
  complete: boolean
}

export type RequiredProfileCompletion = {
  percent: number
  done: number
  total: number
  isComplete: boolean
  fields: ProfileFieldCheck[]
}

export type OptionalProfileReminder = {
  key: string
  label: string
}

function hasText(value: string | null | undefined) {
  return Boolean(value?.trim())
}

/** Required fields that determine workspace readiness. */
export function getRequiredProfileFields(
  company: Pick<
    CompanySettings,
    'name' | 'logoUrl' | 'email' | 'currency' | 'timezone' | 'invoicePrefix'
  >,
): ProfileFieldCheck[] {
  return [
    { key: 'name', label: 'Company Name', complete: hasText(company.name) },
    { key: 'logo', label: 'Company Logo', complete: Boolean(company.logoUrl) },
    { key: 'email', label: 'Company Email', complete: hasText(company.email) },
    {
      key: 'currency',
      label: 'Currency',
      complete: hasText(company.currency),
    },
    {
      key: 'timezone',
      label: 'Timezone',
      complete: hasText(company.timezone),
    },
    {
      key: 'invoicePrefix',
      label: 'Invoice Prefix',
      complete: hasText(company.invoicePrefix),
    },
  ]
}

/**
 * Profile completion from REQUIRED fields only.
 * Optional fields never reduce this percentage.
 */
export function getRequiredProfileCompletion(
  company: Pick<
    CompanySettings,
    'name' | 'logoUrl' | 'email' | 'currency' | 'timezone' | 'invoicePrefix'
  >,
): RequiredProfileCompletion {
  const fields = getRequiredProfileFields(company)
  const total = fields.length
  const done = fields.filter((field) => field.complete).length
  const percent = total === 0 ? 100 : Math.round((done / total) * 100)

  return {
    percent,
    done,
    total,
    isComplete: done === total,
    fields,
  }
}

/** True when all required company fields are filled. */
export function isWorkspaceReady(
  company: Pick<
    CompanySettings,
    'name' | 'logoUrl' | 'email' | 'currency' | 'timezone' | 'invoicePrefix'
  >,
): boolean {
  return getRequiredProfileCompletion(company).isComplete
}

/**
 * Optional improvements for a ready workspace.
 * Informational only — does not affect completion %.
 */
export function getOptionalProfileReminders(
  company: Pick<
    CompanySettings,
    | 'businessType'
    | 'website'
    | 'taxId'
    | 'phone'
    | 'description'
    | 'addressLine1'
    | 'city'
    | 'state'
    | 'postalCode'
    | 'country'
    | 'invoiceFooter'
    | 'primaryColor'
  >,
): OptionalProfileReminder[] {
  const reminders: OptionalProfileReminder[] = []

  if (!hasText(company.taxId)) {
    reminders.push({ key: 'taxId', label: 'Add GST Number' })
  }
  if (!hasText(company.website)) {
    reminders.push({ key: 'website', label: 'Add Website' })
  }
  if (!hasText(company.description)) {
    reminders.push({ key: 'description', label: 'Add Company Description' })
  }
  if (
    !hasText(company.addressLine1) &&
    !hasText(company.city) &&
    !hasText(company.country)
  ) {
    reminders.push({ key: 'address', label: 'Add Address' })
  }
  if (!hasText(company.phone)) {
    reminders.push({ key: 'phone', label: 'Add Phone' })
  }
  if (!hasText(company.businessType)) {
    reminders.push({ key: 'businessType', label: 'Add Business Type' })
  }
  if (!hasText(company.invoiceFooter)) {
    reminders.push({ key: 'invoiceFooter', label: 'Add Invoice Footer' })
  }

  return reminders
}

/**
 * @deprecated Prefer getRequiredProfileCompletion — kept for callers expecting the old name.
 */
export function getProfileCompletion(
  company: Pick<
    CompanySettings,
    'name' | 'logoUrl' | 'email' | 'currency' | 'timezone' | 'invoicePrefix'
  >,
) {
  return getRequiredProfileCompletion(company)
}
