# Development Setup Guide

## Environment Files Explained

You now have **three** environment files:

### 1. `.env.local` (Currently Active - LOCAL)
- **Currently points to:** Local Supabase on your computer
- **Used by:** `npm run dev`
- **Data:** Test data only (safe to break things!)
- **Internet:** Not required once Supabase is started

### 2. `.env.development` (Backup - LOCAL)
- **Backup copy** of local Supabase config
- Use this to quickly switch back to local

### 3. `.env.production.local` (PRODUCTION)
- **Points to:** Cloud Supabase (real data!)
- **Use when:** Deploying to production or testing with real data
- **Warning:** Changes affect live users!

---

## Daily Development Workflow

### Starting Your Dev Environment (Every Day)

1. **Start Local Supabase** (in project directory):
   ```bash
   supabase start
   ```
   Wait for: "Started supabase local development setup."

2. **Start Next.js Dev Server**:
   ```bash
   npm run dev
   ```

3. **You're ready!** Your app now uses local Supabase at:
   - App: http://localhost:3000
   - Supabase Studio: http://127.0.0.1:54323
   - API: http://127.0.0.1:54321

### When You're Done Working

1. **Stop Next.js** (Ctrl+C in the dev server terminal)

2. **Stop Supabase** (optional - saves computer resources):
   ```bash
   supabase stop
   ```
   Your data is saved! It will be there when you start again.

---

## Switching Between Environments

### Switch to LOCAL (for development):
```bash
# Copy local config
cp .env.development .env.local

# Restart dev server
npm run dev
```

### Switch to PRODUCTION (for testing with real data):
```bash
# Copy production config
cp .env.production.local .env.local

# Restart dev server
npm run dev
```

**IMPORTANT:** Always restart your dev server after changing `.env.local`!

---

## Benefits of Local Development

### 🚀 Work Anywhere
- **No internet needed** (after initial setup)
- Work on a plane, at a coffee shop, anywhere!
- Local database is fast and responsive

### 🔒 Safe Testing
- Break things without affecting production
- Create test shops, delete them, experiment freely
- Real users never see your experiments

### ⚡ Speed
- Database queries are instant (no internet latency)
- No API rate limits
- Reset database instantly: `supabase db reset --local`

### 🧪 Easy Reset
If you mess up your local database:
```bash
supabase db reset --local
```
Back to a clean state in seconds!

---

## Checking Which Environment You're Using

### Method 1: Check `.env.local`
```bash
cat .env.local | grep SUPABASE_URL
```
- `http://127.0.0.1:54321` = LOCAL
- `https://jrwklvragwthzucgkkrc.supabase.co` = PRODUCTION

### Method 2: In Your Browser
Open the Network tab and look at API calls:
- Calls to `127.0.0.1` = LOCAL
- Calls to `jrwklvragwthzucgkkrc.supabase.co` = PRODUCTION

---

## Common Commands

### Supabase Commands
```bash
supabase start          # Start local instance
supabase stop           # Stop local instance
supabase status         # Check what's running
supabase db reset       # Reset local database to migrations
supabase db dump        # Export schema from production
```

### Development Commands
```bash
npm run dev            # Start Next.js dev server
npm run build          # Build for production
```

---

## Troubleshooting

### "Error connecting to Supabase"
- **Check:** Is local Supabase running? Run `supabase status`
- **Fix:** Run `supabase start`

### "Table does not exist"
- **Check:** Did you reset the database?
- **Fix:** Run `supabase db reset --local`

### "Changes aren't showing up"
- **Check:** Did you restart dev server after changing `.env.local`?
- **Fix:** Stop (Ctrl+C) and restart `npm run dev`

### "I can't log in"
- **Issue:** Local Supabase has NO users by default (empty auth table)
- **Fix:** Create a test account:
  1. Go to http://127.0.0.1:54323
  2. Click "Authentication"
  3. Click "Add User"
  4. Create a test account (e.g., test@example.com / password123)

---

## Local Supabase URLs

When running locally, these are your Supabase URLs:

| Service | URL |
|---------|-----|
| Studio (Database UI) | http://127.0.0.1:54323 |
| API | http://127.0.0.1:54321 |
| Database | postgresql://postgres:postgres@127.0.0.1:54322/postgres |
| Mailpit (Email Testing) | http://127.0.0.1:54324 |

**Default credentials:**
- Username: `postgres`
- Password: `postgres`

---

## Next Steps

You're now set up for local development! Here's what to do next:

1. ✅ Make sure `supabase start` is running
2. ✅ Start your dev server with `npm run dev`
3. ✅ Create a test user in Supabase Studio
4. ✅ Test the shop creation flow!
5. ✅ Break things, experiment, learn!

**Remember:** Local = safe playground. Production = real users. Develop locally, deploy to production!
