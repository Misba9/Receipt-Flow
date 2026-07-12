-- =============================================================================
-- ReceiptFlow — multi-tenant hardening
-- Ensures one-company-per-user isolation stays airtight under RLS.
-- =============================================================================

-- ---------------------------------------------------------------------------
-- Profiles: users cannot change their own role or move companies
-- ---------------------------------------------------------------------------

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

-- Only owners may update other profiles (e.g. role changes). company_id stays fixed.
drop policy if exists "profiles_update_admin" on public.profiles;

create policy "profiles_update_owner"
on public.profiles
for update
to authenticated
using (
  company_id = public.current_company_id()
  and public.current_user_role() = 'owner'
)
with check (
  company_id = public.current_company_id()
  and public.current_user_role() = 'owner'
);

-- Hard stop: never allow moving a profile to another company
create or replace function public.prevent_profile_company_change()
returns trigger
language plpgsql
as $$
begin
  if tg_op = 'UPDATE' and new.company_id is distinct from old.company_id then
    raise exception 'Profiles cannot be moved between companies';
  end if;
  return new;
end;
$$;

drop trigger if exists profiles_prevent_company_change on public.profiles;

create trigger profiles_prevent_company_change
before update of company_id on public.profiles
for each row
execute function public.prevent_profile_company_change();

-- ---------------------------------------------------------------------------
-- Tenant rows: company_id is immutable after insert
-- ---------------------------------------------------------------------------

create or replace function public.prevent_company_id_change()
returns trigger
language plpgsql
as $$
begin
  if new.company_id is distinct from old.company_id then
    raise exception 'company_id cannot be changed';
  end if;
  return new;
end;
$$;

drop trigger if exists customers_prevent_company_change on public.customers;
create trigger customers_prevent_company_change
before update of company_id on public.customers
for each row
execute function public.prevent_company_id_change();

drop trigger if exists invoices_prevent_company_change on public.invoices;
create trigger invoices_prevent_company_change
before update of company_id on public.invoices
for each row
execute function public.prevent_company_id_change();

drop trigger if exists invoice_items_prevent_company_change on public.invoice_items;
create trigger invoice_items_prevent_company_change
before update of company_id on public.invoice_items
for each row
execute function public.prevent_company_id_change();

drop trigger if exists settings_prevent_company_change on public.settings;
create trigger settings_prevent_company_change
before update of company_id on public.settings
for each row
execute function public.prevent_company_id_change();

-- ---------------------------------------------------------------------------
-- Members can bump the invoice counter for their own company only
-- (settings UPDATE otherwise requires admin)
-- ---------------------------------------------------------------------------

create or replace function public.bump_next_invoice_number()
returns void
language plpgsql
security definer
set search_path = public
as $$
declare
  cid uuid := public.current_company_id();
begin
  if cid is null then
    raise exception 'Not authenticated';
  end if;

  update public.settings
  set next_invoice_number = next_invoice_number + 1
  where company_id = cid;

  if not found then
    raise exception 'Company settings not found';
  end if;
end;
$$;

revoke all on function public.bump_next_invoice_number() from public;
grant execute on function public.bump_next_invoice_number() to authenticated;

comment on function public.bump_next_invoice_number() is
  'Atomically increments next_invoice_number for the caller''s company only.';

-- ---------------------------------------------------------------------------
-- Documentation
-- ---------------------------------------------------------------------------

comment on function public.current_company_id() is
  'Returns the authenticated user''s company_id from profiles. Used by all RLS policies.';

comment on table public.profiles is
  '1:1 with auth.users. Each user belongs to exactly one company (company_id NOT NULL, immutable).';
