-- New workspaces get sender_name = company name by default
create or replace function public.ensure_user_workspace()
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  uid uuid := auth.uid();
  existing_company_id uuid;
  new_company_id uuid;
  meta jsonb;
  company_name text;
  profile_name text;
  company_active boolean;
begin
  if uid is null then
    raise exception 'Not authenticated';
  end if;

  select p.company_id, coalesce(c.is_active, true)
    into existing_company_id, company_active
  from public.profiles p
  left join public.companies c on c.id = p.company_id
  where p.id = uid;

  if existing_company_id is not null then
    return jsonb_build_object(
      'company_id', existing_company_id,
      'full_name', (select full_name from public.profiles where id = uid),
      'is_super_admin', (select is_super_admin from public.profiles where id = uid),
      'company_active', company_active,
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

  insert into public.companies (name, sender_name)
  values (company_name, company_name)
  returning id into new_company_id;

  insert into public.profiles (id, company_id, full_name, role, is_super_admin)
  values (uid, new_company_id, profile_name, 'owner', false);

  insert into public.settings (company_id)
  values (new_company_id)
  on conflict (company_id) do nothing;

  return jsonb_build_object(
    'company_id', new_company_id,
    'full_name', profile_name,
    'is_super_admin', false,
    'company_active', true,
    'created', true
  );
end;
$$;
