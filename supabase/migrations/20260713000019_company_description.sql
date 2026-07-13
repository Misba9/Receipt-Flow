-- Company description for Settings profile card
alter table public.companies
  add column if not exists description text;

comment on column public.companies.description is
  'Short public company description shown on the Settings profile card (max 500 chars in app).';
