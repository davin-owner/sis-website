-- Migration: Fix RLS policies to allow authenticated users to create shops
-- Issue: Users getting "new row violates row-level security policy" when creating shops

-- Step 1: Drop existing potentially conflicting INSERT policies
DROP POLICY IF EXISTS "authenticated_users_can_create_shops" ON public.shops_tables;
DROP POLICY IF EXISTS "owners_can_insert_shops" ON public.shops_tables;

-- Step 2: Create a single, clear INSERT policy for authenticated users
-- This allows any authenticated user to create a shop where they are the owner
CREATE POLICY "authenticated_users_can_create_shops"
ON public.shops_tables
FOR INSERT
TO authenticated
WITH CHECK (
  -- The user creating the shop must be setting themselves as the shop_owner
  auth.uid() = shop_owner
);

-- Step 3: Verify other necessary policies exist (SELECT, UPDATE, DELETE)
-- These should already exist from migration 00, but let's ensure they're correct

-- Allow users to read shops they belong to (via shop_users table)
DROP POLICY IF EXISTS "users_can_read_their_shops" ON public.shops_tables;
CREATE POLICY "users_can_read_their_shops"
ON public.shops_tables
FOR SELECT
USING (
  shop_id IN (
    SELECT shop_id
    FROM public.shop_users
    WHERE user_id = auth.uid()
  )
);

-- Allow shop owners to update their shops
DROP POLICY IF EXISTS "owners_can_update_shops" ON public.shops_tables;
CREATE POLICY "owners_can_update_shops"
ON public.shops_tables
FOR UPDATE
USING (
  shop_id IN (
    SELECT shop_id
    FROM public.shop_users
    WHERE user_id = auth.uid() AND role = 'owner'
  )
);

-- Allow shop owners to delete their shops
DROP POLICY IF EXISTS "owners_can_delete_shops" ON public.shops_tables;
CREATE POLICY "owners_can_delete_shops"
ON public.shops_tables
FOR DELETE
USING (
  shop_id IN (
    SELECT shop_id
    FROM public.shop_users
    WHERE user_id = auth.uid() AND role = 'owner'
  )
);

-- Add helpful comment
COMMENT ON POLICY "authenticated_users_can_create_shops" ON public.shops_tables IS
'Allows authenticated users to create shops where they set themselves as the owner';
