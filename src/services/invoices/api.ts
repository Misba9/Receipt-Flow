import { supabase } from '@/lib/supabase'
import { requireTenantContext } from '@/lib/tenant'
import { createCustomer } from '@/services/customers/api'
import { calculateInvoiceTotals, lineAmount } from '@/services/invoices/calculations'
import type {
  CreateBillInput,
  InvoiceDefaults,
  InvoiceDetail,
  InvoiceInput,
  InvoiceItem,
  InvoiceListItem,
  InvoiceStatus,
  InvoicesListParams,
  InvoicesListResult,
  PaymentMode,
} from '@/services/invoices/types'

async function getAuthContext() {
  return requireTenantContext()
}

function emptyToNull(value: string) {
  const trimmed = value.trim()
  return trimmed.length > 0 ? trimmed : null
}

function mapCustomer(raw: unknown): InvoiceListItem['customer'] {
  if (!raw) return null
  const customer = Array.isArray(raw) ? raw[0] : raw
  if (!customer || typeof customer !== 'object') return null

  const row = customer as Record<string, unknown>
  return {
    id: String(row.id ?? ''),
    name: String(row.name ?? ''),
    email: (row.email as string | null) ?? null,
    phone: (row.phone as string | null) ?? null,
    company_name: (row.company_name as string | null) ?? null,
    address_line1: (row.address_line1 as string | null) ?? null,
  }
}

function mapListItem(row: Record<string, unknown>): InvoiceListItem {
  return {
    id: String(row.id),
    invoice_number: String(row.invoice_number),
    status: row.status as InvoiceStatus,
    issue_date: String(row.issue_date),
    due_date: (row.due_date as string | null) ?? null,
    currency: String(row.currency ?? 'USD'),
    subtotal: Number(row.subtotal ?? 0),
    tax_rate: Number(row.tax_rate ?? 0),
    tax_amount: Number(row.tax_amount ?? 0),
    discount_amount: Number(row.discount_amount ?? 0),
    total: Number(row.total ?? 0),
    payment_mode: (row.payment_mode as PaymentMode | null) ?? null,
    payment_mode_other: (row.payment_mode_other as string | null) ?? null,
    model: (row.model as string | null) ?? null,
    place: (row.place as string | null) ?? null,
    employee_name: (row.employee_name as string | null) ?? null,
    customer: mapCustomer(row.customer),
    created_at: String(row.created_at),
  }
}

export async function fetchInvoiceDefaults(): Promise<InvoiceDefaults> {
  const { companyId } = await getAuthContext()

  const { data, error } = await supabase
    .from('settings')
    .select(
      'invoice_prefix, next_invoice_number, default_tax_rate, default_currency, invoice_footer, invoice_due_days',
    )
    .eq('company_id', companyId)
    .single()

  if (error) throw error

  const prefix = data.invoice_prefix ?? 'INV-'
  const next = data.next_invoice_number ?? 1

  return {
    invoice_number: `${prefix}${String(next).padStart(4, '0')}`,
    tax_rate: Number(data.default_tax_rate ?? 0),
    currency: data.default_currency ?? 'USD',
    footer: data.invoice_footer ?? '',
    due_days: data.invoice_due_days ?? 30,
  }
}

export async function fetchCustomerOptions() {
  const { companyId } = await getAuthContext()

  const { data, error } = await supabase
    .from('customers')
    .select('id, name, email, phone, address_line1')
    .eq('company_id', companyId)
    .eq('is_active', true)
    .order('name', { ascending: true })

  if (error) throw error
  return data ?? []
}

export async function fetchInvoices({
  search = '',
  status = 'all',
  page,
  pageSize,
}: InvoicesListParams): Promise<InvoicesListResult> {
  const { companyId } = await getAuthContext()
  const from = (page - 1) * pageSize
  const to = from + pageSize - 1
  const term = search.trim()

  let query = supabase
    .from('invoices')
    .select(
      `
      id,
      invoice_number,
      status,
      issue_date,
      due_date,
      currency,
      subtotal,
      tax_rate,
      tax_amount,
      discount_amount,
      total,
      created_at,
      customer:customers(id, name, email, phone, company_name, address_line1)
    `,
      { count: 'exact' },
    )
    .eq('company_id', companyId)
    .order('created_at', { ascending: false })
    .range(from, to)

  if (status !== 'all') {
    query = query.eq('status', status)
  }

  if (term) {
    const escaped = term.replace(/[%_]/g, '').replace(/,/g, ' ').trim()
    if (escaped) {
      const { data: matchedCustomers } = await supabase
        .from('customers')
        .select('id')
        .eq('company_id', companyId)
        .ilike('name', `%${escaped}%`)

      const customerIds = (matchedCustomers ?? []).map((row) => row.id)
      if (customerIds.length > 0) {
        query = query.or(
          `invoice_number.ilike.%${escaped}%,customer_id.in.(${customerIds.join(',')})`,
        )
      } else {
        query = query.ilike('invoice_number', `%${escaped}%`)
      }
    }
  }

  const { data, error, count } = await query
  if (error) throw error

  const total = count ?? 0

  return {
    data: (data ?? []).map((row) => mapListItem(row as Record<string, unknown>)),
    total,
    page,
    pageSize,
    totalPages: Math.max(1, Math.ceil(total / pageSize)),
  }
}

