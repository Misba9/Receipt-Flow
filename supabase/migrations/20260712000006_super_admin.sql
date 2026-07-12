-- =============================================================================
-- ReceiptFlow — Super Admin platform control plane
-- Cross-tenant reads/mutations go through SECURITY DEFINER RPCs only.
-- Regular tenant RLS stays company-scoped (no blanket super-admin SELECT).
-- =============================================================================

create type public.subscription_status as enum (
  'trial',
  'active',
  'past_due',
  'canceled',
  'none'
);

-- ---------------------------------------------------------------------------
-- Schema additions
-- ---------------------------------------------------------------------------

alter table public.companies
  add column if not exists is_active boolean not null default true,
  add column if not exists disabled_at timestamptz,
  add column if not exists disabled_reason text,
  add column if not exists subscription_status public.subscription_status
    not null default 'trial',
  add column if not exists subscription_plan text,
  add column if not exists subscription_ends_at timestamptz;

create index if not exists companies_is_active_idx
  on public.companies (is_active);
create index if not exists companies_subscription_status_idx
  on public.companies (subscription_status);

alter table public.profiles
  add column if not exists is_super_admin boolean not null default false;

create index if not exists profiles_is_super_admin_idx
  on public.profiles (is_super_admin)
  where is_super_admin = true;

comment on column public.profiles.is_super_admin is
  'Platform super admin. Set only via SQL / service role — never by client signup.';

comment on column public.companies.is_active is
  'When false, tenant users cannot use the app. Super admins can still access /admin.';

-- ---------------------------------------------------------------------------
-- Helpers (before policies that may call them)
-- ---------------------------------------------------------------------------

create or replace function public.is_super_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select coalesce(
    (
      select is_super_admin
      from public.profiles
      where id = auth.uid()
    ),
    false
  )
$$;

revoke all on function public.is_super_admin() from public;
grant execute on function public.is_super_admin() to authenticated;

create or replace function public.require_super_admin()
returns void
language plpgsql
stable
security definer
set search_path = public
as $$
begin
  if not public.is_super_admin() then
    raise exception 'Super admin access required' using errcode = '42501';
  end if;
end;
$$;

revoke all on function public.require_super_admin() from public;
grant execute on function public.require_super_admin() to authenticated;

create or replace function public.is_current_company_active()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select coalesce(
    (
      select c.is_active
      from public.companies c
      join public.profiles p on p.company_id = c.id
      where p.id = auth.uid()
    ),
    false
  )
$$;

revoke all on function public.is_current_company_active() from public;
grant execute on function public.is_current_company_active() to authenticated;

-- ---------------------------------------------------------------------------
-- Lock is_super_admin from client updates
-- ---------------------------------------------------------------------------

create or replace function public.prevent_super_admin_flag_change()
returns trigger
language plpgsql
as $$
begin
  if tg_op = 'UPDATE'
    and new.is_super_admin is distinct from old.is_super_admin
    and auth.uid() is not null
  then
    raise exception 'is_super_admin can only be changed by a database administrator';
  end if;
  return new;
end;
$$;

drop trigger if exists profiles_prevent_super_admin_change on public.profiles;

create trigger profiles_prevent_super_admin_change
before update of is_super_admin on public.profiles
for each row
execute function public.prevent_super_admin_flag_change();

-- Self-update: role + company stay fixed; is_super_admin locked by trigger above
drop policy if exists "profiles_update_self" on public.profiles;

create policy "profiles_update_self"
on public.profiles
for update
to authenticated
using (id = auth.uid())
with check (
  id = auth.uid()
  and company_id = public.current_company_id()
  and role = public.current_user_role()
);

-- ---------------------------------------------------------------------------
-- RPCs — dashboard
-- ---------------------------------------------------------------------------

create or replace function public.admin_platform_stats()
returns jsonb
language plpgsql
stable
security definer
set search_path = public
as $$
declare
  result jsonb;
begin
  perform public.require_super_admin();

  select jsonb_build_object(
    'total_companies', (select count(*)::int from public.companies),
    'active_companies', (select count(*)::int from public.companies where is_active),
    'disabled_companies', (select count(*)::int from public.companies where not is_active),
    'total_users', (select count(*)::int from public.profiles),
    'super_admins', (select count(*)::int from public.profiles where is_super_admin),
    'total_invoices', (select count(*)::int from public.invoices),
    'total_customers', (select count(*)::int from public.customers where is_active),
    'total_revenue', coalesce((
      select sum(total)::numeric
      from public.invoices
      where status = 'paid'
    ), 0),
    'subscriptions', (
      select coalesce(jsonb_object_agg(status, cnt), '{}'::jsonb)
      from (
        select subscription_status::text as status, count(*)::int as cnt
        from public.companies
        group by subscription_status
      ) s
    )
  ) into result;

  return result;
end;
$$;

revoke all on function public.admin_platform_stats() from public;
grant execute on function public.admin_platform_stats() to authenticated;

