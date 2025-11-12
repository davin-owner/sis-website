-- Migration 12: Add Subscription Tiers and Usage Tracking
-- Created: 2025-11-11
-- Purpose: Add Polar billing integration with tier-based features

-- Add subscription columns to shops_tables (only if they don't exist)
DO $$
BEGIN
  -- Add subscription_tier if it doesn't exist
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema = 'public'
    AND table_name = 'shops_tables'
    AND column_name = 'subscription_tier'
  ) THEN
    ALTER TABLE public.shops_tables
      ADD COLUMN subscription_tier TEXT DEFAULT 'free'
        CHECK (subscription_tier IN ('free', 'basics', 'pro', 'enterprise'));
  END IF;

  -- Add polar_customer_id if it doesn't exist
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema = 'public'
    AND table_name = 'shops_tables'
    AND column_name = 'polar_customer_id'
  ) THEN
    ALTER TABLE public.shops_tables ADD COLUMN polar_customer_id TEXT;
  END IF;

  -- Add polar_subscription_id if it doesn't exist
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema = 'public'
    AND table_name = 'shops_tables'
    AND column_name = 'polar_subscription_id'
  ) THEN
    ALTER TABLE public.shops_tables ADD COLUMN polar_subscription_id TEXT;
  END IF;

  -- Add subscription_status if it doesn't exist
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema = 'public'
    AND table_name = 'shops_tables'
    AND column_name = 'subscription_status'
  ) THEN
    ALTER TABLE public.shops_tables
      ADD COLUMN subscription_status TEXT DEFAULT 'active'
        CHECK (subscription_status IN ('active', 'cancelled', 'past_due', 'trialing'));
  END IF;

  -- Add trial_ends_at if it doesn't exist
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema = 'public'
    AND table_name = 'shops_tables'
    AND column_name = 'trial_ends_at'
  ) THEN
    ALTER TABLE public.shops_tables ADD COLUMN trial_ends_at TIMESTAMP WITH TIME ZONE;
  END IF;

  -- Add subscription_created_at if it doesn't exist
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema = 'public'
    AND table_name = 'shops_tables'
    AND column_name = 'subscription_created_at'
  ) THEN
    ALTER TABLE public.shops_tables ADD COLUMN subscription_created_at TIMESTAMP WITH TIME ZONE;
  END IF;
END $$;

-- Create usage tracking table
CREATE TABLE public.shop_usage (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  shop_id UUID REFERENCES public.shops_tables(shop_id) ON DELETE CASCADE,
  month DATE NOT NULL, -- First day of the month (2025-11-01)
  appointments_created INT DEFAULT 0,
  sms_sent INT DEFAULT 0,
  emails_sent INT DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(shop_id, month)
);

-- RLS policies for shop_usage
ALTER TABLE public.shop_usage ENABLE ROW LEVEL SECURITY;

CREATE POLICY "users_read_own_usage"
ON public.shop_usage
FOR SELECT
TO authenticated
USING (
  shop_id IN (
    SELECT shop_id FROM public.shop_users WHERE user_id = auth.uid()
  )
);

CREATE POLICY "system_insert_usage"
ON public.shop_usage
FOR INSERT
TO authenticated
WITH CHECK (
  shop_id IN (
    SELECT shop_id FROM public.shop_users WHERE user_id = auth.uid()
  )
);

CREATE POLICY "system_update_usage"
ON public.shop_usage
FOR UPDATE
TO authenticated
USING (
  shop_id IN (
    SELECT shop_id FROM public.shop_users WHERE user_id = auth.uid()
  )
);

-- Index for fast lookups
CREATE INDEX shop_usage_shop_month_idx ON public.shop_usage(shop_id, month);

-- Comments
COMMENT ON TABLE public.shop_usage IS 'Tracks monthly usage for tier limit enforcement';
COMMENT ON COLUMN public.shops_tables.subscription_tier IS 'Current subscription tier: free, basics, pro, enterprise';
COMMENT ON COLUMN public.shops_tables.polar_customer_id IS 'Polar customer ID for billing';
COMMENT ON COLUMN public.shops_tables.polar_subscription_id IS 'Polar subscription ID';
COMMENT ON COLUMN public.shops_tables.subscription_status IS 'Subscription status: active, cancelled, past_due, trialing';
