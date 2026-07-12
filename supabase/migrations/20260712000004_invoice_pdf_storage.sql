-- =============================================================================
-- Invoice PDF storage: pdf_url on invoices + private storage bucket
-- =============================================================================

alter table public.invoices
  add column if not exists pdf_url text,
  add column if not exists pdf_generated_at timestamptz;

comment on column public.invoices.pdf_url is
  'Supabase Storage object path for the generated invoice PDF (bucket: invoice-pdfs).';
comment on column public.invoices.pdf_generated_at is
  'When the stored PDF was last generated and uploaded.';

-- ---------------------------------------------------------------------------
-- Storage: invoice PDFs (path: {company_id}/{invoice_id}.pdf)
-- Private bucket — authenticated company members only
-- ---------------------------------------------------------------------------

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'invoice-pdfs',
  'invoice-pdfs',
  false,
  10485760, -- 10MB
  array['application/pdf']
)
on conflict (id) do update
set
  public = excluded.public,
  file_size_limit = excluded.file_size_limit,
  allowed_mime_types = excluded.allowed_mime_types;

create policy "invoice_pdfs_select_own_company"
on storage.objects
for select
to authenticated
using (
  bucket_id = 'invoice-pdfs'
  and (storage.foldername(name))[1] = public.current_company_id()::text
);

create policy "invoice_pdfs_insert_own_company"
on storage.objects
for insert
to authenticated
with check (
  bucket_id = 'invoice-pdfs'
  and (storage.foldername(name))[1] = public.current_company_id()::text
);

create policy "invoice_pdfs_update_own_company"
on storage.objects
for update
to authenticated
using (
  bucket_id = 'invoice-pdfs'
  and (storage.foldername(name))[1] = public.current_company_id()::text
)
with check (
  bucket_id = 'invoice-pdfs'
  and (storage.foldername(name))[1] = public.current_company_id()::text
);

create policy "invoice_pdfs_delete_own_company"
on storage.objects
for delete
to authenticated
using (
  bucket_id = 'invoice-pdfs'
  and (storage.foldername(name))[1] = public.current_company_id()::text
);
