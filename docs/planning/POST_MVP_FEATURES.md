# Post-MVP Features Roadmap

**Last Updated:** November 1, 2025
**Current Version:** MVP 1.0 - LIVE IN PRODUCTION ✅
**Next Version:** MVP 1.1 (Week of Nov 4-10) - Payment Integration

---

## ✅ MVP 1.0 (DEPLOYED - Nov 1, 2025)

**Shipped Features:**
- ✅ Landing page with production signup flow (changed from waitlist)
- ✅ Authentication (signup/login/logout)
- ✅ Multi-tenancy (shops with RLS)
- ✅ Pipeline CRM (drag-and-drop, full CRUD, optimistic updates)
- ✅ Workers/Artists Management (/content/artists with full CRUD)
- ✅ Calendar with FullCalendar (month/week/day views)
- ✅ Appointment scheduling from pipeline cards
- ✅ Performance optimizations (React Compiler, chunk splitting)
- ✅ Production build and deployment

---

## 🚀 MVP 1.1 - Payment Integration (Week of Nov 4-10) - CURRENT PRIORITY

### 1. ✅ Appointments UX Improvements - COMPLETE
**Status:** SHIPPED IN MVP 1.0

- [x] "Schedule Appointment" button on pipeline cards
  - Opens appointment modal with client pre-selected
  - Primary workflow for booking appointments
  - Integrated with existing AppointmentModal

- [ ] Show appointment indicator on client cards (DEFERRED)
  - Small badge showing "Scheduled for Nov 5 @ 2pm"
  - Visual confirmation client has upcoming appointment
  - **Decision:** Defer to MVP 1.2, not critical for launch

---

### 2. 💰 Payment Processing with Polar - NEXT PRIORITY
**Priority:** CRITICAL (blocks revenue)
**Effort:** 4-6 hours for basic setup
**Decision:** USE POLAR (made Oct 31)

#### Why Polar:
- Handles taxes automatically (like Gumroad)
- Simpler setup for first revenue
- Can migrate to Stripe later at $5k+ MRR

#### Implementation Tasks:
- [ ] Set up Polar account and get API keys
- [ ] **DECISION NEEDED:** Pricing strategy
  - Option A: Single tier ($79/mo, unlimited)
  - Option B: Multiple tiers ($49/$99/$199)
- [ ] Create pricing page in app
- [ ] Add checkout flow
- [ ] Webhook handler for subscription events
- [ ] Update database schema for subscriptions
- [ ] Feature gates (if using tiered pricing)
- [ ] Test payment flow end-to-end

**Goal:** First paying customer by end of week (Nov 8)

---

### 3. ✅ Workers/Artists Management Page - COMPLETE
**Status:** SHIPPED IN MVP 1.0

- [x] `/content/artists` page
- [x] List all workers with sorting (active first)
- [x] Add/Edit/Delete worker modals
- [x] Color picker for calendar visualization
- [x] Specialty tags (Realism, Traditional, Japanese, etc.)
- [x] Status tracking (active/inactive/on_leave)
- [x] Contact info, hire date, hourly rate

---

### 4. Dashboard Improvements
**Priority:** LOW
**Effort:** 2 hours

- [ ] "Upcoming Appointments" widget
  - Shows next 3-5 appointments
  - Links to calendar
- [ ] Pipeline stats
  - Total clients per stage
  - Conversion rates
- [ ] Recent activity feed

---

## 🎨 MVP 1.2 - Enhanced Features (Future)

### 1. ✅ Calendar Grid View - COMPLETE
**Status:** SHIPPED IN MVP 1.0

- [x] Month/week/day views with FullCalendar
- [x] Visual blocks for appointments
- [x] Color-coded by worker/artist
- [x] Click to view/edit appointments
- [x] Drag to reschedule
- [x] Today highlighting

**Note:** Full FullCalendar implementation shipped in MVP 1.0

---

### 2. Client Communication
**Priority:** HIGH
**Effort:** 6-8 hours

- [ ] SMS reminders (Twilio)
  - "Hi John, reminder: Your appointment is tomorrow at 2pm"
- [ ] Email notifications (Resend)
  - Appointment confirmations
  - Reschedule notifications
- [ ] Templates management
  - Customize message templates
  - Merge tags (client name, date, etc.)

---

### 3. Advanced Pipeline Features
**Priority:** MEDIUM
**Effort:** 4-5 hours

- [ ] Custom pipeline stages (per shop)
  - Right now: hardcoded stages
  - Future: Shop owner can customize
- [ ] Automation rules
  - "Auto-move to 'Lost' after 30 days in 'Consulting'"
  - "Send follow-up after 7 days in 'Deposit Sent'"
