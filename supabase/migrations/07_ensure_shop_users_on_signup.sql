-- Migration: Ensure users can create shops without issues
-- This adds helpful indexes and validates RLS policies

-- Add index for faster shop owner lookups (if not exists)
CREATE INDEX IF NOT EXISTS shops_tables_shop_owner_idx
ON public.shops_tables USING btree (shop_owner);

-- Add helpful comment
COMMENT ON TABLE public.shop_users IS
'Junction table for user-shop relationships. Users can belong to multiple shops with different roles (owner, employee, etc.)';

-- Verify the RLS policy allows authenticated users to insert themselves
-- This policy should already exist from migration 00, but let''s ensure it''s correct
DO $$
BEGIN
  -- Drop and recreate to ensure it''s correct
  DROP POLICY IF EXISTS "users_can_add_themselves_to_shops" ON public.shop_users;

  CREATE POLICY "users_can_add_themselves_to_shops"
  ON public.shop_users
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

  RAISE NOTICE 'RLS policy "users_can_add_themselves_to_shops" verified/recreated';
END $$;

-- Add a helpful function to check if user can create shops (for debugging)
CREATE OR REPLACE FUNCTION public.user_can_create_shop(check_user_id uuid DEFAULT NULL)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  target_user_id uuid;
  is_authenticated boolean;
BEGIN
  -- Use provided user_id or current authenticated user
  target_user_id := COALESCE(check_user_id, auth.uid());

  -- Check if user is authenticated
  is_authenticated := (auth.uid() IS NOT NULL);

  -- User must be authenticated to create shops
  RETURN is_authenticated;
END;
$$;

COMMENT ON FUNCTION public.user_can_create_shop IS
'Helper function to check if a user can create shops. Returns true if user is authenticated.';

-- Grant execute permission
GRANT EXECUTE ON FUNCTION public.user_can_create_shop TO authenticated;
GRANT EXECUTE ON FUNCTION public.user_can_create_shop TO anon;
