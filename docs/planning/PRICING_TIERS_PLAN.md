# 💰 Pricing & Tiers Strategy

**Last Updated:** 2025-11-05
**Status:** Planning Phase
**Goal:** Monetize Simple Ink Studios with a clear, value-based tiered pricing model

---

## 🎯 Pricing Philosophy

- **Value-based pricing:** Charge based on value delivered, not just features
- **Clear upgrade paths:** Each tier solves a specific pain point
- **Start simple, add complexity:** Launch with 3 tiers, add Enterprise later
- **Middle tier = revenue driver:** Most customers will choose Pro ($79/mo)

---

## 📊 The 4-Tier Model

### 🎨 Free: Solo Artist ($0/month)
**Target Audience:** Individual tattoo artists testing the platform

**Features:**
- ✅ 1 artist only (solo use)
- ✅ Up to 50 clients
- ✅ Up to 20 appointments/month
- ✅ Basic calendar view
- ✅ Simple client list (no pipeline stages)
- ❌ No SMS/email notifications
- ❌ No team features
- ⚠️ "Powered by Simple Ink Studios" branding

**Purpose:** Conversion funnel - let artists try before upgrading

**Upgrade Trigger:** Hiring another artist or hitting appointment limit

---

### 💼 Tier 1: Studio Basics ($29/month)
**Target Audience:** Small tattoo shops (1-3 artists)

**Features:**
- ✅ Everything in Solo tier
- ✅ Up to 3 artists
- ✅ Unlimited clients & appointments
- ✅ Full client pipeline (consultation → deposit → scheduled → completed)
- ✅ Team calendar with color-coded artists
- ✅ Deposit tracking (manual - no payment processing)
- ✅ Remove "Powered by" branding
- ❌ No automated SMS/email notifications

**Value Proposition:** "Organize your shop and team for less than $1/day"

**Upgrade Trigger:** "I'm tired of manually texting reminders" or hiring 4+ artists

---

### 🚀 Tier 2: Studio Pro ($79/month) ⭐ MOST POPULAR
**Target Audience:** Growing shops that want automation (4-10 artists)

**Features:**
- ✅ Everything in Studio Basics
- ✅ **SMS notifications** (appointment reminders, updates) via Twilio
- ✅ **Email notifications** (confirmations, calendar invites, receipts) via Resend
- ✅ Up to 10 artists
- ✅ Basic analytics dashboard (bookings, revenue trends, artist utilization)
- ✅ Custom branding (logo, colors on client-facing booking pages)
- ✅ Priority email support (24hr response time)
- ❌ No payment processing (yet)
- ❌ No multi-location support

**Value Proposition:** "Stop chasing clients - automate reminders and reduce no-shows by 40%"

**Upgrade Trigger:** "We need online payment collection" or "We opened a 2nd location"

---

### 💎 Tier 3: Studio Enterprise ($149/month)
**Target Audience:** Established shops, multi-location businesses, serious operations

**Features:**
- ✅ Everything in Studio Pro
- ✅ **Payment processing** (Stripe Connect - collect deposits/payments online)
- ✅ Unlimited artists
- ✅ Advanced analytics & reports (client lifetime value, artist performance, revenue forecasting)
- ✅ **Multi-location support** (manage multiple shop locations under one account)
- ✅ **API access** (for custom integrations, website embeds, third-party tools)
- ✅ Priority phone/chat support (1hr response time)
- ✅ Custom feature requests considered
- ✅ Dedicated account manager (for annual contracts)

**Value Proposition:** "Enterprise-grade tools for shops that are scaling or have multiple locations"

**Upgrade Trigger:** Complex needs, multiple locations, or wanting white-glove support

---

## 📈 Feature Comparison Matrix

| Feature | Free | Basics ($29) | Pro ($79) | Enterprise ($149) |
|---------|------|--------------|-----------|-------------------|
| **Artists** | 1 | 3 | 10 | Unlimited |
| **Clients** | 50 | Unlimited | Unlimited | Unlimited |
| **Appointments/month** | 20 | Unlimited | Unlimited | Unlimited |
| **Client Pipeline** | Basic list | Full pipeline | ✅ | ✅ |
| **Team Calendar** | ❌ | ✅ | ✅ | ✅ |
| **SMS Notifications** | ❌ | ❌ | ✅ | ✅ |
| **Email Notifications** | ❌ | ❌ | ✅ | ✅ |
| **Analytics** | ❌ | Basic | ✅ | Advanced |
| **Payment Processing** | ❌ | ❌ | ❌ | ✅ (Stripe) |
| **Multi-Location** | ❌ | ❌ | ❌ | ✅ |
| **API Access** | ❌ | ❌ | ❌ | ✅ |
| **Custom Branding** | ❌ | Remove logo | Custom | Custom |
| **Support** | Community | Email | Priority email | Phone/chat |

---

## 🛠️ Implementation Roadmap

### Phase 1: MVP Launch (Weeks 1-3)
**Tiers:** Free + Basics + Pro

**Core Features to Build:**
- [ ] Tier selection during onboarding
- [ ] Store `subscription_tier` in `shops_tables`
- [ ] Feature gates throughout app (check tier before allowing features)
- [ ] Stripe integration for Basics & Pro billing
- [ ] SMS notifications (Twilio) for Pro tier
- [ ] Email notifications (Resend) for Pro tier
- [ ] Basic analytics dashboard for Pro tier
- [ ] Tier limits enforcement (artist count, appointment count for Free)

