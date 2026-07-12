import { supabase } from '@/lib/supabase'
import { getCurrentCompanyId } from '@/lib/tenant'
import type {
  Customer,
  CustomerInput,
  CustomersListParams,
  CustomersListResult,
} from '@/services/customers/types'

const CUSTOMER_COLUMNS =
  'id, company_id, name, email, phone, company_name, address_line1, notes, is_active, created_at, updated_at'

function emptyToNull(value: string) {
  const trimmed = value.trim()
  return trimmed.length > 0 ? trimmed : null
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
    const escaped = term.replace(/[%_,]/g, '\\$&')
    const pattern = `%${escaped}%`
    query = query.or(
      `name.ilike.${pattern},email.ilike.${pattern},phone.ilike.${pattern},company_name.ilike.${pattern},address_line1.ilike.${pattern},notes.ilike.${pattern}`,
    )
  }

  const { data, error, count } = await query
  if (error) throw error

  const total = count ?? 0

  return {
    data: (data ?? []) as Customer[],
    total,
    page,
    pageSize,
    totalPages: Math.max(1, Math.ceil(total / pageSize)),
  }
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
      notes: emptyToNull(input.notes),
      is_active: true,
    })
    .select(CUSTOMER_COLUMNS)
    .single()

  if (error) throw error
  return data as Customer
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
      notes: emptyToNull(input.notes),
    })
    .eq('id', id)
    .eq('company_id', companyId)
    .select(CUSTOMER_COLUMNS)
    .single()

  if (error) throw error
  return data as Customer
}

export async function deleteCustomer(id: string): Promise<void> {
  const companyId = await getCurrentCompanyId()

  // Soft delete so invoices that reference the customer remain valid
  const { error } = await supabase
    .from('customers')
    .update({ is_active: false })
    .eq('id', id)
    .eq('company_id', companyId)

  if (error) throw error
}
