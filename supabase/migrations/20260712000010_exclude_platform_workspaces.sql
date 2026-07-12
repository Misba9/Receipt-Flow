-- =============================================================================
-- Exclude platform (super-admin) workspaces from tenant admin views
-- =============================================================================

create or replace function public.is_platform_company(p_company_id uuid)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.profiles p
    where p.company_id = p_company_id
      and p.is_super_admin = true
  );
$$;

revoke all on function public.is_platform_company(uuid) from public;
grant execute on function public.is_platform_company(uuid) to authenticated;

comment on function public.is_platform_company(uuid) is
  'True when the company belongs to a platform super admin (not a tenant workspace).';

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
    'total_companies', (
      select count(*)::int
      from public.companies c
      where not public.is_platform_company(c.id)
    ),
    'active_companies', (
      select count(*)::int
      from public.companies c
      where c.is_active
        and not public.is_platform_company(c.id)
    ),
    'disabled_companies', (
      select count(*)::int
      from public.companies c
      where not c.is_active
        and not public.is_platform_company(c.id)
    ),
    'total_users', (
      select count(*)::int
      from public.profiles p
      where not p.is_super_admin
        and not public.is_platform_company(p.company_id)
    ),
    'super_admins', (
      select count(*)::int
      from public.profiles
      where is_super_admin
    ),
    'total_invoices', (
      select count(*)::int
      from public.invoices i
      where not public.is_platform_company(i.company_id)
    ),
    'total_customers', (
      select count(*)::int
      from public.customers cu
      where cu.is_active
        and not public.is_platform_company(cu.company_id)
    ),
    'total_revenue', coalesce((
      select sum(i.total)::numeric
      from public.invoices i
      where i.status = 'paid'
        and not public.is_platform_company(i.company_id)
    ), 0),
    'subscriptions', (
      select coalesce(jsonb_object_agg(status, cnt), '{}'::jsonb)
      from (
        select c.subscription_status::text as status, count(*)::int as cnt
        from public.companies c
        where not public.is_platform_company(c.id)
        group by c.subscription_status
      ) s
    )
  ) into result;

  return result;
end;
$$;

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
  where not public.is_platform_company(c.id)
  order by c.created_at desc;
end;
$$;

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
    u.email,
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
  where not p.is_super_admin
    and not public.is_platform_company(p.company_id)
  order by p.created_at desc;
end;
$$;

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

  if public.is_platform_company(p_company_id) then
    raise exception 'Cannot modify a platform admin workspace';
  end if;

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

  if public.is_platform_company(p_company_id) then
    raise exception 'Cannot modify a platform admin workspace';
  end if;

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

create or replace function public.admin_delete_company(p_company_id uuid)
returns void
language plpgsql
security definer
set search_path = public
as $$
begin
  perform public.require_super_admin();

  if public.is_platform_company(p_company_id) then
    raise exception 'Cannot delete a platform admin workspace';
  end if;

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
