-- Migration: Change contact_phone from integer to text
-- Reason: Phone numbers should be stored as text to preserve formatting,
--         leading zeros, and support international formats

-- Change shop_leads.contact_phone from int4 to text
ALTER TABLE shop_leads
ALTER COLUMN contact_phone TYPE text
USING contact_phone::text;

-- Add a comment for documentation
COMMENT ON COLUMN shop_leads.contact_phone IS
'Phone number stored as text to preserve formatting (e.g., (555) 123-4567, +1-555-123-4567)';