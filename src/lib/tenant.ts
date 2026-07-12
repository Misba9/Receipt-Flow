import { supabase } from '@/lib/supabase'

export type TenantContext = {
  userId: string
  companyId: string
}

/**
 * Resolves the signed-in user's tenant. Every data query should scope by companyId.
 * RLS enforces the same rule server-side — this is defense in depth.
 */
export async function requireTenantContext(): Promise<TenantContext> {
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser()

  if (userError) throw userError
  if (!user) throw new Error('You must be signed in.')

  const { data: profile, error: profileError } = await supabase
    .from('profiles')
    .select('company_id')
    .eq('id', user.id)
    .maybeSingle()

  if (profileError) throw profileError
  if (!profile?.company_id) {
    const { data: ensured, error: ensureError } = await supabase.rpc(
      'ensure_user_workspace',
    )
    if (ensureError) throw ensureError
    const companyId =
      ensured && typeof ensured === 'object'
        ? String((ensured as { company_id?: string }).company_id ?? '')
        : ''
    if (!companyId) throw new Error('Your account is not linked to a company.')
    return {
      userId: user.id,
      companyId,
    }
  }

  return {
    userId: user.id,
    companyId: String(profile.company_id),
  }
}

export async function getCurrentCompanyId(): Promise<string> {
  const { companyId } = await requireTenantContext()
  return companyId
}
