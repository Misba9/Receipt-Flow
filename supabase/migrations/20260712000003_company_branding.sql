-- =============================================================================
-- Company branding: primary color + logo storage
-- =============================================================================

alter table public.settings
  add column if not exists primary_color text not null default '#1a73f5'
    check (primary_color ~ '^#[0-9A-Fa-f]{6}$');

comment on column public.settings.primary_color is 'Company brand color used on invoices and UI accents.';

-- ---------------------------------------------------------------------------
-- Storage: company logos (path: {company_id}/logo.ext)
-- ---------------------------------------------------------------------------

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'company-logos',
  'company-logos',
  true,
  2097152, -- 2MB
  array['image/png', 'image/jpeg', 'image/webp', 'image/svg+xml']
)
on conflict (id) do update
set
  public = excluded.public,
  file_size_limit = excluded.file_size_limit,
  allowed_mime_types = excluded.allowed_mime_types;

-- Read: public bucket (logos displayed on invoices / UI)
create policy "company_logos_public_read"
on storage.objects
for select
to public
using (bucket_id = 'company-logos');

-- Upload / replace: company admins only, scoped to their company folder
create policy "company_logos_admin_insert"
on storage.objects
for insert
to authenticated
with check (
  bucket_id = 'company-logos'
  and public.is_company_admin()
  and (storage.foldername(name))[1] = public.current_company_id()::text
);

create policy "company_logos_admin_update"
on storage.objects
for update
to authenticated
using (
  bucket_id = 'company-logos'
  and public.is_company_admin()
  and (storage.foldername(name))[1] = public.current_company_id()::text
)
with check (
  bucket_id = 'company-logos'
  and public.is_company_admin()
  and (storage.foldername(name))[1] = public.current_company_id()::text
);

create policy "company_logos_admin_delete"
on storage.objects
for delete
to authenticated
using (
  bucket_id = 'company-logos'
  and public.is_company_admin()
  and (storage.foldername(name))[1] = public.current_company_id()::text
);
