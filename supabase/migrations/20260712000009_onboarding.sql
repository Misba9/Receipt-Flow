-- =============================================================================
-- Onboarding: business type + completion tracking
-- =============================================================================

alter table public.companies
  add column if not exists business_type text,
  add column if not exists onboarding_completed_at timestamptz;

comment on column public.companies.business_type is
  'Industry / business type selected during onboarding';
comment on column public.companies.onboarding_completed_at is
  'Set when the multi-step onboarding wizard finishes';

create index if not exists companies_onboarding_completed_idx
  on public.companies (onboarding_completed_at);

-- Existing workspaces skip the new wizard
update public.companies
set onboarding_completed_at = coalesce(onboarding_completed_at, created_at)
where onboarding_completed_at is null;
