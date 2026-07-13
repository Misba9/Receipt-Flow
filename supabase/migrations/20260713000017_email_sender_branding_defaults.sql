-- =============================================================================
-- Ensure every company has a sender display name for multi-tenant From headers
-- =============================================================================

comment on column public.companies.sender_name is
  'Display name in Resend From: "{sender_name} <EMAIL_FROM>". Mailbox is platform EMAIL_FROM.';
comment on column public.companies.sender_email is
  'Deprecated — From mailbox is the platform EMAIL_FROM secret, not per-tenant.';
comment on column public.companies.reply_to is
  'Optional Reply-To for invoice emails. When empty, reply_to is omitted from the send.';

update public.companies
set sender_name = coalesce(nullif(trim(sender_name), ''), nullif(trim(name), ''), 'Company')
where sender_name is null
   or trim(sender_name) = '';

-- Prefer dedicated reply_to; keep existing values; backfill only when blank
update public.companies
set reply_to = nullif(trim(email), '')
where (reply_to is null or trim(reply_to) = '')
  and email is not null
  and trim(email) <> '';