**Why start here:** These 3 tiers cover 90% of use cases and are buildable quickly

---

### Phase 2: Enterprise Features (Weeks 4-8)
**Add:** Enterprise tier with advanced features

**Features to Build:**
- [ ] Payment processing (Stripe Connect integration)
- [ ] Multi-location support (locations table, location switcher UI)
- [ ] API layer (REST endpoints, authentication, rate limiting)
- [ ] API documentation (Swagger/OpenAPI)
- [ ] Advanced analytics (client LTV, forecasting, artist performance)
- [ ] Account manager assignment for Enterprise customers

**Why defer:** Build these only when customers are asking for them (validate demand first)

---

### Phase 3: Optimization (Ongoing)
- [ ] A/B test pricing ($79 vs $89 for Pro)
- [ ] Add annual billing (15% discount)
- [ ] Referral program (give 1 month free for referrals)
- [ ] Usage-based overage fees (e.g., $0.05/SMS for Pro tier over 500 msgs/mo)
- [ ] Custom Enterprise pricing for 20+ artists

---

## 💡 Key Implementation Details

### Database Schema Changes
```sql
-- Add to shops_tables
ALTER TABLE shops_tables
  ADD COLUMN subscription_tier TEXT DEFAULT 'free'
    CHECK (subscription_tier IN ('free', 'basics', 'pro', 'enterprise'));

ALTER TABLE shops_tables
  ADD COLUMN stripe_customer_id TEXT;

ALTER TABLE shops_tables
  ADD COLUMN stripe_subscription_id TEXT;

-- Track usage for limits
CREATE TABLE shop_usage (
  shop_id UUID REFERENCES shops_tables(shop_id),
  month DATE,
  appointments_created INT DEFAULT 0,
  sms_sent INT DEFAULT 0,
  emails_sent INT DEFAULT 0,
  PRIMARY KEY (shop_id, month)
);
```

### Feature Gate Example
```typescript
// lib/utils/feature-gates.ts
export function canUseSMS(tier: string): boolean {
  return ['pro', 'enterprise'].includes(tier);
}

export function getArtistLimit(tier: string): number {
  switch(tier) {
    case 'free': return 1;
    case 'basics': return 3;
    case 'pro': return 10;
    case 'enterprise': return Infinity;
  }
}
```

### Stripe Products to Create
```typescript
// Stripe Dashboard Setup
const STRIPE_PRODUCTS = {
  basics: {
    name: 'Studio Basics',
    price: 2900, // $29.00 in cents
    interval: 'month',
  },
  pro: {
    name: 'Studio Pro',
    price: 7900, // $79.00
    interval: 'month',
  },
  enterprise: {
    name: 'Studio Enterprise',
    price: 14900, // $149.00
    interval: 'month',
  }
};
```

---

## 📊 Revenue Projections (Year 1)

**Assumptions:**
- 100 shops sign up in first year
- 20% Free, 40% Basics, 35% Pro, 5% Enterprise

**Monthly Recurring Revenue (MRR):**
- Free: 20 shops × $0 = $0
- Basics: 40 shops × $29 = $1,160
- Pro: 35 shops × $79 = $2,765
- Enterprise: 5 shops × $149 = $745

**Total MRR:** $4,670/month
**Annual Run Rate (ARR):** $56,040/year

**Year 1 Target:** 100 shops, $56k ARR

---

## 🎯 Success Metrics

**Conversion Funnel:**
- Free → Basics: Target 30% conversion
- Basics → Pro: Target 40% conversion
- Pro → Enterprise: Target 10% conversion

**Retention:**
- Month 1-3: 85% retention (some churn from bad fits)
- Month 4-12: 95% retention (sticky once integrated)

**Customer Acquisition Cost (CAC):**
- Target: <$200/customer (3 month payback at Pro tier)

**Lifetime Value (LTV):**
- Basics: $29 × 18 months = $522
- Pro: $79 × 24 months = $1,896
- Enterprise: $149 × 36 months = $5,364

---

## 🚀 Next Steps

1. **Week 1:** Build tier selection into onboarding flow
2. **Week 1-2:** Integrate Stripe for Basics & Pro billing
3. **Week 2:** Add feature gates for SMS/email (Pro only)
4. **Week 2-3:** Set up Twilio & Resend integrations
5. **Week 3:** Build pricing page with tier comparison
6. **Week 3:** Launch Free + Basics + Pro tiers
7. **Week 4+:** Monitor usage, gather feedback, iterate

---

## 📝 Open Questions

- [ ] Should we offer annual billing at launch? (15% discount)
- [ ] What's the right SMS limit for Pro tier? (Unlimited or cap at 500/mo?)
- [ ] Do we need a "Teams" tier between Basics and Pro? (5 artists, no automation)
- [ ] Should Free tier have a time limit? (30-day trial then must upgrade)
- [ ] White-label option for Enterprise? (remove all SIS branding)

---

## 🤝 Competitive Analysis

| Competitor | Pricing | Our Advantage |
|------------|---------|---------------|
| Square Appointments | $29-$69/mo | We're tattoo-specific, better pipeline |
| Booksy | $29.99-$89.99/mo | More affordable Pro tier, simpler UI |
| Vagaro | $25-$95/mo | Focus on tattoos, not hair/nails/spa |

**Our positioning:** "The only booking platform built specifically for tattoo shops"

---

**End of Pricing Tiers Plan**
