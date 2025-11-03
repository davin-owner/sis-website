-- Migration: Force fix all RLS policies on shops_tables
-- This aggressively removes ALL policies and recreates them correctly

-- Step 1: Disable RLS temporarily to clean up
ALTER TABLE public.shops_tables DISABLE ROW LEVEL SECURITY;

-- Step 2: Drop ALL existing policies (including any we might have missed)
DO $$
DECLARE
    r RECORD;
BEGIN
    FOR r IN (SELECT policyname FROM pg_policies WHERE tablename = 'shops_tables' AND schemaname = 'public')
    LOOP
        EXECUTE format('DROP POLICY IF EXISTS %I ON public.shops_tables', r.policyname);
    END LOOP;
END $$;

-- Step 3: Re-enable RLS
ALTER TABLE public.shops_tables ENABLE ROW LEVEL SECURITY;

-- Step 4: Create the ONE correct INSERT policy
CREATE POLICY "users_create_own_shops"
ON public.shops_tables
FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = shop_owner);

-- Step 5: Create SELECT policy (read shops you belong to)
CREATE POLICY "users_read_their_shops"
ON public.shops_tables
FOR SELECT
TO authenticated
USING (
  shop_id IN (
    SELECT shop_id
    FROM public.shop_users
    WHERE user_id = auth.uid()
  )
);

-- Step 6: Create UPDATE policy (only owners can update)
CREATE POLICY "owners_update_shops"
ON public.shops_tables
FOR UPDATE
TO authenticated
USING (
  shop_id IN (
    SELECT shop_id
    FROM public.shop_users
    WHERE user_id = auth.uid() AND role = 'owner'
  )
)
WITH CHECK (
  shop_id IN (
    SELECT shop_id
    FROM public.shop_users
    WHERE user_id = auth.uid() AND role = 'owner'
  )
);

-- Step 7: Create DELETE policy (only owners can delete)
CREATE POLICY "owners_delete_shops"
ON public.shops_tables
FOR DELETE
TO authenticated
USING (
  shop_id IN (
    SELECT shop_id
    FROM public.shop_users
    WHERE user_id = auth.uid() AND role = 'owner'
  )
);

-- Add helpful comments
COMMENT ON POLICY "users_create_own_shops" ON public.shops_tables IS
'Allows any authenticated user to create a shop where they are the owner';

COMMENT ON POLICY "users_read_their_shops" ON public.shops_tables IS
'Allows users to read shops they belong to via shop_users table';

COMMENT ON POLICY "owners_update_shops" ON public.shops_tables IS
'Allows shop owners to update their shops';

COMMENT ON POLICY "owners_delete_shops" ON public.shops_tables IS
'Allows shop owners to delete their shops';
