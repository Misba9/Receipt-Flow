import { supabase } from '@/lib/supabase'
import { getCurrentCompanyId } from '@/lib/tenant'
import type { Customer } from '@/services/customers/types'
import type {
  InvoiceListItem,
  InvoiceStatus,
  PaymentMode,
} from '@/services/invoices/types'

async function fetchAllPages<T>(
  fetchPage: (
    from: number,
    to: number,
  ) => Promise<{ data: T[] | null; error: Error | null }>,
  pageSize = 500,
): Promise<T[]> {
  const rows: T[] = []
  let from = 0

  while (true) {
    const to = from + pageSize - 1
    const { data, error } = await fetchPage(from, to)
    if (error) throw error
    const batch = data ?? []
    rows.push(...batch)
    if (batch.length < pageSize) break
    from += pageSize
  }

  return rows
}

export async function fetchCustomersForExport(): Promise<Customer[]> {
  const companyId = await getCurrentCompanyId()

  return fetchAllPages(async (from, to) => {
    const { data, error } = await supabase
      .from('customers')
      .select(
        'id, company_id, name, email, phone, company_name, address_line1, tax_id, notes, is_active, created_at, updated_at',
      )
      .eq('company_id', companyId)
      .eq('is_active', true)
      .order('name', { ascending: true })
      .range(from, to)

    return { data: data as Customer[] | null, error: error as Error | null }
  })
}

export async function fetchInvoicesForExport(): Promise<InvoiceListItem[]> {
  const companyId = await getCurrentCompanyId()

  return fetchAllPages(async (from, to) => {
    const { data, error } = await supabase
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
        payment_mode,
        payment_mode_other,
        model,
        place,
        employee_name,
        created_at,
        customer:customers(id, name, email, phone, company_name, address_line1)
      `,
      )
      .eq('company_id', companyId)
      .order('issue_date', { ascending: false })
      .range(from, to)

    if (error) return { data: null, error: error as Error }

    const mapped = (data ?? []).map((row) => {
      const customerRaw = Array.isArray(row.customer)
        ? row.customer[0]
        : row.customer

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
        amount_paid: Number(
          (row as { amount_paid?: number | null }).amount_paid ?? 0,
        ),
        payment_mode: (row.payment_mode as PaymentMode | null) ?? null,
        payment_mode_other:
          (row.payment_mode_other as string | null) ?? null,
        model: (row.model as string | null) ?? null,
        place: (row.place as string | null) ?? null,
        employee_name: (row.employee_name as string | null) ?? null,
        created_at: String(row.created_at),
        customer: customerRaw
          ? {
              id: String(customerRaw.id ?? ''),
              name: String(customerRaw.name ?? ''),
              email: (customerRaw.email as string | null) ?? null,
              phone: (customerRaw.phone as string | null) ?? null,
              company_name:
                (customerRaw.company_name as string | null) ?? null,
              address_line1:
                (customerRaw.address_line1 as string | null) ?? null,
            }
          : null,
      } satisfies InvoiceListItem
    })

    return { data: mapped, error: null }
  })
}

export type SalesExportRow = {
  invoice_number: string
  customer_name: string
  customer_email: string
  issue_date: string
  paid_at: string | null
  currency: string
  subtotal: number
  discount_amount: number
  tax_rate: number
  tax_amount: number
  total: number
  status: InvoiceStatus
}

/** Sales = paid invoices (revenue recognized). */
export async function fetchSalesForExport(): Promise<SalesExportRow[]> {
  const companyId = await getCurrentCompanyId()

  return fetchAllPages(async (from, to) => {
    const { data, error } = await supabase
      .from('invoices')
      .select(
        `
        invoice_number,
        status,
        issue_date,
        paid_at,
        currency,
        subtotal,
        tax_rate,
        tax_amount,
        discount_amount,
        total,
        customer:customers(name, email)
      `,
      )
      .eq('company_id', companyId)
      .eq('status', 'paid')
      .order('paid_at', { ascending: false })
      .range(from, to)

    if (error) return { data: null, error: error as Error }

    const mapped = (data ?? []).map((row) => {
      const customerRaw = Array.isArray(row.customer)
        ? row.customer[0]
        : row.customer

      return {
        invoice_number: String(row.invoice_number),
        customer_name: String(customerRaw?.name ?? '—'),
        customer_email: String(customerRaw?.email ?? ''),
        issue_date: String(row.issue_date),
        paid_at: (row.paid_at as string | null) ?? null,
        currency: String(row.currency ?? 'USD'),
        subtotal: Number(row.subtotal ?? 0),
        discount_amount: Number(row.discount_amount ?? 0),
        tax_rate: Number(row.tax_rate ?? 0),
        tax_amount: Number(row.tax_amount ?? 0),
        total: Number(row.total ?? 0),
        status: row.status as InvoiceStatus,
      } satisfies SalesExportRow
    })

    return { data: mapped, error: null }
  })
}
