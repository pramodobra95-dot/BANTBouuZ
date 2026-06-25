-- ====================================================================
-- SUPABASE MIGRATION SCRIPT: ADMIN ROLE MAPPING FOR BANTCONFIRM
-- Target Email: info.bouuz@gmail.com
-- ====================================================================
-- This migration script ensures that 'info.bouuz@gmail.com' (and other admin emails)
-- are safely mapped to the 'admin' role in Supabase auth, preventing user role 
-- collision and securing backend queries.

-- 1. UPDATE EXISTING USER METADATA (IF USER IS ALREADY REGISTERED)
-- Updates the 'raw_user_meta_data' JSONB block inside Supabase's auth.users table.
-- This sets {"role": "admin"} while preserving any other metadata like company, mobile, etc.
UPDATE auth.users
SET raw_user_meta_data = 
  COALESCE(raw_user_meta_data, '{}'::jsonb) || '{"role": "admin"}'::jsonb
WHERE LOWER(email) IN ('info.bouuz@gmail.com', 'info.bouuz@gmail.co', 'admin@bantconfirm.com', 'pramodobra95@gmail.com');


-- 2. AUTOMATIC TRIGGER FOR FUTURE REGISTRATIONS
-- Ensures that if any of these admin emails sign up in the future, they automatically
-- get assigned the 'admin' role metadata from day one.

CREATE OR REPLACE FUNCTION public.handle_admin_role_assignment()
RETURNS TRIGGER AS $$
BEGIN
  -- If the registering user email belongs to the admin list, enforce the admin role
  IF LOWER(new.email) IN ('info.bouuz@gmail.com', 'info.bouuz@gmail.co', 'admin@bantconfirm.com', 'pramodobra95@gmail.com') THEN
    new.raw_user_meta_data := COALESCE(new.raw_user_meta_data, '{}'::jsonb) || '{"role": "admin"}'::jsonb;
  ELSE
    -- Default non-admins to 'buyer' or keep their chosen sign-up role if valid
    IF NOT (new.raw_user_meta_data ? 'role') OR (new.raw_user_meta_data->>'role' = 'admin') THEN
      new.raw_user_meta_data := COALESCE(new.raw_user_meta_data, '{}'::jsonb) || '{"role": "buyer"}'::jsonb;
    END IF;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Safe creation of trigger (drops existing first to avoid duplicate errors)
DROP TRIGGER IF EXISTS trigger_assign_admin_role ON auth.users;
CREATE TRIGGER trigger_assign_admin_role
BEFORE INSERT ON auth.users
FOR EACH ROW
EXECUTE FUNCTION public.handle_admin_role_assignment();


-- 3. SECURING ROW LEVEL SECURITY (RLS) FOR ADMIN ACCESS ONLY
-- Example helper policy that restricts critical tables (like leads, settings) to admin roles.
-- Copy and run these on your Supabase tables (e.g. 'leads') to enforce server-side validation.

/*
-- Enable Row Level Security
ALTER TABLE public.leads ENABLE ROW LEVEL SECURITY;

-- Allow read access for leads only if user metadata role is 'admin' or they are the lead owner
CREATE POLICY "Leads access policy" ON public.leads
FOR ALL
USING (
  (auth.jwt() -> 'user_metadata' ->> 'role') = 'admin'
  OR email = auth.jwt() ->> 'email'
);
*/

-- 4. VERIFY CURRENT USERS SETTINGS
-- Execute this query in your Supabase SQL editor to verify metadata roles:
-- SELECT id, email, raw_user_meta_data->>'role' as assigned_role, created_at FROM auth.users;
