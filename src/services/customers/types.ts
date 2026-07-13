export type Customer = {
  id: string
  company_id: string
  name: string
  email: string | null
  phone: string | null
  company_name: string | null
  address_line1: string | null
  tax_id: string | null
  notes: string | null
  is_active: boolean
  created_at: string
  updated_at: string
}

export type CustomerInput = {
  name: string
  phone: string
  email: string
  company_name: string
  address: string
  tax_id: string
  notes: string
}

export type CustomerSuggestion = Pick<
  Customer,
  'id' | 'name' | 'email' | 'phone' | 'address_line1' | 'tax_id' | 'notes'
>

export type CustomersListParams = {
  search?: string
  page: number
  pageSize: number
}

export type CustomersListResult = {
  data: Customer[]
  total: number
  page: number
  pageSize: number
  totalPages: number
}
