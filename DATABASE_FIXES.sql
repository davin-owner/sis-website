-- DATABASE FIXES FOR SIMPLE INK STUDIOS
-- Execute these commands in Supabase SQL Editor to fix worker creation
-- and enable proper security policies
--
-- Date: December 9, 2025
-- Issue: Worker creation fails due to missing column + RLS disabled
--
-- INSTRUCTIONS:
-- 1. Go to Supabase Dashboard → SQL Editor
-- 2. Create a new query
-- 3. Copy and paste this entire file
-- 4. Click "Run" (or Cmd/Ctrl + Enter)
-- 5. Verify success messages
-- 6. Test worker creation on the site

-- ============================================================================
-- FIX 1: Add missing 'color' column to shop_workers table
-- ============================================================================
--
-- PROBLEM: Code expects color column but database doesn't have it
-- ERROR: "Could not find the 'color' column of 'shop_workers' in the schema cache"
--
-- This column stores hex color codes for calendar visualization
-- Expected format: '#3B82F6' (7 characters including #)
--
-- Files affected:
-- - lib/database.ts:104 (type definition)
-- - lib/supabase/data/workers-data.ts:67 (insert)
-- - app/content/artists/actions.ts:47-52 (create action)
-- - app/dashboard/page.tsx:118 (display)

ALTER TABLE shop_workers
ADD COLUMN IF NOT EXISTS color VARCHAR(7) DEFAULT '#3B82F6';

-- Verify column was added
SELECT column_name, data_type, character_maximum_length, column_default
FROM information_schema.columns
WHERE table_name = 'shop_workers' AND column_name = 'color';

-- Expected result: color | character varying | 7 | '#3B82F6'::character varying


-- ============================================================================
-- FIX 2: Enable Row Level Security (RLS) on all tables with policies
-- ============================================================================
--
-- PROBLEM: RLS is disabled, so security policies don't protect data
-- IMPACT: Anyone can access/modify data regardless of policies
--
-- Supabase Security Advisor showed: "Policy Exists RLS Disabled"
-- This means policies were created but RLS wasn't enabled on the tables
--
-- Files affected: All data access files in lib/supabase/data/

-- Enable RLS on shop_workers (fixes worker creation)
ALTER TABLE shop_workers ENABLE ROW LEVEL SECURITY;

-- Enable RLS on related tables for proper security
ALTER TABLE shop_leads ENABLE ROW LEVEL SECURITY;
ALTER TABLE appointments ENABLE ROW LEVEL SECURITY;
ALTER TABLE daily_tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE accomplishments ENABLE ROW LEVEL SECURITY;
ALTER TABLE reminders ENABLE ROW LEVEL SECURITY;

-- Verify RLS is enabled
SELECT tablename, rowsecurity
FROM pg_tables
WHERE schemaname = 'public'
AND tablename IN (
  'shop_workers',
  'shop_leads',
  'appointments',
  'daily_tasks',
  'accomplishments',
  'reminders'
)
ORDER BY tablename;

-- Expected result: All tables should show rowsecurity = 't' (true)


-- ============================================================================
-- VERIFICATION QUERIES
-- ============================================================================
--
-- Run these to confirm everything is working:

-- 1. Check if color column exists and has default value
SELECT
  column_name,
  data_type,
  character_maximum_length,
  column_default
FROM information_schema.columns
WHERE table_name = 'shop_workers'
ORDER BY ordinal_position;

-- 2. Check RLS status on all important tables
SELECT
  schemaname,
  tablename,
  rowsecurity as rls_enabled
FROM pg_tables
WHERE schemaname = 'public'
AND tablename LIKE 'shop_%' OR tablename IN ('appointments', 'daily_tasks', 'accomplishments', 'reminders')
ORDER BY tablename;

-- 3. List all policies on shop_workers (they should now be active)
SELECT
  schemaname,
  tablename,
  policyname,
  permissive,
  roles,
  cmd as operation
FROM pg_policies
WHERE tablename = 'shop_workers'
ORDER BY policyname;

-- ============================================================================
-- POST-EXECUTION CHECKLIST
-- ============================================================================
--
-- After running this SQL successfully:
--
-- [ ] Color column added to shop_workers (check verification query 1)
-- [ ] RLS enabled on all tables (check verification query 2)
-- [ ] Policies are active (check verification query 3)
-- [ ] Go to website and test creating a worker/artist
-- [ ] Worker should save successfully
-- [ ] Worker should appear in dashboard with color
-- [ ] Worker should appear in calendar with their assigned color
--
-- If any issues:
-- 1. Check the response in the Network tab (F12 → Network)
-- 2. Look for error messages in Vercel logs
-- 3. Verify the user is authenticated
-- 4. Check that shop_id exists for the user
--
-- ============================================================================
-- END OF DATABASE FIXES
-- ============================================================================
