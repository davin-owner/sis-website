# 🚀 Tier Implementation Plan - Programming Roadmap

**Goal:** Launch Free, Basics ($29), and Pro ($79) tiers with Polar billing
**Timeline:** 2-3 weeks
**Status:** Planning Phase

---

## 📋 Implementation Checklist

### **Phase 1: Database & Schema (Days 1-2)**

#### Task 1.1: Create Subscription Migration
**File:** `supabase/migrations/12_add_subscription_tiers.sql`

```sql
-- Add subscription columns to shops_tables
ALTER TABLE public.shops_tables
  ADD COLUMN subscription_tier TEXT DEFAULT 'free'
    CHECK (subscription_tier IN ('free', 'basics', 'pro', 'enterprise'));

ALTER TABLE public.shops_tables
  ADD COLUMN polar_customer_id TEXT;

ALTER TABLE public.shops_tables
  ADD COLUMN polar_subscription_id TEXT;

ALTER TABLE public.shops_tables
  ADD COLUMN subscription_status TEXT DEFAULT 'active'
    CHECK (subscription_status IN ('active', 'cancelled', 'past_due', 'trialing'));

ALTER TABLE public.shops_tables
  ADD COLUMN trial_ends_at TIMESTAMP WITH TIME ZONE;

ALTER TABLE public.shops_tables
  ADD COLUMN subscription_created_at TIMESTAMP WITH TIME ZONE;

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

-- Index for fast lookups
CREATE INDEX shop_usage_shop_month_idx ON public.shop_usage(shop_id, month);

-- Comments
COMMENT ON TABLE public.shop_usage IS 'Tracks monthly usage for tier limit enforcement';
COMMENT ON COLUMN public.shops_tables.subscription_tier IS 'Current subscription tier: free, basics, pro, enterprise';
COMMENT ON COLUMN public.shops_tables.polar_customer_id IS 'Polar customer ID for billing';
```

**Commands:**
```bash
cd /Users/davin/Desktop/Simple\ Ink\ Studios/sis-website
supabase db reset --local  # Test locally first
supabase db push            # Push to production when ready
```

---

#### Task 1.2: Update TypeScript Types
**File:** `lib/database.ts`

Add to existing types:
```typescript
export type SubscriptionTier = 'free' | 'basics' | 'pro' | 'enterprise';
export type SubscriptionStatus = 'active' | 'cancelled' | 'past_due' | 'trialing';

export interface ShopSubscription {
  subscription_tier: SubscriptionTier;
  polar_customer_id: string | null;
  polar_subscription_id: string | null;
  subscription_status: SubscriptionStatus;
  trial_ends_at: string | null;
  subscription_created_at: string | null;
}

// Update ShopTable interface to include subscription fields
export interface ShopTable extends ShopSubscription {
  shop_id: string;
  shop_name: string;
  shop_address: string;
  amount_of_workers: number;
  shop_owner: string;
  created_at: string;
  updated_at: string;
}

export interface ShopUsage {
  id: string;
  shop_id: string;
  month: string; // YYYY-MM-DD (first of month)
  appointments_created: number;
  sms_sent: number;
  emails_sent: number;
  created_at: string;
  updated_at: string;
}
```

---

### **Phase 2: Feature Gates (Days 3-4)**

#### Task 2.1: Create Feature Gate Utilities
**File:** `lib/utils/feature-gates.ts`

