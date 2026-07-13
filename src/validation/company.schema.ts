import { z } from 'zod'
import {
  optionalGstSchema,
  optionalMax,
  optionalUrlSchema,
  phoneSchema,
  requiredEmailSchema,
} from '@/validation/common'

export const companyProfileSchema = z.object({
  name: z.string().trim().min(1, 'Company name is required'),
  businessType: z.string().trim(),
  description: optionalMax(500, 'Description'),
  email: requiredEmailSchema,
  phone: phoneSchema,
  website: optionalUrlSchema,
  taxId: optionalGstSchema,
  addressLine1: optionalMax(200, 'Address'),
  addressLine2: optionalMax(200, 'Address'),
  city: optionalMax(100, 'City'),
  state: optionalMax(100, 'State'),
  postalCode: optionalMax(20, 'Postal code'),
  country: optionalMax(100, 'Country'),
  logoUrl: z.string().nullable(),
})

export const companyLocalizationSchema = z.object({
  currency: z
    .string()
    .trim()
    .toUpperCase()
    .regex(/^[A-Z]{3}$/, 'Currency must be a 3-letter code'),
  timezone: z.string().trim().min(1, 'Timezone is required'),
  invoicePrefix: z
    .string()
    .trim()
    .min(1, 'Invoice prefix is required')
    .max(10, 'Invoice prefix must be 10 characters or less'),
  invoiceFooter: optionalMax(500, 'Invoice footer'),
})

export const companyBrandingSchema = z.object({
  primaryColor: z
    .string()
    .trim()
    .regex(/^#[0-9A-Fa-f]{6}$/, 'Enter a valid hex color (e.g. #1a73f5)'),
})

export type CompanyProfileSchema = z.infer<typeof companyProfileSchema>
export type CompanyLocalizationSchema = z.infer<typeof companyLocalizationSchema>
export type CompanyBrandingSchema = z.infer<typeof companyBrandingSchema>
