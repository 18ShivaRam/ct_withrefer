-- Add admin_last_viewed_at column to profiles table
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS admin_last_viewed_at timestamptz DEFAULT NULL;
