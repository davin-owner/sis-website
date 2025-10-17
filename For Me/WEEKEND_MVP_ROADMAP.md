# Weekend MVP Roadmap - Simple Ink Studios

**Goal:** Ship a working MVP by Sunday night
**Status:** Database foundation complete, ready for data layer + UI

---

## What's Already Done ✅

**From Last Session (2025-10-16):**
- ✅ User authentication (sign up/login)
- ✅ Shop creation flow (onboarding)
- ✅ Multi-shop architecture (shop_users junction table)
- ✅ Dashboard loads for shop owners
- ✅ UI components & design system
- ✅ Mock pipeline with drag & drop

**From Tonight (2025-01-16):**
- ✅ Database migration: Added pipeline_stage + sort_order columns
- ✅ Security architecture documented
- ✅ Understanding of complete system architecture

---

## MVP Definition - What We're Shipping

**Core Features (Must Have):**
1. ✅ User can sign up / log in
2. ✅ User can create a shop
3. ⏳ User can add clients to their shop
4. ⏳ User can see clients in pipeline columns (Leads, Consulting, Apts Made, Inking, Follow Ups)
5. ⏳ User can drag clients between pipeline stages (persists to database)
6. ⏳ User can edit client details
7. ⏳ If user has multiple shops, can switch between them
8. ⏳ Dashboard shows real client counts

**Out of Scope (Post-MVP):**
- ❌ Delete clients
- ❌ Client history tracking
- ❌ Email/SMS automation
- ❌ Calendar integration
- ❌ Worker/artist management
- ❌ Payment/subscription system
- ❌ Mobile app

---

## Tomorrow After Work (Friday Night) - Data Layer

**Time estimate:** 3-4 hours
**Goal:** Complete data foundation so UI can connect

### Task 1: TypeScript Types (30 min)
```typescript
// lib/types/database.ts
- Define PipelineStage type
- Define ShopLead type (matches shop_leads table)
- Define PipelineColumn type
- Define CreateClientInput / UpdateClientInput
```

### Task 2: Access Control Utility (20 min)
```typescript
// lib/utils/access-control.ts
- verifyShopAccess(userId, shopId, supabase)
- Used by all data functions
```

### Task 3: Active Shop Management (30 min)
```typescript
// lib/utils/active-shop.ts
- getActiveShopId() - server-side from cookie
- getActiveShopWithFallback() - with DB fallback
- setActiveShopCookie() - update cookie + DB
```

### Task 4: Pipeline Data Functions (90 min)
```typescript
// lib/supabase/data/pipeline-data.ts

1. getPipelineData(shopId, userId, supabase)
   - Get all shop_leads for shop
   - Group by pipeline_stage
   - Return PipelineColumn[]

2. updateClientStage(clientId, stage, sortOrder, shopId, userId, supabase)
   - Update pipeline_stage and sort_order
   - Verify access first

3. createClient(data, shopId, userId, supabase)
   - Insert new shop_leads record
   - Validate access

4. updateClient(clientId, data, shopId, userId, supabase)
   - Update existing shop_leads record
   - Verify access

5. getClientById(clientId, shopId, userId, supabase)
   - Fetch single client for edit modal
   - Verify access
```

### Task 5: Server Actions (60 min)
```typescript
// app/content/pipeline/actions.ts

1. updateClientStageAction(clientId, stage, sortOrder)
   - Get user + active shop
   - Call updateClientStage()
   - revalidatePath()

2. createClientAction(formData)
   - Get user + active shop
   - Call createClient()
   - revalidatePath()

3. updateClientAction(clientId, formData)
   - Get user + active shop
   - Call updateClient()
   - revalidatePath()
```

### Task 6: Test with Manual Data (30 min)
- Insert 5-10 test clients via Supabase Studio
- Different pipeline stages
- Different sort orders
- Verify data functions work via console.log

**End of Friday:** Data layer complete, tested, ready for UI

---

## Saturday Morning (4-5 hours) - Connect UI to Data

### Task 1: Update Pipeline Page (60 min)
```typescript
// app/content/pipeline/page.tsx

Before:
  import { initialColumns } from "@/lib/mock-data";
  return <PipelineBoard initialColumns={initialColumns} />

After:
  const shopId = getActiveShopId();
  const user = await supabase.auth.getUser();
  const columns = await getPipelineData(shopId, user.id, supabase);
  return <PipelineBoard initialColumns={columns} />
```

**Test:** Refresh page, see real data from database

### Task 2: Wire Up Drag & Drop (60 min)
```typescript
// components/studio/pipeline/PipelineBoard.client.tsx

In handleDragEnd():
  // After updating local state
  await updateClientStageAction(clientId, newStage, newSortOrder);
```

**Test:** Drag a card, refresh page, card stays in new position

### Task 3: Build Client Modal (90 min)
```typescript
// components/studio/ClientModal.client.tsx

Features:
- Form with: name, email, phone, notes
- Two modes: Add (empty form) vs Edit (pre-filled)
- Cancel button (close modal)
- Save button (calls server action)

// Hook it up:
- Add "Add Client" button to pipeline page
- Add onClick to client cards to open edit modal
```

