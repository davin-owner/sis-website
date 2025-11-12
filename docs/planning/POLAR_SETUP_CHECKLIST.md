# Polar Integration Setup Checklist

**Status:** Ready for Production Deployment
**Date:** 2025-11-11

## ✅ Completed Steps

- [x] Created 4 tiers in Polar dashboard
- [x] Added Polar API keys to `.env.production.local`
- [x] Created database migration (`12_add_subscription_tiers.sql`)
- [x] Updated TypeScript types in `lib/database.ts`
- [x] Created Polar client utility (`lib/polar/client.ts`)
- [x] Created feature gates utility (`lib/utils/feature-gates.ts`)
- [x] Created checkout API route (`app/api/checkout/route.ts`)
- [x] Created webhook handler (`app/api/webhooks/polar/route.ts`)
- [x] Created pricing page (`app/pricing/page.tsx`)
- [x] Applied migration to local database

---

## 📋 Remaining Setup Steps

### 1. Add Missing Environment Variables

You need to add these to both `.env.production.local` and Vercel:

```bash
# Get this from your Supabase dashboard > Settings > API > service_role key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key_here

# Your production site URL
NEXT_PUBLIC_SITE_URL=https://your-domain.vercel.app
```

**Where to find Supabase Service Role Key:**
1. Go to https://supabase.com/dashboard
2. Select your project
3. Settings → API
4. Copy the `service_role` secret key (NOT the anon public key)

---

### 2. Deploy Database Migration to Production

Run this command to push the migration to your production database:

```bash
cd /Users/davin/Desktop/Simple\ Ink\ Studios/sis-website
supabase db push
```

This will apply migration `12_add_subscription_tiers.sql` to your production Supabase database.

---

### 3. Set Up Polar Webhook

**In your Polar dashboard:**

1. Go to Settings → Webhooks
2. Click "Add Webhook"
3. Enter webhook URL: `https://your-domain.vercel.app/api/webhooks/polar`
4. Select these events to subscribe to:
   - `checkout.created`
   - `order.created`
   - `subscription.created`
   - `subscription.updated`
   - `subscription.canceled`
5. Save the webhook

**Test the webhook:**
- Polar will send a test event to verify the endpoint is working
- Check your Vercel logs to see if it's received

---

### 4. Add Environment Variables to Vercel

**In your Vercel dashboard:**

1. Go to your project → Settings → Environment Variables
2. Add all variables from `.env.production.local`:
   ```
   NEXT_PUBLIC_SUPABASE_URL
   NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY
   SUPABASE_SERVICE_ROLE_KEY (NEW - add this!)
   POLAR_ACCESS_TOKEN
   POLAR_ORG_ID
   SOLO_FREE_ID
   STUDIO_BASICS_ID
   STUDIO_PRO_ID
   STUDIO_ENTERPRISE_ID
   NEXT_PUBLIC_SITE_URL (NEW - add this!)
   ```
3. Redeploy your application

---

### 5. Test the Pricing Flow

**Test locally first:**

```bash
npm run dev
```

1. Visit http://localhost:3000/pricing
2. Click "Start Free Trial" on Studio Basics
3. Should redirect to Polar checkout
4. Complete test purchase (use Polar test mode)
5. Verify webhook updates subscription in database

**Test in production:**

1. Visit https://your-domain.vercel.app/pricing
2. Complete the same flow
3. Check database to verify subscription_tier is updated

---

### 6. Update Onboarding to Set Free Tier

Currently, new signups don't automatically get set to the `free` tier. Let's update the onboarding flow:

**File to modify:** `app/onboarding/actions.ts`

Find the `createShop` function and update it to include:

```typescript
const { data: newShop, error: shopError } = await supabase
  .from('shops_tables')
  .insert({
    shop_name: shopName,
    shop_address: shopAddress,
    amount_of_workers: 0,
    shop_owner: user.id,
    subscription_tier: 'free', // ← Add this
    subscription_status: 'active', // ← Add this
  })
  .select()
  .single()
```

---

## 🎯 Next Phase: Enforce Feature Limits

After the basic integration is working, you'll want to:

1. **Enforce artist limits** in worker creation
2. **Enforce appointment limits** for free tier
3. **Show upgrade prompts** when users hit limits
4. **Gate SMS/Email features** for Pro+ tiers

See `docs/planning/TIER_IMPLEMENTATION_PLAN.md` for full details.

---

## 🧪 Testing Checklist

- [ ] Free tier signup works
- [ ] Basics tier checkout redirects to Polar
- [ ] Pro tier checkout redirects to Polar
- [ ] Enterprise tier checkout redirects to Polar
- [ ] Webhook updates `subscription_tier` in database
- [ ] Webhook updates `polar_customer_id` in database
- [ ] Pricing page displays correctly
- [ ] Checkout flow completes end-to-end

---

## 🚨 Important Notes

1. **Service Role Key Security:** The `SUPABASE_SERVICE_ROLE_KEY` bypasses RLS. Only use it in webhook handlers (server-side only). NEVER expose it to the client.

2. **Polar Test Mode:** Make sure you're using Polar's test mode for development. Only switch to live mode when ready for real customers.

3. **Database Backup:** Before pushing the migration to production, consider taking a backup of your database:
   ```bash
   supabase db dump -f backup.sql
   ```

4. **Vercel Environment:** Make sure environment variables are set for all environments (Production, Preview, Development) in Vercel.

---

## 📞 Support

If you run into issues:

1. Check Vercel logs for API route errors
2. Check Polar webhook logs for delivery issues
3. Check Supabase logs for database errors
4. Test the checkout flow in Polar's test mode first

---

**Last Updated:** 2025-11-11
**Status:** Ready for deployment