- [ ] Pipeline analytics
  - Conversion rates per stage
  - Average time in each stage

---

## 💰 Revenue Milestones & Features

### At $1,000 MRR
- [ ] Hire VA for customer support
- [ ] Add live chat (Intercom or plain.com)
- [ ] Create help documentation

### At $5,000 MRR
- [ ] Consider Stripe migration (lower fees)
- [ ] Add team collaboration features
  - Multiple users per shop
  - Role permissions (owner/artist/front-desk)
- [ ] Mobile app (React Native or PWA)

### At $10,000 MRR
- [ ] Advanced reporting/analytics
- [ ] Instagram integration (import DMs as leads)
- [ ] Client portal (clients can book/reschedule themselves)

---

## 🔧 Technical Debt to Address

### Performance
- [ ] Add React Query for better caching
- [ ] Real-time subscriptions (Supabase realtime)
- [ ] Optimistic updates for all actions (already done for pipeline)

### Code Quality
- [ ] Add unit tests (Vitest)
- [ ] E2E tests (Playwright)
- [ ] Better error boundaries
- [ ] Loading states/skeletons

### Database
- [ ] Add ENUMs/CHECK constraints for status fields
- [ ] Audit RLS policies in production
- [ ] Set up automated backups
- [ ] Add database indices for common queries

---

## 🎯 Pricing Strategy - DECISION NEEDED

### Option A: Simple Single Tier (RECOMMENDED FOR MVP 1.1)
**Simple Ink Studios - $79/mo**
- Unlimited clients
- Unlimited workers
- Full calendar features
- Pipeline CRM
- 14-day free trial
- Email support

**Pros:**
- Easier to explain and sell
- No complexity in code (no feature gates)
- Can launch payment TODAY
- Can add tiers later based on demand

**Cons:**
- May leave money on table from high-value customers
- Can't upsell within product

---

### Option B: Three-Tier Approach
**Starter - $49/mo**
- 1 shop location
- Up to 100 clients
- Basic appointments
- Email support

**Professional - $99/mo** ⭐ RECOMMENDED
- 1 shop location
- Unlimited clients
- SMS reminders (100/mo included, post-MVP 1.2)
- Advanced reporting (post-MVP 1.2)
- Priority support

**Studio - $199/mo**
- Multi-location (up to 3)
- Unlimited everything
- White-label option (future)
- API access (future)
- Phone support

**Add-ons (Future):**
- Extra locations: +$50/mo each
- Extra SMS: $20 per 100 messages

**Pros:**
- Captures different customer segments
- Upsell opportunities
- Higher potential revenue

**Cons:**
- More complex to implement (feature gates required)
- Delays payment launch by 2-3 hours
- More testing required

---

### Recommendation: Start with Option A
Ship single tier ASAP, add tiers in MVP 1.2 if demand shows need

---

## 📝 Launch Checklist (Post-MVP)

**Week 1 (Nov 1-7): CURRENT WEEK** ✅
- [x] MVP 1.0 deployed to production (Nov 1)
- [x] Monitor for bugs/crashes - ONGOING
- [x] "Schedule" button to pipeline - SHIPPED
- [x] Workers management page - SHIPPED
- [ ] Collect user feedback (as users sign up)
- [ ] Fix critical issues only (none reported yet)

**Week 2 (Nov 4-10): PAYMENT INTEGRATION**
- [ ] Set up Polar account
- [ ] Decide pricing (single vs tiered)
- [ ] Implement payment flow
- [ ] Test checkout end-to-end
- [ ] First paying customer 🎉

**Week 3 (Nov 11-17): GROWTH & POLISH**
- [ ] Dashboard improvements
- [ ] Appointment indicators on client cards
- [ ] User feedback iteration
- [ ] Marketing/outreach

**Week 4+ (Nov 18+): AUTOMATION**
- [ ] SMS/Email notifications
- [ ] Automated reminders
- [ ] Advanced reporting

---

## 🚨 Critical Decisions Status

1. **Payment processor:** ✅ DECIDED - Polar
   - Migrate to Stripe at $5k+ MRR

2. **Pricing:** ⚠️ DECISION NEEDED FOR WEEK 2
   - Option A: Single tier $79/mo (RECOMMENDED - ship fast)
   - Option B: Three tiers $49/$99/$199 (more revenue potential)

3. **Free trial:** ✅ DECIDED - 14 days
   - Already messaging on landing page
   - No credit card required

4. **Feature gates:** ⚠️ DEPENDS ON PRICING DECISION
   - If single tier: No gates needed
   - If tiered: Limit by client count (Starter = 100 max, Pro+ = unlimited)

---

**Next Update:** After payment integration (Week of Nov 4-10)
