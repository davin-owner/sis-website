# Data Isolation & Security - Preventing "One Bug = Total Meltdown"

**Last Updated:** 2025-01-16
**Critical Reading:** This document explains how we prevent data leaks between shops

---

## The Problem

**Scenario:** You have a multi-tenant SaaS. One bug in data isolation = Shop A sees Shop B's clients.

**Result:**
- Data breach
- Legal liability
- Business destroyed
- Customer trust lost

**This cannot happen.**

---

## Multi-Layered Defense System

Think airport security: **Multiple checkpoints, not just one.**

---

## Layer 1: TypeScript - Compile-Time Enforcement

**Make it impossible to call functions without shop_id:**

```typescript
// ❌ BAD - Optional parameter (easy to forget)
async function getClients(shopId?: string) {
  // What if shopId is undefined?
}

// ✅ GOOD - Required parameter (won't compile without it)
async function getClients(shopId: string, userId: string, supabase: SupabaseClient) {
  if (!shopId) throw new Error('shop_id is required');
  if (!userId) throw new Error('user_id is required');
  // TypeScript forces caller to provide both
}

// ❌ This won't compile:
const clients = await getClients();
// Error: Expected 3 arguments, but got 0

// ✅ This will compile:
const clients = await getClients(activeShop.shop_id, user.id, supabase);
```

**Result:** You literally cannot call the function wrong. Compiler stops you.

---

## Layer 2: Access Control Middleware

**Verify user has access BEFORE any database query:**

```typescript
// lib/utils/access-control.ts

export async function verifyShopAccess(
  userId: string,
  shopId: string,
  supabase: SupabaseClient
): Promise<boolean> {
  const { data, error } = await supabase
    .from('shop_users')
    .select('shop_id')
    .eq('user_id', userId)
    .eq('shop_id', shopId)
    .single();

  return !!data && !error;
}

// Use in EVERY data function:
async function getClients(shopId: string, userId: string, supabase: SupabaseClient) {
  // 1. Check access FIRST
  const hasAccess = await verifyShopAccess(userId, shopId, supabase);
  if (!hasAccess) {
    throw new Error('Unauthorized: No access to this shop');
  }

  // 2. Only then query data
  return await supabase
    .from('shop_leads')
    .select('*')
    .eq('shop_id', shopId);
}
```

**Even if you forget the `.eq('shop_id', shopId)`, the access check catches it.**

---

## Layer 3: Row Level Security (RLS) - Database Enforcement

**The nuclear option: Database enforces access, regardless of code.**

```sql
-- Create RLS policy on shop_leads
CREATE POLICY "users_only_see_their_shop_leads"
ON shop_leads
FOR ALL
USING (
  shop_id IN (
    SELECT shop_id
    FROM shop_users
    WHERE user_id = auth.uid()
  )
);

-- Enable RLS
ALTER TABLE shop_leads ENABLE ROW LEVEL SECURITY;
```

**What this does:**

```typescript
// Even if your code forgets the filter:
const { data } = await supabase.from('shop_leads').select('*');

// Database automatically adds:
// WHERE shop_id IN (SELECT shop_id FROM shop_users WHERE user_id = current_user)

// User ONLY sees their shops' clients, always.
```

