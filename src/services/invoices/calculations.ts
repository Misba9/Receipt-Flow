import type { InvoiceItemInput } from '@/services/invoices/types'

export type InvoiceTotals = {
  subtotal: number
  discountAmount: number
  taxable: number
  taxAmount: number
  total: number
}

function roundMoney(value: number) {
  return Math.round((value + Number.EPSILON) * 100) / 100
}

export function lineAmount(quantity: number, unitPrice: number) {
  return roundMoney(Math.max(0, quantity) * Math.max(0, unitPrice))
}

export function calculateInvoiceTotals(
  items: InvoiceItemInput[],
  discountAmount: number,
  taxRatePercent: number,
): InvoiceTotals {
  const subtotal = roundMoney(
    items.reduce(
      (sum, item) => sum + lineAmount(item.quantity, item.unit_price),
      0,
    ),
  )

  const discount = roundMoney(Math.min(Math.max(0, discountAmount), subtotal))
  const taxable = roundMoney(Math.max(0, subtotal - discount))
  const taxAmount = roundMoney(taxable * (Math.max(0, taxRatePercent) / 100))
  const total = roundMoney(taxable + taxAmount)

  return {
    subtotal,
    discountAmount: discount,
    taxable,
    taxAmount,
    total,
  }
}
