# Shop Creation Flow - Core Architecture

## 🎯 The Vision

Every user MUST have a shop before they can use the platform. The shop is the "hub" that all data connects to.

```
User Login → Check Shop → Create Shop (if needed) → Dashboard → Everything uses shop_id
```

---

## 🏗️ The Flow

### Step 1: User Signs Up / Logs In
```
User creates account via Supabase Auth
→ Gets user ID (auth.uid())
→ Redirected to dashboard
```

### Step 2: Dashboard Checks for Shop
```typescript
// On dashboard load:
const { data: shop } = await supabase
  .from('shops_tables')
  .select('*')
  .eq('shop_owner', user.id)
  .single();

if (!shop) {
  // Show "Create Your Shop" page
} else {
  // Show main dashboard with shop data
}
```

### Step 3: Create Shop (First Time)
```
Show form:
- Shop Name
- Shop Address
- Number of Workers
- [Create Shop Button]

On submit:
→ Insert into shops_tables with shop_owner = auth.uid()
→ Reload dashboard
→ Now user has access to full platform
```

### Step 4: Everything Uses shop_id
```
From this point on, ALL actions automatically use the user's shop_id:
- Create shop_lead → shop_id auto-populated
- Create shop_worker → shop_id auto-populated
- View reports → filtered by shop_id
```

---

## 📂 File Structure

```
app/
├── dashboard/
│   ├── page.tsx              # Main entry point - checks for shop
│   └── create-shop/
│       └── page.tsx          # Shop creation form
│
components/
├── dashboard/
│   ├── ShopChecker.tsx       # Checks if user has shop
│   ├── CreateShopForm.tsx    # Form to create new shop
│   └── ShopSelector.tsx      # (Future) Switch between multiple shops
│
lib/
├── supabase/
│   ├── shops.ts              # Shop CRUD operations
│   └── shop-context.tsx      # React Context for current shop
│
contexts/
└── ShopContext.tsx           # Global shop state management
```

---

## 🧩 Component Breakdown

### 1. `app/dashboard/page.tsx` - Main Entry Point

```typescript
export default async function DashboardPage() {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect('/login');
  }

  // Check if user has a shop
  const { data: shop } = await supabase
    .from('shops_tables')
    .select('*')
    .eq('shop_owner', user.id)
    .single();

  // No shop? Show create shop page
  if (!shop) {
    return <CreateShopPage />;
  }

  // Has shop? Show full dashboard
  return (
    <ShopProvider shop={shop}>
      <DashboardContent />
    </ShopProvider>
  );
}
```

---

### 2. `components/dashboard/CreateShopForm.tsx` - Shop Creation

```typescript
'use client';

import { useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';

export function CreateShopForm() {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    shop_name: '',
    shop_address: '',
    amount_of_workers: 1,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const supabase = createClient();

    // Insert shop (shop_owner will be auto-set by trigger or default)
    const { error } = await supabase
      .from('shops_tables')
      .insert({
        shop_name: formData.shop_name,
        shop_address: formData.shop_address,
        amount_of_workers: formData.amount_of_workers,
      });

    if (error) {
      console.error('Error creating shop:', error);
      alert('Failed to create shop');
    } else {
      // Reload page to refresh shop check
      window.location.reload();
    }

    setLoading(false);
  };

  return (
    <div className="max-w-md mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Create Your Shop</h1>
      <p className="text-gray-600 mb-6">
        Let's get started by setting up your tattoo shop in the system.
      </p>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-2">
            Shop Name *
          </label>
          <Input
            type="text"
            value={formData.shop_name}
            onChange={(e) => setFormData({ ...formData, shop_name: e.target.value })}
            required
            placeholder="e.g., Ink Masters Studio"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">
            Shop Address *
          </label>
          <Input
            type="text"
            value={formData.shop_address}
            onChange={(e) => setFormData({ ...formData, shop_address: e.target.value })}
            required
            placeholder="123 Main St, City, State"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">
            Number of Workers
          </label>
          <Input
            type="number"
            value={formData.amount_of_workers}
            onChange={(e) => setFormData({ ...formData, amount_of_workers: parseInt(e.target.value) })}
            min={1}
          />
        </div>

        <Button
          type="submit"
          disabled={loading}
          className="w-full"
        >
          {loading ? 'Creating Shop...' : 'Create Shop'}
        </Button>
      </form>
    </div>
  );
}
```

---

