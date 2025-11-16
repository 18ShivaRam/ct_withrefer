-- Add phone column to profiles and update trigger function to insert phone from user metadata

-- 1) Add phone column if it doesn't exist
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_schema = 'public' 
      AND table_name = 'profiles' 
      AND column_name = 'phone'
  ) THEN
    ALTER TABLE public.profiles ADD COLUMN phone text;
  END IF;
END $$;

-- 2) Update the handle_new_auth_user function to insert phone
CREATE OR REPLACE FUNCTION public.handle_new_auth_user()
RETURNS trigger
SECURITY DEFINER
AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name, first_name, phone, created_at)
  VALUES (
    NEW.id,
    NEW.email,
    (NEW.raw_user_meta_data ->> 'full_name'),
    (NEW.raw_user_meta_data ->> 'first_name'),
    (NEW.raw_user_meta_data ->> 'phone_number'),
    now()
  )
  ON CONFLICT (id) DO UPDATE SET
    email = EXCLUDED.email,
    full_name = COALESCE(EXCLUDED.full_name, public.profiles.full_name),
    first_name = COALESCE(EXCLUDED.first_name, public.profiles.first_name),
    phone = COALESCE(EXCLUDED.phone, public.profiles.phone),
    updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Set function owner to a privileged role if available
ALTER FUNCTION public.handle_new_auth_user() OWNER TO postgres;

-- Note: existing trigger on auth.users will continue to call this function
-- (as defined in initial setup). No change to the trigger is required here.