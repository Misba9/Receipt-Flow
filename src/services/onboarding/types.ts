export const BUSINESS_TYPES = [
  'Retail Store',
  'Mobile Shop',
  'Interior Design',
  'Restaurant',
  'Medical',
  'Electronics',
  'Wholesale',
  'Service Business',
  'Other',
] as const

export type BusinessType = (typeof BUSINESS_TYPES)[number]

export const ONBOARDING_STEPS = [
  { id: 1, title: 'Create account', description: 'Your login details' },
  { id: 2, title: 'Company', description: 'Business profile' },
  { id: 3, title: 'Contact', description: 'How customers reach you' },
  { id: 4, title: 'Branding', description: 'Invoices & look' },
  { id: 5, title: 'Verify email', description: 'Confirm your inbox' },
] as const

export type OnboardingDraft = {
  fullName: string
  email: string
  /** True after a successful signUp call for this draft. */
  accountCreated: boolean
  companyName: string
  businessType: string
  taxId: string
  logoUrl: string | null
  companyEmail: string
  phone: string
  website: string
  addressLine1: string
  addressLine2: string
  city: string
  state: string
  country: string
  postalCode: string
  currency: string
  timezone: string
  invoicePrefix: string
  primaryColor: string
  invoiceFooter: string
}

export const emptyOnboardingDraft = (): OnboardingDraft => ({
  fullName: '',
  email: '',
  accountCreated: false,
  companyName: '',
  businessType: '',
  taxId: '',
  logoUrl: null,
  companyEmail: '',
  phone: '',
  website: '',
  addressLine1: '',
  addressLine2: '',
  city: '',
  state: '',
  country: '',
  postalCode: '',
  currency: 'USD',
  timezone: Intl.DateTimeFormat().resolvedOptions().timeZone || 'UTC',
  invoicePrefix: 'INV-',
  primaryColor: '#1a73f5',
  invoiceFooter: 'Thank you for your business.',
})

const DRAFT_KEY = 'receiptflow.onboarding.draft'
const STEP_KEY = 'receiptflow.onboarding.step'

function readStorage(key: string): string | null {
  try {
    return localStorage.getItem(key) ?? sessionStorage.getItem(key)
  } catch {
    return null
  }
}

function writeStorage(key: string, value: string) {
  try {
    localStorage.setItem(key, value)
    sessionStorage.removeItem(key)
  } catch {
    // Ignore quota / private-mode failures; in-memory state still works.
  }
}

function removeStorage(key: string) {
  try {
    localStorage.removeItem(key)
    sessionStorage.removeItem(key)
  } catch {
    // ignore
  }
}

export function loadOnboardingDraft(): OnboardingDraft {
  try {
    const raw = readStorage(DRAFT_KEY)
    if (!raw) return emptyOnboardingDraft()
    return { ...emptyOnboardingDraft(), ...(JSON.parse(raw) as OnboardingDraft) }
  } catch {
    return emptyOnboardingDraft()
  }
}

export function saveOnboardingDraft(draft: OnboardingDraft) {
  writeStorage(DRAFT_KEY, JSON.stringify(draft))
}

export function loadOnboardingStep(): number {
  const raw = readStorage(STEP_KEY)
  const step = Number(raw)
  return Number.isFinite(step) && step >= 1 && step <= 5 ? step : 1
}

export function saveOnboardingStep(step: number) {
  writeStorage(STEP_KEY, String(step))
}

export function clearOnboardingSession() {
  removeStorage(DRAFT_KEY)
  removeStorage(STEP_KEY)
}

export function validateStrongPassword(password: string): string | true {
  if (password.length < 8) return 'Password must be at least 8 characters'
  if (!/[A-Z]/.test(password)) return 'Include at least one uppercase letter'
  if (!/[a-z]/.test(password)) return 'Include at least one lowercase letter'
  if (!/[0-9]/.test(password)) return 'Include at least one number'
  return true
}

/** Optional fields used for profile completion percentage. */
export function getProfileCompletion(settings: {
  logoUrl: string | null
  taxId: string
  website: string
  phone: string
  addressLine1: string
  senderEmail: string
  invoiceFooter: string
}) {
  const checks = [
    Boolean(settings.logoUrl),
    Boolean(settings.taxId.trim()),
    Boolean(settings.website.trim()),
    Boolean(settings.phone.trim()),
    Boolean(settings.addressLine1.trim()),
    Boolean(settings.senderEmail.trim()),
    Boolean(settings.invoiceFooter.trim()),
  ]
  const done = checks.filter(Boolean).length
  const percent = Math.round((done / checks.length) * 100)
  return { percent, done, total: checks.length, isComplete: percent === 100 }
}

export function fileToDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => resolve(String(reader.result))
    reader.onerror = () => reject(new Error('Unable to read logo file.'))
    reader.readAsDataURL(file)
  })
}

export async function dataUrlToFile(dataUrl: string, filename: string): Promise<File> {
  const response = await fetch(dataUrl)
  const blob = await response.blob()
  return new File([blob], filename, { type: blob.type || 'image/png' })
}
