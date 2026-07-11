-- =============================================================================
-- ReceiptFlow — Row Level Security
-- Rule: authenticated users may only access rows for their own company_id
-- =============================================================================

-- ---------------------------------------------------------------------------
-- Enable RLS on all tenant tables
-- ---------------------------------------------------------------------------

alter table public.companies enable row level security;
alter table public.profiles enable row level security;
alter table public.customers enable row level security;
alter table public.invoices enable row level security;
alter table public.invoice_items enable row level security;
alter table public.settings enable row level security;

-- Force RLS for table owners as well (defense in depth)
alter table public.companies force row level security;
alter table public.profiles force row level security;
alter table public.customers force row level security;
alter table public.invoices force row level security;
alter table public.invoice_items force row level security;
alter table public.settings force row level security;

-- ---------------------------------------------------------------------------
-- companies
-- Users can see/update only their own company. Inserts happen via signup trigger.
-- ---------------------------------------------------------------------------

create policy "companies_select_own"
on public.companies
for select
to authenticated
using (id = public.current_company_id());

create policy "companies_update_own_admin"
on public.companies
for update
to authenticated
using (
  id = public.current_company_id()
  and public.is_company_admin()
)
with check (
  id = public.current_company_id()
  and public.is_company_admin()
);

-- No direct INSERT/DELETE for clients — companies are created by signup trigger.
-- Owners may soft-manage via update only.

-- ---------------------------------------------------------------------------
-- profiles
-- Members of a company can read teammates. Users update themselves.
-- Admins can update roles (except elevating outside company).
-- ---------------------------------------------------------------------------

create policy "profiles_select_same_company"
on public.profiles
for select
to authenticated
using (company_id = public.current_company_id());

create policy "profiles_update_self"
on public.profiles
for update
to authenticated
using (id = auth.uid())
with check (
  id = auth.uid()
  and company_id = public.current_company_id()
);

create policy "profiles_update_admin"
on public.profiles
for update
to authenticated
using (
  company_id = public.current_company_id()
  and public.is_company_admin()
)
with check (
  company_id = public.current_company_id()
  and public.is_company_admin()
);

-- Inserts are performed by the security definer signup trigger only.

-- ---------------------------------------------------------------------------
-- customers
-- ---------------------------------------------------------------------------

create policy "customers_select_own_company"
on public.customers
for select
to authenticated
using (company_id = public.current_company_id());

create policy "customers_insert_own_company"
on public.customers
for insert
to authenticated
with check (company_id = public.current_company_id());

create policy "customers_update_own_company"
on public.customers
for update
to authenticated
using (company_id = public.current_company_id())
with check (company_id = public.current_company_id());

create policy "customers_delete_own_company"
on public.customers
for delete
to authenticated
using (company_id = public.current_company_id());

-- ---------------------------------------------------------------------------
-- invoices
-- ---------------------------------------------------------------------------

create policy "invoices_select_own_company"
on public.invoices
for select
to authenticated
using (company_id = public.current_company_id());

create policy "invoices_insert_own_company"
on public.invoices
for insert
to authenticated
with check (
  company_id = public.current_company_id()
  and (created_by is null or created_by = auth.uid())
);

create policy "invoices_update_own_company"
on public.invoices
for update
to authenticated
using (company_id = public.current_company_id())
with check (company_id = public.current_company_id());

create policy "invoices_delete_own_company"
on public.invoices
for delete
to authenticated
using (company_id = public.current_company_id());

-- ---------------------------------------------------------------------------
-- invoice_items
-- ---------------------------------------------------------------------------

create policy "invoice_items_select_own_company"
on public.invoice_items
for select
to authenticated
using (company_id = public.current_company_id());

create policy "invoice_items_insert_own_company"
on public.invoice_items
for insert
to authenticated
with check (company_id = public.current_company_id());

create policy "invoice_items_update_own_company"
on public.invoice_items
for update
to authenticated
using (company_id = public.current_company_id())
with check (company_id = public.current_company_id());

create policy "invoice_items_delete_own_company"
on public.invoice_items
for delete
to authenticated
using (company_id = public.current_company_id());

-- ---------------------------------------------------------------------------
-- settings
-- Readable by all company members; writable by owners/admins
-- ---------------------------------------------------------------------------

create policy "settings_select_own_company"
on public.settings
for select
to authenticated
using (company_id = public.current_company_id());

create policy "settings_update_own_company_admin"
on public.settings
for update
to authenticated
using (
  company_id = public.current_company_id()
  and public.is_company_admin()
)
with check (
  company_id = public.current_company_id()
  and public.is_company_admin()
);

-- Inserts happen via company signup / company trigger (security definer).

-- ---------------------------------------------------------------------------
-- Grants (Supabase roles)
-- ---------------------------------------------------------------------------

grant usage on schema public to authenticated;

grant select, update on public.companies to authenticated;
grant select, update on public.profiles to authenticated;
grant select, insert, update, delete on public.customers to authenticated;
grant select, insert, update, delete on public.invoices to authenticated;
grant select, insert, update, delete on public.invoice_items to authenticated;
grant select, update on public.settings to authenticated;
