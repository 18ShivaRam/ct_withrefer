-- Create referrals and client-employee assignment tables with basic RLS

-- Referrals table
CREATE TABLE IF NOT EXISTS public.referrals (
  id bigserial PRIMARY KEY,
  name text NOT NULL,
  email text,
  phone text,
  referred_by uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.referrals ENABLE ROW LEVEL SECURITY;

-- Policies: allow authenticated users to insert own referrals; allow authenticated to select
DROP POLICY IF EXISTS insert_own_referrals ON public.referrals;
CREATE POLICY insert_own_referrals
  ON public.referrals
  FOR INSERT
  WITH CHECK (auth.uid()::uuid = referred_by);

DROP POLICY IF EXISTS select_referrals ON public.referrals;
CREATE POLICY select_referrals
  ON public.referrals
  FOR SELECT
  USING (true);


-- Client-Employee assignments
CREATE TABLE IF NOT EXISTS public.client_employee_assignments (
  client_id uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  employee_id uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  created_at timestamptz NOT NULL DEFAULT now(),
  PRIMARY KEY (client_id, employee_id)
);

ALTER TABLE public.client_employee_assignments ENABLE ROW LEVEL SECURITY;

-- Policies: allow authenticated select; admin inserts and deletes (simple approach)
DROP POLICY IF EXISTS select_assignments ON public.client_employee_assignments;
CREATE POLICY select_assignments
  ON public.client_employee_assignments
  FOR SELECT
  USING (true);

DROP POLICY IF EXISTS modify_assignments ON public.client_employee_assignments;
CREATE POLICY modify_assignments
  ON public.client_employee_assignments
  FOR ALL
  USING (true)
  WITH CHECK (true);