import { supabase } from '@/lib/supabase'
import { getCurrentCompanyId } from '@/lib/tenant'
import type {
  DashboardCustomer,
  DashboardInvoice,
  DashboardStats,
} from '@/services/dashboard/types'
import type { InvoiceStatus } from '@/services/invoices/types'

function startOfTodayIso() {
  const now = new Date()
  now.setHours(0, 0, 0, 0)
  return now.toISOString()
}

export async function fetchDashboardStats(): Promise<DashboardStats> {
  const companyId = await getCurrentCompanyId()
  const todayIso = startOfTodayIso()

  const [
    { count: customerCount, error: customerError },
    { count: invoiceCount, error: invoiceError },
    { data: paidInvoices, error: revenueError },
    { data: todaysPaid, error: todayError },
    { data: settings },
  ] = await Promise.all([
    supabase
      .from('customers')
      .select('*', { count: 'exact', head: true })
      .eq('company_id', companyId)
      .eq('is_active', true),
    supabase
      .from('invoices')
      .select('*', { count: 'exact', head: true })
      .eq('company_id', companyId),
    supabase
      .from('invoices')
      .select('total, currency')
      .eq('company_id', companyId)
      .eq('status', 'paid'),
    supabase
      .from('invoices')
      .select('total')
      .eq('company_id', companyId)
      .eq('status', 'paid')
      .gte('paid_at', todayIso),
    supabase
      .from('settings')
      .select('default_currency')
      .eq('company_id', companyId)
      .maybeSingle(),
  ])

  if (customerError) throw customerError
  if (invoiceError) throw invoiceError
  if (revenueError) throw revenueError
  if (todayError) throw todayError

  const revenue =
    paidInvoices?.reduce((sum, row) => sum + Number(row.total ?? 0), 0) ?? 0
  const todaysSales =
    todaysPaid?.reduce((sum, row) => sum + Number(row.total ?? 0), 0) ?? 0

  return {
    todaysSales,
    totalCustomers: customerCount ?? 0,
    totalInvoices: invoiceCount ?? 0,
    revenue,
    currency: settings?.default_currency ?? 'USD',
  }
}

export async function fetchLatestCustomers(
  limit = 5,
): Promise<DashboardCustomer[]> {
  const companyId = await getCurrentCompanyId()

  const { data, error } = await supabase
    .from('customers')
    .select('id, name, email, company_name, created_at')
    .eq('company_id', companyId)
    .order('created_at', { ascending: false })
    .limit(limit)

  if (error) throw error
  return data ?? []
}

export async function fetchRecentInvoices(
  limit = 5,
): Promise<DashboardInvoice[]> {
  const companyId = await getCurrentCompanyId()

  const { data, error } = await supabase
    .from('invoices')
    .select(
      'id, invoice_number, status, total, currency, issue_date, customer:customers(name)',
    )
    .eq('company_id', companyId)
    .order('created_at', { ascending: false })
    .limit(limit)

  if (error) throw error

  return (data ?? []).map((row) => {
    const customer = Array.isArray(row.customer)
      ? row.customer[0]
      : row.customer

    return {
      id: row.id,
      invoice_number: row.invoice_number,
      status: row.status as InvoiceStatus,
      total: Number(row.total ?? 0),
      currency: row.currency,
      issue_date: row.issue_date,
      customer: customer ? { name: customer.name } : null,
    }
  })
}
