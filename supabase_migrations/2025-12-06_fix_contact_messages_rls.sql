-- Enable RLS on contact_messages
ALTER TABLE contact_messages ENABLE ROW LEVEL SECURITY;

-- Allow public (anonymous and authenticated) to insert contact messages
CREATE POLICY "Allow public to insert contact messages" 
ON contact_messages 
FOR INSERT 
TO public 
WITH CHECK (true);

-- Allow admins to view contact messages
-- Assuming admin check is consistent with other policies
CREATE POLICY "Allow admins to select contact messages"
ON contact_messages
FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE profiles.id = auth.uid()::uuid 
    AND profiles.is_admin = true
  )
);
