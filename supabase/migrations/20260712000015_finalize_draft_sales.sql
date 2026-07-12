-- =============================================================================
-- Bills with a payment mode are completed sales — promote leftover drafts to paid
-- =============================================================================

update public.invoices
set
  status = 'paid',
  paid_at = coalesce(paid_at, created_at, (issue_date::timestamptz))
where status = 'draft'
  and payment_mode is not null;

-- Sync amount_paid when the column exists (added in 000014)
do $$
begin
  if exists (
    select 1
    from information_schema.columns
    where table_schema = 'public'
      and table_name = 'invoices'
      and column_name = 'amount_paid'
  ) then
    update public.invoices
    set amount_paid = total
    where status = 'paid'
      and payment_mode is not null
      and (amount_paid is null or amount_paid = 0)
      and total > 0;
  end if;
end $$;
