-- =============================================================================
-- Fix profiles self-read + bootstrap missing workspaces
-- =============================================================================

-- Allow every user to read their own profile by id (avoids edge cases where
-- current_company_id() is null before the row is visible under company policy).
drop policy if exists "profiles_select_same_company" on public.profiles;

create policy "profiles_select_own_or_company"
on public.profiles
for select
to authenticated
using (
  id = auth.uid()
  or company_id = public.current_company_id()
);

-- Create company + owner profile when auth user has no profile yet
create or replace function public.ensure_user_workspace()
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  uid uuid := auth.uid();
  existing record;
  new_company_id uuid;
  company_name text;
  profile_name text;
  meta jsonb;
begin
  if uid is null then
    raise exception 'Not authenticated' using errcode = '42501';
  end if;

  select p.company_id, p.full_name, p.is_super_admin, c.is_active
  into existing
  from public.profiles p
  join public.companies c on c.id = p.company_id
  where p.id = uid;

  if found then
    return jsonb_build_object(
      'company_id', existing.company_id,
      'full_name', existing.full_name,
      'is_super_admin', existing.is_super_admin,
      'company_active', existing.is_active,
      'created', false
    );
  end if;

  select raw_user_meta_data into meta
  from auth.users
  where id = uid;

  company_name := nullif(trim(coalesce(meta ->> 'company_name', '')), '');
  profile_name := nullif(trim(coalesce(meta ->> 'full_name', '')), '');

  if company_name is null then
    company_name := coalesce(
      profile_name,
      split_part((select email from auth.users where id = uid), '@', 1),
      'My Company'
    ) || '''s Company';
  end if;

  insert into public.companies (name)
  values (company_name)
  returning id into new_company_id;

  insert into public.profiles (id, company_id, full_name, role, is_super_admin)
  values (uid, new_company_id, profile_name, 'owner', false);

  return jsonb_build_object(
    'company_id', new_company_id,
    'full_name', profile_name,
    'is_super_admin', false,
    'company_active', true,
    'created', true
  );
end;
$$;

revoke all on function public.ensure_user_workspace() from public;
grant execute on function public.ensure_user_workspace() to authenticated;

comment on function public.ensure_user_workspace() is
  'Returns the caller workspace; creates company + owner profile if missing.';
