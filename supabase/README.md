# ReceiptFlow Supabase schema

## Tables

| Table | Purpose |
| --- | --- |
| `companies` | Tenant organization (+ subscription / active flags) |
| `profiles` | User profile (`auth.users` ↔ company, `is_super_admin`) |
| `customers` | Customers per company |
| `invoices` | Invoices per company |
| `invoice_items` | Invoice line items |
| `settings` | One settings row per company |

## Tenancy model

Every business row is scoped by `company_id`.

On signup, a trigger (`handle_new_user`) creates:

1. a `companies` row  
2. a `profiles` row (`role = owner`)  
3. a `settings` row  

Optional register metadata: `full_name`, `company_name`.

## Row Level Security

RLS is enabled and **forced** on all tenant tables.

Helpers: `current_company_id()`, `current_user_role()`, `is_company_admin()`, `is_super_admin()`.

Cross-tenant platform admin reads/mutations go through SECURITY DEFINER RPCs only (never blanket client SELECT on other tenants).

## Apply migrations

Run **in order** (or use the CLI):

1. `20260712000001_init_schema.sql`
2. `20260712000002_row_level_security.sql`
3. `20260712000003_company_branding.sql`
4. `20260712000004_invoice_pdf_storage.sql`
5. `20260712000005_multi_tenant_hardening.sql`
6. `20260712000006_super_admin.sql`
7. `20260712000007_ensure_workspace.sql`
8. `20260712000008_company_sender_branding.sql`
9. `20260712000009_onboarding.sql`
10. `20260712000010_exclude_platform_workspaces.sql`
11. `20260712000011_platform_company_flag.sql`
12. `20260712000012_bill_extra_fields.sql`
13. `20260712000013_soft_email_verification.sql`

```bash
supabase db push
```

## Soft email verification

Email confirmation must **not** block sign-in (Auth → Providers → Email → **Confirm email** OFF).

Product verification is tracked on `profiles.email_verified_at` (migration `000013`). Users can verify later from the dashboard banner or Settings → Profile via a magic-link OTP to `/auth/callback?next=email-verified`.

## Production Auth URLs

Supabase Dashboard → Authentication → URL Configuration:

| Setting | Example |
| --- | --- |
| Site URL | Your primary production origin (e.g. `https://your-domain.com`) |
| Redirect URLs | `https://your-domain.com/auth/callback`, `https://your-domain.com/auth/callback?next=reset-password`, `https://your-domain.com/auth/callback?next=email-verified`, plus matching localhost URLs for development |

Do **not** bake a localhost host into client auth redirects — use `window.location.origin`.

## Invoice email (Resend)

```bash
supabase secrets set RESEND_API_KEY=re_xxxxxxxxx
supabase secrets set EMAIL_FROM=noreply@receiptflow.app
supabase secrets set APP_URL=https://your-domain.com
supabase functions deploy send-invoice-email
```

From header becomes `"{companies.sender_name}" <EMAIL_FROM>`. Reply-To uses `companies.reply_to` when set. Use a verified Resend domain in production.
## Super Admin

```sql
update public.profiles
set is_super_admin = true
where id = '<auth-user-uuid>';
```

Then open `/admin`.
