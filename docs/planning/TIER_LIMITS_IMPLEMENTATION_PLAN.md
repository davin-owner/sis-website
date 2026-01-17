# Tier Limits Implementation Plan

*A learning-focused guide to implementing subscription-based feature limits*

**Created:** January 16, 2026
**Status:** Planning Phase
**Goal:** Learn the patterns for enforcing tier-based limits in a SaaS app

---

## Your Tier Structure

| Tier | Clients | Artists | Price |
|------|---------|---------|-------|
| Solo Artist (Free) | 50 | 1 | $0 |
| Small Shop | 200 | 3 | $29/mo |
| Growing Shop | Unlimited | 10 | $59/mo |
| Enterprise | Unlimited | Unlimited | Custom |

---

## What Already Exists in Your Codebase

- `lib/utils/feature-gates.ts` - Has `TIER_LIMITS` defined
- Database fields for subscription tier in `shops_tables`
- `shop_usage` table for tracking monthly usage
- Polar webhook integration for subscription events
- **Limits are NOT being enforced yet** - this is what you'll build

---

## The Core Pattern: "Check-Then-Act"

Every time a user tries to create a limited resource (client, worker, appointment), you need to:

```
1. FETCH the shop's current tier
2. COUNT how many of that resource already exist
3. COMPARE against the tier limit
4. ALLOW or REJECT with a helpful message
```

This is called a "guard clause" or "gatekeeper" pattern. It prevents invalid operations before they happen.

**Why This Pattern Matters:**
- It keeps your data consistent (no shops with 10 artists on a 3-artist plan)
- It creates natural upgrade moments ("You've hit your limit - upgrade to add more!")
- It happens server-side, so users cannot bypass it

---

## Phase 1: Create Limit Checking Utilities

**Goal:** Build reusable functions that count resources and check limits

**Location:** Create a new file `lib/utils/tier-limits.ts`

**Conceptual Design:**

```
FUNCTION getClientCount(shopId)
  Query shop_leads table
  Count rows WHERE shop_id = shopId
  Return count

FUNCTION getWorkerCount(shopId)
  Query shop_workers table
  Count rows WHERE shop_id = shopId
  Return count

FUNCTION checkCanAddClient(shopId, supabase)
  Get shop's subscription_tier from shops_tables
  Get current client count using getClientCount()
  Get limit from TIER_LIMITS[tier].clients

  IF currentCount >= limit THEN
    RETURN { allowed: false, reason: "Client limit reached", currentCount, limit }
  ELSE
    RETURN { allowed: true, currentCount, limit, remaining: limit - currentCount }

FUNCTION checkCanAddWorker(shopId, supabase)
  (Same pattern as checkCanAddClient but for workers)
```

**Why This Design:**
- Separating the count logic from the check logic makes testing easier
- Returning both `allowed` and context (counts, limits) lets the UI show useful info
- Using your existing `TIER_LIMITS` constant keeps limits in one place

---

## Phase 2: Integrate Checks into Data Layer

**Goal:** Modify the create functions to check limits before inserting

**Files to Modify:**
1. `lib/supabase/data/shop-leads-data.ts`
2. `lib/supabase/data/workers-data.ts`

**For shop-leads-data.ts (client creation):**

Look at the existing `createShopClient` function. You need to add a limit check BEFORE the insert operation.

**Conceptual Change:**

```
FUNCTION createShopClient(shopId, userId, clientData, supabase)
  // Existing: Validation and access check
  IF NOT shopId THEN throw error
  IF NOT userId THEN throw error
  IF NOT hasAccess THEN throw "Unauthorized"

  // NEW: Add limit check here, BEFORE the insert
  limitCheck = await checkCanAddClient(shopId, supabase)
  IF NOT limitCheck.allowed THEN
    throw new Error(limitCheck.reason + " Upgrade your plan to add more clients.")

  // Existing: Insert into database
  INSERT into shop_leads...

  RETURN newClient
```

**For workers-data.ts (worker/artist creation):**

Same pattern in the `createShopWorker` function.

**Why Add Check in Data Layer:**
- This is your "last line of defense" - even if UI fails, server blocks invalid operations
- All create paths go through here, so you only write the check once
- Error messages bubble up to the UI automatically through your action pattern

---