-- ---------------------------------------------------------------------------
-- RPCs — companies
-- ---------------------------------------------------------------------------

create or replace function public.admin_list_companies()
returns table (
  id uuid,
  name text,
  email text,
  phone text,
  is_active boolean,
  disabled_at timestamptz,
  disabled_reason text,
  subscription_status public.subscription_status,
  subscription_plan text,
  subscription_ends_at timestamptz,
  created_at timestamptz,
  user_count bigint,
  customer_count bigint,
  invoice_count bigint,
  revenue numeric
)
language plpgsql
stable
security definer
set search_path = public
as $$
begin
  perform public.require_super_admin();

  return query
  select
    c.id,
    c.name,
    c.email,
    c.phone,
    c.is_active,
    c.disabled_at,
    c.disabled_reason,
    c.subscription_status,
    c.subscription_plan,
    c.subscription_ends_at,
    c.created_at,
    (select count(*) from public.profiles p where p.company_id = c.id),
    (select count(*) from public.customers cu where cu.company_id = c.id and cu.is_active),
    (select count(*) from public.invoices i where i.company_id = c.id),
    coalesce((
      select sum(i.total)
      from public.invoices i
      where i.company_id = c.id and i.status = 'paid'
    ), 0)
  from public.companies c
  order by c.created_at desc;
end;
$$;

revoke all on function public.admin_list_companies() from public;
grant execute on function public.admin_list_companies() to authenticated;

create or replace function public.admin_set_company_active(
  p_company_id uuid,
  p_is_active boolean,
  p_reason text default null
)
returns void
language plpgsql
security definer
set search_path = public
as $$
begin
  perform public.require_super_admin();

  if exists (
    select 1
    from public.profiles
    where id = auth.uid()
      and company_id = p_company_id
  ) then
    raise exception 'Cannot disable or re-enable your own company';
  end if;

  update public.companies
  set
    is_active = p_is_active,
    disabled_at = case when p_is_active then null else timezone('utc', now()) end,
    disabled_reason = case
      when p_is_active then null
      else nullif(trim(coalesce(p_reason, '')), '')
    end
  where id = p_company_id;

  if not found then
    raise exception 'Company not found';
  end if;
end;
$$;

revoke all on function public.admin_set_company_active(uuid, boolean, text) from public;
grant execute on function public.admin_set_company_active(uuid, boolean, text) to authenticated;

create or replace function public.admin_set_company_subscription(
  p_company_id uuid,
  p_status public.subscription_status,
  p_plan text default null,
  p_ends_at timestamptz default null
)
returns void
language plpgsql
security definer
set search_path = public
as $$
begin
  perform public.require_super_admin();

  update public.companies
  set
    subscription_status = p_status,
    subscription_plan = nullif(trim(coalesce(p_plan, '')), ''),
    subscription_ends_at = p_ends_at
  where id = p_company_id;

  if not found then
    raise exception 'Company not found';
  end if;
end;
$$;

revoke all on function public.admin_set_company_subscription(uuid, public.subscription_status, text, timestamptz) from public;
grant execute on function public.admin_set_company_subscription(uuid, public.subscription_status, text, timestamptz) to authenticated;

create or replace function public.admin_delete_company(p_company_id uuid)
returns void
language plpgsql
security definer
set search_path = public
as $$
begin
  perform public.require_super_admin();

  if exists (
    select 1
    from public.profiles
    where id = auth.uid()
      and company_id = p_company_id
  ) then
    raise exception 'Cannot delete your own company';
  end if;

  delete from public.companies where id = p_company_id;

  if not found then
    raise exception 'Company not found';
  end if;
end;
$$;

revoke all on function public.admin_delete_company(uuid) from public;
grant execute on function public.admin_delete_company(uuid) to authenticated;

-- ---------------------------------------------------------------------------
-- RPCs — users
-- ---------------------------------------------------------------------------

create or replace function public.admin_list_users()
returns table (
  id uuid,
  email text,
  full_name text,
  role public.profile_role,
  is_super_admin boolean,
  company_id uuid,
  company_name text,
  company_active boolean,
  created_at timestamptz,
  last_sign_in_at timestamptz
)
language plpgsql
stable
security definer
set search_path = public
as $$
begin
  perform public.require_super_admin();

  return query
  select
    p.id,
    u.email::text,
    p.full_name,
    p.role,
    p.is_super_admin,
    p.company_id,
    c.name,
    c.is_active,
    p.created_at,
    u.last_sign_in_at
  from public.profiles p
  join auth.users u on u.id = p.id
  join public.companies c on c.id = p.company_id
  order by p.created_at desc;
end;
$$;

revoke all on function public.admin_list_users() from public;
grant execute on function public.admin_list_users() to authenticated;

-- Bootstrap note:
--   update public.profiles set is_super_admin = true where id = '<auth-user-uuid>';
-- (Run in SQL editor as postgres / service role.)
