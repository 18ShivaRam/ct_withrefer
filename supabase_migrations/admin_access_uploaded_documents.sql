-- Add admin access policy for uploaded_documents table
-- This allows admin users to view all uploaded documents

-- Create policy for admin users to select all documents
CREATE POLICY admin_select_all_docs
  ON public.uploaded_documents
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE profiles.id = auth.uid()::uuid 
      AND profiles.is_admin = true
    )
  );

-- Create policy for admin users to insert documents for any user
CREATE POLICY admin_insert_all_docs
  ON public.uploaded_documents
  FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE profiles.id = auth.uid()::uuid 
      AND profiles.is_admin = true
    )
  );

-- Create policy for admin users to update any documents
CREATE POLICY admin_update_all_docs
  ON public.uploaded_documents
  FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE profiles.id = auth.uid()::uuid 
      AND profiles.is_admin = true
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE profiles.id = auth.uid()::uuid 
      AND profiles.is_admin = true
    )
  );

-- Create policy for admin users to delete any documents
CREATE POLICY admin_delete_all_docs
  ON public.uploaded_documents
  FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE profiles.id = auth.uid()::uuid 
      AND profiles.is_admin = true
    )
  );