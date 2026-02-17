# Supabase setup for this project

This guide covers: **connecting** the app to Supabase, creating the **Storage bucket** and **event_files table**, and optional **Auth (login)**.

---

## 1. Create / open your Supabase project

1. Go to [supabase.com](https://supabase.com) and sign in.
2. Create a new project (or open the one you use for this app).
3. Wait for the project to finish provisioning.

---

## 2. Get your project URL and keys (connect / link)

1. In the Supabase dashboard, go to **Project Settings** (gear icon) → **API**.
2. Copy:
   - **Project URL** → use as `NEXT_PUBLIC_SUPABASE_URL`
   - **anon public** key → use as `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - **service_role** key → use as `SUPABASE_SERVICE_ROLE_KEY` (keep this secret; never in `NEXT_PUBLIC_` or in the browser)

3. In the project root, create or edit `.env.local`:

```env
NEXT_PUBLIC_SUPABASE_URL="https://YOUR_PROJECT_REF.supabase.co"
NEXT_PUBLIC_SUPABASE_ANON_KEY="your-anon-key"
SUPABASE_SERVICE_ROLE_KEY="your-service-role-key"
SUPABASE_BUCKET="event-files"
```

Use the **same project** for URL and both keys. Restart the dev server after changing env.

---

## 3. Create the Storage bucket (`event-files`)

1. In the dashboard: **Storage** (left sidebar).
2. Click **New bucket**.
3. **Name:** `event-files` (must match `SUPABASE_BUCKET` in `.env.local`).
4. **Public bucket:** turn **ON** so the app can use public URLs for photos/videos.
5. Click **Create bucket**.

Optional: under **Policies** for this bucket you can add a policy to allow public read if you want to enforce it via RLS; for “public bucket” the UI often does this for you.

---

## 4. Create the `event_files` table (metadata)

The API route stores file metadata in a table named `event_files`, not in Storage. Create it in SQL:

1. In the dashboard: **SQL Editor** → **New query**.
2. Paste and run:

```sql
-- Table used by /api/drive-to-supabase to store file metadata
create table if not exists public.event_files (
  id uuid primary key default gen_random_uuid(),
  event_name text not null,
  file_name text not null,
  file_url text,
  created_at timestamptz default now()
);

-- Optional: index for the “already synced?” check
create index if not exists idx_event_files_event_name_file_name
  on public.event_files (event_name, file_name);

-- Allow public read for portfolio (anon key); restrict write to service role
alter table public.event_files enable row level security (rls);

create policy "Allow public read"
  on public.event_files for select
  using (true);

create policy "Allow service role all"
  on public.event_files for all
  using (auth.role() = 'service_role');
```

3. Run the query. You should see “event_files” under **Table Editor**.

---

## 5. Optional: Supabase Auth (login)

The app currently uses **anon** (public) and **service_role** only. There is no “login” yet. To add login:

1. In the dashboard: **Authentication** → **Providers**. Enable Email, Google, etc.
2. In the app, use the same Supabase client (from `src/library/supabaseClient.ts`) and call:
   - `supabase.auth.signInWithPassword({ email, password })` or
   - `supabase.auth.signInWithOAuth({ provider: 'google' })`
3. Protect admin/sync routes (e.g. `/api/drive-to-supabase`) in your backend by checking a secret header or using Supabase Auth in a way that only your app can call it (e.g. server-side check of the service role or a shared secret).

---

## Checklist

- [ ] Supabase project created and URL + anon + service_role keys in `.env.local`
- [ ] Storage bucket **event-files** created and set to **Public**
- [ ] Table **event_files** created (SQL above) and RLS policies applied
- [ ] Restart dev server; call `GET /api/drive-to-supabase` to test sync

---

## Env summary (no secrets in this file)

| Variable | Where to get it | Used for |
|----------|-----------------|----------|
| `NEXT_PUBLIC_SUPABASE_URL` | Project Settings → API | Supabase client (browser + API route) |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Project Settings → API | Public client (browser) |
| `SUPABASE_SERVICE_ROLE_KEY` | Project Settings → API | Server-only (API route, bypasses RLS) |
| `SUPABASE_BUCKET` | You choose | Bucket name, e.g. `event-files` |
