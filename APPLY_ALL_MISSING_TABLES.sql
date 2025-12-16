-- ============================================================================
-- APPLY ALL MISSING TABLES FOR SIMPLE INK STUDIOS
-- ============================================================================
--
-- This script creates all missing tables in production database:
-- 1. appointments (calendar feature)
-- 2. daily_tasks (dashboard feature)
-- 3. accomplishments (dashboard feature)
-- 4. reminders (dashboard feature)
--
-- Date: December 29, 2025
-- Issue: Dashboard and calendar features don't work in production
-- Reason: Migration files exist locally but haven't been applied to production
--
-- INSTRUCTIONS:
-- 1. Go to Supabase Dashboard → SQL Editor
-- 2. Create a new query
-- 3. Copy and paste this ENTIRE file
-- 4. Click "Run" (or Cmd/Ctrl + Enter)
-- 5. Wait for success message
-- 6. Test all features on your website
--
-- This script is idempotent - safe to run multiple times
-- It will skip creating tables that already exist
-- ============================================================================


-- ============================================================================
-- TABLE 1: APPOINTMENTS (Calendar Feature)
-- ============================================================================
--
-- Purpose: Client appointments with workers/artists
-- Used in: Calendar page (/content/calendar)
-- Files: lib/supabase/data/appointment-data.ts
--

CREATE TABLE IF NOT EXISTS appointments (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  shop_id UUID NOT NULL REFERENCES shops_tables(shop_id) ON DELETE CASCADE,
  client_id BIGINT NOT NULL REFERENCES shop_leads(id) ON DELETE CASCADE,
  worker_id UUID REFERENCES shop_workers(id) ON DELETE SET NULL,

  -- Appointment timing
  appointment_date DATE NOT NULL,
  start_time TIME NOT NULL,
  end_time TIME NOT NULL,

  -- Details
  title VARCHAR(255),
  notes TEXT,
  location VARCHAR(255), -- Room/station number

  -- Status
  status VARCHAR(50) DEFAULT 'scheduled', -- scheduled, completed, cancelled, no-show

  -- Metadata
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_appointments_shop_id ON appointments(shop_id);
CREATE INDEX IF NOT EXISTS idx_appointments_client_id ON appointments(client_id);
CREATE INDEX IF NOT EXISTS idx_appointments_worker_id ON appointments(worker_id);
CREATE INDEX IF NOT EXISTS idx_appointments_date ON appointments(appointment_date);
CREATE INDEX IF NOT EXISTS idx_appointments_status ON appointments(status);
CREATE INDEX IF NOT EXISTS idx_appointments_date_worker ON appointments(appointment_date, worker_id);

-- Constraint: end_time must be after start_time
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'check_appointment_times'
  ) THEN
    ALTER TABLE appointments
    ADD CONSTRAINT check_appointment_times CHECK (end_time > start_time);
  END IF;
END $$;

-- Update trigger
CREATE OR REPLACE FUNCTION update_appointments_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS appointments_updated_at ON appointments;
CREATE TRIGGER appointments_updated_at
  BEFORE UPDATE ON appointments
  FOR EACH ROW
  EXECUTE FUNCTION update_appointments_updated_at();

-- Enable RLS
ALTER TABLE appointments ENABLE ROW LEVEL SECURITY;

-- RLS Policies for appointments
DROP POLICY IF EXISTS "users_read_appointments" ON appointments;
CREATE POLICY "users_read_appointments"
  ON appointments FOR SELECT
  TO authenticated
  USING (
    shop_id IN (
      SELECT shop_id FROM shop_users
      WHERE user_id = auth.uid()
    )
  );

DROP POLICY IF EXISTS "users_insert_appointments" ON appointments;
CREATE POLICY "users_insert_appointments"
  ON appointments FOR INSERT
  TO authenticated
  WITH CHECK (
    shop_id IN (
      SELECT shop_id FROM shop_users
      WHERE user_id = auth.uid()
    )
  );

DROP POLICY IF EXISTS "users_update_appointments" ON appointments;
CREATE POLICY "users_update_appointments"
  ON appointments FOR UPDATE
  TO authenticated
  USING (
    shop_id IN (
      SELECT shop_id FROM shop_users
      WHERE user_id = auth.uid()
    )
  );

