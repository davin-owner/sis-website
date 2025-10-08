-- ============================================
-- WAITLIST TABLE - Lead Generation for Simple Ink Studios
-- ============================================
-- This table stores potential customer leads who sign up
-- on the landing page before the product launches
--
-- HOW TO RUN THIS:
-- 1. Go to Supabase Dashboard → SQL Editor
-- 2. Copy/paste this entire file
-- 3. Click "Run"
-- ============================================

-- Create the waitlist table
CREATE TABLE IF NOT EXISTS waitlist (
  -- Auto-incrementing ID (primary key)
  id BIGSERIAL PRIMARY KEY,

  -- Name of the person (REQUIRED)
  name TEXT NOT NULL,

  -- Contact info (at least one is required, enforced in app)
  email TEXT,
  phone TEXT,

  -- Shop information (OPTIONAL)
  shop_name TEXT,
  city_state TEXT,

  -- Free-form message field
  -- Stores: What intrigued them? Current tracking method? What they're looking for?
  message TEXT,

  -- Timestamp - automatically set when row is created
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ============================================
-- RLS controls who can read/write this table
-- For waitlist: Anyone can INSERT (public signup form)
-- Only authenticated users can SELECT (you viewing leads)

-- Enable RLS on the table
ALTER TABLE waitlist ENABLE ROW LEVEL SECURITY;

-- Policy 1: Anyone can sign up (INSERT)
-- This allows the public landing page to save signups
CREATE POLICY "Anyone can sign up for waitlist"
ON waitlist
FOR INSERT
TO anon, authenticated
WITH CHECK (true);

-- Policy 2: Only authenticated users can view waitlist
-- This protects your leads - only you (logged in) can see them
CREATE POLICY "Authenticated users can view waitlist"
ON waitlist
FOR SELECT
TO authenticated
USING (true);

-- ============================================
-- INDEX for faster queries
-- ============================================
-- Create index on created_at so you can sort by date quickly
CREATE INDEX IF NOT EXISTS waitlist_created_at_idx ON waitlist(created_at DESC);

-- ============================================
-- DONE!
-- ============================================
-- After running this, you'll have:
-- ✅ waitlist table ready to store leads
-- ✅ Public can sign up (no login needed)
-- ✅ Only you (logged in) can view the leads
-- ✅ Fast queries sorted by signup date
