# Appointments Feature - Implementation Plan

## 🎯 Goal
Add appointment scheduling to complete the pipeline workflow. When a client reaches "Scheduled" stage, they should have an actual appointment with date/time.

---

## 📊 Database Schema

### New Table: `appointments`

```sql
CREATE TABLE appointments (
  id BIGSERIAL PRIMARY KEY,
  shop_id BIGINT NOT NULL REFERENCES shops(id) ON DELETE CASCADE,
  client_id BIGINT NOT NULL REFERENCES shop_leads(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,

  -- Appointment details
  appointment_date DATE NOT NULL,
  appointment_time TIME NOT NULL,
  duration_minutes INTEGER DEFAULT 60,

  -- Optional fields
  artist VARCHAR(255),
  notes TEXT,
  status VARCHAR(50) DEFAULT 'scheduled', -- scheduled, completed, cancelled, no-show

  -- Metadata
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes for performance
CREATE INDEX idx_appointments_shop_id ON appointments(shop_id);
CREATE INDEX idx_appointments_client_id ON appointments(client_id);
CREATE INDEX idx_appointments_date ON appointments(appointment_date);
CREATE INDEX idx_appointments_user_id ON appointments(user_id);

-- RLS Policies (same pattern as shop_leads)
ALTER TABLE appointments ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view appointments in their shops"
  ON appointments FOR SELECT
  USING (
    shop_id IN (
      SELECT id FROM shops WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Users can create appointments in their shops"
  ON appointments FOR INSERT
  WITH CHECK (
    shop_id IN (
      SELECT id FROM shops WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Users can update appointments in their shops"
  ON appointments FOR UPDATE
  USING (
    shop_id IN (
      SELECT id FROM shops WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Users can delete appointments in their shops"
  ON appointments FOR DELETE
  USING (
    shop_id IN (
      SELECT id FROM shops WHERE user_id = auth.uid()
    )
  );
```

---

## 🏗️ Architecture (Same Pattern as Clients)

### 1. Types (`lib/database.ts`)
```typescript
export interface Appointment {
  id: number;
  shop_id: number;
  client_id: number;
  user_id: string;
  appointment_date: string; // YYYY-MM-DD format
  appointment_time: string; // HH:MM format
  duration_minutes: number;
  artist: string | null;
  notes: string | null;
  status: 'scheduled' | 'completed' | 'cancelled' | 'no-show';
  created_at: string;
  updated_at: string;
}
```

### 2. Data Functions (`lib/supabase/data/appointments-data.ts`)
```typescript
// Similar to shop-leads-data.ts
- getShopAppointments(shopId, userId, supabase)
- createAppointment(shopId, userId, appointmentData, supabase)
- updateAppointment(appointmentId, shopId, userId, appointmentData, supabase)
- deleteAppointment(appointmentId, shopId, userId, supabase)
```

### 3. Server Actions (`app/content/calendar/actions.ts`)
```typescript
// Similar to pipeline/actions.ts
- createAppointmentAction(formData)
- updateAppointmentAction(formData)
- deleteAppointmentAction(appointmentId)
```

### 4. UI Components

**Modals** (Same pattern as AddClientModal/EditClientModal):
- `components/studio/appointments/AddAppointmentModal.client.tsx`
- `components/studio/appointments/EditAppointmentModal.client.tsx`

**Fields in modal:**
- Client (dropdown - select from existing clients)
- Date (date picker)
- Time (time picker)
- Duration (number input, default 60 mins)
- Artist (text input, optional)
- Notes (textarea, optional)
- Status (dropdown: scheduled/completed/cancelled/no-show)

**List View** (`app/content/calendar/page.tsx`):
- Server component that fetches appointments
- Displays list sorted by date (upcoming first)
- Each appointment shows: Client name, Date, Time, Duration, Artist
- "Add Appointment" button → opens modal
- "Edit" / "Delete" buttons on each row

---

## 🎨 UI/UX Plan

### Calendar Page (`/content/calendar`)

**Layout:**
```
┌─────────────────────────────────────────────┐
│ Appointments              [+ Add Appointment]│
├─────────────────────────────────────────────┤
│                                              │
│  📅 Monday, Oct 28, 2024                    │
│  ├─ 10:00 AM - John Doe (90 min) - Artist: │
│  │  Mike [Edit] [Delete]                    │
│  └─ 2:00 PM - Jane Smith (60 min) [Edit]    │
│                                              │
│  📅 Tuesday, Oct 29, 2024                   │
│  ├─ 11:00 AM - Bob Johnson (120 min) [Edit] │
│                                              │
│  No appointments for rest of week           │
└─────────────────────────────────────────────┘
```

