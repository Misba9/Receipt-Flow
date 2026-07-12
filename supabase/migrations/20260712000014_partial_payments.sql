-- =============================================================================
-- Partial payments: status + amount_paid for accurate revenue / outstanding
-- =============================================================================

alter type public.invoice_status add value if not exists 'partially_paid';

alter table public.invoices
  add column if not exists amount_paid numeric(14, 2) not null default 0
  check (amount_paid >= 0);

comment on column public.invoices.amount_paid is
  'Amount received so far. For paid invoices this equals total; for partially_paid it is less than total.';

-- Fully paid invoices should reflect amount_paid = total
update public.invoices
set amount_paid = total
where status = 'paid'
  and amount_paid = 0
  and total > 0;

-- Keep amount_paid in sync when status flips to/from paid
create or replace function public.sync_invoice_amount_paid()
returns trigger
language plpgsql
as $$
begin
  if new.status::text = 'paid' then
    new.amount_paid := new.total;
    if new.paid_at is null then
      new.paid_at := timezone('utc', now());
    end if;
  elsif new.status::text = 'partially_paid' then
    if new.amount_paid <= 0 then
      new.amount_paid := 0;
    end if;
    if new.amount_paid >= new.total and new.total > 0 then
      new.status := 'paid';
      new.amount_paid := new.total;
      if new.paid_at is null then
        new.paid_at := timezone('utc', now());
      end if;
    end if;
  elsif new.status::text in ('draft', 'sent', 'overdue', 'cancelled', 'void') then
    if tg_op = 'UPDATE' and old.status::text = 'paid' and new.status::text <> 'paid' then
      new.paid_at := null;
    end if;
  end if;

  return new;
end;
$$;

drop trigger if exists invoices_sync_amount_paid on public.invoices;
create trigger invoices_sync_amount_paid
  before insert or update of status, total, amount_paid, paid_at
  on public.invoices
  for each row
  execute function public.sync_invoice_amount_paid();
