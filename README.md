# ReceiptFlow

Multi-tenant SaaS for invoices, receipts, reports, and company workspaces.

## Stack

- React + Vite + TypeScript
- Tailwind CSS v4
- React Router DOM
- Supabase (Auth, Postgres, RLS, Storage, Edge Functions)
- TanStack Query · React Hook Form · Recharts · ExcelJS · pdf-lib

## Getting started

```bash
cp .env.example .env
# Fill VITE_SUPABASE_URL, VITE_SUPABASE_ANON_KEY, VITE_APP_URL
npm install
npm run dev
```

## Scripts

| Command | Description |
| --- | --- |
| `npm run dev` | Development server |
| `npm run build` | Type-check + production build |
| `npm run preview` | Preview production build |
| `npm run lint` | ESLint (zero warnings expected) |
| `npm run typecheck` | TypeScript only |

## Project structure

```
src/
  assets/
  components/
  contexts/
  hooks/
  layouts/
  lib/
  pages/
  services/
  utils/
  App.tsx
  main.tsx
```

## Environment variables (client)

| Variable | Required | Notes |
| --- | --- | --- |
| `VITE_SUPABASE_URL` | Yes | Project URL |
| `VITE_SUPABASE_ANON_KEY` | Yes | Anon / publishable key only |
| `VITE_APP_URL` | Yes | Public origin, no trailing slash |
| `VITE_APP_NAME` | No | Defaults to `ReceiptFlow` |

**Never** expose `SUPABASE_SERVICE_ROLE_KEY` or `RESEND_API_KEY` as `VITE_*` vars.

### Edge Function secrets (Resend)

```bash
supabase secrets set RESEND_API_KEY=re_xxxxxxxxx
supabase secrets set RESEND_FROM_EMAIL="ReceiptFlow <billing@yourdomain.com>"
supabase secrets set APP_URL=https://your-domain.com
supabase functions deploy send-invoice-email
```

## Supabase configuration

1. Apply **all** migrations in `supabase/migrations/` (`supabase db push` or SQL Editor in order).
2. Auth → URL configuration — add redirect URLs:
   - `http://localhost:5173/login`
   - `http://localhost:5173/reset-password`
   - `https://your-domain.com/login`
   - `https://your-domain.com/reset-password`
3. Site URL: `https://your-domain.com`
4. Confirm Storage buckets `company-logos` and `invoice-pdfs` exist (created by migrations).
5. Optional super admin:

```sql
update public.profiles
set is_super_admin = true
where id = '<auth-user-uuid>';
```

Details: [`supabase/README.md`](./supabase/README.md).

## Vercel deployment

1. Import the Git repo in Vercel (Framework Preset: **Vite**).
2. Set Production env vars: `VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY`, `VITE_APP_URL`, `VITE_APP_NAME`.
3. Deploy. `vercel.json` configures SPA rewrites, security headers, and asset caching.
4. Update `public/robots.txt` and `public/sitemap.xml` — replace `REPLACE_WITH_YOUR_DOMAIN`.
5. Point Supabase Auth Site URL + redirects at the Vercel domain.

## Production checklist

- [x] Environment variable validation (`src/lib/env.ts`)
- [x] Vercel SPA + security headers (`vercel.json`)
- [x] Supabase RLS + tenant isolation (migrations)
- [x] Error boundaries (root + lazy routes)
- [x] Loading states (`PageLoader` + Suspense)
- [x] 404 page with `noindex`
- [x] SEO meta tags (landing + document helpers)
- [x] Optimized build (manual chunks + route code-splitting)
- [ ] Set real domain in robots/sitemap
- [ ] Deploy Edge Function + Resend secrets
- [ ] Confirm Auth redirect URLs for production

## Security notes

- Browser uses **anon key** only; RLS + `company_id` enforce tenancy.
- Platform admin actions use SECURITY DEFINER RPCs gated by `is_super_admin()`.
- Security headers include CSP, HSTS, frame denial, and nosniff (see `vercel.json`).
