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

Run **in order**:

1. `20260712000001_init_schema.sql`
2. `20260712000002_row_level_security.sql`
3. `20260712000003_company_branding.sql`
4. `20260712000004_invoice_pdf_storage.sql`
5. `20260712000005_multi_tenant_hardening.sql`
6. `20260712000006_super_admin.sql`

```bash
supabase db push
```

## Production Auth URLs

Supabase Dashboard → Authentication → URL Configuration:

| Setting | Example |
| --- | --- |
| Site URL | `https://your-domain.com` |
| Redirect URLs | `https://your-domain.com/login`, `https://your-domain.com/reset-password` |

Also keep localhost URLs for development.

## Invoice email (Resend)

```bash
supabase secrets set RESEND_API_KEY=re_xxxxxxxxx
supabase secrets set RESEND_FROM_EMAIL="ReceiptFlow <billing@yourdomain.com>"
supabase secrets set APP_URL=https://your-domain.com
supabase functions deploy send-invoice-email
```

Use a verified Resend domain in production.

## Super Admin

```sql
update public.profiles
set is_super_admin = true
where id = '<auth-user-uuid>';
```

Then open `/admin`.
