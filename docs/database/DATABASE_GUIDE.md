# Database Guide - Simple Ink Studios

## 📋 Table of Contents
1. [Database Structure](#database-structure)
2. [Core Architecture](#core-architecture)
3. [RLS Policies & Triggers](#rls-policies--triggers)
4. [Shop Creation Flow](#shop-creation-flow)

---

## Database Structure

### Naming Convention
- **`shops_tables`** - Your clients (tattoo shops that pay for SIS)
- **`shop_*` prefix** - Data that belongs to your clients' tattoo shops
- **`leads`** - YOUR prospective clients (tattoo shops you're trying to sign up)

### Entity Relationship Diagram

```
YOU (Simple Ink Studios Owner)
│
├── 📋 leads (shops you want to sign up)
│   ├── owner_id = YOUR auth.uid()
│   └── converted_to_shop_id → shops_tables
│
└── 🏢 shops_tables (shops that signed up and pay you)
    ├── shop_owner = THEIR auth.uid()
    │
    ├── 💰 shop_leads (their customers wanting tattoos)
    │   └── shop_id → shops_tables (auto-populated)
    │
    ├── 👨‍🎨 shop_workers (their tattoo artists)
    │   └── shop_id → shops_tables (auto-populated)
    │
    └── 📅 shop_appointments (future: their bookings)
        └── shop_id → shops_tables (auto-populated)
```

---

## Tables Reference

### 1. `shops_tables` - Your Paying Customers
Tattoo shops that pay for your software

**Columns:**
- `shop_id` (UUID, PRIMARY KEY)
- `shop_name` (TEXT)
- `shop_owner` (UUID, UNIQUE) → auth.users(id)
- `shop_address` (TEXT)
- `amount_of_workers` (INTEGER)
- `created_at`, `updated_at` (TIMESTAMPTZ)

**RLS:** `shop_owner = auth.uid()`

---

### 2. `leads` - YOUR Business Leads
Tattoo shops YOU are trying to sign as customers

**Columns:**
- `id` (UUID, PRIMARY KEY)
- `studio_name` (TEXT)
- `contact_name`, `contact_email`, `contact_phone` (TEXT)
- `address`, `city`, `state`, `zip_code` (TEXT)
- `status` (TEXT) - new, contacted, qualified, demo_scheduled, proposal_sent, converted, lost
- `source` (TEXT) - where you found them
- `notes` (TEXT)
- `converted_to_shop_id` (UUID) → shops_tables(shop_id)
- `owner_id` (UUID) → auth.users(id) - YOUR user ID
- `created_at`, `updated_at` (TIMESTAMPTZ)

**RLS:** `owner_id = auth.uid()`

---

### 3. `shop_leads` - Their Tattoo Customers
People who want tattoos from your customer's shop

**Columns:**
- `id` (BIGINT, PRIMARY KEY)
- `shop_id` (UUID) → shops_tables(shop_id) CASCADE
- `name` (TEXT)
- `contact_email` (TEXT)
- `contact_phone` (INTEGER)
- `notes` (TEXT)
- `perfered_artist_id` (TEXT) - typo, should be "preferred"
- `session_count` (INTEGER)
- `deposit_status` (TEXT)
- `created_at` (TIMESTAMPTZ)

**RLS:** `shop_id IN (SELECT shop_id FROM shops_tables WHERE shop_owner = auth.uid())`

---

### 4. `shop_workers` - Their Tattoo Artists
Artists working at each tattoo shop

**Columns:**
- `id` (UUID, PRIMARY KEY)
- `shop_id` (UUID) → shops_tables(shop_id) CASCADE
- `first_name`, `last_name` (TEXT)
- `email`, `phone` (TEXT)
- `status` (TEXT) - active, inactive, on_leave
- `hire_date` (DATE)
- `hourly_rate` (DECIMAL(10,2))
- `specialties` (TEXT[]) - array like ['traditional', 'realism']
- `notes` (TEXT)
- `created_at`, `updated_at` (TIMESTAMPTZ)

**RLS:** `shop_id IN (SELECT shop_id FROM shops_tables WHERE shop_owner = auth.uid())`

---

### 5. `waitlist` - Website Form Submissions
People interested in your software

**Columns:**
- `id` (BIGINT, PRIMARY KEY)
- `name`, `email`, `phone` (TEXT)
- `shop_name`, `city_state` (TEXT)
- `message` (TEXT)
- `created_at` (TIMESTAMPTZ)

**RLS:** Anonymous can INSERT, Authenticated have full access

---

## Core Architecture

### 🎯 The Critical Flow

```
User Login → Check Shop → Create Shop (if needed) → Dashboard → Everything uses shop_id
```

**Key Principle:** Everything in the platform revolves around the `shop_id`

1. User signs up/logs in
2. Dashboard checks: "Do they have a shop?"
3. NO → Show "Create Your Shop" page
4. YES → Show main dashboard
5. All actions create records with their `shop_id`

---

## RLS Policies & Triggers

### What Needs Auto-Population

**shop_owner** (on shops_tables):
```sql
CREATE TRIGGER shops_tables_auto_set_shop_owner
  BEFORE INSERT ON shops_tables
  FOR EACH ROW
  EXECUTE FUNCTION auto_set_shop_owner();
```

**shop_id** (on shop_leads, shop_workers):
```sql
CREATE TRIGGER shop_leads_auto_set_shop_id
  BEFORE INSERT ON shop_leads
  FOR EACH ROW
  EXECUTE FUNCTION auto_set_shop_id();
```

### RLS Policy Pattern

All shop-related tables follow this pattern:
```sql
CREATE POLICY "table_name_owner_access"
  ON table_name
  FOR ALL
  USING (
    shop_id IN (
      SELECT shop_id FROM shops_tables
      WHERE shop_owner = auth.uid()
    )
  )
  WITH CHECK (
    shop_id IN (
      SELECT shop_id FROM shops_tables
      WHERE shop_owner = auth.uid()
    )
  );
```

---

## Shop Creation Flow

### Implementation Steps

1. **Check for Shop on Dashboard Load**
```typescript
const { data: shop } = await supabase
  .from('shops_tables')
  .select('*')
  .eq('shop_owner', user.id)
  .single();

if (!shop) {
  // Show create shop form
}
```

2. **Create Shop Context**
Global state management for current shop

3. **Build CreateShopForm**
Simple form: shop_name, shop_address, amount_of_workers

4. **Test Flow**
Signup → Create Shop → Create Lead → Verify Isolation

---

## Learning Notes

### When Creating Migrations

1. Open Supabase Dashboard SQL Editor
2. Write your migration SQL
3. Test locally first if using Supabase CLI
4. Apply to production when ready

### Data Isolation

Every shop owner should ONLY see their own:
- shop_leads
- shop_workers
- shop_appointments (future)

Test by creating two users and verifying they can't see each other's data.

---

## Future Improvements

1. Fix typo: `perfered_artist_id` → `preferred_artist_id`
2. Add table: `shop_appointments` for booking management
3. Consider: Renaming `shops_tables` to just `shops`
4. Multi-shop support: Allow users to own multiple shops
5. Team members: Multiple users per shop with roles

---

## Migration History

- `20251012_cleanup_database_schema.sql` - Initial cleanup and schema setup
  - Fixed shops_tables primary key
  - Created leads and shop_workers tables
  - Added foreign key constraints
  - Set up RLS policies
