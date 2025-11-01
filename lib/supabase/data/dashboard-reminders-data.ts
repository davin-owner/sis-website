/**
 * DATA LAYER: Reminders/Goals
 *
 * CRUD operations for dashboard reminders and goals
 * Supports three types:
 * - 'reminder': Regular reminders
 * - 'goal': User-set goals
 * - 'urgent': High-priority items
 */

import { Reminder } from "@/lib/database";
import { verifyShopAccess } from "@/lib/utils/access-control";
import { SupabaseClient } from "@supabase/supabase-js";

// Get all reminders for a shop
export async function getShopReminders(
  shopId: string,
  userId: string,
  supabase: SupabaseClient,
  includeCompleted = false
): Promise<Reminder[]> {
  // 1. Validate inputs
  if (!shopId) throw new Error("shop_id is required");
  if (!userId) throw new Error("user_id is required");

  // 2. Verify access
  const hasAccess = await verifyShopAccess(userId, shopId, supabase);
  if (!hasAccess) throw new Error("Unauthorized");

  // 3. Query data
  let query = supabase
    .from("reminders")
    .select("*")
    .eq("shop_id", shopId);

  // Filter out completed unless requested
  if (!includeCompleted) {
    query = query.eq("is_completed", false);
  }

  // Order by priority (high to low), then due date
  query = query
    .order("priority", { ascending: false })
    .order("due_date", { ascending: true, nullsFirst: false })
    .order("created_at", { ascending: true });

  const { data, error } = await query;

  if (error) throw error;

  // 4. Return typed data
  return data as Reminder[];
}

// Get reminders by type
export async function getRemindersByType(
  shopId: string,
  userId: string,
  type: "reminder" | "goal" | "urgent",
  supabase: SupabaseClient
): Promise<Reminder[]> {
  if (!shopId) throw new Error("shop_id is required");
  if (!userId) throw new Error("user_id is required");

  const hasAccess = await verifyShopAccess(userId, shopId, supabase);
  if (!hasAccess) throw new Error("Unauthorized");

  const { data, error } = await supabase
    .from("reminders")
    .select("*")
    .eq("shop_id", shopId)
    .eq("type", type)
    .eq("is_completed", false)
    .order("priority", { ascending: false })
    .order("due_date", { ascending: true, nullsFirst: false });

  if (error) throw error;

  return data as Reminder[];
}

// Create a new reminder
export async function createReminder(
  shopId: string,
  userId: string,
  reminderData: Partial<Reminder>,
  supabase: SupabaseClient
): Promise<Reminder> {
  if (!shopId) throw new Error("shopId is required");
  if (!userId) throw new Error("userId is required");
  if (!reminderData.title) throw new Error("Reminder title is required");

  const hasAccess = await verifyShopAccess(userId, shopId, supabase);
  if (!hasAccess) throw new Error("Unauthorized");

  const { data: newReminder, error: reminderError } = await supabase
    .from("reminders")
    .insert({
      shop_id: shopId,
      created_by_user_id: userId,
      title: reminderData.title,
      description: reminderData.description || null,
      type: reminderData.type || "reminder",
      due_date: reminderData.due_date || null,
      priority: reminderData.priority || 0,
      is_completed: false,
    })
    .select()
    .single();

  if (reminderError) throw reminderError;

  return newReminder as Reminder;
}

// Update a reminder
export async function updateReminder(
  shopId: string,
  userId: string,
  reminderId: string,
  reminderData: Partial<Reminder>,
  supabase: SupabaseClient
): Promise<Reminder> {
  if (!shopId) throw new Error("shopId is required");
  if (!userId) throw new Error("userId is required");
  if (!reminderId) throw new Error("reminderId is required");

  const hasAccess = await verifyShopAccess(userId, shopId, supabase);
  if (!hasAccess) throw new Error("Unauthorized");

  // Build update object with only provided fields
  const updateData: any = {};
  if (reminderData.title !== undefined) updateData.title = reminderData.title;
  if (reminderData.description !== undefined)
    updateData.description = reminderData.description;
  if (reminderData.type !== undefined) updateData.type = reminderData.type;
  if (reminderData.due_date !== undefined)
    updateData.due_date = reminderData.due_date;
  if (reminderData.priority !== undefined)
    updateData.priority = reminderData.priority;
  if (reminderData.is_completed !== undefined) {
    updateData.is_completed = reminderData.is_completed;
    // Set completed_at timestamp when marking complete
    if (reminderData.is_completed) {
      updateData.completed_at = new Date().toISOString();
    } else {
      updateData.completed_at = null;
    }
  }

  const { data: updatedReminder, error: reminderError } = await supabase
    .from("reminders")
    .update(updateData)
    .eq("id", reminderId)
    .eq("shop_id", shopId)
    .select()
    .single();

  if (reminderError) throw reminderError;

  return updatedReminder as Reminder;
}

// Delete a reminder
export async function deleteReminder(
  reminderId: string,
  shopId: string,
  userId: string,
  supabase: SupabaseClient
) {
  // 1. Verify access
  const hasAccess = await verifyShopAccess(userId, shopId, supabase);
  if (!hasAccess) throw new Error("Unauthorized");

  // 2. Delete where BOTH match
  const { error } = await supabase
    .from("reminders")
    .delete()
    .eq("id", reminderId)
    .eq("shop_id", shopId); // ← Security!

  if (error) throw error;
}

// Toggle reminder completed status (convenience function)
export async function toggleReminderComplete(
  reminderId: string,
  shopId: string,
  userId: string,
  currentCompletedStatus: boolean,
  supabase: SupabaseClient
): Promise<Reminder> {
  return updateReminder(
    shopId,
    userId,
    reminderId,
    { is_completed: !currentCompletedStatus },
    supabase
  );
}

// Get reminder counts by type (for dashboard stats)
export async function getReminderCounts(
  shopId: string,
  userId: string,
  supabase: SupabaseClient
): Promise<{ reminders: number; goals: number; urgent: number; total: number }> {
  if (!shopId) throw new Error("shop_id is required");
  if (!userId) throw new Error("user_id is required");

  const hasAccess = await verifyShopAccess(userId, shopId, supabase);
  if (!hasAccess) throw new Error("Unauthorized");

  const { data, error } = await supabase
    .from("reminders")
    .select("type")
    .eq("shop_id", shopId)
    .eq("is_completed", false);

  if (error) throw error;

  const counts = {
    reminders: 0,
    goals: 0,
    urgent: 0,
    total: data.length,
  };

  data.forEach((reminder) => {
    if (reminder.type === "reminder") counts.reminders++;
    if (reminder.type === "goal") counts.goals++;
    if (reminder.type === "urgent") counts.urgent++;
  });

  return counts;
}