## Phase 3: Pass Limit Info to Pages

**Goal:** Give pages access to current counts and limits so UI can show warnings

**Current Flow (already exists):**
```
Page (server)
  → getActiveShop()
    → returns shop data including subscription_tier
      → passes to ShopProvider
        → components access via useShop()
```

**What You Need to Add:**

Create a function that returns limit status for the current shop:

```
FUNCTION getShopLimitStatus(shopId, supabase)
  // Parallel fetch for performance
  [shop, clientCount, workerCount] = await Promise.all([
    GET shop data with subscription_tier
    COUNT clients for this shop
    COUNT workers for this shop
  ])

  tier = shop.subscription_tier
  limits = TIER_LIMITS[tier]

  RETURN {
    tier: tier,
    clients: {
      current: clientCount,
      limit: limits.clients,
      remaining: limits.clients - clientCount,
      atLimit: clientCount >= limits.clients,
      percentUsed: (clientCount / limits.clients) * 100
    },
    workers: {
      current: workerCount,
      limit: limits.artists,
      remaining: limits.artists - workerCount,
      atLimit: workerCount >= limits.artists,
      percentUsed: (workerCount / limits.artists) * 100
    }
  }
```

**Where to Call This:**

In pages that need limit info, fetch it alongside other data:

```typescript
// Example in app/content/artists/page.tsx
const [workers, limitStatus] = await Promise.all([
  getShopWorkerData(shopId, user.id, supabase),
  getShopLimitStatus(shopId, supabase)
])

// Pass limitStatus to the client component
<ArtistsPageClient
  initialWorkers={workers}
  shopId={shopId}
  limitStatus={limitStatus}  // NEW
/>
```

---

## Phase 4: Build UI Feedback Components

**Goal:** Show users their usage and warn them before hitting limits

### Component 1: UsageIndicator

A small component that shows "2/3 artists" or a progress bar.

**Where to Use:**
- In the header of the Artists page
- In the sidebar/dashboard
- Above the "Add Client" form

**Conceptual Structure:**
```
UsageIndicator
  Props: { current, limit, resourceName }

  IF limit === Infinity THEN
    SHOW "Unlimited {resourceName}"
  ELSE
    percentage = (current / limit) * 100

    IF percentage >= 90 THEN
      color = "red/warning"
    ELSE IF percentage >= 70 THEN
      color = "yellow/caution"
    ELSE
      color = "green/good"

    SHOW "{current} / {limit} {resourceName}"
    SHOW progress bar with color
```

### Component 2: UpgradePrompt

Shown when user tries to add something but is at the limit.

**Conceptual Structure:**
```
UpgradePrompt
  Props: { tier, resourceType }

  nextTier = getNextTier(tier)  // Use existing function in feature-gates.ts
  message = getUpgradeMessage(tier)  // Use existing function

  SHOW modal or banner with:
    "You've reached your {resourceType} limit on the {tier} plan"
    "{message}"
    [Upgrade Button] → links to /pricing or checkout flow
```

### Component 3: Pre-emptive Warning

Show BEFORE they hit the limit (at 80% usage).

**Where to Use:**
- On the "Add Artist" button when at 2/3 artists
- In the dashboard sidebar

**Logic:**
```
IF remaining === 1 THEN
  SHOW warning: "You can add 1 more {resource}. Upgrade for more."
ELSE IF remaining === 0 THEN
  DISABLE the "Add" button
  SHOW: "Limit reached. Upgrade to add more."
```

---

## Phase 5: Modify Add Buttons/Forms

**Goal:** Disable or warn when at limits

**Files to Modify:**
1. `components/features/workers/ArtistsPage.client.tsx`
2. Pipeline/client components

**Current Pattern in ArtistsPage.client.tsx:**
```jsx
<Button onClick={() => setIsAddModalOpen(true)}>
  <UserCircle2 size={18} className="mr-2" />
  Add Artist
</Button>
```

**Modified Pattern:**
```jsx
// Receive limitStatus from props
const { limitStatus } = props

// Check if at limit
const atArtistLimit = limitStatus.workers.atLimit

<Button
  onClick={() => atArtistLimit ? setShowUpgradeModal(true) : setIsAddModalOpen(true)}
  variant={atArtistLimit ? "secondary" : "primary"}
>
  <UserCircle2 size={18} className="mr-2" />
  {atArtistLimit ? "Upgrade to Add Artist" : "Add Artist"}
</Button>

// Show count below
<UsageIndicator
  current={limitStatus.workers.current}
  limit={limitStatus.workers.limit}
  resourceName="artists"
/>
```

