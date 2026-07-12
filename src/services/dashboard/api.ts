import { supabase } from '@/lib/supabase'
import { getCurrentCompanyId } from '@/lib/tenant'
import {
  fetchDashboardStats as fetchSharedDashboardStats,
  fetchRecentInvoices as fetchSharedRecentInvoices,
} from '@/services/dashboardStats'
import type {
  DashboardCustomer,
  DashboardInvoice,
  DashboardStats,
} from '@/services/dashboard/types'

export async function fetchDashboardStats(): Promise<DashboardStats> {
  return fetchSharedDashboardStats()
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
  return fetchSharedRecentInvoices(limit)
}
