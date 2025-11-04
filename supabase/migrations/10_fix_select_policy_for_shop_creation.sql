-- Migration: Fix SELECT policy to allow reading shops you own
-- Issue: INSERT with .select() fails because shop isn't in shop_users yet
-- Solution: Allow SELECT if you're the shop_owner OR in shop_users

-- Drop the existing SELECT policy
DROP POLICY IF EXISTS "users_read_their_shops" ON public.shops_tables;

-- Create new SELECT policy that allows reading shops you own OR belong to
CREATE POLICY "users_read_their_shops"
ON public.shops_tables
FOR SELECT
TO authenticated
USING (
  -- Allow if you're the shop owner
  auth.uid() = shop_owner
  OR
  -- OR if you're in the shop_users table for this shop
  shop_id IN (
    SELECT shop_id
    FROM public.shop_users
    WHERE user_id = auth.uid()
  )
);

COMMENT ON POLICY "users_read_their_shops" ON public.shops_tables IS
'Allows users to read shops where they are the owner or a member via shop_users table';
