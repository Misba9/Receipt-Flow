import { z } from 'zod'
import {
  optionalEmailSchema,
  optionalGstSchema,
  optionalMax,
  phoneSchema,
} from '@/validation/common'

export const customerSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, 'Customer name is required')
    .min(2, 'Enter at least 2 characters')
    .max(100, 'Customer name must be 100 characters or less'),
  phone: phoneSchema,
  email: optionalEmailSchema,
  company_name: z.string().trim(),
  address: optionalMax(500, 'Address'),
  tax_id: optionalGstSchema,
  notes: optionalMax(2000, 'Notes'),
})

export type CustomerFormSchema = z.infer<typeof customerSchema>
