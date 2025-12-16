-- ============================================================================
-- FIX SHOP_LEADS TABLE - Add Missing Columns
-- ============================================================================
--
-- Issue: Client creation fails with error:
-- "Could not find the 'pipeline_stage' column of 'shop_leads' in the schema cache"
--
-- This script adds missing columns needed for pipeline functionality
--
-- INSTRUCTIONS:
-- 1. Go to Supabase Dashboard → SQL Editor
-- 2. Copy and paste this entire file
-- 3. Click "Run"
-- 4. Test creating a client again
--
-- This script is idempotent - safe to run multiple times
-- ============================================================================

-- Add pipeline_stage column (tracks which pipeline column the client is in)
ALTER TABLE shop_leads
ADD COLUMN IF NOT EXISTS pipeline_stage TEXT DEFAULT 'leads';

-- Add sort_order column (tracks position within pipeline column)
ALTER TABLE shop_leads
ADD COLUMN IF NOT EXISTS sort_order INTEGER DEFAULT 0;

-- Add index for performance
CREATE INDEX IF NOT EXISTS idx_shop_leads_pipeline
ON shop_leads(shop_id, pipeline_stage);

-- Add constraint to ensure valid stage names
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_constraint WHERE conname = 'valid_pipeline_stage'
    ) THEN
        ALTER TABLE shop_leads
        ADD CONSTRAINT valid_pipeline_stage
        CHECK (pipeline_stage IN ('leads', 'consulting', 'apts-made', 'inking', 'follow-ups'));
    END IF;
END $$;

-- Add documentation
COMMENT ON COLUMN shop_leads.pipeline_stage IS
'Current stage in the client pipeline. Valid values: leads, consulting, apts-made, inking, follow-ups';

COMMENT ON COLUMN shop_leads.sort_order IS
'Position within pipeline stage for drag-and-drop ordering. 0 = top of column, higher = lower';

-- Notify PostgREST to reload schema cache
NOTIFY pgrst, 'reload schema';

-- ============================================================================
-- VERIFICATION
-- ============================================================================

-- Check that columns were added
SELECT
  column_name,
  data_type,
  column_default
FROM information_schema.columns
WHERE table_name = 'shop_leads'
AND column_name IN ('pipeline_stage', 'sort_order')
ORDER BY column_name;

-- Expected output:
-- pipeline_stage | text    | 'leads'::text
-- sort_order     | integer | 0

-- Check that constraint was added
SELECT
  conname,
  pg_get_constraintdef(oid)
FROM pg_constraint
WHERE conname = 'valid_pipeline_stage';

-- Expected output showing the CHECK constraint

-- ============================================================================
-- SUCCESS!
-- ============================================================================

DO $$
BEGIN
  RAISE NOTICE '============================================';
  RAISE NOTICE '✅ SHOP_LEADS COLUMNS ADDED!';
  RAISE NOTICE '============================================';
  RAISE NOTICE '';
  RAISE NOTICE 'Columns added:';
  RAISE NOTICE '  ✓ pipeline_stage (TEXT, default "leads")';
  RAISE NOTICE '  ✓ sort_order (INTEGER, default 0)';
  RAISE NOTICE '';
  RAISE NOTICE 'Now try creating a client again!';
  RAISE NOTICE '============================================';
END $$;