**Benefits:**
- ✅ Works even if code has bugs
- ✅ Enforced at database level (can't bypass)
- ✅ Protects against SQL injection
- ✅ Works for ALL queries (SELECT, UPDATE, DELETE)

**Current Status:**
- Local dev: RLS DISABLED (JWT validation issues)
- Production: RLS ENABLED (must enable before launch)

---

## Layer 4: Automated Testing

**Write tests that verify isolation:**

```typescript
// tests/data-isolation.test.ts

describe('Data Isolation', () => {
  it('User A cannot see User B clients', async () => {
    // Create two shops with different owners
    const shopA = await createShop('Shop A', userA.id);
    const shopB = await createShop('Shop B', userB.id);

    // Add client to Shop A
    await createClient({ name: 'John Doe', shop_id: shopA.id });

    // Try to fetch as User B
    const clients = await getClients(shopA.id, userB.id, supabase);

    // Should throw error or return empty
    expect(clients).toHaveLength(0);
  });
});
```

**Run these tests:**
- Before every deploy
- In CI/CD pipeline
- On every pull request

**If isolation breaks, tests fail, deploy blocked.**

---

## Layer 5: Audit Logging

**Log every data access:**

```typescript
// Create audit_log table (future)
async function logAccess(userId: string, shopId: string, action: string) {
  await supabase.from('audit_log').insert({
    user_id: userId,
    shop_id: shopId,
    action: action,
    table: 'shop_leads',
    timestamp: new Date().toISOString(),
  });
}

// Add to every data function
async function getClients(shopId: string, userId: string, supabase: SupabaseClient) {
  await logAccess(userId, shopId, 'read_clients');
  // ... rest of function
}
```

**Benefits:**
- Track who accessed what data
- Detect suspicious patterns
- Compliance (GDPR requires audit trails)
- Forensics if breach occurs

---

## Layer 6: Context Pattern

**Never pass shop_id as raw parameter. Use context:**

```typescript
// lib/contexts/shop-context.tsx (already exists in your codebase!)

const ShopContext = createContext<{ shopId: string } | null>(null);

export function ShopProvider({ shopId, children }) {
  return (
    <ShopContext.Provider value={{ shopId }}>
      {children}
    </ShopContext.Provider>
  );
}

export function useShopId() {
  const context = useContext(ShopContext);
  if (!context) throw new Error('useShopId must be used within ShopProvider');
  return context.shopId;
}

// Usage in components
function SomeComponent() {
  const shopId = useShopId(); // Always has correct shop
  // Can't accidentally use wrong shop
}
```

---

## Standard Data Function Pattern

**Every data function follows this template:**

```typescript
export async function getFunctionName(
  shopId: string,
  userId: string,
  supabase: SupabaseClient
): Promise<ReturnType> {
  // 1. Validate inputs
  if (!shopId) throw new Error('shop_id is required');
  if (!userId) throw new Error('user_id is required');

  // 2. Verify access
  const hasAccess = await verifyShopAccess(userId, shopId, supabase);
  if (!hasAccess) throw new Error('Unauthorized');

  // 3. Query data (ALWAYS with shop_id filter)
  const { data, error } = await supabase
    .from('table_name')
    .select('*')
    .eq('shop_id', shopId); // Belt AND suspenders

  if (error) throw error;

  // 4. Return typed data
  return data as TypeName[];
}
```

---

## Recommended Defense Stack

### **Development (Local):**
- ✅ Layer 1: TypeScript (required shopId parameter)
- ✅ Layer 2: Access control checks
- ⏳ Layer 3: RLS DISABLED (local dev limitation)
- ⏳ Layer 4: Automated tests (build this weekend)

### **Production:**
- ✅ Layer 1: TypeScript
- ✅ Layer 2: Access control checks
- ✅ Layer 3: RLS ENABLED (must enable before launch)
- ✅ Layer 4: Automated tests
- ⏳ Layer 5: Audit logging (add before scale)
- ✅ Layer 6: Context pattern (already exists)

---

## Emergency Procedures (If Breach Happens)

### **Detection:**
```sql
-- Run this query daily
SELECT user_id, shop_id, COUNT(*)
FROM audit_log
WHERE timestamp > NOW() - INTERVAL '24 hours'
GROUP BY user_id, shop_id
HAVING COUNT(*) > 10000; -- Suspiciously high access
```

### **Response:**
1. ALERT - Suspicious activity detected
2. INVESTIGATE - Review audit logs
3. ISOLATE - Disable affected user accounts
4. NOTIFY - Inform affected shops
5. FIX - Patch vulnerability
6. AUDIT - Review all access patterns
7. REPORT - Document incident (legal requirement)

---

## Pre-Launch Checklist

Before going to production:

- [ ] All data functions use standard pattern (validate, check access, filter by shop_id)
- [ ] RLS policies created and ENABLED on all tables
- [ ] Test suite covers data isolation scenarios
- [ ] Audit logging implemented
- [ ] Manual security audit completed
- [ ] Load testing with multiple shops
- [ ] Error monitoring set up (Sentry, etc.)

---

## Key Takeaways

1. **Defense in Depth:** Multiple independent layers. All must fail for breach to occur.

2. **TypeScript First:** If it doesn't compile, it can't run. Make wrong code uncompilable.

3. **Always Verify Access:** Never trust that shop_id is valid. Check shop_users table.

4. **RLS as Safety Net:** Even if code has bugs, database enforces isolation.

5. **Test Everything:** Automated tests catch bugs before production.

6. **Monitor Always:** Audit logs detect breaches early.

---

**"One bug = total meltdown" is preventable. Build it right from the start.**

---

## Next Steps (After Work Tomorrow)

1. Read this document thoroughly
2. Understand each layer
3. Continue building data functions with these patterns
4. Build the MVP this weekend with security baked in

---

*Security is not a feature. It's the foundation.*
