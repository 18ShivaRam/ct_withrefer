-- Update handle_new_auth_user to set role and employee_role from user metadata

CREATE OR REPLACE FUNCTION public.handle_new_auth_user()
RETURNS trigger
SECURITY DEFINER
AS $$
DECLARE
  gen_user_id text;
  meta_role text;
  meta_employee_role text;
BEGIN
  gen_user_id := public.generate_user_unique_id();
  meta_role := (NEW.raw_user_meta_data ->> 'role');
  meta_employee_role := (NEW.raw_user_meta_data ->> 'employee_role');

  INSERT INTO public.profiles (
    id, email, full_name, first_name, phone, user_unique_id, role, employee_role, created_at
  )
  VALUES (
    NEW.id,
    NEW.email,
    (NEW.raw_user_meta_data ->> 'full_name'),
    (NEW.raw_user_meta_data ->> 'first_name'),
    (NEW.raw_user_meta_data ->> 'phone_number'),
    gen_user_id,
    COALESCE(meta_role, 'client')::profile_role_type,
    CASE WHEN meta_employee_role IS NOT NULL THEN meta_employee_role::employee_role_type ELSE NULL END,
    now()
  )
  ON CONFLICT (id) DO UPDATE SET
    email = EXCLUDED.email,
    full_name = COALESCE(EXCLUDED.full_name, public.profiles.full_name),
    first_name = COALESCE(EXCLUDED.first_name, public.profiles.first_name),
    phone = COALESCE(EXCLUDED.phone, public.profiles.phone),
    role = COALESCE(EXCLUDED.role, public.profiles.role),
    employee_role = COALESCE(EXCLUDED.employee_role, public.profiles.employee_role),
    updated_at = now();

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

ALTER FUNCTION public.handle_new_auth_user() OWNER TO postgres;