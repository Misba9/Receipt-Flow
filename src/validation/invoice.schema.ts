import { z } from 'zod'
import {
  numberFromInput,
  optionalEmailSchema,
  optionalGstSchema,
  optionalMax,
  phoneSchema,
} from '@/validation/common'
import { INVOICE_STATUSES, PAYMENT_MODES } from '@/services/invoices/types'

const statusTuple = INVOICE_STATUSES as [
  (typeof INVOICE_STATUSES)[number],
  ...(typeof INVOICE_STATUSES)[number][],
]
const paymentTuple = PAYMENT_MODES as [
  (typeof PAYMENT_MODES)[number],
  ...(typeof PAYMENT_MODES)[number][],
]

const invoiceItemSchema = z.object({
  description: z.string().trim().min(1, 'Product description is required'),
  product_type: z.string().trim().min(1, 'Product type is required'),
  quantity: numberFromInput('Quantity is required').refine(
    (value) => value > 0,
    'Quantity must be greater than 0',
  ),
  unit_price: numberFromInput('Price is required').refine(
    (value) => value > 0,
    'Price must be greater than 0',
  ),
})

function refineInvoiceTotals(
  values: {
    payment_mode: string
    payment_mode_other: string
    discount_amount: number
    issue_date: string
    due_date: string
    items: Array<{ quantity: unknown; unit_price: unknown }>
  },
  ctx: z.RefinementCtx,
) {
  if (values.payment_mode === 'other' && !values.payment_mode_other.trim()) {
    ctx.addIssue({
      code: 'custom',
      path: ['payment_mode_other'],
      message: 'Describe the payment mode',
    })
  }

  if (values.due_date && values.issue_date && values.due_date < values.issue_date) {
    ctx.addIssue({
      code: 'custom',
      path: ['due_date'],
      message: 'Due date cannot be before invoice date',
    })
  }

  const subtotal = values.items.reduce((sum, item) => {
    const qty = Number(item.quantity) || 0
    const price = Number(item.unit_price) || 0
    return sum + qty * price
  }, 0)

  if (values.discount_amount > subtotal) {
    ctx.addIssue({
      code: 'custom',
      path: ['discount_amount'],
      message: 'Discount cannot exceed subtotal',
    })
  }
}

export const invoiceCreateSchema = z
  .object({
    customer_name: z
      .string()
      .trim()
      .min(1, 'Customer name is required')
      .min(2, 'Enter at least 2 characters')
      .max(100, 'Customer name must be 100 characters or less'),
    customer_phone: phoneSchema,
    customer_email: optionalEmailSchema,
    customer_address: optionalMax(500, 'Address'),
    customer_tax_id: optionalGstSchema,
    customer_notes: optionalMax(2000, 'Notes'),
    customer_id: z.string(),
    invoice_number: z.string().trim().min(1, 'Invoice number is required'),
    issue_date: z.string().trim().min(1, 'Invoice date is required'),
    due_date: z.string().trim().min(1, 'Due date is required'),
    status: z.enum(statusTuple),
    discount_amount: numberFromInput('Enter a valid discount').refine(
      (value) => value >= 0,
      'Discount cannot be negative',
    ),
    tax_rate: numberFromInput('Enter a valid tax rate').refine(
      (value) => value >= 0 && value <= 100,
      'Tax must be between 0 and 100',
    ),
    notes: optionalMax(2000, 'Notes'),
    payment_mode: z
      .union([z.enum(paymentTuple), z.literal('')])
      .refine((value) => value !== '', 'Payment mode is required'),
    payment_mode_other: z.string().trim(),
    employee_name: optionalMax(120, 'Employee name'),
    items: z.array(invoiceItemSchema).min(1, 'At least one product is required'),
  })
  .superRefine(refineInvoiceTotals)

export const invoiceEditSchema = z
  .object({
    customer_name: z.string().trim(),
    customer_phone: z.string().trim(),
    customer_email: z.string().trim(),
    customer_address: optionalMax(500, 'Address'),
    customer_tax_id: optionalGstSchema,
    customer_notes: optionalMax(2000, 'Notes'),
    customer_id: z.string().trim().min(1, 'Customer is required'),
    invoice_number: z.string().trim().min(1, 'Invoice number is required'),
    issue_date: z.string().trim().min(1, 'Invoice date is required'),
    due_date: z.string().trim().min(1, 'Due date is required'),
    status: z.enum(statusTuple),
    discount_amount: numberFromInput('Enter a valid discount').refine(
      (value) => value >= 0,
      'Discount cannot be negative',
    ),
    tax_rate: numberFromInput('Enter a valid tax rate').refine(
      (value) => value >= 0 && value <= 100,
      'Tax must be between 0 and 100',
    ),
    notes: optionalMax(2000, 'Notes'),
    payment_mode: z
      .union([z.enum(paymentTuple), z.literal('')])
      .refine((value) => value !== '', 'Payment mode is required'),
    payment_mode_other: z.string().trim(),
    employee_name: optionalMax(120, 'Employee name'),
    items: z.array(invoiceItemSchema).min(1, 'At least one product is required'),
  })
  .superRefine(refineInvoiceTotals)

export type InvoiceCreateSchema = z.infer<typeof invoiceCreateSchema>
export type InvoiceEditSchema = z.infer<typeof invoiceEditSchema>
