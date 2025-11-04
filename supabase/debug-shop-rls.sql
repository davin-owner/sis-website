-- Debug script to check RLS policies on shops_tables
-- Run this in Supabase SQL Editor to see what's actually configured

-- 1. Check if RLS is enabled
SELECT tablename, rowsecurity
FROM pg_tables
WHERE schemaname = 'public' AND tablename = 'shops_tables';

-- 2. List ALL policies on shops_tables
SELECT
  schemaname,
  tablename,
  policyname,
  permissive,
  roles,
  cmd,
  qual,
  with_check
FROM pg_policies
WHERE schemaname = 'public' AND tablename = 'shops_tables'
ORDER BY cmd, policyname;

-- 3. Check table structure
SELECT column_name, data_type, is_nullable, column_default
FROM information_schema.columns
WHERE table_schema = 'public' AND table_name = 'shops_tables'
ORDER BY ordinal_position;

-- 4. Test what user auth.uid() returns (run this while logged in)
SELECT auth.uid() as current_user_id;

-- 5. Check if shop_users table has correct structure
SELECT column_name, data_type, is_nullable
FROM information_schema.columns
WHERE table_schema = 'public' AND table_name = 'shop_users'
ORDER BY ordinal_position;
