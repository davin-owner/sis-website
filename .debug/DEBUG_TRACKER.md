# Debug Tracker

**Last Updated:** 2025-11-13

Track all bugs, issues, and code improvements found in the project. Mark them as you fix them!

---

## Legend

- 🔴 **High Priority** - Critical bugs or security issues
- 🟡 **Medium Priority** - Important improvements or performance issues
- 🟢 **Low Priority** - Nice-to-haves, code quality improvements
- ✅ **Fixed** - Issue has been resolved
- 🚧 **In Progress** - Currently being worked on

---

## Issues Found

### 🔴 High Priority Issues

#### 1. Auto-Executing SMS Test Code

- **File:** `lib/twillo/sms-send.js:20`
- **Issue:** Test SMS sends automatically when module is imported with hardcoded numbers
- **Why it matters:** Could incur Twilio charges on every import, test code in production
- **How to fix:** Remove the `createMessage()` call at bottom, export function without executing

#### 2. Webhook Console Logs Exposing Metadata

- **File:** `app/api/webhooks/polar/route.ts` (15 instances)
- **Issue:** Console logs throughout webhook handler expose shopId, userId, and metadata
- **Why it matters:** Internal IDs exposed in production logs, security/privacy concern
- **How to fix:** Replace with environment-based logging, use proper monitoring service (Sentry)

#### 3. Production Console Logs in Data Layer

- **File:** `lib/supabase/data/shop-data.js:14,22,24`
- **File:** `lib/supabase/data/waitlist-data.js:52,53,62,83`
- **Issue:** Console logs left in production data access layer
- **Why it matters:** Exposes database queries and internal logic to users
- **How to fix:** Use proper logging library with environment checks

#### 4. Debug Component in Production

- **File:** `components/debug/DebugButton.client.tsx:23,25`
- **Issue:** Debug button with console logging
- **Why it matters:** Debug tools should not be in production build
- **How to fix:** Add environment check or remove from production builds

---

### 🟡 Medium Priority Issues

#### 1. Missing Type Safety in Appointment Data

- **File:** `lib/supabase/data/appointment-data.ts:44`
- **Issue:** Using `any` type for Supabase query results
- **Why it matters:** Defeats TypeScript's type safety, hides bugs
- **How to fix:** Define proper type for Supabase joined query results

#### 2. Missing useEffect Dependencies

- **File:** `components/features/calendar/AppointmentModal.client.tsx:104`
- **Issue:** useEffect missing `clients`, `prefilledDate`, `prefilledTime` in dependency array
- **Why it matters:** Can cause stale closures and bugs, component won't update properly
- **How to fix:** Add all used variables to dependency array

#### 3. TODO: Missing Error Toast Implementation

- **File:** `components/features/pipeline/PipelineBoard.client.tsx:235`
- **Issue:** Error handling silently fails with TODO comment
- **Why it matters:** Users don't see errors when drag-drop operations fail
- **How to fix:** Implement toast notification system for errors

#### 4. Console.error in All Action Files

- **File:** `app/dashboard/actions.ts` (8 instances)
- **File:** `app/content/artists/actions.ts` (3 instances)
- **File:** `app/content/pipeline/actions.ts` (3 instances)
- **File:** `app/settings/actions.ts` (2 instances)
- **Issue:** Error logging via console.error instead of proper error tracking
- **Why it matters:** Errors aren't tracked or monitored properly in production
- **How to fix:** Integrate error monitoring service (Sentry, LogRocket)

#### 5. Non-Null Assertions on Environment Variables

- **File:** `lib/polar/client.ts:36-39`
- **Issue:** Using `!` assertion on potentially undefined env vars
- **Why it matters:** Will cause runtime crashes if env vars missing
- **How to fix:** Add validation function that checks at startup and throws clear errors

---

### 🟢 Low Priority Issues

#### 1. Array Index Used as React Keys

- **File:** `components/shared/CheckList.client.tsx:16`
- **File:** `components/features/workers/ArtistsPage.client.tsx:150`
- **Issue:** Using array index as key in .map()
- **Why it matters:** Can cause React reconciliation bugs when items reorder
- **How to fix:** Use unique identifiers instead of indices

#### 2. TODO Comments in Code

- **File:** `components/features/clients/EditClientModal.client.tsx:67,72`
- **Issue:** TODO comments indicating incomplete work
- **Why it matters:** Should be tracked in issue tracker
- **How to fix:** Create GitHub issues and remove comments

