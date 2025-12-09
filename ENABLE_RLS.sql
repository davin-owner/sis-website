-- Enable Row Level Security on shop_workers table
-- This fixes the "Policy Exists RLS Disabled" error preventing worker creation

ALTER TABLE shop_workers ENABLE ROW LEVEL SECURITY;

-- Verify RLS is enabled (optional - check the result)
SELECT tablename, rowsecurity
FROM pg_tables
WHERE schemaname = 'public'
AND tablename = 'shop_workers';

-- Expected result: rowsecurity should be 't' (true)
