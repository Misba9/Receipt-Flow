import { z } from 'zod'

export const LOOKS_GOOD = 'Looks good'

export function countDigits(value: string) {
  return (value.match(/\d/g) ?? []).length
}

/** Coerce form number inputs without turning empty strings into 0. */
export function numberFromInput(requiredMessage: string) {
  return z.preprocess((value) => {
    if (value === '' || value === null || value === undefined) return undefined
    if (typeof value === 'number') return value
    const parsed = Number(value)
    return Number.isFinite(parsed) ? parsed : value
  }, z.number({ error: requiredMessage }))
}

export const optionalEmailSchema = z
  .string()
  .trim()
  .refine(
    (value) => value === '' || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value),
    'Enter a valid email address',
  )

export const requiredEmailSchema = z
  .string()
  .trim()
  .min(1, 'Email is required')
  .email('Enter a valid email address')

/** Digits and optional leading + only; 10–15 digits. */
export const phoneSchema = z
  .string()
  .trim()
  .min(1, 'Phone number is required')
  .regex(/^[+]?\d*$/, 'Only digits and + are allowed')
  .refine((value) => countDigits(value) >= 10, {
    message: 'Phone number must contain at least 10 digits',
  })
  .refine((value) => countDigits(value) <= 15, {
    message: 'Phone number must contain at most 15 digits',
  })

/** @deprecated Prefer phoneSchema */
export const phoneDigitsPlusSchema = phoneSchema

const GST_PATTERN =
  /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/i

export const optionalGstSchema = z
  .string()
  .trim()
  .refine(
    (value) => value === '' || GST_PATTERN.test(value),
    'Enter a valid GST number',
  )

export const optionalUrlSchema = z
  .string()
  .trim()
  .refine((value) => {
    if (!value) return true
    try {
      const withProtocol = /^https?:\/\//i.test(value)
        ? value
        : `https://${value}`
      const url = new URL(withProtocol)
      return Boolean(url.hostname.includes('.'))
    } catch {
      return false
    }
  }, 'Enter a valid URL')

export const optionalMax = (max: number, label = 'This field') =>
  z
    .string()
    .trim()
    .max(max, `${label} must be ${max} characters or less`)

export const strongPasswordSchema = z
  .string()
  .min(1, 'Password is required')
  .min(8, 'Password must be at least 8 characters')
  .refine((value) => /[A-Z]/.test(value), {
    message: 'Include at least one uppercase letter',
  })
  .refine((value) => /[a-z]/.test(value), {
    message: 'Include at least one lowercase letter',
  })
  .refine((value) => /[0-9]/.test(value), {
    message: 'Include at least one number',
  })
