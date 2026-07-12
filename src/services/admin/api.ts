import { supabase } from '@/lib/supabase'
import type {
  AdminCompany,
  AdminUser,
  PlatformStats,
  SessionAccess,
  SubscriptionStatus,
} from '@/services/admin/types'

function asNumber(value: unknown) {
  return Number(value ?? 0)
}

function emptyAccess(): SessionAccess {
  return {
    isSuperAdmin: false,
    companyActive: false,
    companyId: null,
    fullName: null,
  }
}

/**
 * Resolves workspace access for the signed-in user.
 * Bootstraps a company/profile when the auth user has no profile row yet
 * (avoids PostgREST 406 from .single() on zero rows).
 */
export async function fetchSessionAccess(): Promise<SessionAccess> {
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser()

  if (userError) throw userError
  if (!user) return emptyAccess()

  const { data: ensured, error: ensureError } = await supabase.rpc(
    'ensure_user_workspace',
  )

  if (!ensureError && ensured && typeof ensured === 'object') {
    const row = ensured as Record<string, unknown>
    return {
      isSuperAdmin: Boolean(row.is_super_admin),
      companyActive: Boolean(row.company_active),
      companyId: row.company_id ? String(row.company_id) : null,
      fullName: (row.full_name as string | null) ?? null,
    }
  }

  // Fallback if RPC is not deployed yet
  const { data: profile, error: profileError } = await supabase
    .from('profiles')
    .select('company_id, full_name, is_super_admin')
    .eq('id', user.id)
    .maybeSingle()

  if (profileError) throw profileError
  if (!profile?.company_id) {
    throw new Error(
      ensureError?.message ||
        'Your workspace is not set up yet. Sign out and register again, or contact support.',
    )
  }

  const { data: companyActive, error: activeError } = await supabase.rpc(
    'is_current_company_active',
  )
  if (activeError) throw activeError

  return {
    isSuperAdmin: Boolean(profile.is_super_admin),
    companyActive: Boolean(companyActive),
    companyId: String(profile.company_id),
    fullName: profile.full_name ?? null,
  }
}

export async function fetchPlatformStats(): Promise<PlatformStats> {
  const { data, error } = await supabase.rpc('admin_platform_stats')
  if (error) throw error

  const row = (data ?? {}) as Record<string, unknown>
  const subscriptions =
    row.subscriptions && typeof row.subscriptions === 'object'
      ? (row.subscriptions as Record<string, number>)
      : {}

  return {
    totalCompanies: asNumber(row.total_companies),
    activeCompanies: asNumber(row.active_companies),
    disabledCompanies: asNumber(row.disabled_companies),
    totalUsers: asNumber(row.total_users),
    superAdmins: asNumber(row.super_admins),
    totalInvoices: asNumber(row.total_invoices),
    totalCustomers: asNumber(row.total_customers),
    totalRevenue: asNumber(row.total_revenue),
    subscriptions,
  }
}

export async function fetchAdminCompanies(): Promise<AdminCompany[]> {
  const [access, companiesResult] = await Promise.all([
    fetchSessionAccess(),
    supabase.rpc('admin_list_companies'),
  ])

  const { data, error } = companiesResult
  if (error) throw error

  return (data ?? [])
    .map((row: Record<string, unknown>) => ({
      id: String(row.id),
      name: String(row.name ?? ''),
      email: (row.email as string | null) ?? null,
      phone: (row.phone as string | null) ?? null,
      isActive: Boolean(row.is_active),
      disabledAt: (row.disabled_at as string | null) ?? null,
      disabledReason: (row.disabled_reason as string | null) ?? null,
      subscriptionStatus: row.subscription_status as SubscriptionStatus,
      subscriptionPlan: (row.subscription_plan as string | null) ?? null,
      subscriptionEndsAt: (row.subscription_ends_at as string | null) ?? null,
      createdAt: String(row.created_at),
      userCount: asNumber(row.user_count),
      customerCount: asNumber(row.customer_count),
      invoiceCount: asNumber(row.invoice_count),
      revenue: asNumber(row.revenue),
    }))
    // Safety net: never show the signed-in super admin's own workspace
    .filter((company: AdminCompany) => company.id !== access.companyId)
}

export async function fetchAdminUsers(): Promise<AdminUser[]> {
  const { data, error } = await supabase.rpc('admin_list_users')
  if (error) throw error

  return (data ?? [])
    .map((row: Record<string, unknown>) => ({
      id: String(row.id),
      email: (row.email as string | null) ?? null,
      fullName: (row.full_name as string | null) ?? null,
      role: row.role as AdminUser['role'],
      isSuperAdmin: Boolean(row.is_super_admin),
      companyId: String(row.company_id),
      companyName: String(row.company_name ?? ''),
      companyActive: Boolean(row.company_active),
      createdAt: String(row.created_at),
      lastSignInAt: (row.last_sign_in_at as string | null) ?? null,
    }))
    .filter((user: AdminUser) => !user.isSuperAdmin)
}

export async function setCompanyActive(
  companyId: string,
  isActive: boolean,
  reason?: string,
) {
  const { error } = await supabase.rpc('admin_set_company_active', {
    p_company_id: companyId,
    p_is_active: isActive,
    p_reason: reason ?? null,
  })
  if (error) throw error
}

export async function setCompanySubscription(
  companyId: string,
  status: SubscriptionStatus,
  plan?: string | null,
  endsAt?: string | null,
) {
  const { error } = await supabase.rpc('admin_set_company_subscription', {
    p_company_id: companyId,
    p_status: status,
    p_plan: plan ?? null,
    p_ends_at: endsAt ?? null,
  })
  if (error) throw error
}

export async function deleteCompany(companyId: string) {
  const { error } = await supabase.rpc('admin_delete_company', {
    p_company_id: companyId,
  })
  if (error) throw error
}
