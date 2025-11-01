-- Migration: Dashboard Features (Daily Tasks, Accomplishments, Reminders)
-- Created: November 1, 2025
-- Purpose: Add tables for interactive dashboard features

-- =====================================================
-- 1. DAILY_TASKS TABLE
-- Purpose: User-created daily tasks/checklist items
-- =====================================================
CREATE TABLE IF NOT EXISTS public.daily_tasks (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  shop_id UUID NOT NULL REFERENCES public.shops_tables(shop_id) ON DELETE CASCADE,
  created_by_user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,

  label TEXT NOT NULL,
  done BOOLEAN DEFAULT false,
  sort_order INTEGER DEFAULT 0,

  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Add index for faster queries
CREATE INDEX idx_daily_tasks_shop_id ON public.daily_tasks(shop_id);
CREATE INDEX idx_daily_tasks_done ON public.daily_tasks(done);

-- =====================================================
-- 2. ACCOMPLISHMENTS TABLE
-- Purpose: Track daily accomplishments (manual for now, auto in future)
-- =====================================================
CREATE TABLE IF NOT EXISTS public.accomplishments (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  shop_id UUID NOT NULL REFERENCES public.shops_tables(shop_id) ON DELETE CASCADE,
  created_by_user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,

  description TEXT NOT NULL,
  accomplishment_date DATE DEFAULT CURRENT_DATE,

  -- Meta: Mark if this was auto-generated (future feature)
  is_automated BOOLEAN DEFAULT false,
  automation_source TEXT, -- e.g., 'pipeline_move', 'appointment_completed', etc.

  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Add indexes
CREATE INDEX idx_accomplishments_shop_id ON public.accomplishments(shop_id);
CREATE INDEX idx_accomplishments_date ON public.accomplishments(accomplishment_date DESC);

-- =====================================================
-- 3. REMINDERS TABLE (Goals & Reminders)
-- Purpose: User-set goals, reminders, and action items
-- =====================================================
CREATE TABLE IF NOT EXISTS public.reminders (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  shop_id UUID NOT NULL REFERENCES public.shops_tables(shop_id) ON DELETE CASCADE,
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

-- Add indexes
CREATE INDEX idx_reminders_shop_id ON public.reminders(shop_id);
CREATE INDEX idx_reminders_due_date ON public.reminders(due_date);
CREATE INDEX idx_reminders_type ON public.reminders(type);
CREATE INDEX idx_reminders_completed ON public.reminders(is_completed);

-- =====================================================
-- ROW LEVEL SECURITY (RLS)
-- =====================================================

-- Enable RLS on all three tables
ALTER TABLE public.daily_tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.accomplishments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reminders ENABLE ROW LEVEL SECURITY;

-- DAILY_TASKS RLS POLICIES
CREATE POLICY "Users can view tasks for their shops"
  ON public.daily_tasks FOR SELECT
  USING (
    shop_id IN (
      SELECT shop_id FROM public.shop_users
      WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Users can insert tasks for their shops"
  ON public.daily_tasks FOR INSERT
  WITH CHECK (
    shop_id IN (
      SELECT shop_id FROM public.shop_users
      WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Users can update tasks for their shops"
  ON public.daily_tasks FOR UPDATE
  USING (
    shop_id IN (
      SELECT shop_id FROM public.shop_users
      WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Users can delete tasks for their shops"
  ON public.daily_tasks FOR DELETE
  USING (
    shop_id IN (
      SELECT shop_id FROM public.shop_users
      WHERE user_id = auth.uid()
    )
  );

-- ACCOMPLISHMENTS RLS POLICIES
CREATE POLICY "Users can view accomplishments for their shops"
  ON public.accomplishments FOR SELECT
  USING (
    shop_id IN (
      SELECT shop_id FROM public.shop_users
      WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Users can insert accomplishments for their shops"
  ON public.accomplishments FOR INSERT
  WITH CHECK (
    shop_id IN (
      SELECT shop_id FROM public.shop_users
      WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Users can delete accomplishments for their shops"
  ON public.accomplishments FOR DELETE
  USING (
    shop_id IN (
      SELECT shop_id FROM public.shop_users
      WHERE user_id = auth.uid()
    )
  );

-- REMINDERS RLS POLICIES
CREATE POLICY "Users can view reminders for their shops"
  ON public.reminders FOR SELECT
  USING (
    shop_id IN (
      SELECT shop_id FROM public.shop_users
      WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Users can insert reminders for their shops"
  ON public.reminders FOR INSERT
  WITH CHECK (
    shop_id IN (
      SELECT shop_id FROM public.shop_users
      WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Users can update reminders for their shops"
  ON public.reminders FOR UPDATE
  USING (
    shop_id IN (
      SELECT shop_id FROM public.shop_users
      WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Users can delete reminders for their shops"
  ON public.reminders FOR DELETE
  USING (
    shop_id IN (
      SELECT shop_id FROM public.shop_users
      WHERE user_id = auth.uid()
    )
  );

-- =====================================================
-- UPDATED_AT TRIGGERS
-- =====================================================

-- Trigger function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply trigger to daily_tasks
CREATE TRIGGER update_daily_tasks_updated_at
  BEFORE UPDATE ON public.daily_tasks
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Apply trigger to reminders
CREATE TRIGGER update_reminders_updated_at
  BEFORE UPDATE ON public.reminders
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- =====================================================
-- COMMENTS FOR DOCUMENTATION
-- =====================================================

COMMENT ON TABLE public.daily_tasks IS 'User-created daily tasks and checklist items for dashboard';
COMMENT ON TABLE public.accomplishments IS 'Daily accomplishments - manual entry for now, automated tracking planned for future';
COMMENT ON TABLE public.reminders IS 'Goals, reminders, and action items for users to track';

COMMENT ON COLUMN public.accomplishments.is_automated IS 'Future feature: Track if accomplishment was auto-generated from system events';
COMMENT ON COLUMN public.accomplishments.automation_source IS 'Future feature: Source of auto-generated accomplishment (e.g., pipeline_move, appointment_completed)';
