export type ProfileRole = 'owner' | 'admin' | 'member'

export type CompanySettings = {
  companyId: string
  name: string
  email: string
  phone: string
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
  role: ProfileRole
  canEdit: boolean
}

export type CompanySettingsInput = {
  name: string
  email: string
  phone: string
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
}