```typescript
import { SubscriptionTier } from '@/lib/database';

// Tier limits
export const TIER_LIMITS = {
  free: {
    artists: 1,
    clients: 50,
    appointmentsPerMonth: 20,
    sms: false,
    email: false,
    analytics: false,
    customBranding: false,
  },
  basics: {
    artists: 3,
    clients: Infinity,
    appointmentsPerMonth: Infinity,
    sms: false,
    email: false,
    analytics: false,
    customBranding: true,
  },
  pro: {
    artists: 10,
    clients: Infinity,
    appointmentsPerMonth: Infinity,
    sms: true,
    email: true,
    analytics: true,
    customBranding: true,
  },
  enterprise: {
    artists: Infinity,
    clients: Infinity,
    appointmentsPerMonth: Infinity,
    sms: true,
    email: true,
    analytics: true,
    customBranding: true,
  },
} as const;

// Check if feature is available for tier
export function canUseFeature(
  tier: SubscriptionTier,
  feature: keyof typeof TIER_LIMITS.free
): boolean {
  return TIER_LIMITS[tier][feature] === true;
}

// Get limit value for tier
export function getTierLimit(
  tier: SubscriptionTier,
  limit: keyof typeof TIER_LIMITS.free
): number | boolean {
  return TIER_LIMITS[tier][limit];
}

// Check if shop is at limit
export function isAtLimit(
  tier: SubscriptionTier,
  limitType: 'artists' | 'clients' | 'appointmentsPerMonth',
  currentCount: number
): boolean {
  const limit = getTierLimit(tier, limitType);
  if (typeof limit === 'number') {
    return currentCount >= limit;
  }
  return false;
}

// Get upgrade message
export function getUpgradeMessage(tier: SubscriptionTier): string {
  switch (tier) {
    case 'free':
      return 'Upgrade to Basics ($29/mo) to add more artists and remove limits';
    case 'basics':
      return 'Upgrade to Pro ($79/mo) to unlock SMS/Email automation';
    case 'pro':
      return 'Upgrade to Enterprise ($149/mo) for unlimited artists and payment processing';
    default:
      return '';
  }
}

// Get next tier
export function getNextTier(tier: SubscriptionTier): SubscriptionTier | null {
  const tiers: SubscriptionTier[] = ['free', 'basics', 'pro', 'enterprise'];
  const currentIndex = tiers.indexOf(tier);
  return currentIndex < tiers.length - 1 ? tiers[currentIndex + 1] : null;
}
```

---

#### Task 2.2: Create Usage Tracking Functions
**File:** `lib/supabase/data/shop-usage-data.ts`

```typescript
import { SupabaseClient } from '@supabase/supabase-js';
import { ShopUsage } from '@/lib/database';

// Get current month's usage
export async function getCurrentUsage(
  shopId: string,
  supabase: SupabaseClient
): Promise<ShopUsage> {
  const firstOfMonth = new Date();
  firstOfMonth.setDate(1);
  firstOfMonth.setHours(0, 0, 0, 0);
  const monthKey = firstOfMonth.toISOString().split('T')[0];

  const { data, error } = await supabase
    .from('shop_usage')
    .select('*')
    .eq('shop_id', shopId)
    .eq('month', monthKey)
    .single();

  if (error && error.code !== 'PGRST116') {
    // PGRST116 = not found, which is ok
    throw error;
  }

  // If no usage record exists, create one
  if (!data) {
    const { data: newUsage, error: insertError } = await supabase
      .from('shop_usage')
      .insert({
        shop_id: shopId,
        month: monthKey,
        appointments_created: 0,
        sms_sent: 0,
        emails_sent: 0,
      })
      .select()
      .single();

    if (insertError) throw insertError;
    return newUsage;
  }

  return data;
}

// Increment usage counter
export async function incrementUsage(
  shopId: string,
  type: 'appointments_created' | 'sms_sent' | 'emails_sent',
  supabase: SupabaseClient
): Promise<void> {
  const usage = await getCurrentUsage(shopId, supabase);

  const { error } = await supabase
    .from('shop_usage')
    .update({
      [type]: usage[type] + 1,
      updated_at: new Date().toISOString(),
    })
    .eq('id', usage.id);

  if (error) throw error;
}
```

---

### **Phase 3: Polar Integration (Days 5-7)**

#### Task 3.1: Install Polar SDK
```bash
npm install @polar-sh/sdk
```

#### Task 3.2: Add Environment Variables
**File:** `.env.local` and `.env.production.local`

```bash
# Polar API Keys
POLAR_ACCESS_TOKEN=polar_at_xxxxx
NEXT_PUBLIC_POLAR_ORGANIZATION_ID=your-org-id

# Product Price IDs (get these from Polar dashboard)
POLAR_PRICE_ID_BASICS=price_xxxxx
POLAR_PRICE_ID_PRO=price_xxxxx
```

---

