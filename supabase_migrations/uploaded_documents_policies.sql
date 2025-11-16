-- Ensure RLS enabled and remove old conflicting policies
ALTER TABLE public.uploaded_documents ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS insert_own_docs ON public.uploaded_documents;
DROP POLICY IF EXISTS select_own_docs ON public.uploaded_documents;
DROP POLICY IF EXISTS update_own_docs ON public.uploaded_documents;
DROP POLICY IF EXISTS delete_own_docs ON public.uploaded_documents;

-- Allow authenticated users to INSERT their own rows
-- auth.uid() is text, cast it to uuid to compare with user_id (uuid)
CREATE POLICY insert_own_docs
  ON public.uploaded_documents
  FOR INSERT
  WITH CHECK (auth.uid()::uuid = user_id);

-- Allow authenticated users to SELECT only their own rows
CREATE POLICY select_own_docs
  ON public.uploaded_documents
  FOR SELECT
  USING (auth.uid()::uuid = user_id);

-- Allow authenticated users to UPDATE only their own rows
CREATE POLICY update_own_docs
  ON public.uploaded_documents
  FOR UPDATE
  USING (auth.uid()::uuid = user_id)
  WITH CHECK (auth.uid()::uuid = user_id);

-- Allow authenticated users to DELETE only their own rows
CREATE POLICY delete_own_docs
  ON public.uploaded_documents
  FOR DELETE
  USING (auth.uid()::uuid = user_id);

-- Note:
-- If you run client-side inserts, make sure the client is authenticated (user logged in)
-- and that the user_id you insert equals auth.uid() for the current session.
-- Alternatively, server-side inserts using the service_role key bypass RLS (but don't expose service_role to the browser).