export async function fetchInvoice(id: string): Promise<InvoiceDetail> {
  const { companyId } = await getAuthContext()

  const { data, error } = await supabase
    .from('invoices')
    .select(
      `
      id,
      company_id,
      customer_id,
      invoice_number,
      status,
      issue_date,
      due_date,
      currency,
      subtotal,
      tax_rate,
      tax_amount,
      discount_amount,
      total,
      payment_mode,
      payment_mode_other,
      model,
      place,
      employee_name,
      notes,
      footer,
      paid_at,
      pdf_url,
      pdf_generated_at,
      created_at,
      customer:customers(id, name, email, phone, company_name, address_line1),
      items:invoice_items(id, invoice_id, description, product_type, quantity, unit_price, amount, position)
    `,
    )
    .eq('id', id)
    .eq('company_id', companyId)
    .single()

  if (error) throw error

  const items = ((data.items ?? []) as InvoiceItem[])
    .map((item) => ({
      ...item,
      product_type: item.product_type ?? null,
      quantity: Number(item.quantity),
      unit_price: Number(item.unit_price),
      amount: Number(item.amount),
    }))
    .sort((a, b) => a.position - b.position)

  const base = mapListItem(data as Record<string, unknown>)

  return {
    ...base,
    company_id: String(data.company_id),
    customer_id: String(data.customer_id),
    notes: data.notes ?? null,
    footer: data.footer ?? null,
    paid_at: data.paid_at ?? null,
    pdf_url: data.pdf_url ?? null,
    pdf_generated_at: data.pdf_generated_at ?? null,
    items,
  }
}

function buildInvoicePayload(
  companyId: string,
  userId: string,
  input: InvoiceInput,
  defaults: { currency: string; footer: string; due_days: number },
) {
  const totals = calculateInvoiceTotals(
    input.items,
    input.discount_amount,
    input.tax_rate,
  )

  const issueDate = input.issue_date
  const due = new Date(issueDate)
  due.setDate(due.getDate() + defaults.due_days)

  const paymentMode = input.payment_mode || null
  const paymentModeOther =
    paymentMode === 'other' ? emptyToNull(input.payment_mode_other) : null

  return {
    company_id: companyId,
    customer_id: input.customer_id,
    invoice_number: input.invoice_number.trim(),
    status: input.status,
    issue_date: issueDate,
    due_date: due.toISOString().slice(0, 10),
    currency: defaults.currency,
    subtotal: totals.subtotal,
    tax_rate: input.tax_rate,
    tax_amount: totals.taxAmount,
    discount_amount: totals.discountAmount,
    total: totals.total,
    notes: input.notes.trim() || null,
    footer: defaults.footer || null,
    payment_mode: paymentMode,
    payment_mode_other: paymentModeOther,
    model: emptyToNull(input.model),
    place: emptyToNull(input.place),
    employee_name: emptyToNull(input.employee_name),
    paid_at: input.status === 'paid' ? new Date().toISOString() : null,
    created_by: userId,
  }
}

async function replaceInvoiceItems(
  invoiceId: string,
  companyId: string,
  items: InvoiceInput['items'],
) {
  const { error: deleteError } = await supabase
    .from('invoice_items')
    .delete()
    .eq('invoice_id', invoiceId)
    .eq('company_id', companyId)

  if (deleteError) throw deleteError

  if (items.length === 0) return

  const rows = items.map((item, index) => ({
    company_id: companyId,
    invoice_id: invoiceId,
    description: item.description.trim(),
    product_type: emptyToNull(item.product_type),
    quantity: item.quantity,
    unit_price: item.unit_price,
    amount: lineAmount(item.quantity, item.unit_price),
    position: index,
  }))

  const { error: insertError } = await supabase.from('invoice_items').insert(rows)
  if (insertError) throw insertError
}

export async function createInvoice(input: InvoiceInput): Promise<string> {
  const { userId, companyId } = await getAuthContext()
  const defaults = await fetchInvoiceDefaults()

  const payload = buildInvoicePayload(companyId, userId, input, defaults)

  const { data, error } = await supabase
    .from('invoices')
    .insert(payload)
    .select('id')
    .single()

  if (error) throw error

  await replaceInvoiceItems(data.id, companyId, input.items)

  // Bump next invoice number when the generated number was used
  const { data: settings } = await supabase
    .from('settings')
    .select('next_invoice_number, invoice_prefix')
    .eq('company_id', companyId)
    .single()

  if (settings) {
    const expected = `${settings.invoice_prefix}${String(settings.next_invoice_number).padStart(4, '0')}`
    if (input.invoice_number.trim() === expected) {
      const { error: bumpError } = await supabase.rpc('bump_next_invoice_number')
      if (bumpError) throw bumpError
    }
  }

  return data.id as string
}

