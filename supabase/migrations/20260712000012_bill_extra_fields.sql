-- Extra bill / invoice / customer fields for create-bill flow

alter table public.invoices
  add column if not exists payment_mode text,
  add column if not exists payment_mode_other text,
  add column if not exists model text,
  add column if not exists place text,
  add column if not exists employee_name text;

comment on column public.invoices.payment_mode is
  'Payment mode: cash, card, phone_pay, google_pay, paytm, other';
comment on column public.invoices.payment_mode_other is
  'Free-text payment mode when payment_mode = other';
comment on column public.invoices.model is
  'Product / device / job model on the bill';
comment on column public.invoices.place is
  'Place / location for the bill';
comment on column public.invoices.employee_name is
  'Employee who handled the bill';

alter table public.invoice_items
  add column if not exists product_type text;

comment on column public.invoice_items.product_type is
  'Product type / category for the line item';

-- customers.company_name already exists from init schema
