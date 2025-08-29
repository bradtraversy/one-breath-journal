-- One‑Breath Journal — Supabase DB & RLS setup
-- Run this in the Supabase SQL editor for your project.

-- Extensions
create extension if not exists pgcrypto;

-- Profiles (per-auth user settings)
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text, -- optional mirror of auth.users.email
  timezone text not null default 'UTC',
  created_at timestamptz not null default now()
);
alter table public.profiles enable row level security;

-- RLS for profiles: owners can read/update their row
drop policy if exists "Profiles are viewable by owner" on public.profiles;
create policy "Profiles are viewable by owner" on public.profiles
  for select using (auth.uid() = id);

drop policy if exists "Profiles are updatable by owner" on public.profiles;
create policy "Profiles are updatable by owner" on public.profiles
  for update using (auth.uid() = id);

-- Entries (one per day per user)
create table if not exists public.entries (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  entry_date date not null, -- day per user's timezone at submit time
  text text not null,
  started_at timestamptz not null,
  submitted_at timestamptz not null,
  word_count int generated always as (
    case when length(btrim(text))=0 then 0
         else cardinality(regexp_split_to_array(btrim(text), '\\s+')) end
  ) stored,
  source text not null default 'web', -- web/pwa
  unique(user_id, entry_date)
);
create index if not exists idx_entries_user_date_desc on public.entries(user_id, entry_date desc);
alter table public.entries enable row level security;

-- RLS: owners only; updates disabled (lock after submit)
drop policy if exists "Entries readable by owner" on public.entries;
create policy "Entries readable by owner" on public.entries
  for select using (auth.uid() = user_id);

drop policy if exists "Entries insertable by owner" on public.entries;
create policy "Entries insertable by owner" on public.entries
  for insert with check (auth.uid() = user_id);

drop policy if exists "Entries deletable by owner" on public.entries;
create policy "Entries deletable by owner" on public.entries
  for delete using (auth.uid() = user_id);

-- Optional: create a profile row automatically on signup
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, email)
  values (new.id, new.email)
  on conflict (id) do nothing;
  return new;
end;
$$ language plpgsql security definer;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

