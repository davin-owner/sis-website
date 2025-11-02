# Security Issues by File

## CRITICAL ISSUES

### app/api/debug/shops/route.ts
- **Line 1-17**: Exposed unauthenticated API route returning all shops
- **Severity**: CRITICAL
- **Action**: DELETE THIS FILE
- **Alternative**: If needed for debugging, add authentication and user filtering

### app/api/debug/shop_leads/route.ts  
- **Line 1-18**: Exposed unauthenticated API route returning all leads
- **Severity**: CRITICAL
- **Action**: DELETE THIS FILE
- **Alternative**: If needed for debugging, add authentication and user filtering

### app/content/calendar/actions.ts
- **Line 25**: `client_id: parseInt(formData.get("client_id") as string, 10)` - No ownership verification
- **Line 89**: Same issue in updateAppointmentAction
- **Severity**: CRITICAL
- **Action**: Add ownership check before using client_id
```typescript
const { data: clientData } = await supabase
  .from("shop_leads")
  .select("id")
  .eq("id", clientId)
  .eq("shop_id", shopId)
  .single();
if (!clientData) {
  return { error: "Client not found or not authorized" };
}
```

### app/content/calendar/actions 2.ts
- **Line 25**: Same parseInt without ownership verification
- **Line 89**: Same issue in updateAppointmentAction
- **Severity**: CRITICAL
- **Action**: Same fix as above

### .env.production.local
- **Line 5-6**: Production Supabase credentials exposed
- **Severity**: CRITICAL  
- **Action**: Add to .gitignore, rotate keys
- **.gitignore addition**: `.env.local`, `.env.*.local`

### .env.local
- **Line 6**: Publishable key exposed
- **Severity**: MEDIUM (publishable key is meant to be public, but file should not be in git)
- **Action**: Add to .gitignore

### .env.development
- **Line 6**: Development key exposed
- **Severity**: LOW (dev key, but still in git)
- **Action**: Add to .gitignore

---

## HIGH PRIORITY ISSUES

### next.config.ts
- **Line 68**: CSP includes `'unsafe-inline' 'unsafe-eval'`
- **Severity**: HIGH
- **Current**: `script-src 'self' 'unsafe-inline' 'unsafe-eval' https:`
- **Fix to**: `script-src 'self' https://cdn.tailwindcss.com`
- **Current**: `style-src 'self' 'unsafe-inline' https:`
- **Fix to**: `style-src 'self' 'unsafe-inline' https://cdn.tailwindcss.com`

### app/content/pipeline/actions.ts
- **Line 35-46**: Input validation missing trim() and length checks
  - name: no length limit, whitespace not trimmed
  - contact_email: no email format validation
  - contact_phone: has validation (good)
  - notes: no length limit, whitespace not trimmed
- **Severity**: HIGH
- **Action**: Add input validation with trim, length checks, format validation

### app/onboarding/actions.ts
- **Line 21-22**: shopName, shopAddress not validated
- **Severity**: HIGH
- **Action**: Add validation (trim, length limits)

### components/auth/SignUpForm.tsx
- **Line 30-57**: No password strength requirements
- **Severity**: HIGH
- **Missing checks**:
  - No minimum length (should be 12+)
  - No uppercase requirement
  - No lowercase requirement
  - No number requirement
  - No special character requirement
- **Action**: Add `validatePassword()` function and check before signup

### app/auth/confirm/route.ts
- **Line 42**: Error message exposed in URL parameter
  - `error=${encodeURIComponent(error?.message || "Verification failed")}`
  - Could expose database errors like "relation doesn't exist"
- **Severity**: HIGH
- **Action**: Return generic error message, log actual error server-side

### app/content/pipeline/actions.ts
- **Line 73**: `console.error('Create client error:', errorMessage, error)`
- **Line 109**: `console.error('Update client error:', errorMessage, error)`
- **Line 135**: `console.error('Update client stage error:', errorMessage, error)`
- **Severity**: HIGH
- **Issue**: Error details logged to console, visible in dev tools
- **Action**: Map internal errors to user-friendly messages

### app/settings/actions.ts
- **Line 52**: `console.error("Error updating user profile:", error)`
- **Line 109**: `console.error("Error updating shop:", error)`
- **Severity**: HIGH
- **Action**: Map internal errors to user-friendly messages

### app/content/artists/actions.ts
- **Line 49**: `console.error("Error creating worker:", error)`
- **Line 93**: `console.error("Error updating worker:", error)`
- **Line 130**: `console.error("Error deleting worker:", error)`
- **Severity**: HIGH
- **Action**: Map internal errors to user-friendly messages