DROP POLICY IF EXISTS "users_delete_appointments" ON appointments;
CREATE POLICY "users_delete_appointments"
  ON appointments FOR DELETE
  TO authenticated
  USING (
    shop_id IN (
      SELECT shop_id FROM shop_users
      WHERE user_id = auth.uid()
    )
  );


-- ============================================================================
-- TABLE 2: DAILY_TASKS (Dashboard Feature)
-- ============================================================================
--
-- Purpose: Simple todo list for daily shop tasks
-- Used in: Dashboard page (/dashboard)
-- Files: lib/supabase/data/dashboard-tasks-data.ts
--

CREATE TABLE IF NOT EXISTS daily_tasks (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  shop_id UUID NOT NULL REFERENCES shops_tables(shop_id) ON DELETE CASCADE,
  created_by_user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,

  label TEXT NOT NULL,
  done BOOLEAN DEFAULT false,
  sort_order INTEGER DEFAULT 0,

  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_daily_tasks_shop_id ON daily_tasks(shop_id);
CREATE INDEX IF NOT EXISTS idx_daily_tasks_created_by ON daily_tasks(created_by_user_id);
CREATE INDEX IF NOT EXISTS idx_daily_tasks_done ON daily_tasks(done);
CREATE INDEX IF NOT EXISTS idx_daily_tasks_sort_order ON daily_tasks(shop_id, sort_order);

-- Enable RLS
ALTER TABLE daily_tasks ENABLE ROW LEVEL SECURITY;

-- RLS Policies for daily_tasks
DROP POLICY IF EXISTS "Users can view tasks for their shops" ON daily_tasks;
CREATE POLICY "Users can view tasks for their shops"
  ON daily_tasks FOR SELECT
  TO authenticated
  USING (
    shop_id IN (
      SELECT shop_id FROM shop_users
      WHERE user_id = auth.uid()
    )
  );

DROP POLICY IF EXISTS "Users can insert tasks for their shops" ON daily_tasks;
CREATE POLICY "Users can insert tasks for their shops"
  ON daily_tasks FOR INSERT
  TO authenticated
  WITH CHECK (
    shop_id IN (
      SELECT shop_id FROM shop_users
      WHERE user_id = auth.uid()
    )
  );

DROP POLICY IF EXISTS "Users can update tasks for their shops" ON daily_tasks;
CREATE POLICY "Users can update tasks for their shops"
  ON daily_tasks FOR UPDATE
  TO authenticated
  USING (
    shop_id IN (
      SELECT shop_id FROM shop_users
      WHERE user_id = auth.uid()
    )
  );

DROP POLICY IF EXISTS "Users can delete tasks for their shops" ON daily_tasks;
CREATE POLICY "Users can delete tasks for their shops"
  ON daily_tasks FOR DELETE
  TO authenticated
  USING (
    shop_id IN (
      SELECT shop_id FROM shop_users
      WHERE user_id = auth.uid()
    )
  );

-- Update trigger
CREATE OR REPLACE FUNCTION update_daily_tasks_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS update_daily_tasks_updated_at ON daily_tasks;
CREATE TRIGGER update_daily_tasks_updated_at
  BEFORE UPDATE ON daily_tasks
  FOR EACH ROW
  EXECUTE FUNCTION update_daily_tasks_updated_at();


-- ============================================================================
-- TABLE 3: ACCOMPLISHMENTS (Dashboard Feature)
-- ============================================================================
--
-- Purpose: Track daily wins and achievements
-- Used in: Dashboard page (/dashboard)
-- Files: lib/supabase/data/dashboard-accomplishments-data.ts
--

CREATE TABLE IF NOT EXISTS accomplishments (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  shop_id UUID NOT NULL REFERENCES shops_tables(shop_id) ON DELETE CASCADE,
  created_by_user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,

  description TEXT NOT NULL,
  accomplishment_date DATE DEFAULT CURRENT_DATE,

  -- Meta: Mark if this was auto-generated (future feature)
  is_automated BOOLEAN DEFAULT false,
  automation_source TEXT, -- e.g., 'pipeline_move', 'appointment_completed', etc.

  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_accomplishments_shop_id ON accomplishments(shop_id);
CREATE INDEX IF NOT EXISTS idx_accomplishments_created_by ON accomplishments(created_by_user_id);
CREATE INDEX IF NOT EXISTS idx_accomplishments_date ON accomplishments(shop_id, accomplishment_date DESC);

-- Enable RLS
ALTER TABLE accomplishments ENABLE ROW LEVEL SECURITY;

-- RLS Policies for accomplishments
DROP POLICY IF EXISTS "Users can view accomplishments for their shops" ON accomplishments;
CREATE POLICY "Users can view accomplishments for their shops"
  ON accomplishments FOR SELECT
  TO authenticated
  USING (
    shop_id IN (
      SELECT shop_id FROM shop_users
      WHERE user_id = auth.uid()
    )
  );

DROP POLICY IF EXISTS "Users can insert accomplishments for their shops" ON accomplishments;
CREATE POLICY "Users can insert accomplishments for their shops"
  ON accomplishments FOR INSERT
  TO authenticated
  WITH CHECK (
    shop_id IN (
      SELECT shop_id FROM shop_users
      WHERE user_id = auth.uid()
    )
  );

DROP POLICY IF EXISTS "Users can delete accomplishments for their shops" ON accomplishments;
CREATE POLICY "Users can delete accomplishments for their shops"
  ON accomplishments FOR DELETE
  TO authenticated
  USING (
    shop_id IN (
      SELECT shop_id FROM shop_users
      WHERE user_id = auth.uid()
    )
  );


-- ============================================================================
-- TABLE 4: REMINDERS (Dashboard Feature)
-- ============================================================================
--
-- Purpose: Track reminders, goals, and urgent tasks
-- Used in: Dashboard page (/dashboard)
-- Files: lib/supabase/data/dashboard-reminders-data.ts
--

CREATE TABLE IF NOT EXISTS reminders (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  shop_id UUID NOT NULL REFERENCES shops_tables(shop_id) ON DELETE CASCADE,
  created_by_user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,

  title TEXT NOT NULL,
  description TEXT,

  -- Categorization
  type TEXT DEFAULT 'reminder' CHECK (type IN ('reminder', 'goal', 'urgent')),

  -- Scheduling
  due_date DATE,
  is_completed BOOLEAN DEFAULT false,
  completed_at TIMESTAMPTZ,

  -- Priority
  priority INTEGER DEFAULT 0, -- Higher = more important

  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_reminders_shop_id ON reminders(shop_id);
CREATE INDEX IF NOT EXISTS idx_reminders_created_by ON reminders(created_by_user_id);
CREATE INDEX IF NOT EXISTS idx_reminders_type ON reminders(shop_id, type);
CREATE INDEX IF NOT EXISTS idx_reminders_due_date ON reminders(shop_id, due_date);
CREATE INDEX IF NOT EXISTS idx_reminders_completed ON reminders(shop_id, is_completed);
CREATE INDEX IF NOT EXISTS idx_reminders_priority ON reminders(shop_id, priority DESC) WHERE is_completed = false;

-- Enable RLS
ALTER TABLE reminders ENABLE ROW LEVEL SECURITY;

-- RLS Policies for reminders
DROP POLICY IF EXISTS "Users can view reminders for their shops" ON reminders;
CREATE POLICY "Users can view reminders for their shops"
  ON reminders FOR SELECT
  TO authenticated
  USING (
    shop_id IN (
      SELECT shop_id FROM shop_users
      WHERE user_id = auth.uid()
    )
  );

DROP POLICY IF EXISTS "Users can insert reminders for their shops" ON reminders;
CREATE POLICY "Users can insert reminders for their shops"
  ON reminders FOR INSERT
  TO authenticated
  WITH CHECK (
    shop_id IN (
      SELECT shop_id FROM shop_users
      WHERE user_id = auth.uid()
    )
  );

DROP POLICY IF EXISTS "Users can update reminders for their shops" ON reminders;
CREATE POLICY "Users can update reminders for their shops"
  ON reminders FOR UPDATE
  TO authenticated
  USING (
    shop_id IN (
      SELECT shop_id FROM shop_users
      WHERE user_id = auth.uid()
    )
  );

DROP POLICY IF EXISTS "Users can delete reminders for their shops" ON reminders;
CREATE POLICY "Users can delete reminders for their shops"
  ON reminders FOR DELETE
  TO authenticated
  USING (
    shop_id IN (
      SELECT shop_id FROM shop_users
      WHERE user_id = auth.uid()
    )
  );

-- Update trigger
CREATE OR REPLACE FUNCTION update_reminders_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS update_reminders_updated_at ON reminders;
CREATE TRIGGER update_reminders_updated_at
  BEFORE UPDATE ON reminders
  FOR EACH ROW
  EXECUTE FUNCTION update_reminders_updated_at();


-- ============================================================================
-- VERIFICATION QUERIES
-- ============================================================================
--
-- Automatically run these to confirm success:

-- 1. Check all 4 tables exist
SELECT
  table_name,
  table_type
FROM information_schema.tables
WHERE table_schema = 'public'
AND table_name IN ('appointments', 'daily_tasks', 'accomplishments', 'reminders')
ORDER BY table_name;

-- Expected: 4 rows

-- 2. Check RLS is enabled on all tables
SELECT
  tablename,
  rowsecurity as rls_enabled
FROM pg_tables
WHERE schemaname = 'public'
AND tablename IN ('appointments', 'daily_tasks', 'accomplishments', 'reminders')
ORDER BY tablename;

-- Expected: 4 rows with rls_enabled = 't'

-- 3. Check policies exist for each table
SELECT
  tablename,
  COUNT(*) as policy_count
FROM pg_policies
WHERE tablename IN ('appointments', 'daily_tasks', 'accomplishments', 'reminders')
GROUP BY tablename
ORDER BY tablename;

-- Expected: appointments=4, daily_tasks=4, accomplishments=3, reminders=4

-- 4. Quick count check (should show 0 rows in each table)
SELECT 'appointments' as table_name, COUNT(*) as row_count FROM appointments
UNION ALL
SELECT 'daily_tasks', COUNT(*) FROM daily_tasks
UNION ALL
SELECT 'accomplishments', COUNT(*) FROM accomplishments
UNION ALL
SELECT 'reminders', COUNT(*) FROM reminders
ORDER BY table_name;


-- ============================================================================
-- SUCCESS MESSAGE
-- ============================================================================

DO $$
BEGIN
  RAISE NOTICE '============================================';
  RAISE NOTICE '✅ ALL TABLES CREATED SUCCESSFULLY!';
  RAISE NOTICE '============================================';
  RAISE NOTICE '';
  RAISE NOTICE 'Tables created:';
  RAISE NOTICE '  ✓ appointments (Calendar feature)';
  RAISE NOTICE '  ✓ daily_tasks (Dashboard feature)';
  RAISE NOTICE '  ✓ accomplishments (Dashboard feature)';
  RAISE NOTICE '  ✓ reminders (Dashboard feature)';
  RAISE NOTICE '';
  RAISE NOTICE 'Next steps:';
  RAISE NOTICE '  1. Go to https://www.simpleinkstudios.com/dashboard';
  RAISE NOTICE '  2. Try creating a daily task';
  RAISE NOTICE '  3. Try creating an accomplishment';
  RAISE NOTICE '  4. Try creating a reminder';
  RAISE NOTICE '  5. Go to /content/calendar and test appointments';
  RAISE NOTICE '';
  RAISE NOTICE 'Everything should work now! 🎉';
  RAISE NOTICE '============================================';
END $$;


-- ============================================================================
-- POST-EXECUTION CHECKLIST
-- ============================================================================
--
-- After running this SQL:
--
-- [ ] All 4 tables created (see verification query 1)
-- [ ] RLS enabled on all tables (see verification query 2)
-- [ ] Policies exist (see verification query 3)
-- [ ] Test dashboard daily tasks - should save
-- [ ] Test dashboard accomplishments - should save
-- [ ] Test dashboard reminders - should save
-- [ ] Test calendar appointments - should load without errors
--
-- If any features still don't work:
-- 1. Check browser console (F12 → Console)
-- 2. Check Network tab (F12 → Network) for API errors
-- 3. Verify you're logged in
-- 4. Verify your user has a shop_id
-- 5. Check Supabase logs for policy violations
--
-- ============================================================================
-- END OF SCRIPT
-- ============================================================================
