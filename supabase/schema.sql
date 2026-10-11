-- Run this script in Supabase Dashboard > SQL Editor for the EWG project.
create table if not exists public.store_state (
  id text primary key check (id = 'owner'),
  data jsonb not null default '{"products":[],"sales":[],"expenses":[]}'::jsonb,
  updated_at timestamptz not null default now()
);

alter table public.store_state enable row level security;
revoke all on table public.store_state from anon, authenticated;
grant all on table public.store_state to service_role;

-- Create this public bucket in Storage > New bucket instead of storing image bytes in Postgres:
-- name: product-images | public: yes | allowed: image/jpeg, image/png, image/webp | max: 1 MB
-- Uploads are performed by the server with SUPABASE_SECRET_KEY, never by the browser.