---

## Phase 6: Handle Errors Gracefully

**Goal:** When server rejects a create operation, show a useful error

**Your actions already return `{ error: string }` on failure.** Make sure the error message from your limit check is user-friendly:

```typescript
throw new Error(
  `You've reached your client limit (${limit} clients). ` +
  `Upgrade to ${getNextTier(tier)} for more.`
);
```

**In your UI (modal/form):** When action returns `{ error }`, show it in a toast or inline message.

---

## Database Queries You Will Need

**Count clients for a shop:**
```typescript
const { count } = await supabase
  .from('shop_leads')
  .select('*', { count: 'exact', head: true })
  .eq('shop_id', shopId)
```

**Count workers for a shop:**
```typescript
const { count } = await supabase
  .from('shop_workers')
  .select('*', { count: 'exact', head: true })
  .eq('shop_id', shopId)
```

**Get shop tier:**
```typescript
const { data: shop } = await supabase
  .from('shops_tables')
  .select('subscription_tier')
  .eq('shop_id', shopId)
  .single()
```

---

## Step-by-Step Implementation Order

### Step 1: Create `lib/utils/tier-limits.ts`
- Add `getClientCount()` and `getWorkerCount()` functions
- Add `checkCanAddClient()` and `checkCanAddWorker()` functions
- Add `getShopLimitStatus()` function

### Step 2: Modify `lib/supabase/data/workers-data.ts`
- Import your new limit check function
- Add the check at the start of `createShopWorker()`
- Test: Try adding workers on free tier - should block at 1

### Step 3: Modify `lib/supabase/data/shop-leads-data.ts`
- Same pattern: Add check to `createShopClient()`
- Test: Try adding clients on free tier - should block at 50

### Step 4: Update `app/content/artists/page.tsx`
- Fetch limit status alongside worker data
- Pass to client component

### Step 5: Update `ArtistsPage.client.tsx`
- Accept limitStatus prop
- Show usage indicator
- Modify Add button behavior when at limit

### Step 6: Create `UpgradePrompt` component
- Modal that shows when user is blocked
- Links to pricing/checkout

### Step 7: Repeat for pipeline (clients)
- Same pattern in pipeline page and forms

---

## Key Learning Points

### Pattern 1: Guard Clauses
Always check permissions/limits BEFORE doing the action, not after.

### Pattern 2: Separation of Concerns
- **Data layer:** enforces rules (throws errors)
- **Action layer:** catches errors, formats for UI
- **UI layer:** shows feedback, prevents bad UX

### Pattern 3: Fail Gracefully
Never just block the user. Always tell them:
- WHAT happened ("You've hit your limit")
- WHY ("Free tier allows 1 artist")
- HOW to fix it ("Upgrade to add more")

### Pattern 4: Progressive Disclosure
- Show usage indicator (non-intrusive)
- Show warning at 80% (gentle nudge)
- Show blocker at 100% (forced upgrade prompt)

---

## Critical Files Reference

| File | Purpose |
|------|---------|
| `lib/utils/feature-gates.ts` | Already has TIER_LIMITS - use these constants |
| `lib/supabase/data/shop-leads-data.ts` | Add limit check to createShopClient() |
| `lib/supabase/data/workers-data.ts` | Add limit check to createShopWorker() |
| `components/features/workers/ArtistsPage.client.tsx` | Add UI for limit feedback |
| `app/content/artists/page.tsx` | Pass limit status to components |

---

## Testing Checklist

- [ ] Create shop on free tier, add 1 artist, try to add 2nd - should block
- [ ] Create shop on free tier, add 50 clients, try to add 51st - should block
- [ ] UI shows correct count (e.g., "1/1 artists")
- [ ] Warning shows at 80% usage
- [ ] Upgrade button appears when at limit
- [ ] Upgrade button links to pricing page
- [ ] After upgrading tier, limits increase correctly

---

*This is your learning path. Take it one phase at a time. The patterns you learn here apply to any SaaS limiting system.*
