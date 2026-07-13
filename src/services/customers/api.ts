import { supabase } from '@/lib/supabase'
import { getCurrentCompanyId } from '@/lib/tenant'
import type {
  Customer,
  CustomerInput,
  CustomerSuggestion,
  CustomersListParams,
  CustomersListResult,
} from '@/services/customers/types'

const CUSTOMER_COLUMNS =
  'id, company_id, name, email, phone, company_name, address_line1, tax_id, notes, is_active, created_at, updated_at'

const SUGGESTION_COLUMNS =
  'id, name, email, phone, address_line1, tax_id, notes'

function emptyToNull(value: string) {
  const trimmed = value.trim()
  return trimmed.length > 0 ? trimmed : null
}

function escapeIlike(term: string) {
  return term.replace(/[%_,]/g, '\\$&')
}

function mapCustomer(row: Record<string, unknown>): Customer {
  return {
    id: String(row.id),
    company_id: String(row.company_id),
    name: String(row.name ?? ''),
    email: (row.email as string | null) ?? null,
    phone: (row.phone as string | null) ?? null,
    company_name: (row.company_name as string | null) ?? null,
    address_line1: (row.address_line1 as string | null) ?? null,
    tax_id: (row.tax_id as string | null) ?? null,
    notes: (row.notes as string | null) ?? null,
    is_active: Boolean(row.is_active),
    created_at: String(row.created_at),
    updated_at: String(row.updated_at),
  }
}

function mapSuggestion(row: Record<string, unknown>): CustomerSuggestion {
  return {
    id: String(row.id),
    name: String(row.name ?? ''),
    email: (row.email as string | null) ?? null,
    phone: (row.phone as string | null) ?? null,
    address_line1: (row.address_line1 as string | null) ?? null,
    tax_id: (row.tax_id as string | null) ?? null,
    notes: (row.notes as string | null) ?? null,
  }
}

export async function fetchCustomers({
  search = '',
  page,
  pageSize,
}: CustomersListParams): Promise<CustomersListResult> {
  const companyId = await getCurrentCompanyId()
  const from = (page - 1) * pageSize
  const to = from + pageSize - 1
  const term = search.trim()

  let query = supabase
    .from('customers')
    .select(CUSTOMER_COLUMNS, { count: 'exact' })
    .eq('company_id', companyId)
    .eq('is_active', true)
    .order('created_at', { ascending: false })
    .range(from, to)

  if (term) {
    const pattern = `%${escapeIlike(term)}%`
    query = query.or(
      `name.ilike.${pattern},email.ilike.${pattern},phone.ilike.${pattern},company_name.ilike.${pattern},address_line1.ilike.${pattern},notes.ilike.${pattern}`,
    )
  }

  const { data, error, count } = await query
  if (error) throw error

  const total = count ?? 0

  return {
    data: (data ?? []).map((row) => mapCustomer(row as Record<string, unknown>)),
    total,
    page,
    pageSize,
    totalPages: Math.max(1, Math.ceil(total / pageSize)),
  }
}

/** Debounced autocomplete: partial match on name, phone, or email. */
export async function searchCustomersAutocomplete(
  query: string,
  options: { limit?: number; excludeId?: string } = {},
): Promise<CustomerSuggestion[]> {
  const term = query.trim()
  if (term.length < 1) return []

  const companyId = await getCurrentCompanyId()
  const limit = options.limit ?? 10
  const pattern = `%${escapeIlike(term)}%`

  let request = supabase
    .from('customers')
    .select(SUGGESTION_COLUMNS)
    .eq('company_id', companyId)
    .eq('is_active', true)
    .or(`name.ilike.${pattern},email.ilike.${pattern},phone.ilike.${pattern}`)
    .order('name', { ascending: true })
    .limit(limit)

  if (options.excludeId) {
    request = request.neq('id', options.excludeId)
  }

  const { data, error } = await request
  if (error) throw error

  return (data ?? []).map((row) =>
    mapSuggestion(row as Record<string, unknown>),
  )
}

/**
 * Exact duplicate when name + phone + email all match (case-insensitive).
 * Used to block creating a second identical customer.
 */
export async function findExactCustomerDuplicate(input: {
  name: string
  phone: string
  email: string
  excludeId?: string
}): Promise<CustomerSuggestion | null> {
  const name = input.name.trim()
  const phone = input.phone.trim()
  const email = input.email.trim()
  if (!name || !phone || !email) return null

  const companyId = await getCurrentCompanyId()

  let request = supabase
    .from('customers')
    .select(SUGGESTION_COLUMNS)
    .eq('company_id', companyId)
    .eq('is_active', true)
    .ilike('name', name)
    .ilike('phone', phone)
    .ilike('email', email)
    .limit(1)

  if (input.excludeId) {
    request = request.neq('id', input.excludeId)
  }

  const { data, error } = await request
  if (error) throw error
  if (!data?.length) return null
  return mapSuggestion(data[0] as Record<string, unknown>)
}

export async function fetchCustomerById(
  id: string,
): Promise<CustomerSuggestion | null> {
  const companyId = await getCurrentCompanyId()
  const { data, error } = await supabase
    .from('customers')
    .select(SUGGESTION_COLUMNS)
    .eq('company_id', companyId)
    .eq('id', id)
    .eq('is_active', true)
    .maybeSingle()

  if (error) throw error
  if (!data) return null
  return mapSuggestion(data as Record<string, unknown>)
}

export async function createCustomer(input: CustomerInput): Promise<Customer> {
  const companyId = await getCurrentCompanyId()

  const { data, error } = await supabase
    .from('customers')
    .insert({
      company_id: companyId,
      name: input.name.trim(),
      phone: emptyToNull(input.phone),
      email: emptyToNull(input.email),
      company_name: emptyToNull(input.company_name),
      address_line1: emptyToNull(input.address),
      tax_id: emptyToNull(input.tax_id),
      notes: emptyToNull(input.notes),
      is_active: true,
    })
    .select(CUSTOMER_COLUMNS)
    .single()

  if (error) throw error
  return mapCustomer(data as Record<string, unknown>)
}

export async function updateCustomer(
  id: string,
  input: CustomerInput,
): Promise<Customer> {
  const companyId = await getCurrentCompanyId()

  const { data, error } = await supabase
    .from('customers')
    .update({
      name: input.name.trim(),
      phone: emptyToNull(input.phone),
      email: emptyToNull(input.email),
      company_name: emptyToNull(input.company_name),
      address_line1: emptyToNull(input.address),
      tax_id: emptyToNull(input.tax_id),
      notes: emptyToNull(input.notes),
    })
    .eq('id', id)
    .eq('company_id', companyId)
    .select(CUSTOMER_COLUMNS)
    .single()

  if (error) throw error
  return mapCustomer(data as Record<string, unknown>)
}

export async function deleteCustomer(id: string): Promise<void> {
  const companyId = await getCurrentCompanyId()

  const { error } = await supabase
    .from('customers')
    .update({ is_active: false })
    .eq('id', id)
    .eq('company_id', companyId)

  if (error) throw error
}

export function customerToFormValues(
  customer: CustomerSuggestion | Customer,
): CustomerInput {
  return {
    name: customer.name ?? '',
    phone: customer.phone ?? '',
    email: customer.email ?? '',
    company_name: '',
    address: customer.address_line1 ?? '',
    tax_id: customer.tax_id ?? '',
    notes: customer.notes ?? '',
  }
}
