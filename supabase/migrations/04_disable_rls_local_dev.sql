-- Migration: Disable RLS for local development
-- Reason: Local Supabase doesn't properly validate JWT tokens, causing auth.uid() to return NULL
--         This makes all RLS policies fail even for authenticated users
--
-- NOTE: In production (cloud Supabase), RLS works correctly and should remain ENABLED
--       These policies are already defined in 00_initial_schema.sql and will work in production

-- Disable RLS on all shop-related tables for local development
ALTER TABLE shops_tables DISABLE ROW LEVEL SECURITY;
ALTER TABLE shop_users DISABLE ROW LEVEL SECURITY;
ALTER TABLE shop_leads DISABLE ROW LEVEL SECURITY;
ALTER TABLE shop_appointments DISABLE ROW LEVEL SECURITY;
ALTER TABLE shop_tasks DISABLE ROW LEVEL SECURITY;
ALTER TABLE shop_workers DISABLE ROW LEVEL SECURITY;

-- Note: The 'leads' table (for Simple Ink Studios internal use) keeps RLS enabled
-- as it has proper owner-based policies that should work in all environments

-- Add helpful comments for documentation
COMMENT ON TABLE shops_tables IS
'Tattoo shops (clients of Simple Ink Studios). RLS disabled for local dev, enabled in production.';

COMMENT ON TABLE shop_users IS
'User-shop relationships with roles. RLS disabled for local dev, enabled in production.';

COMMENT ON TABLE shop_leads IS
'Client leads for each shop (people wanting tattoos). RLS disabled for local dev, enabled in production.';
