-- Fast customer autocomplete: trigram indexes for partial name/phone/email search
create extension if not exists pg_trgm;

create index if not exists customers_company_name_trgm_idx
  on public.customers
  using gin (name gin_trgm_ops);

create index if not exists customers_company_phone_trgm_idx
  on public.customers
  using gin (phone gin_trgm_ops);

create index if not exists customers_company_email_trgm_idx
  on public.customers
  using gin (email gin_trgm_ops);

create index if not exists customers_company_active_created_idx
  on public.customers (company_id, is_active, created_at desc);