#### Task 3.3: Create Polar Client Utility
**File:** `lib/polar/client.ts`

```typescript
import { Polar } from '@polar-sh/sdk';

if (!process.env.POLAR_ACCESS_TOKEN) {
  throw new Error('POLAR_ACCESS_TOKEN is not set');
}

export const polar = new Polar({
  accessToken: process.env.POLAR_ACCESS_TOKEN,
});

export const POLAR_PRICE_IDS = {
  basics: process.env.POLAR_PRICE_ID_BASICS!,
  pro: process.env.POLAR_PRICE_ID_PRO!,
} as const;
```

---

#### Task 3.4: Create Checkout Route
**File:** `app/api/checkout/route.ts`

```typescript
import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { polar, POLAR_PRICE_IDS } from '@/lib/polar/client';

export async function POST(req: NextRequest) {
  try {
    // Get authenticated user
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get shop
    const { data: shopUser } = await supabase
      .from('shop_users')
      .select('shop_id, shops_tables(*)')
      .eq('user_id', user.id)
      .single();

    if (!shopUser) {
      return NextResponse.json({ error: 'No shop found' }, { status: 404 });
    }

    // Get requested tier
    const { tier } = await req.json();
    if (!tier || !['basics', 'pro'].includes(tier)) {
      return NextResponse.json({ error: 'Invalid tier' }, { status: 400 });
    }

    // Create Polar checkout
    const checkout = await polar.checkouts.custom.create({
      productPriceId: POLAR_PRICE_IDS[tier as 'basics' | 'pro'],
      successUrl: `${process.env.NEXT_PUBLIC_SITE_URL}/dashboard?checkout=success`,
      customerEmail: user.email,
      metadata: {
        userId: user.id,
        shopId: shopUser.shop_id,
        tier,
      },
    });

    return NextResponse.json({ checkoutUrl: checkout.url });
  } catch (error) {
    console.error('Checkout error:', error);
    return NextResponse.json(
      { error: 'Failed to create checkout' },
      { status: 500 }
    );
  }
}
```

---

#### Task 3.5: Create Webhook Handler
**File:** `app/api/webhooks/polar/route.ts`

```typescript
import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

// Admin client (bypasses RLS)
const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(req: NextRequest) {
  try {
    const payload = await req.json();
    const event = payload.event;

    switch (event) {
      case 'subscription.created':
      case 'subscription.updated':
        await handleSubscriptionUpdate(payload.data);
        break;

      case 'subscription.cancelled':
        await handleSubscriptionCancelled(payload.data);
        break;

      default:
        console.log('Unhandled webhook event:', event);
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error('Webhook error:', error);
    return NextResponse.json({ error: 'Webhook failed' }, { status: 500 });
  }
}

async function handleSubscriptionUpdate(data: any) {
  const { metadata, customer_id, id, status } = data;
  const { shopId, tier } = metadata;

  await supabaseAdmin
    .from('shops_tables')
    .update({
      subscription_tier: tier,
      polar_customer_id: customer_id,
      polar_subscription_id: id,
      subscription_status: status,
      subscription_created_at: new Date().toISOString(),
    })
    .eq('shop_id', shopId);
}

async function handleSubscriptionCancelled(data: any) {
  const { metadata } = data;
  const { shopId } = metadata;

  await supabaseAdmin
    .from('shops_tables')
    .update({
      subscription_status: 'cancelled',
    })
    .eq('shop_id', shopId);
}
```

---

### **Phase 4: Pricing Page UI (Days 8-10)**

#### Task 4.1: Create Pricing Page
**File:** `app/pricing/page.tsx`

```typescript
import PricingTiers from '@/components/pricing/PricingTiers';

export default function PricingPage() {
  return (
    <div className="min-h-screen py-20">
      <div className="container mx-auto px-4">
        <h1 className="text-5xl font-bold text-center mb-4">
          Simple, Transparent Pricing
        </h1>
        <p className="text-xl text-center text-muted-foreground mb-16">
          Choose the plan that fits your studio
        </p>
        <PricingTiers />
      </div>
    </div>
  );
}
```

---

