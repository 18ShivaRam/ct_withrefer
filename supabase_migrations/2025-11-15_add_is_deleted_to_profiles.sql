-- Add is_deleted column to profiles for soft delete, idempotent
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_schema = 'public' AND table_name = 'profiles' AND column_name = 'is_deleted'
  ) THEN
    ALTER TABLE public.profiles ADD COLUMN is_deleted boolean NOT NULL DEFAULT false;
  END IF;
END $$;

-- Optional index to speed up queries filtering out deleted
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_indexes 
    WHERE schemaname = 'public' AND tablename = 'profiles' AND indexname = 'idx_profiles_is_deleted'
  ) THEN
    CREATE INDEX idx_profiles_is_deleted ON public.profiles (is_deleted);
  END IF;
END $$;