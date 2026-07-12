-- Soft email verification (does not block sign-in).
-- Auth "Confirm email" should be disabled so signup returns a session immediately.
-- Ownership is proven later via a magic-link OTP that sets email_verified_at.

alter table public.profiles
  add column if not exists email_verified_at timestamptz,
  add column if not exists email_verify_banner_dismissed_at timestamptz;

comment on column public.profiles.email_verified_at is
  'Set when the user proves inbox ownership via a verification magic link. Null = not verified for product UX.';
comment on column public.profiles.email_verify_banner_dismissed_at is
  'When set, the dashboard email-verify banner stays hidden until cleared.';

create or replace function public.mark_email_verified()
returns void
language plpgsql
security definer
set search_path = public
as $$
begin
  if auth.uid() is null then
    raise exception 'Not authenticated';
  end if;

  update public.profiles
  set email_verified_at = coalesce(email_verified_at, timezone('utc', now()))
  where id = auth.uid();
end;
$$;

create or replace function public.dismiss_email_verify_banner()
returns void
language plpgsql
security definer
set search_path = public
as $$
begin
  if auth.uid() is null then
    raise exception 'Not authenticated';
  end if;

  update public.profiles
  set email_verify_banner_dismissed_at = timezone('utc', now())
  where id = auth.uid();
end;
$$;

revoke all on function public.mark_email_verified() from public;
revoke all on function public.dismiss_email_verify_banner() from public;
grant execute on function public.mark_email_verified() to authenticated;
grant execute on function public.dismiss_email_verify_banner() to authenticated;
