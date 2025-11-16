-- Create admin user in auth.users
-- First check if the user already exists
DO $$
DECLARE
  user_exists boolean;
BEGIN
  SELECT EXISTS (
    SELECT 1 FROM auth.users WHERE email = 'admin@gmail.com'
  ) INTO user_exists;
  
  IF NOT user_exists THEN
    INSERT INTO auth.users (
      instance_id,
      id,
      aud,
      role,
      email,
      encrypted_password,
      email_confirmed_at,
      recovery_sent_at,
      last_sign_in_at,
      raw_app_meta_data,
      raw_user_meta_data,
      created_at,
      updated_at,
      confirmation_token,
      email_change,
      email_change_token_new,
      recovery_token
    ) VALUES (
      '00000000-0000-0000-0000-000000000000',
      uuid_generate_v4(),
      'authenticated',
      'authenticated',
      'admin@gmail.com',
      crypt('123456', gen_salt('bf')),
      now(),
      now(),
      now(),
      '{"provider":"email","providers":["email"]}',
      '{}',
      now(),
      now(),
      '',
      '',
      '',
      ''
    );
  END IF;
END $$;

-- Get the user id of the admin user
DO $$
DECLARE
  admin_user_id uuid;
  profile_exists boolean;
BEGIN
  SELECT id INTO admin_user_id FROM auth.users WHERE email = 'admin@gmail.com';

  IF admin_user_id IS NOT NULL THEN
    -- Check if profile exists
    SELECT EXISTS (
      SELECT 1 FROM public.profiles WHERE id = admin_user_id
    ) INTO profile_exists;
    
    IF profile_exists THEN
      -- Update existing profile
      UPDATE public.profiles
      SET 
        updated_at = now()
      WHERE id = admin_user_id;
    ELSE
      -- Create admin profile
      INSERT INTO public.profiles (
        id,
        email,
        full_name,
        first_name,
        last_name,
        created_at,
        updated_at
      ) VALUES (
        admin_user_id,
        'admin@gmail.com',
        'Admin User',
        'Admin',
        'User',
        now(),
        now()
      );
    END IF;
  END IF;
END $$;

-- Since there's no role column in profiles table, we need to create one to track admin status
-- First, add a role column to the profiles table if it doesn't exist
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_schema = 'public' 
    AND table_name = 'profiles' 
    AND column_name = 'is_admin'
  ) THEN
    ALTER TABLE public.profiles ADD COLUMN is_admin BOOLEAN DEFAULT FALSE;
  END IF;
END $$;

-- Set the admin user's is_admin flag to true
UPDATE public.profiles 
SET is_admin = TRUE 
WHERE id IN (SELECT id FROM auth.users WHERE email = 'admin@gmail.com');

-- First, enable RLS on profiles if not already enabled
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Drop all existing policies on profiles to start fresh
DROP POLICY IF EXISTS "Allow admin access to admin users only" ON public.profiles;
DROP POLICY IF EXISTS "Admins can select non-admin profiles" ON public.profiles;
DROP POLICY IF EXISTS "Users can view own profile" ON public.profiles;
DROP POLICY IF EXISTS "Admin users can view all profiles" ON public.profiles;
DROP POLICY IF EXISTS "Profiles access policy" ON public.profiles;
DROP POLICY IF EXISTS "Admin can view all profiles" ON public.profiles;

-- The simplest possible approach: just allow all authenticated users to view all profiles
-- This completely bypasses the recursion issue
CREATE POLICY "Allow all authenticated users to view profiles" ON public.profiles
  FOR SELECT TO authenticated USING (true);