### 3. `contexts/ShopContext.tsx` - Global Shop State

```typescript
'use client';

import { createContext, useContext, ReactNode } from 'react';

interface Shop {
  shop_id: string;
  shop_name: string;
  shop_address: string;
  shop_owner: string;
  amount_of_workers: number;
}

interface ShopContextType {
  shop: Shop;
  shopId: string; // Convenience accessor
}

const ShopContext = createContext<ShopContextType | null>(null);

export function ShopProvider({
  shop,
  children
}: {
  shop: Shop;
  children: ReactNode;
}) {
  return (
    <ShopContext.Provider value={{ shop, shopId: shop.shop_id }}>
      {children}
    </ShopContext.Provider>
  );
}

// Custom hook to access shop context
export function useShop() {
  const context = useContext(ShopContext);
  if (!context) {
    throw new Error('useShop must be used within ShopProvider');
  }
  return context;
}
```

---

### 4. Usage Example - Creating a Shop Lead

```typescript
'use client';

import { useShop } from '@/contexts/ShopContext';
import { createClient } from '@/lib/supabase/client';

export function CreateLeadButton() {
  const { shopId } = useShop(); // Get current shop_id from context

  const createLead = async () => {
    const supabase = createClient();

    // shop_id will be auto-populated by trigger
    // But we can also pass it explicitly if needed
    const { error } = await supabase
      .from('shop_leads')
      .insert({
        name: 'New Customer',
        contact_email: 'customer@example.com',
        // shop_id: shopId, // Optional - trigger handles this
      });

    if (error) {
      console.error('Error:', error);
    }
  };

  return <button onClick={createLead}>Create Lead</button>;
}
```

---

## 🔐 Database Requirements

For this to work, you need:

1. **Foreign Key on shops_tables:**
   ```sql
   shop_owner UUID REFERENCES auth.users(id) UNIQUE
   ```

2. **Trigger to auto-populate shop_owner:**
   ```sql
   CREATE OR REPLACE FUNCTION set_shop_owner()
   RETURNS TRIGGER AS $$
   BEGIN
     IF NEW.shop_owner IS NULL THEN
       NEW.shop_owner := auth.uid();
     END IF;
     RETURN NEW;
   END;
   $$ LANGUAGE plpgsql SECURITY DEFINER;

   CREATE TRIGGER shops_set_owner
     BEFORE INSERT ON shops_tables
     FOR EACH ROW
     EXECUTE FUNCTION set_shop_owner();
   ```

3. **RLS Policy:**
   ```sql
   CREATE POLICY "users_own_shop"
   ON shops_tables
   FOR ALL
   USING (shop_owner = auth.uid())
   WITH CHECK (shop_owner = auth.uid());
   ```

---

## 🎨 UI/UX Considerations

### First-Time User Experience:
1. Clean, welcoming "Create Your Shop" page
2. Simple form (only essential fields)
3. Clear messaging: "Before you can manage leads and appointments, we need to set up your shop"

### Returning User Experience:
1. Instant access to dashboard
2. Shop name visible in header
3. (Future) Dropdown to switch between shops

### Visual States:
- ⏳ Loading: "Checking your shop..."
- ❌ No shop: Show CreateShopForm
- ✅ Has shop: Show full dashboard

---

## 🚀 Future Enhancements

### Phase 1 (Now):
- Single shop per user
- Required to create shop on first login

### Phase 2 (Later):
- Multiple shops per user
- Shop switcher in header
- Team members (multiple users → same shop)

### Phase 3 (Advanced):
- Shop roles (owner, manager, artist)
- Shop settings page
- Shop branding/customization

---

## ✅ Success Criteria

When this is implemented:
- ✅ New users can't access dashboard without creating shop
- ✅ All data automatically ties to shop_id
- ✅ Shop owners can't see other shops' data
- ✅ Simple, clean onboarding flow
- ✅ Foundation for multi-shop support later

---

## 📋 Implementation Checklist

- [ ] Add shop check to dashboard/page.tsx
- [ ] Create CreateShopForm component
- [ ] Create ShopContext for global state
- [ ] Add trigger to auto-set shop_owner
- [ ] Test: signup → create shop → create lead
- [ ] Verify RLS policies work correctly
- [ ] Add loading states
- [ ] Add error handling
- [ ] Style the create shop page

---

This architecture ensures EVERYTHING in your platform revolves around the shop. Clean, scalable, and professional. 🔥
