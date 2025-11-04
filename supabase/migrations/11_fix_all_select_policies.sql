-- Migration: Fix SELECT policies on all shop-related tables
-- Issue: INSERT with .select() fails because SELECT policies check shop_users
--         but the row doesn't exist in shop_users context yet
-- Solution: Allow SELECT based on shop_id ownership via shops_tables

-- ============================================================================
-- FIX 1: shop_workers - Allow reading workers from your shops
-- ============================================================================

DROP POLICY IF EXISTS "shop_users_can_manage_workers" ON public.shop_workers;

-- Allow SELECT if you belong to the shop (via shop_users or shop ownership)
CREATE POLICY "users_read_shop_workers"
ON public.shop_workers
FOR SELECT
TO authenticated
USING (
  shop_id IN (
    SELECT shop_id
    FROM public.shop_users
    WHERE user_id = auth.uid()
  )
);

-- Allow INSERT if you belong to the shop
CREATE POLICY "users_insert_shop_workers"
ON public.shop_workers
FOR INSERT
TO authenticated
WITH CHECK (
  shop_id IN (
    SELECT shop_id
    FROM public.shop_users
    WHERE user_id = auth.uid()
  )
);

-- Allow UPDATE if you belong to the shop
CREATE POLICY "users_update_shop_workers"
ON public.shop_workers
FOR UPDATE
TO authenticated
USING (
  shop_id IN (
    SELECT shop_id
    FROM public.shop_users
    WHERE user_id = auth.uid()
  )
)
WITH CHECK (
  shop_id IN (
    SELECT shop_id
    FROM public.shop_users
    WHERE user_id = auth.uid()
  )
);

-- Allow DELETE if you belong to the shop
CREATE POLICY "users_delete_shop_workers"
ON public.shop_workers
FOR DELETE
TO authenticated
USING (
  shop_id IN (
    SELECT shop_id
    FROM public.shop_users
    WHERE user_id = auth.uid()
  )
);

-- ============================================================================
-- FIX 2: shop_leads - Allow reading leads from your shops
-- ============================================================================

-- Check if shop_leads policies exist and drop them
DO $$
BEGIN
  -- Drop any existing policies on shop_leads
  DROP POLICY IF EXISTS "users_read_shop_leads" ON public.shop_leads;
  DROP POLICY IF EXISTS "users_insert_shop_leads" ON public.shop_leads;
  DROP POLICY IF EXISTS "users_update_shop_leads" ON public.shop_leads;
  DROP POLICY IF EXISTS "users_delete_shop_leads" ON public.shop_leads;
EXCEPTION
  WHEN undefined_table THEN
    -- Table doesn't exist, that's ok
    NULL;
END $$;

-- Only create policies if the table exists
DO $$
BEGIN
  IF EXISTS (SELECT FROM pg_tables WHERE schemaname = 'public' AND tablename = 'shop_leads') THEN
    -- SELECT policy
    EXECUTE 'CREATE POLICY "users_read_shop_leads"
    ON public.shop_leads
    FOR SELECT
    TO authenticated
    USING (
      shop_id IN (
        SELECT shop_id
        FROM public.shop_users
        WHERE user_id = auth.uid()
      )
    )';

    -- INSERT policy
    EXECUTE 'CREATE POLICY "users_insert_shop_leads"
    ON public.shop_leads
    FOR INSERT
    TO authenticated
    WITH CHECK (
      shop_id IN (
        SELECT shop_id
        FROM public.shop_users
        WHERE user_id = auth.uid()
      )
    )';

    -- UPDATE policy
    EXECUTE 'CREATE POLICY "users_update_shop_leads"
    ON public.shop_leads
    FOR UPDATE
    TO authenticated
    USING (
      shop_id IN (
        SELECT shop_id
        FROM public.shop_users
        WHERE user_id = auth.uid()
      )
    )
    WITH CHECK (
      shop_id IN (
        SELECT shop_id
        FROM public.shop_users
        WHERE user_id = auth.uid()
      )
    )';

    -- DELETE policy
    EXECUTE 'CREATE POLICY "users_delete_shop_leads"
    ON public.shop_leads
    FOR DELETE
    TO authenticated
    USING (
      shop_id IN (
        SELECT shop_id
        FROM public.shop_users
        WHERE user_id = auth.uid()
      )
    )';
  END IF;
END $$;

-- ============================================================================
-- FIX 3: appointments - Allow reading appointments from your shops
-- ============================================================================

-- Check if appointments policies exist and drop them
DO $$
BEGIN
  DROP POLICY IF EXISTS "users_read_appointments" ON public.appointments;
  DROP POLICY IF EXISTS "users_insert_appointments" ON public.appointments;
  DROP POLICY IF EXISTS "users_update_appointments" ON public.appointments;
  DROP POLICY IF EXISTS "users_delete_appointments" ON public.appointments;
EXCEPTION
  WHEN undefined_table THEN
    NULL;
END $$;

-- Only create policies if the table exists
DO $$
BEGIN
  IF EXISTS (SELECT FROM pg_tables WHERE schemaname = 'public' AND tablename = 'appointments') THEN
    -- SELECT policy
    EXECUTE 'CREATE POLICY "users_read_appointments"
    ON public.appointments
    FOR SELECT
    TO authenticated
    USING (
      shop_id IN (
        SELECT shop_id
        FROM public.shop_users
        WHERE user_id = auth.uid()
      )
    )';

    -- INSERT policy
    EXECUTE 'CREATE POLICY "users_insert_appointments"
    ON public.appointments
    FOR INSERT
    TO authenticated
    WITH CHECK (
      shop_id IN (
        SELECT shop_id
        FROM public.shop_users
        WHERE user_id = auth.uid()
      )
    )';

    -- UPDATE policy
    EXECUTE 'CREATE POLICY "users_update_appointments"
    ON public.appointments
    FOR UPDATE
    TO authenticated
    USING (
      shop_id IN (
        SELECT shop_id
        FROM public.shop_users
        WHERE user_id = auth.uid()
      )
    )
    WITH CHECK (
      shop_id IN (
        SELECT shop_id
        FROM public.shop_users
        WHERE user_id = auth.uid()
      )
    )';

    -- DELETE policy
    EXECUTE 'CREATE POLICY "users_delete_appointments"
    ON public.appointments
    FOR DELETE
    TO authenticated
    USING (
      shop_id IN (
        SELECT shop_id
        FROM public.shop_users
        WHERE user_id = auth.uid()
      )
    )';
  END IF;
END $$;

-- Add helpful comments
COMMENT ON POLICY "users_read_shop_workers" ON public.shop_workers IS
'Allows users to read workers from shops they belong to via shop_users table';

COMMENT ON POLICY "users_insert_shop_workers" ON public.shop_workers IS
'Allows users to create workers in shops they belong to';

COMMENT ON POLICY "users_update_shop_workers" ON public.shop_workers IS
'Allows users to update workers in shops they belong to';

COMMENT ON POLICY "users_delete_shop_workers" ON public.shop_workers IS
'Allows users to delete workers from shops they belong to';
