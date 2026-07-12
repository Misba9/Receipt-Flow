import { supabase } from '@/lib/supabase'
import { getCurrentCompanyId } from '@/lib/tenant'
import type { InvoiceStatus } from '@/services/invoices/types'

export type GlobalCustomerHit = {
  id: string
  name: string
  email: string | null
  phone: string | null
}

export type GlobalInvoiceHit = {
  id: string
  invoice_number: string
  status: InvoiceStatus
  total: number
  currency: string
  customer_name: string | null
}

export type GlobalSearchResults = {
  customers: GlobalCustomerHit[]
  invoices: GlobalInvoiceHit[]
}

function sanitizeTerm(term: string) {
  return term.replace(/[%_,]/g, ' ').replace(/\s+/g, ' ').trim()
}

function ilikeOr(columns: string[], pattern: string) {
  const quoted = `"${pattern}"`
  return columns.map((column) => `${column}.ilike.${quoted}`).join(',')
}

/**
 * Searches customers (name, phone, email) and invoices (number + related customers).
 * Scoped to the caller's company (RLS + explicit company_id).
 */
export async function globalSearch(
  query: string,
): Promise<GlobalSearchResults> {
  const companyId = await getCurrentCompanyId()
  const term = sanitizeTerm(query)
  if (term.length < 2) {
    return { customers: [], invoices: [] }
  }

  const pattern = `%${term}%`
  const customerFilter = ilikeOr(['name', 'email', 'phone'], pattern)

  const [customersResult, matchingIdsResult] = await Promise.all([
    supabase
      .from('customers')
      .select('id, name, email, phone')
      .eq('company_id', companyId)
      .eq('is_active', true)
      .or(customerFilter)
      .order('name', { ascending: true })
      .limit(8),
    supabase
      .from('customers')
      .select('id')
      .eq('company_id', companyId)
      .eq('is_active', true)
      .or(customerFilter)
      .limit(50),
  ])

  if (customersResult.error) throw customersResult.error
  if (matchingIdsResult.error) throw matchingIdsResult.error

  const customerHits = (customersResult.data ?? []) as GlobalCustomerHit[]
  const customerIds = (matchingIdsResult.data ?? []).map((row) => String(row.id))

  let invoicesQuery = supabase
    .from('invoices')
    .select(
      `
      id,
      invoice_number,
      status,
      total,
      currency,
      customer:customers(name)
    `,
    )
    .eq('company_id', companyId)
    .order('created_at', { ascending: false })
    .limit(8)

  if (customerIds.length > 0) {
    invoicesQuery = invoicesQuery.or(
      `invoice_number.ilike."${pattern}",customer_id.in.(${customerIds.join(',')})`,
    )
  } else {
    invoicesQuery = invoicesQuery.ilike('invoice_number', pattern)
  }

  const { data: invoices, error: invoicesError } = await invoicesQuery
  if (invoicesError) throw invoicesError

  const invoiceHits: GlobalInvoiceHit[] = (invoices ?? []).map((row) => {
    const customer = Array.isArray(row.customer) ? row.customer[0] : row.customer
    return {
      id: String(row.id),
      invoice_number: String(row.invoice_number),
      status: row.status as InvoiceStatus,
      total: Number(row.total ?? 0),
      currency: String(row.currency ?? 'USD'),
      customer_name: customer?.name ? String(customer.name) : null,
    }
  })

  return {
    customers: customerHits,
    invoices: invoiceHits,
  }
}
