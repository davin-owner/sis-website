-- Migration: Add Pipeline Tracking to Shop Leads
-- Created: 2025-01-16
-- Purpose: Enable drag-and-drop pipeline management for tattoo shop clients
--
-- This migration adds columns to track which stage a client is in
-- and their position within that stage for ordering.

-- Add pipeline_stage column
-- This tracks which column the client card is in (Leads, Consulting, etc.)
-- Default is 'leads' so existing clients start in the Leads column
ALTER TABLE shop_leads
ADD COLUMN IF NOT EXISTS pipeline_stage TEXT DEFAULT 'leads';

-- Add sort_order column
-- This tracks the vertical position within each pipeline column
-- Lower numbers appear at the top, higher numbers at the bottom
-- Default is 0 so existing clients appear at the top
ALTER TABLE shop_leads
ADD COLUMN IF NOT EXISTS sort_order INTEGER DEFAULT 0;

-- Add composite index for query performance
-- We ALWAYS query: "Get all clients in shop X that are in stage Y"
-- This index makes that query lightning fast
CREATE INDEX IF NOT EXISTS idx_shop_leads_pipeline
ON shop_leads(shop_id, pipeline_stage);

-- Add constraint to prevent invalid stage names
-- This ensures the app can ONLY set these 5 valid stages
-- If code tries to set stage = 'invalid', database will reject it
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

-- Add documentation comments
-- These show up in database tools and help future developers
COMMENT ON COLUMN shop_leads.pipeline_stage IS
'Current stage in the client pipeline. Valid values: leads, consulting, apts-made, inking, follow-ups';

COMMENT ON COLUMN shop_leads.sort_order IS
'Position within pipeline stage for drag-and-drop ordering. 0 = top of column, higher = lower in column';

-- Rollback Instructions (if needed):
-- To undo this migration, run:
-- ALTER TABLE shop_leads DROP CONSTRAINT IF EXISTS valid_pipeline_stage;
-- DROP INDEX IF EXISTS idx_shop_leads_pipeline;
-- ALTER TABLE shop_leads DROP COLUMN IF EXISTS sort_order;
-- ALTER TABLE shop_leads DROP COLUMN IF EXISTS pipeline_stage;