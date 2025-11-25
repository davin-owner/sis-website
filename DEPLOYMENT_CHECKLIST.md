# Deployment Checklist - Simple Ink Studios

## Pre-Deployment

### 1. Environment Variables (Vercel)
Set these in Vercel Dashboard → Project → Settings → Environment Variables:

#### Production Supabase
```
NEXT_PUBLIC_SUPABASE_URL=https://jrwklvragwthzucgkkrc.supabase.co
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=sb_publishable_gpCNme4hP1ju85avHoKj1g_S0bX2ihR
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
NEXT_PUBLIC_SITE_URL=https://your-domain.vercel.app
```

#### Production Polar (NO SANDBOX MODE)
```
# DO NOT SET POLAR_SANDBOX in production
POLAR_ACCESS_TOKEN=polar_oat_Z7OcX2zK0AEOelh93CJRzG2llEHcDQGG49RDU44y9mX
POLAR_SUCCESS_URL=https://your-domain.vercel.app/dashboard?checkout=success
POLAR_ORG_ID=2607f1b8-e2c6-4990-abd4-b214c0fc1a9c
```

#### Production Polar Product IDs
```
SOLO_FREE_ID=b68ae9b4-b95e-476a-9969-4260cfe0dccf
STUDIO_BASICS_ID=760f9dac-b430-4a2e-82a0-67f1159461ea
STUDIO_PRO_ID=e73d6422-af27-43c1-a09b-deecac4725fe
STUDIO_ENTERPRISE_ID=8ced57a7-3db6-4b3f-bbcb-20da2dcf2534
```

### 2. Code Cleanup
- [ ] Remove dev console.log from `lib/polar/client.ts:19`
- [ ] Ensure .env files not committed

### 3. Supabase Production Setup
- [ ] Run migrations on production database
- [ ] Verify RLS policies are enabled
- [ ] Test authentication flow
- [ ] Set up Resend for emails (optional)

### 4. Polar Production Setup
- [ ] Create products in production Polar (already done)
- [ ] Set up webhook URL: `https://your-domain.vercel.app/api/webhooks/polar`
- [ ] Test checkout flow with production mode

## Deployment Steps

### Option 1: Vercel (Recommended)

1. **Install Vercel CLI** (if not installed):
```bash
npm i -g vercel
```

2. **Login to Vercel**:
```bash
vercel login
```

3. **Deploy**:
```bash
cd /Users/davin/Desktop/Simple\ Ink\ Studios/sis-website
vercel --prod
```

4. **Set Environment Variables in Vercel Dashboard**

5. **Redeploy after env vars**:
```bash
vercel --prod
```

### Option 2: Manual Vercel Dashboard

1. Go to [vercel.com/new](https://vercel.com/new)
2. Import your Git repository
3. Set environment variables
4. Deploy

## Post-Deployment Checklist

- [ ] Test authentication (sign up, login, logout)
- [ ] Test pipeline (create/edit/delete clients)
- [ ] Test calendar (create/edit/delete appointments)
- [ ] Test Polar checkout (all 4 tiers)
- [ ] Verify Polar webhooks are working
- [ ] Test on mobile devices
- [ ] Check Vercel logs for errors

## Rollback Plan

If something goes wrong:
```bash
vercel rollback
```

Or use Vercel Dashboard → Deployments → [Select previous deployment] → Promote to Production

## Monitoring

- Vercel Dashboard → Analytics
- Vercel Dashboard → Logs
- Supabase Dashboard → Logs
- Polar Dashboard → Webhooks logs

## Domain Setup (Optional)

1. Buy domain (Namecheap, GoDaddy, etc.)
2. Vercel Dashboard → Project → Settings → Domains
3. Add your domain
4. Update DNS records as instructed
5. Update `NEXT_PUBLIC_SITE_URL` and `POLAR_SUCCESS_URL`
