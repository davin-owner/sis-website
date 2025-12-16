# Fix Dashboard & Calendar Features

## The Problem

Your dashboard features (daily tasks, accomplishments, reminders) and calendar appointments won't save because the database tables don't exist in production yet.

## The Solution (2 minutes)

### Step 1: Open Supabase SQL Editor
1. Go to https://supabase.com/dashboard/project/jrwklvragwthzucgkkrc
2. Click **SQL Editor** in the left sidebar
3. Click **New Query**

### Step 2: Run the SQL Script
1. Open the file `APPLY_ALL_MISSING_TABLES.sql` in your project
2. Copy **all** the contents (it's a big file, make sure you get everything!)
3. Paste into the Supabase SQL Editor
4. Click **Run** (or press Cmd/Ctrl + Enter)

### Step 3: Wait for Success
You'll see output showing:
- ✅ Tables created
- ✅ RLS policies applied
- ✅ Indexes created
- ✅ Success message at the end

### Step 4: Test Your Features
1. Go to https://www.simpleinkstudios.com/dashboard
2. Try creating a daily task → Should work!
3. Try creating an accomplishment → Should work!
4. Try creating a reminder → Should work!
5. Go to /content/calendar → Should load without errors!

---

## What This Creates

This script creates 4 missing tables with full security:

1. **appointments** - Calendar appointments with workers/artists
2. **daily_tasks** - Dashboard todo list
3. **accomplishments** - Dashboard accomplishments tracking
4. **reminders** - Dashboard reminders, goals, and urgent items

Each table includes:
- ✅ Proper RLS (Row Level Security) policies
- ✅ Performance indexes
- ✅ Auto-update triggers
- ✅ Foreign key constraints
- ✅ Cascading deletes

---

## Already Ran It?

The script is **idempotent** - safe to run multiple times. It will skip anything that already exists.

---

## Still Having Issues?

1. Check browser console (F12 → Console) for errors
2. Check Network tab (F12 → Network) for failed API calls
3. Verify you're logged in
4. Verify your user has a shop
5. Check Supabase logs for policy violations

---

**That's it! Your dashboard and calendar features should work perfectly now.** 🎉
