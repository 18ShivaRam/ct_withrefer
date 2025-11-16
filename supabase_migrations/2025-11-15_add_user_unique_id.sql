-- Create yearly incremental unique ID generator and add to profiles

-- 1) Add user_unique_id column to profiles if not exists
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_schema = 'public' 
      AND table_name = 'profiles' 
      AND column_name = 'user_unique_id'
  ) THEN
    ALTER TABLE public.profiles ADD COLUMN user_unique_id text;
  END IF;
END $$;

-- Ensure uniqueness
CREATE UNIQUE INDEX IF NOT EXISTS profiles_user_unique_id_unique
ON public.profiles (user_unique_id);

-- 2) Create a counters table to maintain per-year sequence
CREATE TABLE IF NOT EXISTS public.user_unique_id_counters (
  year integer PRIMARY KEY,
  last_seq integer NOT NULL DEFAULT 0,
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- 3) Function to generate the user unique id atomically
CREATE OR REPLACE FUNCTION public.generate_user_unique_id()
RETURNS text
LANGUAGE plpgsql
AS $$
DECLARE
  current_year integer := EXTRACT(YEAR FROM now())::int;
  next_seq integer;
BEGIN
  -- initialize the year row if it does not exist
  INSERT INTO public.user_unique_id_counters (year, last_seq, updated_at)
  VALUES (current_year, 0, now())
  ON CONFLICT (year) DO NOTHING;

  -- increment atomically and fetch the next sequence
  UPDATE public.user_unique_id_counters
  SET last_seq = last_seq + 1,
      updated_at = now()
  WHERE year = current_year
  RETURNING last_seq INTO next_seq;

  IF next_seq > 9999 THEN
    RAISE EXCEPTION 'User unique ID sequence exceeded for year %', current_year;
  END IF;

  RETURN current_year::text || LPAD(next_seq::text, 4, '0');
END;
$$;

-- 4) Update the auth.users trigger function to include user_unique_id on insert
CREATE OR REPLACE FUNCTION public.handle_new_auth_user()
RETURNS trigger
SECURITY DEFINER
AS $$
DECLARE
  gen_user_id text;
BEGIN
  gen_user_id := public.generate_user_unique_id();

  INSERT INTO public.profiles (id, email, full_name, first_name, phone, user_unique_id, created_at)
  VALUES (
    NEW.id,
    NEW.email,
    (NEW.raw_user_meta_data ->> 'full_name'),
    (NEW.raw_user_meta_data ->> 'first_name'),
    (NEW.raw_user_meta_data ->> 'phone_number'),
    gen_user_id,
    now()
  )
  ON CONFLICT (id) DO UPDATE SET
    email = EXCLUDED.email,
    full_name = COALESCE(EXCLUDED.full_name, public.profiles.full_name),
    first_name = COALESCE(EXCLUDED.first_name, public.profiles.first_name),
    phone = COALESCE(EXCLUDED.phone, public.profiles.phone),
    -- keep existing user_unique_id if already set
    updated_at = now();

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

ALTER FUNCTION public.handle_new_auth_user() OWNER TO postgres;

-- 5) Backfill user_unique_id for any existing profiles missing it
DO $$
DECLARE
  r record;
  new_id text;
BEGIN
  FOR r IN SELECT id FROM public.profiles WHERE user_unique_id IS NULL LOOP
    new_id := public.generate_user_unique_id();
    UPDATE public.profiles SET user_unique_id = new_id, updated_at = now() WHERE id = r.id;
  END LOOP;
END $$;