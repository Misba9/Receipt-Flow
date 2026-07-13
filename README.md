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
npm install
npm run dev
```



## Supabase configuration


```bash
npx supabase db push
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
supabase secrets set EMAIL_FROM=noreply@receiptflow.app
supabase secrets set APP_URL=https://your-domain.com
supabase functions deploy send-invoice-email
```

`EMAIL_FROM` is the single verified mailbox. Each workspace sets its own **Sender name** and optional **Reply-To** in Settings → Email branding.
