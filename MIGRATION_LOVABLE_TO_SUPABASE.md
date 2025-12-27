# Migration: Remove Lovable Cloud → Use Supabase

This document describes how to remove Lovable Cloud dependencies, migrate data to Supabase, and update the project to use Supabase exclusively.

## Summary
- Remove `lovable-tagger` dependency (done).
- Create a Supabase project and obtain keys.
- Create required tables & policies in Supabase (SQL provided).
- Export data from Lovable Cloud (CSV/JSON/SQL) and import into Supabase.
- Update environment variables and secrets.
- Verify booking/auth flows.

## 1) Create Supabase project
Option A (GUI):
- Go to https://app.supabase.com and create a new project.
- In Project Settings → API, copy `URL` and `anon` (public) key and the `service_role` key.

Option B (CLI - if supported):
```bash
# Login
supabase login
# Create project (may require org id; if unsupported, use GUI)
supabase projects create --name "catalyst-ai" --org-id <ORG_ID> --db-password <DB_PASSWORD>
```

## 2) Environment variables
Add to `.env` (or to platform secrets / CI variables):
- `VITE_SUPABASE_URL` = `https://<project-ref>.supabase.co`
- `VITE_SUPABASE_PUBLISHABLE_KEY` or `NEXT_PUBLIC_SUPABASE_ANON_KEY` = anon/public key
- `SUPABASE_SERVICE_ROLE_KEY` = service_role key (server only - do NOT expose to client)
- `SUPABASE_URL` = same as `VITE_SUPABASE_URL`

Use `.env.example` in repo to show placeholders (file added).

## 3) Database schema (SQL)
Below are essential table definitions used by the app. Run these via `psql` or Supabase SQL editor.

-- contact_submissions
```sql
create table if not exists public.contact_submissions (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  email text not null,
  message text not null,
  status text default 'new',
  created_at timestamptz default now()
);
```

-- profiles (linked to Supabase auth)
```sql
create table if not exists public.profiles (
  id uuid primary key,
  email text,
  full_name text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);
```

-- user_roles enum and table
```sql
create type if not exists public.app_role as enum ('admin', 'moderator', 'user');

create table if not exists public.user_roles (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null,
  role public.app_role not null,
  created_at timestamptz default now()
);
```

-- Storage bucket (already included in repo migrations)
See `supabase/migrations/*` for storage bucket creation and policies.

## 4) Policies
Create minimal RLS policies for `contact_submissions`:
```sql
-- allow insert from server or anonymous clients
alter table public.contact_submissions enable row level security;
create policy "allow_insert" on public.contact_submissions
  for insert using (true) with check (true);
```
For production, tighten policies: restrict insert rate, validate fields, or require a stored token.

## 5) Export data from Lovable Cloud
- Use Lovable Cloud dashboard or API to export each table to CSV or JSON.
- If Lovable provides SQL dumps, prefer SQL.

If Lovable → CSV, example: `contacts.csv` with columns `id,name,email,message,created_at,status`.

## 6) Import into Supabase
Option A: psql (recommended for SQL dumps)
```bash
# Set a PG connection string from Supabase (Settings → Database → Connection string)
export PG_URL="postgresql://postgres:<DB_PASSWORD>@<DB_HOST>:5432/postgres"
# Import SQL dump
psql "$PG_URL" -f lovable_export_dump.sql
```

Option B: CSV import for a single table
```bash
# Upload contacts.csv to the DB via psql COPY
psql "$PG_URL" -c "\copy public.contact_submissions(id,name,email,message,status,created_at) FROM 'contacts.csv' WITH CSV HEADER"
```

Option C: Use supabase-js script (service role key)
- Use the provided Node script `scripts/migrate-lovable-to-supabase.js` to read JSON/CSV and insert rows.

## 7) Data import sample script (Node)
File: `scripts/migrate-lovable-to-supabase.js` (added to repo). Usage:
```bash
# Install dependencies if needed
npm install
# Run (ensure SUPABASE_SERVICE_ROLE_KEY and SUPABASE_URL set in env)
node scripts/migrate-lovable-to-supabase.js path/to/lovable_export.json contact_submissions
```

## 8) Remove Lovable dependency
Local changes applied:
- Removed `lovable-tagger` from `package.json`.

Run locally to update lockfile and uninstall package:
```bash
npm uninstall lovable-tagger
npm install
```

If you use `package-lock.json`, commit the updated lock after `npm install`.

## 9) Update frontend/backend
- The project already includes a Supabase client at `src/integrations/supabase/client.ts`.
- Ensure frontend uses `VITE_SUPABASE_URL` and `VITE_SUPABASE_PUBLISHABLE_KEY`.
- Ensure server uses `SUPABASE_SERVICE_ROLE_KEY` (server/email-webhook.js already uses it).

## 10) Cleanup
- Remove any Lovable secrets from `.env` and CI.
- Remove leftover Lovable configuration files or scripts.

## 11) Verification checklist
- [ ] `npm run dev` (frontend loads, no Lovable errors).
- [ ] Login / signup flows work (using Supabase auth).
- [ ] Contact form inserts into `contact_submissions` table.
- [ ] Admin pages read `contact_submissions` and other tables correctly.
- [ ] Storage uploads (media) work and objects visible in Supabase storage.
- [ ] No `lovable` references remain in repo (`git grep -i lovable`).

## 12) Rollback plan
- Keep backups of data exported from Lovable and any SQL dumps.
- If migration fails, restore via SQL dumps or re-import CSVs.

---
If you want, I can now:
- Apply SQL for all tables from `src/integrations/supabase/types.ts` into a migration file.
- Run a live grep to ensure no other Lovable code remains.
- Help run the import locally if you provide Lovable exports.
