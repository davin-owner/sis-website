# Subscription Tier Limits - Simple Ink Studios

## Current Tiers

| Tier | Price | Target User |
|------|-------|-------------|
| Solo Free | $0/mo | Single artist testing |
| Studio Basics | TBD | Small studio (2-3 artists) |
| Studio Pro | TBD | Medium studio (4-10 artists) |
| Studio Enterprise | TBD | Large studio (10+ artists) |

## Proposed Limits

### Solo Free (Testing/Single Artist)
- ✅ 1 shop
- ✅ 1-2 workers/artists
- ✅ 10 active clients max
- ✅ 20 appointments/month
- ✅ Basic features only
- ❌ No team collaboration
- ❌ No advanced reporting

### Studio Basics (Small Studio)
- ✅ 1 shop
- ✅ Up to 5 workers/artists
- ✅ 50 active clients
- ✅ 100 appointments/month
- ✅ All core features
- ✅ Basic team collaboration
- ❌ Limited reporting

### Studio Pro (Medium Studio)
- ✅ 1 shop
- ✅ Up to 15 workers/artists
- ✅ 200 active clients
- ✅ Unlimited appointments
- ✅ All features
- ✅ Full team collaboration
- ✅ Advanced reporting
- ✅ Priority support

### Studio Enterprise (Large Studio/Multi-location)
- ✅ Up to 3 shops
- ✅ Unlimited workers/artists
- ✅ Unlimited active clients
- ✅ Unlimited appointments
- ✅ All features
- ✅ Multi-location support
- ✅ Advanced reporting + analytics
- ✅ Dedicated support
- ✅ Custom integrations

## Implementation Plan

### 1. Database Schema Changes (Optional)
Add limits tracking to `shops_tables`:
```sql
ALTER TABLE shops_tables
ADD COLUMN worker_limit INTEGER,
ADD COLUMN client_limit INTEGER,
ADD COLUMN appointment_limit_monthly INTEGER;
```

### 2. Create Tier Config File
`lib/tiers/limits.ts`:
```typescript
export const TIER_LIMITS = {
  free: {
    workers: 2,
    clients: 10,
    appointments_per_month: 20,
    shops: 1,
  },
  basics: {
    workers: 5,
    clients: 50,
    appointments_per_month: 100,
    shops: 1,
  },
  pro: {
    workers: 15,
    clients: 200,
    appointments_per_month: -1, // unlimited
    shops: 1,
  },
  enterprise: {
    workers: -1, // unlimited
    clients: -1, // unlimited
    appointments_per_month: -1, // unlimited
    shops: 3,
  },
};
```

### 3. Middleware/Helper Function
`lib/tiers/check-limits.ts`:
```typescript
export async function checkLimit(
  shopId: string,
  limitType: 'workers' | 'clients' | 'appointments',
  supabase: SupabaseClient
): Promise<{ allowed: boolean; current: number; limit: number }> {
  // Get shop's subscription tier
  // Get current count
  // Check against limit
  // Return result
}
```

### 4. Enforce Limits in Actions
Add checks before creating:
- Workers: `app/content/artists/actions.ts`
- Clients: `components/features/pipeline/AddClientModal.client.tsx`
- Appointments: `app/content/calendar/actions.ts`

### 5. UI Indicators
Show limits in:
- Dashboard (e.g., "3/5 artists used")
- Create buttons (disable when at limit)
- Settings page (show tier and limits)

## Questions to Decide

1. **Pricing**: What should each tier cost?
   - Suggested: Basics $29/mo, Pro $79/mo, Enterprise $199/mo

2. **Hard vs Soft Limits**:
   - Hard: Block creation when limit reached
   - Soft: Allow creation but show upgrade prompt
   - Recommended: Hard limits with upgrade CTA

3. **Grace Period**: Allow temporary overage?
   - E.g., 105/100 clients for 7 days before blocking

4. **Grandfathering**: Existing users keep their data if they downgrade?
   - Recommended: Yes, but block new additions

5. **Client "Active" Definition**:
   - Only count clients in active pipeline stages?
   - Or all clients including "Completed"?
   - Recommended: Exclude "Completed" stage

## Next Steps

1. Decide on pricing for each tier
2. Decide on specific limits for each tier
3. Implement tier config
4. Add limit checks to all create actions
5. Add UI indicators
6. Test thoroughly
7. Deploy

## Implementation Priority

Phase 1 (MVP):
- [ ] Create tier limits config
- [ ] Add checks to worker creation
- [ ] Add checks to client creation
- [ ] Add checks to appointment creation
- [ ] Show basic limit indicators in UI

Phase 2 (Polish):
- [ ] Add limit displays on dashboard
- [ ] Add upgrade CTAs when at limit
- [ ] Add analytics/reporting differences by tier

Phase 3 (Advanced):
- [ ] Soft limits with grace periods
- [ ] Automatic downgrade handling
- [ ] Advanced reporting for Pro/Enterprise
