-- Re-apply finalize for any leftover draft sales with payment_mode
update public.invoices
set
  status = 'paid',
  paid_at = coalesce(paid_at, created_at, (issue_date::timestamptz)),
  amount_paid = coalesce(nullif(amount_paid, 0), total)
where status = 'draft'
  and payment_mode is not null;