#### Task 4.2: Create Pricing Tiers Component
**File:** `components/pricing/PricingTiers.tsx`

```typescript
'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { Check } from 'lucide-react';

const tiers = [
  {
    name: 'Solo Artist',
    price: 0,
    period: 'Forever free',
    description: 'Perfect for individual artists',
    features: [
      '1 artist',
      'Up to 50 clients',
      'Up to 20 appointments/month',
      'Basic calendar',
      'Client list',
    ],
    cta: 'Get Started Free',
    tier: 'free',
  },
  {
    name: 'Studio Basics',
    price: 29,
    period: 'per month',
    description: 'For small tattoo studios',
    features: [
      'Up to 3 artists',
      'Unlimited clients',
      'Unlimited appointments',
      'Full client pipeline',
      'Team calendar',
      'Remove branding',
    ],
    cta: 'Start Free Trial',
    tier: 'basics',
    popular: false,
  },
  {
    name: 'Studio Pro',
    price: 79,
    period: 'per month',
    description: 'Automation for growing studios',
    features: [
      'Up to 10 artists',
      'Everything in Basics',
      'SMS notifications',
      'Email notifications',
      'Analytics dashboard',
      'Custom branding',
      'Priority support',
    ],
    cta: 'Start Free Trial',
    tier: 'pro',
    popular: true,
  },
];

export default function PricingTiers() {
  const [isLoading, setIsLoading] = useState<string | null>(null);

  const handleCheckout = async (tier: string) => {
    if (tier === 'free') {
      window.location.href = '/auth/sign-up?tier=free';
      return;
    }

    setIsLoading(tier);

    try {
      const res = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ tier }),
      });

      const { checkoutUrl } = await res.json();
      window.location.href = checkoutUrl;
    } catch (error) {
      console.error('Checkout failed:', error);
      alert('Failed to start checkout. Please try again.');
    } finally {
      setIsLoading(null);
    }
  };

  return (
    <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
      {tiers.map((tier) => (
        <div
          key={tier.name}
          className={`surface p-8 rounded-lg relative ${
            tier.popular ? 'border-2 border-primary' : ''
          }`}
        >
          {tier.popular && (
            <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-primary text-white px-4 py-1 rounded-full text-sm font-semibold">
              Most Popular
            </div>
          )}

          <h3 className="text-2xl font-bold mb-2">{tier.name}</h3>
          <p className="text-muted-foreground mb-4">{tier.description}</p>

          <div className="mb-6">
            <span className="text-5xl font-bold">${tier.price}</span>
            <span className="text-muted-foreground ml-2">{tier.period}</span>
          </div>

          <Button
            className="w-full mb-6"
            onClick={() => handleCheckout(tier.tier)}
            disabled={isLoading === tier.tier}
          >
            {isLoading === tier.tier ? 'Loading...' : tier.cta}
          </Button>

          <ul className="space-y-3">
            {tier.features.map((feature) => (
              <li key={feature} className="flex items-start gap-2">
                <Check size={20} className="text-primary mt-0.5 flex-shrink-0" />
                <span>{feature}</span>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
}
```

---

### **Phase 5: Onboarding Integration (Days 11-12)**

#### Task 5.1: Update Onboarding to Set Free Tier
**File:** `app/onboarding/actions.ts`

Update `createShop` function:
```typescript
const { data: newShop, error: shopError } = await supabase
  .from('shops_tables')
  .insert({
    shop_name: shopName,
    shop_address: shopAddress,
    amount_of_workers: 0,
    shop_owner: user.id,
    subscription_tier: 'free', // ← Add this
    subscription_status: 'active', // ← Add this
  })
  .select()
  .single()
```

---

### **Phase 6: Enforce Limits (Days 13-14)**

#### Task 6.1: Add Limit Checks to Worker Creation
**File:** `lib/supabase/data/workers-data.ts`

