# ReceiptFlow

Production-ready SaaS scaffold for receipt management.

## Stack

- React + Vite + TypeScript
- Tailwind CSS v4
- React Router DOM
- Supabase
- TanStack Query
- React Hook Form
- Lucide Icons
- ESLint + Prettier

## Getting started

```bash
cp .env.example .env
npm install
npm run dev
```

## Scripts

| Command | Description |
| --- | --- |
| `npm run dev` | Start development server |
| `npm run build` | Type-check and production build |
| `npm run preview` | Preview production build |
| `npm run lint` | Run ESLint |

## Project structure

```
src/
  assets/           # Static assets
  components/
    layout/         # App shell, sidebar, header
    ui/             # Reusable UI primitives
  features/         # Domain modules (auth, receipts, dashboard)
  hooks/            # Shared hooks
  lib/              # Supabase client, utils, query client
  pages/            # Route-level pages
  providers/        # App, theme, and query providers
  routes/           # Route config and path constants
  types/            # Shared TypeScript types
```

## Environment variables

Copy `.env.example` to `.env` and set:

- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_ANON_KEY`
- `VITE_APP_NAME`
- `VITE_APP_URL`

## Authentication

Supabase Auth is wired for:

- Login / Register / Forgot password / Reset password
- Protected dashboard routes
- Session persistence (`localStorage` + auto refresh)
- Logout from the header

In the Supabase dashboard, add these **Redirect URLs**:

- `http://localhost:5173/login`
- `http://localhost:5173/reset-password`

Then set `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` in `.env`.

## Database

SQL migrations live in `supabase/migrations/`. See `supabase/README.md`.

Apply with the Supabase CLI (`supabase db push`) or run the scripts in order in the SQL Editor.

## Status

Auth and database schema (with RLS) are implemented. Receipt/invoice UI logic is not implemented yet.