#### 3. Commented Out Code

- **File:** `components/features/calendar/AppointmentModal.client.tsx:106-114`
- **Issue:** Old useEffect commented out instead of removed
- **Why it matters:** Clutters codebase, creates confusion
- **How to fix:** Remove (it's in git history if needed)

#### 4. Debug Console Logs

- **File:** `components/features/calendar/AppointmentModal.client.tsx:68,69,70,81,92`
- **File:** `components/layout/navbar/Navbar.client.tsx:26,28`
- **Issue:** Debug console.log statements left in code
- **Why it matters:** Clutters browser console for users
- **How to fix:** Remove or wrap in environment checks

---

## Fixed Issues

### ✅ Completed

1. **[2025-11-13] Hydration Error in Calendar Component**

   - **File:** `components/features/calendar/Calendar.client.tsx`
   - **Issue:** styled-jsx causing server/client HTML mismatch
   - **Fix:** Moved all styles to `globals.css`
   - **What you learned:** Hydration errors occur when server and client HTML don't match

2. **[2025-11-13] Workers Context Missing from Calendar Page**

   - **File:** `app/content/calendar/page.tsx`
   - **Issue:** AppointmentModal using `useWorkers()` hook without WorkersProvider
   - **Fix:** Added WorkersProvider wrapper around CalendarWrapper
   - **What you learned:** Context providers must wrap components that use the context

3. **[2025-11-13] Missing Client Data in Pipeline Schedule Modal**

   - **File:** `components/features/pipeline/DraggableCard.client.tsx`
   - **Issue:** AppointmentModal opening with empty client dropdown
   - **Fix:** Passed `clients={[client]}` prop to modal
   - **What you learned:** Props need to be explicitly passed down component tree

4. **[2025-11-13] 🔴 Auto-Executing SMS Test Code**

   - **File:** `lib/twillo/sms-send.js`
   - **Issue:** Test SMS sent automatically on module import with hardcoded test numbers
   - **Fix:** Removed auto-execution, converted to proper exported `sendSMS()` function
   - **What you learned:** Never auto-execute code on import - always export functions to be called explicitly

5. **[2025-11-13] 🔴 Production Console Logs in AppointmentModal**

   - **File:** `components/features/calendar/AppointmentModal.client.tsx:68-70,81,92`
   - **Issue:** Debug console.log statements exposing modal state
   - **Fix:** Removed all console.log statements
   - **Bonus:** Also fixed missing useEffect dependencies (`prefilledDate`, `prefilledTime`)
   - **What you learned:** Console logs expose internals to users and should not be in production

6. **[2025-11-13] 🟢 Debug Console Logs in Navbar**

   - **File:** `components/layout/navbar/Navbar.client.tsx:26,28`
   - **Issue:** Debug console.log for toggle state
   - **Fix:** Removed console.log statements
   - **What you learned:** Even low-priority logs clutter the user's console

7. **[2025-11-13] 🔴 Production Console Logs in Data Layer**
   - **Files:** `lib/supabase/data/shop-data.js`, `lib/supabase/data/waitlist-data.js`
   - **Issue:** Console logs exposing database queries and results
   - **Fix:** Removed all console.log and console.error statements, improved error handling
   - **What you learned:** Data layer should throw errors, not log them - let the calling code decide how to handle

---

## Summary Statistics

- **Total Issues Found:** 13
- **High Priority:** 4 → 1 remaining (Debug component, Webhook logs)
- **Medium Priority:** 5
- **Low Priority:** 4 → 3 remaining
- **Fixed:** 10 (7 new today!)
- **In Progress:** 0

## Recommended Action Plan

### Phase 1: Critical (Do First)

1. 🔴 Fix auto-executing SMS code in twillo/sms-send.js
2. 🔴 Remove/reduce console logs in webhook handlers
3. 🔴 Clean up console logs in data layer files
4. 🟡 Fix missing useEffect dependencies in AppointmentModal

### Phase 2: Important (This Week)

1. 🟡 Add proper type safety to appointment-data.ts
2. 🟡 Validate environment variables at startup
3. 🟡 Remove debug console.logs from AppointmentModal
4. 🟢 Clean up commented code

### Phase 3: Quality (When Ready)

1. 🟡 Implement error toast notifications
2. 🟢 Fix React keys using array indices
3. 🟢 Convert TODO comments to issues
4. 🟡 Add proper error monitoring service

---

_This file is automatically updated as issues are found and fixed. Keep practicing!_
