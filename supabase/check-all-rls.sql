-- Check RLS policies on ALL your tables to find the catch-22 pattern
-- Run this in Supabase SQL Editor

-- Workers table
SELECT 'shop_workers' as table_name, policyname, cmd, with_check, qual
FROM pg_policies
WHERE schemaname = 'public' AND tablename = 'shop_workers'
ORDER BY cmd, policyname;

-- Clients/Leads table
SELECT 'shop_leads' as table_name, policyname, cmd, with_check, qual
FROM pg_policies
WHERE schemaname = 'public' AND tablename = 'shop_leads'
ORDER BY cmd, policyname;

-- Appointments table
SELECT 'appointments' as table_name, policyname, cmd, with_check, qual
FROM pg_policies
WHERE schemaname = 'public' AND tablename = 'appointments'
ORDER BY cmd, policyname;
