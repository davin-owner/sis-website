# Post-MVP Features Roadmap

**Last Updated:** October 30, 2024
**Current Version:** MVP 1.0
**Next Version:** MVP 1.1 (Week of Nov 4-10)

---

## 🎯 MVP 1.0 (Launching Tomorrow - Oct 31)

**Includes:**
- ✅ Landing page + waitlist
- ✅ Authentication
- ✅ Multi-tenancy (shops)
- ✅ Pipeline CRM
- ✅ Basic appointments (calendar page only)

---

## 🚀 MVP 1.1 - Immediate Next Features

### 1. Appointments UX Improvements
**Priority:** HIGH
**Effort:** 2-3 hours

- [ ] "Schedule Appointment" button on pipeline cards
  - Opens appointment modal with client pre-selected
  - Primary workflow for booking appointments
  - Reuses existing AddAppointmentModal

- [ ] Show appointment indicator on client cards
  - Small badge showing "Scheduled for Nov 5 @ 2pm"
  - Visual confirmation client has upcoming appointment

**Why:** Makes appointment scheduling feel natural in the workflow

---

### 2. Payment Processing - CRITICAL DECISION NEEDED
**Priority:** CRITICAL (blocks revenue)
**Effort:** 4-6 hours for basic setup

#### Option A: Stripe
**Pros:**
- Industry standard
- Excellent documentation
- Full control

**Cons:**
- You handle tax compliance (sales tax, VAT, etc.)
- More complex setup
- Need to track nexus (where you owe taxes)

**Tax handling:**
- Stripe Tax (add-on, ~0.5% extra) - Handles calculations
- Still need to file/remit yourself OR use Stripe Tax + auto-filing

#### Option B: Polar
**Pros:**
- Built for SaaS creators
- Handles taxes automatically (like Gumroad)
- Simpler setup
- Clean merchant of record model

**Cons:**
- Higher fees (~5% vs Stripe's ~3%)
- Less customization
- Smaller ecosystem

#### Recommendation: START WITH POLAR
**Why for MVP 1.1:**
- Get revenue flowing FAST
- Don't worry about tax compliance yet
- Simple integration
- Can always migrate to Stripe later when you're making $5k+/month

**When to switch to Stripe:**
- Making $5k+ MRR (fees become significant)
- Want custom billing features
- Have accountant/bookkeeper to handle taxes

**Implementation:**
- [ ] Set up Polar account
- [ ] Create pricing tiers ($49/mo, $99/mo, $199/mo)
- [ ] Add checkout links to app
- [ ] Webhook for subscription events
- [ ] Feature gates based on subscription

---

### 3. Workers/Artists Management Page
**Priority:** MEDIUM
**Effort:** 3-4 hours

- [ ] `/content/artists` page
- [ ] List all workers
- [ ] Add/Edit/Delete worker modal
- [ ] Assign colors for calendar
- [ ] Track specialties (realism, traditional, etc.)

**Why:** Right now workers are in database but no UI to manage them

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

## 🎨 MVP 1.2 - Enhanced Features

### 1. Calendar Grid View
**Priority:** MEDIUM
**Effort:** 8-10 hours

- [ ] Week/month view instead of just list
- [ ] Visual blocks for appointments
- [ ] Color-coded by artist
- [ ] Drag to reschedule

**Note:** Current MVP has list view only

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

## 🎯 Pricing Strategy (For Discussion)

### Suggested Tiers:

**Starter - $49/mo**
- 1 shop location
- Up to 100 clients
- Basic appointments
- Email support

**Professional - $99/mo** ⭐ RECOMMENDED
- 1 shop location
- Unlimited clients
- SMS reminders (100/mo included)
- Advanced reporting
- Priority support

**Studio - $199/mo**
- Multi-location (up to 3)
- Unlimited everything
- White-label option
- API access
- Phone support

**Add-ons:**
- Extra locations: +$50/mo each
- Extra SMS: $20 per 100 messages

---

## 📝 Launch Checklist (Post-MVP)

**Week 1 (Nov 1-7):**
- [ ] Monitor for bugs/crashes
- [ ] Collect user feedback
- [ ] Fix critical issues only
- [ ] DON'T add features yet

**Week 2 (Nov 8-14):**
- [ ] Implement payment processing (Polar)
- [ ] Add "Schedule" button to pipeline
- [ ] Workers management page

**Week 3 (Nov 15-21):**
- [ ] First paying customer 🎉
- [ ] SMS/Email notifications
- [ ] Dashboard improvements

---

## 🚨 Critical Decisions Needed

1. **Payment processor:** Polar vs Stripe
   - **Recommendation:** Start with Polar, migrate to Stripe at $5k MRR

2. **Pricing:** What to charge?
   - **Recommendation:** $49/$99/$199 tiers above

3. **Free trial:** How long?
   - **Recommendation:** 14 days (industry standard for B2B SaaS)

4. **Feature gates:** What's behind paywall?
   - **Recommendation:** All features available, limit by client count
   - Starter = 100 clients max
   - Pro+ = unlimited

---

**Next Update:** After MVP launch (Nov 1)