```typescript
import { isAtLimit, getTierLimit } from '@/lib/utils/feature-gates';

export async function createShopWorker(
  shopId: string,
  userId: string,
  workerData: Partial<Worker>,
  supabase: SupabaseClient
): Promise<Worker> {
  // ... existing validation ...

  // Get shop tier
  const { data: shop } = await supabase
    .from('shops_tables')
    .select('subscription_tier, amount_of_workers')
    .eq('shop_id', shopId)
    .single();

  if (!shop) throw new Error('Shop not found');

  // Check artist limit
  const artistLimit = getTierLimit(shop.subscription_tier, 'artists');
  if (typeof artistLimit === 'number' && shop.amount_of_workers >= artistLimit) {
    throw new Error(
      `You've reached your artist limit (${artistLimit}). Upgrade to add more artists.`
    );
  }

  // ... rest of function ...
}
```

---

#### Task 6.2: Add Limit Checks to Appointment Creation
**File:** `lib/supabase/data/appointment-data.ts`

```typescript
import { getCurrentUsage, incrementUsage } from './shop-usage-data';
import { getTierLimit } from '@/lib/utils/feature-gates';

export async function createAppointment(
  shopId: string,
  appointmentData: Partial<Appointment>,
  supabase: SupabaseClient
): Promise<Appointment> {
  // Get shop tier
  const { data: shop } = await supabase
    .from('shops_tables')
    .select('subscription_tier')
    .eq('shop_id', shopId)
    .single();

  if (!shop) throw new Error('Shop not found');

  // Check appointment limit (only for free tier)
  if (shop.subscription_tier === 'free') {
    const usage = await getCurrentUsage(shopId, supabase);
    const limit = getTierLimit('free', 'appointmentsPerMonth');

    if (typeof limit === 'number' && usage.appointments_created >= limit) {
      throw new Error(
        `You've reached your appointment limit (${limit}/month). Upgrade to Basics for unlimited appointments.`
      );
    }
  }

  // Create appointment
  const { data, error } = await supabase
    .from('appointments')
    .insert(appointmentData)
    .select()
    .single();

  if (error) throw error;

  // Increment usage counter
  await incrementUsage(shopId, 'appointments_created', supabase);

  return data;
}
```

---

### **Phase 7: Testing (Day 15)**

#### Task 7.1: Test Signup Flows
- [ ] Free tier signup (no payment)
- [ ] Basics tier signup (Polar checkout)
- [ ] Pro tier signup (Polar checkout)
- [ ] Webhook processing (subscription.created)

#### Task 7.2: Test Limit Enforcement
- [ ] Free tier: Can't add 2nd artist
- [ ] Free tier: Can't create 21st appointment
- [ ] Basics tier: Can't add 4th artist
- [ ] Pro tier: Can add 10 artists

#### Task 7.3: Test Upgrade Flow
- [ ] Free → Basics upgrade
- [ ] Basics → Pro upgrade
- [ ] Webhook processing (subscription.updated)

---

## 📁 Files to Create

```
Migration:
├── supabase/migrations/12_add_subscription_tiers.sql

Utils:
├── lib/utils/feature-gates.ts
├── lib/polar/client.ts

Data Layer:
├── lib/supabase/data/shop-usage-data.ts

API Routes:
├── app/api/checkout/route.ts
├── app/api/webhooks/polar/route.ts

Pages:
├── app/pricing/page.tsx

Components:
├── components/pricing/PricingTiers.tsx

Updates:
├── lib/database.ts (add types)
├── lib/supabase/data/workers-data.ts (add limit checks)
├── lib/supabase/data/appointment-data.ts (add limit checks)
├── app/onboarding/actions.ts (set free tier)
```

---

## 🎯 Success Criteria

**Must Have:**
- ✅ Users can sign up for Free tier (no payment)
- ✅ Users can purchase Basics/Pro tiers (Polar checkout)
- ✅ Artist limits enforced by tier
- ✅ Appointment limits enforced for Free tier
- ✅ Webhooks update subscription status

**Nice to Have:**
- Upgrade prompts when hitting limits
- Analytics dashboard for Pro tier
- Email confirmation after purchase

---

## 📝 Notes

- **Defer Enterprise tier** - Wait for customer demand
- **Defer SMS/Email** - Focus on billing first, notifications second
- **Test locally first** - Use `supabase db reset --local` before production

---

**Last Updated:** 2025-11-05
**Next Action:** Task 1.1 - Create database migration