/** Saves customer + invoice together for the create-bill flow. */
export async function createBill(input: CreateBillInput): Promise<string> {
  const customer = await createCustomer(input.customer)
  return createInvoice({
    ...input.invoice,
    customer_id: customer.id,
  })
}

export async function updateInvoice(
  id: string,
  input: InvoiceInput,
): Promise<void> {
  const { userId, companyId } = await getAuthContext()
  const defaults = await fetchInvoiceDefaults()
  const existing = await fetchInvoice(id)

  if (existing.company_id !== companyId) {
    throw new Error('Invoice not found.')
  }

  const payload = buildInvoicePayload(companyId, userId, input, {
    currency: existing.currency || defaults.currency,
    footer: existing.footer || defaults.footer,
    due_days: defaults.due_days,
  })

  // Keep paid_at if already paid and still paid
  if (input.status === 'paid' && existing.paid_at) {
    payload.paid_at = existing.paid_at
  }

  const { error } = await supabase
    .from('invoices')
    .update({
      customer_id: payload.customer_id,
      invoice_number: payload.invoice_number,
      status: payload.status,
      issue_date: payload.issue_date,
      due_date: payload.due_date,
      currency: payload.currency,
      subtotal: payload.subtotal,
      tax_rate: payload.tax_rate,
      tax_amount: payload.tax_amount,
      discount_amount: payload.discount_amount,
      total: payload.total,
      notes: payload.notes,
      footer: payload.footer,
      payment_mode: payload.payment_mode,
      payment_mode_other: payload.payment_mode_other,
      model: payload.model,
      place: payload.place,
      employee_name: payload.employee_name,
      paid_at: payload.paid_at,
      // Invalidate stored PDF so the next download regenerates from latest data
      pdf_url: null,
      pdf_generated_at: null,
    })
    .eq('id', id)
    .eq('company_id', companyId)

  if (error) throw error

  await replaceInvoiceItems(id, companyId, input.items)

  if (existing.pdf_url) {
    await supabase.storage.from(INVOICE_PDF_BUCKET).remove([existing.pdf_url])
  }
}

export async function deleteInvoice(id: string): Promise<void> {
  const { companyId } = await getAuthContext()
  const existing = await fetchInvoice(id)

  const { error } = await supabase
    .from('invoices')
    .delete()
    .eq('id', id)
    .eq('company_id', companyId)
  if (error) throw error

  if (existing.pdf_url) {
    await supabase.storage.from(INVOICE_PDF_BUCKET).remove([existing.pdf_url])
  }
}

export const INVOICE_PDF_BUCKET = 'invoice-pdfs'

export function invoicePdfStoragePath(companyId: string, invoiceId: string) {
  return `${companyId}/${invoiceId}.pdf`
}

/**
 * Uploads a PDF blob to Storage and persists the object path on the invoice row.
 * Returns the stored path (also written to invoices.pdf_url).
 */
export async function uploadInvoicePdf(
  invoice: Pick<InvoiceDetail, 'id' | 'company_id' | 'invoice_number'>,
  blob: Blob,
): Promise<string> {
  const path = invoicePdfStoragePath(invoice.company_id, invoice.id)

  const { error: uploadError } = await supabase.storage
    .from(INVOICE_PDF_BUCKET)
    .upload(path, blob, {
      upsert: true,
      contentType: 'application/pdf',
      cacheControl: '0',
    })

  if (uploadError) throw uploadError

  const generatedAt = new Date().toISOString()

  const { error: updateError } = await supabase
    .from('invoices')
    .update({
      pdf_url: path,
      pdf_generated_at: generatedAt,
    })
    .eq('id', invoice.id)
    .eq('company_id', invoice.company_id)

  if (updateError) throw updateError

  return path
}

/**
 * Downloads a previously stored invoice PDF from Storage.
 * Path must belong to the caller's company folder.
 */
export async function downloadStoredInvoicePdf(
  pdfUrl: string,
): Promise<Blob> {
  const { companyId } = await getAuthContext()
  if (!pdfUrl.startsWith(`${companyId}/`)) {
    throw new Error('Invoice PDF not found.')
  }

  const { data, error } = await supabase.storage
    .from(INVOICE_PDF_BUCKET)
    .download(pdfUrl)

  if (error) throw error
  return data
}

/**
 * Creates a short-lived signed URL for a stored invoice PDF (optional sharing).
 */
export async function createInvoicePdfSignedUrl(
  pdfUrl: string,
  expiresInSeconds = 60 * 60,
): Promise<string> {
  const { companyId } = await getAuthContext()
  if (!pdfUrl.startsWith(`${companyId}/`)) {
    throw new Error('Invoice PDF not found.')
  }

  const { data, error } = await supabase.storage
    .from(INVOICE_PDF_BUCKET)
    .createSignedUrl(pdfUrl, expiresInSeconds)

  if (error) throw error
  return data.signedUrl
}
