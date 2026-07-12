-- =============================================================================
-- Per-company email sender branding (multi-tenant)
-- Global Resend API key stays in Edge Function secrets — never on companies.
-- =============================================================================

alter table public.companies
  add column if not exists sender_name text,
  add column if not exists sender_email text,
  add column if not exists reply_to text;

comment on column public.companies.sender_name is
  'Display name used in Resend From: "Sender Name <sender_email>"';
comment on column public.companies.sender_email is
  'Mailbox used as Resend From address (must be on a platform-verified domain)';
comment on column public.companies.reply_to is
  'Optional Reply-To for invoice emails; falls back to companies.email';

-- Backfill sensible defaults from existing company profile fields
update public.companies
set
  sender_name = coalesce(nullif(trim(sender_name), ''), nullif(trim(name), ''), 'Company'),
  sender_email = coalesce(nullif(trim(sender_email), ''), nullif(trim(email), '')),
  reply_to = coalesce(nullif(trim(reply_to), ''), nullif(trim(email), ''))
where true;

-- Note: company display name → companies.name
--        logo → companies.logo_url
--        phone/email/website/address → existing companies columns
--        invoice_prefix / invoice_footer / theme (primary_color) → public.settings
-- These remain the source of truth; the settings API exposes them as one CompanySettings DTO.