**Test:** Add new client, see it appear in Leads. Edit client, see changes persist.

### Task 4: Add Stage Selector to Modal (30 min)
When adding new client, dropdown to pick starting stage:
- Defaults to "Leads"
- Can select any of 5 stages

**Test:** Add client to "Consulting", verify it appears in Consulting column

---

## Saturday Afternoon (3-4 hours) - Shop Switcher + Dashboard

### Task 1: Build Shop Switcher Component (90 min)
```typescript
// components/studio/ShopSwitcher.client.tsx

Features:
- Dropdown in header
- Shows all shops user has access to
- Highlights current shop
- On select: call setActiveShopAction()

// app/dashboard/actions.ts
- setActiveShopAction(shopId)
  - Set cookie
  - Update last_accessed_at in shop_users
  - redirect('/dashboard')
```

**Test:** Create 2 shops, switch between them, see different data

### Task 2: Add Shop Switcher to Dashboard Header (20 min)
```typescript
// app/dashboard/page.tsx
- Add <ShopSwitcher shops={userShops} activeShop={activeShop} />
```

### Task 3: Connect Dashboard Stats (60 min)
```typescript
// lib/supabase/data/shop-stats.ts

getShopStats(shopId, userId, supabase):
  - Count total clients
  - Count clients per stage
  - Return { totalClients, leadCount, consultingCount, ... }

// app/dashboard/page.tsx
- Fetch stats
- Pass to dashboard components
- Replace hardcoded "32 Active Clients" with real count
```

**Test:** Add/remove clients, see dashboard numbers update

### Task 4: Polish & Bug Fixes (60 min)
- Fix any styling issues
- Add loading states
- Better error messages
- Handle edge cases (no clients, no shops, etc.)

---

## Sunday (3-4 hours) - Testing & Documentation

### Task 1: End-to-End Testing (90 min)

**Complete User Journey:**
1. Sign up as new user
2. Create shop "Test Tattoo Shop"
3. Add 5 clients (different stages)
4. Drag clients between stages
5. Edit a client's info
6. Log out
7. Log back in
8. Verify data persists
9. Create 2nd shop
10. Switch between shops
11. Verify data isolation (Shop A data ≠ Shop B data)

**Fix any bugs found.**

### Task 2: Documentation (60 min)
```
Update For Me/ docs:
- SESSION_CONTEXT.md (what we built)
- MISSION_TRACKER.md (mark Phase 1 complete)
- Add DEPLOYMENT_CHECKLIST.md (for future)
```

### Task 3: Git Commits (30 min)
```bash
# Commit everything in logical chunks
git add supabase/migrations/02_add_pipeline_tracking.sql
git commit -m "Add pipeline tracking to database"

git add lib/types/ lib/supabase/data/
git commit -m "Add data layer with security patterns"

git add components/studio/ClientModal* app/content/pipeline/
git commit -m "Connect pipeline to real data + add client modal"

git add components/studio/ShopSwitcher* app/dashboard/
git commit -m "Add shop switcher + real dashboard stats"

git push origin dev
```

### Task 4: Deployment Prep (60 min)
- Review RLS policies (need to enable for production)
- Check environment variables
- Test build: `npm run build`
- Fix any build errors

**End of Sunday:** MVP complete, tested, committed to Git

---

## Success Criteria - MVP is "Done" When:

- [ ] New user can sign up
- [ ] New user can create a shop
- [ ] User can add clients via modal
- [ ] Clients appear in pipeline columns (grouped by stage)
- [ ] User can drag clients between stages
- [ ] Drag & drop persists to database (refresh = data stays)
- [ ] User can click client to edit details
- [ ] Edits save and persist
- [ ] If user has 2+ shops, can switch between them
- [ ] Each shop shows only its own clients (data isolation works)
- [ ] Dashboard shows real client counts
- [ ] No console errors
- [ ] No TypeScript errors
- [ ] Build succeeds

**If all checkboxes = ✅, you have a working MVP.**

---

## Time Budget

| Day | Hours | Tasks |
|-----|-------|-------|
| Friday (after work) | 3-4 | Data layer |
| Saturday morning | 4-5 | UI connection |
| Saturday afternoon | 3-4 | Shop switcher + stats |
| Sunday | 3-4 | Testing + docs |
| **Total** | **13-17 hours** | **Complete MVP** |

**Achievable over 3 days with caffeine and nicotine. 💪**

---

## When You're Stuck

1. Check `For Me/` documentation
2. Check this roadmap
3. Re-read DATA_ISOLATION_SECURITY.md
4. Console.log everything
5. Check Supabase Studio (verify data)
6. Check browser console (look for errors)
7. Check Next.js terminal (server errors)

---

## Post-MVP (Next Week)

Once MVP works:
- Deploy to Vercel
- Enable RLS in production
- Get 3 test users to try it
- Gather feedback
- Build Phase 2 features

---

**"Done is better than perfect. Ship the MVP, iterate from there."**

**You got this. Let's build generational wealth this weekend.** 🚀
