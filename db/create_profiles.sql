-- Create a public.profiles table and recommended RLS policies for per-user access.
-- Run this in your Supabase SQL editor.

-- 1) Create table
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text,
  first_name text,
  last_name text,
  email text,
  avatar_url text,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

-- 2) Enable Row Level Security
alter table public.profiles enable row level security;

-- 3) Policies
-- Allow authenticated users to insert their own profile (id must match auth.uid())
-- Also allow inserts when there are no JWT claims (this covers the auth.users trigger context)
drop policy if exists "Profiles: allow insert for owner" on public.profiles;
create policy "Profiles: allow insert for owner" on public.profiles
  for insert
  with check (
    auth.uid() = id
    OR current_setting('jwt.claims', true) IS NULL
  );

-- Allow owners to update/select their profile
create policy "Profiles: allow update for owner" on public.profiles
  for update
  using (auth.uid() = id)
  with check (auth.uid() = id);

create policy "Profiles: allow select for owner" on public.profiles
  for select
  using (auth.uid() = id);

-- Optional: allow authenticated users to upsert (insert or update) their own profile via the same check
-- (You can rely on insert/update policies above; a separate upsert policy is not required.)

-- 4) Optional: create trigger to auto-create profile when a new auth.user is created
-- Note: Supabase exposes auth.users in the auth schema. Creating triggers on auth.users is a common pattern.
-- Make sure your Supabase project allows this; test in a dev environment first.

-- Create the function as SECURITY DEFINER so it runs with the privileges of its owner
create or replace function public.handle_new_auth_user()
returns trigger
security definer
as $$
begin
  insert into public.profiles (id, email, full_name, first_name, created_at)
  values (
    new.id,
    new.email,
    (new.raw_user_meta_data ->> 'full_name'),
    (new.raw_user_meta_data ->> 'first_name'),
    now()
  )
  on conflict (id) do nothing;
  return new;
end;
$$ language plpgsql;

-- Set the function owner to a DB role that has sufficient privileges (e.g. `postgres` or your admin role).
-- Replace 'postgres' with the admin role available in your Supabase project if different.
alter function public.handle_new_auth_user() owner to postgres;

-- Ensure any existing trigger is removed, then create the trigger correctly
drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_auth_user();

-- 5) Indexes (optional)
create index if not exists idx_profiles_email on public.profiles (email);
