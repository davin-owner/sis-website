# Session Context - Data Layer Build

**Last Updated:** 2025-01-20
**Status:** Data layer complete, Server Actions in progress

---

## What's Been Built

### Data Layer (Complete ✅)
All functions follow the same security pattern:
1. Validate inputs
2. Verify shop access
3. Query/update with shop_id filter
4. Return typed data

**Files:**
- `lib/supabase/data/shop-leads-data.ts` - CRUD for client leads
- `lib/supabase/data/pipeline-data.ts` - Format data for UI
- `lib/supabase/data/user-shops.ts` - Shop management
- `lib/utils/active-shop.ts` - Cookie-based shop caching
- `lib/utils/access-control.ts` - Security verification
- `lib/database.ts` - TypeScript types

### Dashboard Integration (Complete ✅)
- Uses `getActiveShopIdFallback()` for shop ID
- Uses `getActiveShop()` for full shop details
- Proper null checks and redirects
- All TypeScript errors resolved

---

## Key Patterns Learned

### Security Pattern (Every Data Function)
```typescript
export async function anyDataFunction(
  shopId: string,
  userId: string,
  supabase: SupabaseClient
) {
  // 1. Validate
  if (!shopId) throw new Error("shop_id is required");
  if (!userId) throw new Error("user_id is required");

  // 2. Verify access
  const hasAccess = await verifyShopAccess(userId, shopId, supabase);
  if (!hasAccess) throw new Error("Unauthorized");

  // 3. Query with shop_id filter
  const { data, error } = await supabase
    .from("table_name")
    .select("*")
    .eq("shop_id", shopId);

  if (error) throw error;

  // 4. Return typed data
  return data as TypeName[];
}
```

### Server Component vs Server Action
- **Server Components** CAN read cookies, CANNOT write cookies
- **Server Actions** CAN read AND write cookies
- Use `'use server'` directive for Server Actions

### Cookie Management
- `getActiveShopId()` - Fast (cookie only)
- `getActiveShopIdFallback()` - Cookie first, DB fallback
- `setActiveShopId()` - Update both (only in Server Actions)

---

## Teaching Style: "Wired In Mentor Mode"

**The Pattern:**
1. I explain concepts (no code)
2. You think through the logic
3. You write the code yourself
4. I review and give feedback
5. You fix issues
6. We celebrate wins!

**Remember:**
- I won't give you code to copy
- I'll guide you to figure it out
- Brain hurt is GOOD - that's where learning happens
- You build REAL understanding

---

## Next: Server Actions

**Pattern for Server Actions:**
```typescript
'use server'

export async function someAction(formData: FormData) {
  // 1. Get user session
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Not authenticated");

  // 2. Get shop ID
  const shopId = await getActiveShopIdFallback(user.id, supabase);
  if (!shopId) throw new Error("No shop found");

  // 3. Extract form data
  const clientData = {
    name: formData.get('name'),
    contact_email: formData.get('contact_email'),
    // ... etc
  };

  // 4. Call data function
  await createShopClient(shopId, user.id, clientData, supabase);

  // 5. Revalidate & return
  revalidatePath('/content/pipeline');
  return { success: true };
}
```

**To Build:**
1. createClientAction(formData)
2. updateClientAction(clientId, formData)
3. updateClientStageAction(clientId, newStage, newSortOrder)
4. deleteShopClient() data function
5. deleteClientAction(clientId) server action

---

## Quick Reference

**Data Functions (lib/supabase/data/shop-leads-data.ts):**
- fetchShopLeadData(shopId, userId, supabase)
- createShopClient(shopId, userId, clientData, supabase)
- updateShopClient(shopId, userId, clientId, clientData, supabase)
- updateClientStage(clientId, shopId, userId, newStage, newSortOrder, supabase)

**Active Shop (lib/utils/active-shop.ts):**
- getActiveShopId() - Read cookie only
- getActiveShopIdFallback(userId, supabase) - Cookie → DB fallback
- setActiveShopId(userId, shopId, supabase) - Update DB + cookie

**Imports You'll Need:**
```typescript
import { createClient } from '@/lib/supabase/server'
import { getActiveShopIdFallback } from '@/lib/utils/active-shop'
import { createShopClient, updateShopClient, updateClientStage } from '@/lib/supabase/data/shop-leads-data'
import { revalidatePath } from 'next/cache'
```
