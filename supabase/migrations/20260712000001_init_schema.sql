-- =============================================================================
-- ReceiptFlow — initial schema
-- Multi-tenant: all tenant data is scoped by company_id
-- =============================================================================

create extension if not exists "pgcrypto";

-- ---------------------------------------------------------------------------
-- Enums
-- ---------------------------------------------------------------------------

create type public.profile_role as enum ('owner', 'admin', 'member');

create type public.invoice_status as enum (
  'draft',
  'sent',
  'paid',
  'overdue',
  'cancelled',
  'void'
);

-- ---------------------------------------------------------------------------
-- Helpers: updated_at
-- ---------------------------------------------------------------------------

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = timezone('utc', now());
  return new;
end;
$$;

-- ---------------------------------------------------------------------------
-- companies
-- ---------------------------------------------------------------------------

create table public.companies (
  id uuid primary key default gen_random_uuid(),
  name text not null check (char_length(trim(name)) > 0),
  slug text unique,
  email text,
  phone text,
  website text,
  address_line1 text,
  address_line2 text,
  city text,
  state text,
  postal_code text,
  country text,
  tax_id text,
  logo_url text,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create index companies_slug_idx on public.companies (slug);

create trigger companies_set_updated_at
before update on public.companies
for each row
execute function public.set_updated_at();

comment on table public.companies is 'Tenant organizations. All business data belongs to a company.';

-- ---------------------------------------------------------------------------
-- profiles (1:1 with auth.users, belongs to a company)
-- ---------------------------------------------------------------------------

create table public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  company_id uuid not null references public.companies (id) on delete cascade,
  full_name text,
  avatar_url text,
  role public.profile_role not null default 'member',
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create index profiles_company_id_idx on public.profiles (company_id);
create index profiles_role_idx on public.profiles (company_id, role);

create trigger profiles_set_updated_at
before update on public.profiles
for each row
execute function public.set_updated_at();

comment on table public.profiles is 'App user profiles linked to auth.users and a tenant company.';

-- ---------------------------------------------------------------------------
-- customers
-- ---------------------------------------------------------------------------

create table public.customers (
  id uuid primary key default gen_random_uuid(),
  company_id uuid not null references public.companies (id) on delete cascade,
  name text not null check (char_length(trim(name)) > 0),
  email text,
  phone text,
  company_name text,
  address_line1 text,
  address_line2 text,
  city text,
  state text,
  postal_code text,
  country text,
  tax_id text,
  notes text,
  is_active boolean not null default true,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create index customers_company_id_idx on public.customers (company_id);
create index customers_company_email_idx on public.customers (company_id, email);
create index customers_company_name_idx on public.customers (company_id, name);

create trigger customers_set_updated_at
before update on public.customers
for each row
execute function public.set_updated_at();

comment on table public.customers is 'Customers belonging to a company.';

-- ---------------------------------------------------------------------------
-- invoices
-- ---------------------------------------------------------------------------

create table public.invoices (
  id uuid primary key default gen_random_uuid(),
  company_id uuid not null references public.companies (id) on delete cascade,
  customer_id uuid not null references public.customers (id) on delete restrict,
  invoice_number text not null,
  status public.invoice_status not null default 'draft',
  issue_date date not null default (timezone('utc', now()))::date,
  due_date date,
  currency text not null default 'USD' check (char_length(currency) = 3),
  subtotal numeric(14, 2) not null default 0 check (subtotal >= 0),
  tax_rate numeric(7, 4) not null default 0 check (tax_rate >= 0),
  tax_amount numeric(14, 2) not null default 0 check (tax_amount >= 0),
  discount_amount numeric(14, 2) not null default 0 check (discount_amount >= 0),
  total numeric(14, 2) not null default 0 check (total >= 0),
  notes text,
  footer text,
  paid_at timestamptz,
  created_by uuid references public.profiles (id) on delete set null,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now()),
  constraint invoices_company_number_unique unique (company_id, invoice_number),
  constraint invoices_due_after_issue check (due_date is null or due_date >= issue_date)
);

create index invoices_company_id_idx on public.invoices (company_id);
create index invoices_customer_id_idx on public.invoices (customer_id);
create index invoices_company_status_idx on public.invoices (company_id, status);
create index invoices_company_issue_date_idx on public.invoices (company_id, issue_date desc);

create trigger invoices_set_updated_at
before update on public.invoices
for each row
execute function public.set_updated_at();

comment on table public.invoices is 'Invoices scoped to a company and customer.';

-- Ensure invoice customer belongs to the same company
create or replace function public.validate_invoice_customer_company()
returns trigger
language plpgsql
as $$
declare
  customer_company_id uuid;
begin
  select company_id into customer_company_id
  from public.customers
  where id = new.customer_id;

  if customer_company_id is null then
    raise exception 'Customer % does not exist', new.customer_id;
  end if;

  if customer_company_id <> new.company_id then
    raise exception 'Customer does not belong to the same company as the invoice';
  end if;

  return new;
end;
$$;

create trigger invoices_validate_customer_company
before insert or update of customer_id, company_id on public.invoices
for each row
execute function public.validate_invoice_customer_company();

-- ---------------------------------------------------------------------------
-- invoice_items
-- company_id is denormalized for efficient RLS without joins
-- ---------------------------------------------------------------------------

create table public.invoice_items (
  id uuid primary key default gen_random_uuid(),
  company_id uuid not null references public.companies (id) on delete cascade,
  invoice_id uuid not null references public.invoices (id) on delete cascade,
  description text not null check (char_length(trim(description)) > 0),
  quantity numeric(14, 4) not null default 1 check (quantity > 0),
  unit_price numeric(14, 2) not null default 0 check (unit_price >= 0),
  amount numeric(14, 2) not null default 0 check (amount >= 0),
  position integer not null default 0 check (position >= 0),
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create index invoice_items_company_id_idx on public.invoice_items (company_id);
create index invoice_items_invoice_id_idx on public.invoice_items (invoice_id);
create index invoice_items_invoice_position_idx on public.invoice_items (invoice_id, position);

create trigger invoice_items_set_updated_at
before update on public.invoice_items
for each row
execute function public.set_updated_at();

comment on table public.invoice_items is 'Line items for an invoice. company_id mirrors the parent invoice for RLS.';

create or replace function public.sync_invoice_item_company()
returns trigger
language plpgsql
as $$
declare
  parent_company_id uuid;
begin
  select company_id into parent_company_id
  from public.invoices
  where id = new.invoice_id;

  if parent_company_id is null then
    raise exception 'Invoice % does not exist', new.invoice_id;
  end if;

  new.company_id := parent_company_id;

  if new.amount is distinct from round(new.quantity * new.unit_price, 2) then
    new.amount := round(new.quantity * new.unit_price, 2);
  end if;

  return new;
end;
$$;

create trigger invoice_items_sync_company
before insert or update of invoice_id, quantity, unit_price, amount on public.invoice_items
for each row
execute function public.sync_invoice_item_company();

-- ---------------------------------------------------------------------------
-- settings (one row per company)
-- ---------------------------------------------------------------------------

create table public.settings (
  id uuid primary key default gen_random_uuid(),
  company_id uuid not null unique references public.companies (id) on delete cascade,
  default_currency text not null default 'USD' check (char_length(default_currency) = 3),
  default_tax_rate numeric(7, 4) not null default 0 check (default_tax_rate >= 0),
  invoice_prefix text not null default 'INV-' check (char_length(trim(invoice_prefix)) > 0),
  next_invoice_number integer not null default 1 check (next_invoice_number > 0),
  invoice_due_days integer not null default 30 check (invoice_due_days >= 0),
  invoice_footer text,
  invoice_notes text,
  timezone text not null default 'UTC',
  date_format text not null default 'YYYY-MM-DD',
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create index settings_company_id_idx on public.settings (company_id);

create trigger settings_set_updated_at
before update on public.settings
for each row
execute function public.set_updated_at();

comment on table public.settings is 'Per-company application and invoicing settings.';

-- ---------------------------------------------------------------------------
-- Tenant helpers (SECURITY DEFINER — used by RLS policies)
-- ---------------------------------------------------------------------------

create or replace function public.current_company_id()
returns uuid
language sql
stable
security definer
set search_path = public
as $$
  select company_id
  from public.profiles
  where id = auth.uid()
$$;

revoke all on function public.current_company_id() from public;
grant execute on function public.current_company_id() to authenticated;

create or replace function public.current_user_role()
returns public.profile_role
language sql
stable
security definer
set search_path = public
as $$
  select role
  from public.profiles
  where id = auth.uid()
$$;

revoke all on function public.current_user_role() from public;
grant execute on function public.current_user_role() to authenticated;

create or replace function public.is_company_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.profiles
    where id = auth.uid()
      and role in ('owner', 'admin')
  )
$$;

revoke all on function public.is_company_admin() from public;
grant execute on function public.is_company_admin() to authenticated;

-- ---------------------------------------------------------------------------
-- Provision company + profile + settings on signup
-- Reads optional raw_user_meta_data: full_name, company_name
-- ---------------------------------------------------------------------------

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  new_company_id uuid;
  company_name text;
  profile_name text;
begin
  company_name := nullif(trim(coalesce(new.raw_user_meta_data ->> 'company_name', '')), '');
  profile_name := nullif(trim(coalesce(new.raw_user_meta_data ->> 'full_name', '')), '');

  if company_name is null then
    company_name := coalesce(profile_name, split_part(new.email, '@', 1), 'My Company')
      || '''s Company';
  end if;

  insert into public.companies (name)
  values (company_name)
  returning id into new_company_id;

  insert into public.profiles (id, company_id, full_name, role)
  values (new.id, new_company_id, profile_name, 'owner');

  -- settings row is created by companies_create_settings trigger

  return new;
end;
$$;

create trigger on_auth_user_created
after insert on auth.users
for each row
execute function public.handle_new_user();

-- Auto-create settings if a company is inserted outside signup (safety net)
create or replace function public.handle_new_company_settings()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.settings (company_id)
  values (new.id)
  on conflict (company_id) do nothing;
  return new;
end;
$$;

create trigger companies_create_settings
after insert on public.companies
for each row
execute function public.handle_new_company_settings();