### Dashboard Widget

**"Upcoming Appointments" Card:**
- Shows next 3-5 upcoming appointments
- Displays: Date, Time, Client Name
- Link to full calendar

### Client Card Enhancement

**In Pipeline - Add to each client card:**
- "Schedule Appointment" button
- Shows if client has upcoming appointment
- Opens AddAppointmentModal with client pre-selected

---

## 🔄 Data Flow (Same as Clients)

### Creating Appointment:
1. User clicks "Add Appointment"
2. Modal opens, user fills form
3. On submit → `createAppointmentAction(formData)`
4. Server action validates & calls `createAppointment()`
5. Optimistic update: Add to UI immediately
6. Close modal
7. Background: `router.refresh()`

### Editing Appointment:
1. User clicks "Edit" on appointment
2. Modal opens with pre-filled data
3. User updates fields
4. On submit → `updateAppointmentAction(formData)`
5. Optimistic update: Update in UI immediately
6. Close modal
7. Background: `router.refresh()`

### Deleting Appointment:
1. User clicks "Delete"
2. Confirm dialog (optional)
3. `deleteAppointmentAction(id)`
4. Optimistic update: Remove from UI
5. Background: Delete in database

---

## 📁 Files to Create/Modify

### New Files:
- `supabase/migrations/05_create_appointments_table.sql`
- `lib/supabase/data/appointments-data.ts`
- `app/content/calendar/actions.ts`
- `components/studio/appointments/AddAppointmentModal.client.tsx`
- `components/studio/appointments/EditAppointmentModal.client.tsx`

### Files to Modify:
- `lib/database.ts` - Add Appointment interface
- `app/content/calendar/page.tsx` - Build appointments list
- `app/dashboard/page.tsx` - Add upcoming appointments widget
- `components/studio/pipeline/DraggableCard.client.tsx` - Add "Schedule" button

---

## 🚀 Implementation Order

1. **Database** (15 min)
   - Create migration
   - Run migration
   - Test in Supabase dashboard

2. **Types & Data Layer** (30 min)
   - Add types to lib/database.ts
   - Create appointments-data.ts functions
   - Test queries

3. **Server Actions** (20 min)
   - Create calendar/actions.ts
   - Implement create/update/delete actions

4. **Add Appointment Modal** (45 min)
   - Create AddAppointmentModal.client.tsx
   - Date/time pickers
   - Client dropdown
   - Form validation

5. **Calendar List View** (45 min)
   - Update calendar/page.tsx
   - Fetch and display appointments
   - Add/Edit/Delete functionality

6. **Edit Modal** (30 min)
   - Create EditAppointmentModal.client.tsx
   - Pre-fill with existing data

7. **Dashboard Widget** (30 min)
   - Add "Upcoming Appointments" section
   - Show next 5 appointments
   - Link to calendar

8. **Client Card Integration** (20 min)
   - Add "Schedule" button to DraggableCard
   - Check if client has upcoming appointment
   - Show indicator if scheduled

**Total: ~3.5 hours**

---

## 💡 MVP Simplifications

**What to include:**
- ✅ Basic list view (no fancy calendar grid)
- ✅ Date/time picker
- ✅ Link to client
- ✅ Create/edit/delete with optimistic updates

**What to skip for now:**
- ❌ Full calendar grid view (month/week view)
- ❌ Drag-and-drop to reschedule
- ❌ Appointment reminders/notifications
- ❌ Recurring appointments
- ❌ Calendar export (iCal, Google Calendar)

---

## 🎯 Success Criteria

**User can:**
1. Create appointment for a client
2. View all appointments in a list (sorted by date)
3. Edit appointment details
4. Delete appointments
5. See upcoming appointments on dashboard
6. Schedule appointment directly from client card in pipeline

**Technical:**
- All CRUD operations work
- Optimistic updates (instant UI feedback)
- Proper RLS policies (users only see their shop's appointments)
- No TypeScript errors
- Responsive design

---

## 🔍 After MVP (Future Enhancements)

- Full calendar grid view (month/week/day)
- Drag-and-drop to reschedule
- Color-coding by artist
- Appointment reminders (email/SMS)
- Google Calendar integration
- Recurring appointments
- Appointment conflicts detection
- Client history (past appointments)
- Revenue tracking per appointment

---

Ready to build! We'll follow the same patterns you've seen with clients, so it should feel familiar.
