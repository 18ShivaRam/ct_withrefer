-- Add role fields to profiles: role (client|employee) and employee_role (caller|reviewer|preparer)

-- 1) Create enum types if not exist
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'profile_role_type') THEN
    CREATE TYPE profile_role_type AS ENUM ('client', 'employee');
  END IF;

  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'employee_role_type') THEN
    CREATE TYPE employee_role_type AS ENUM ('caller', 'reviewer', 'preparer');
  END IF;
END $$;

-- 2) Add columns to profiles
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_schema = 'public' AND table_name = 'profiles' AND column_name = 'role'
  ) THEN
    ALTER TABLE public.profiles ADD COLUMN role profile_role_type DEFAULT 'client';
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_schema = 'public' AND table_name = 'profiles' AND column_name = 'employee_role'
  ) THEN
    ALTER TABLE public.profiles ADD COLUMN employee_role employee_role_type;
  END IF;
END $$;