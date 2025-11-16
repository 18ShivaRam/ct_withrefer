-- Add uploaded_by_admin column to uploaded_documents if it does not exist
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_schema = 'public'
      AND table_name = 'uploaded_documents'
      AND column_name = 'uploaded_by_admin'
  ) THEN
    ALTER TABLE public.uploaded_documents
      ADD COLUMN uploaded_by_admin BOOLEAN DEFAULT FALSE;
  END IF;
END $$;

-- Optional: backfill logic could go here if there is a way to identify admin uploads historically.