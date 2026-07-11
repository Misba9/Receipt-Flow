# ReceiptFlow Supabase schema

## Tables

| Table | Purpose |
| --- | --- |
| `companies` | Tenant organization |
| `profiles` | User profile (`auth.users` ↔ company) |
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

Pass optional metadata at register time:

- `full_name`
- `company_name`

## Row Level Security

RLS is enabled and forced on all tables.

Helpers:

- `current_company_id()` — caller’s company
- `current_user_role()` — caller’s role
- `is_company_admin()` — owner or admin

Authenticated users can only read/write rows where `company_id = current_company_id()`.

## Apply migrations

### Supabase CLI

```bash
supabase db push
# or
supabase migration up
```

### SQL Editor

Run in order:

1. `migrations/20260712000001_init_schema.sql`
2. `migrations/20260712000002_row_level_security.sql`

No seed/sample data is included.