### app/dashboard/actions.ts
- **Multiple console.error calls** (lines 48, 76, 98, 129, 151, 185, 216, 238)
- **Severity**: HIGH
- **Action**: Map internal errors to user-friendly messages

---

## MEDIUM PRIORITY ISSUES

### lib/utils/access-control.ts
- **Line 13-31**: `verifyShopAccess()` has timing differences
- **Severity**: MEDIUM
- **Issue**: Response time varies based on whether user has access, enabling enumeration
- **Action**: Add constant-time delay to all responses

### lib/supabase/data/shop-leads-data.ts
- **Line 147-165**: `deleteShopClient()` only checks shop access, not user role
- **Severity**: MEDIUM
- **Issue**: Any shop member can delete clients, should require admin/owner
- **Action**: Add role verification before deletion

### lib/supabase/data/workers-data.ts
- **Line 126-144**: `deleteShopWorker()` only checks shop access, not user role
- **Severity**: MEDIUM
- **Issue**: Any shop member can delete workers, should require admin/owner
- **Action**: Add role verification before deletion

### lib/supabase/data/appointment-data.ts
- **Line 146-164**: `deleteShopAppointment()` only checks shop access, not user role
- **Severity**: MEDIUM
- **Issue**: Any shop member can delete appointments, should require admin/owner
- **Action**: Add role verification before deletion

### lib/supabase/data/dashboard-accomplishments-data.ts
- **Line 97-115**: `deleteAccomplishment()` only checks shop access, not user role
- **Severity**: MEDIUM
- **Issue**: Any shop member can delete accomplishments
- **Action**: Add role verification

### lib/supabase/data/dashboard-reminders-data.ts
- **Line 165-183**: `deleteReminder()` only checks shop access, not user role
- **Severity**: MEDIUM
- **Issue**: Any shop member can delete reminders
- **Action**: Add role verification

### lib/supabase/data/dashboard-tasks-data.ts
- **Line 107-125**: `deleteDailyTask()` only checks shop access, not user role
- **Severity**: MEDIUM
- **Issue**: Any shop member can delete tasks
- **Action**: Add role verification

### next.config.ts
- **Line 9**: Hardcoded IP address `192.168.1.194:3000`
- **Severity**: MEDIUM
- **Issue**: Not environment-based, specific to dev machine
- **Action**: Use environment variable `ALLOWED_DEV_ORIGINS`

### All server actions (no rate limiting)
- **Severity**: MEDIUM
- **Files affected**: 
  - app/auth/* (login, signup, password reset)
  - app/content/pipeline/actions.ts (create/update/delete client)
  - app/content/artists/actions.ts (create/update/delete worker)
  - app/content/calendar/actions.ts (create/update/delete appointment)
  - app/dashboard/actions.ts (all dashboard actions)
- **Issue**: No rate limiting on any operations
- **Action**: Implement @upstash/ratelimit

### All CRUD operations (no audit logging)
- **Severity**: MEDIUM
- **Files affected**: All data modification operations
- **Issue**: Cannot track who changed what, when, or why
- **Action**: Implement audit logging to track all operations

---

## LOW PRIORITY ISSUES

### lib/supabase/data/shop-leads-data.ts
- Missing email format validation in `createShopClient()` and `updateShopClient()`

### app/settings/actions.ts
- **Line 80**: Table name mismatch - code uses `user_shops` but should be `shop_users`
- **Line 97**: Table name mismatch - code uses `shops` but should be `shops_tables`
- **Severity**: LOW (but will cause runtime errors)

### next.config.ts
- No Strict-Transport-Security header
- No X-XSS-Protection header
- Could add subresource integrity (SRI) for external scripts

---

## SUMMARY BY SEVERITY

### CRITICAL (Delete immediately)
1. app/api/debug/shops/route.ts
2. app/api/debug/shop_leads/route.ts
3. app/content/calendar/actions.ts (line 25, 89)
4. Environment files (.env.*.local)

### HIGH (Fix this sprint)
1. next.config.ts (CSP policy)
2. app/content/pipeline/actions.ts (input validation)
3. components/auth/SignUpForm.tsx (password requirements)
4. All auth and action files (error exposure)

### MEDIUM (Fix next sprint)
1. Rate limiting (all server actions)
2. Audit logging (all CRUD operations)
3. Role-based permission checks (all delete operations)
4. Timing attack protection (access-control.ts)

### LOW (Consider for later)
1. Additional security headers
2. Email validation in all fields
3. Dependency scanning setup

