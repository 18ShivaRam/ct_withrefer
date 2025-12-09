-- Create table for storing OTPs
CREATE TABLE IF NOT EXISTS public.admin_otp_verifications (
  id bigserial PRIMARY KEY,
  email text NOT NULL,
  otp text NOT NULL,
  expires_at timestamptz NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  verified boolean DEFAULT false
);

-- Enable RLS but allow service role full access
ALTER TABLE public.admin_otp_verifications ENABLE ROW LEVEL SECURITY;

-- No public policies needed as this is backend-only usage
